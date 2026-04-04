/**
 * @agent-guard
 * フォーム4層構成の参考実装（Server Action 層）
 *
 * - 新しいフォームを作る場合、このファイルの構造を模範にする:
 *   1. parseWithValibot(formData, { schema }) でバリデーション
 *   2. submission.status !== 'success' → submission.reply() で返却
 *   3. 処理失敗 → errorResponse() で failureKind 付き返却
 *   4. 処理成功 → submission.reply({ resetForm: true }) で返却
 * - フォームコンポーネント側は useActionState + @conform-to/react を使う
 *
 * @see docs/agent-rules/01-principles.md §8（フォームの実装パターン）
 */

'use server'

import type { SubmissionResult } from '@conform-to/react'
import { parseWithValibot } from '@conform-to/valibot'
import { headers } from 'next/headers'
import { Resend } from 'resend'
import { ContactAdminEmail } from '@/emails/contact-admin-email'
import { ContactUserEmail } from '@/emails/contact-user-email'
import { env } from '@/env/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { siteConfig } from '@/config/site.config'
import { contactFormSchema } from '@/schemas/contact-form-schema'

const resend = new Resend(env.RESEND_API_KEY)

/** 問い合わせ処理の失敗分類（機密を含まない。ログ・クライアント双方の観測用） */
export type ContactFailureKind =
  | 'validation'
  | 'rate_limit'
  | 'send_failed'
  | 'unexpected'

/**
 * contactFormAction の戻り値。
 * - success === true … 送信完了。failureKind は undefined。
 * - success === false … failureKind で理由を区別。ユーザー向け文言は result 内のみ。
 */
export type ContactFormState = {
  result: SubmissionResult | null
  success: boolean
  failureKind?: ContactFailureKind
}

const USER_MSG_RATE_LIMIT =
  '送信回数の上限に達しました。しばらく時間をおいてから再度お試しください。'
const USER_MSG_SEND_FAILED =
  'メールの送信に失敗しました。時間をおいて再度お試しください。'
const USER_MSG_UNEXPECTED =
  '送信中にエラーが発生しました。時間をおいて再度お試しください。'

function logContactEvent(
  kind: ContactFailureKind,
  message: string,
  context?: Record<string, unknown>,
): void {
  const payload = { kind, message, ...context }
  console.error('[ContactForm]', JSON.stringify(payload))
}

function logUnknownError(
  kind: ContactFailureKind,
  phase: string,
  error: unknown,
): void {
  if (error instanceof Error) {
    logContactEvent(kind, phase, {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
    })
  } else {
    logContactEvent(kind, phase, { error: String(error) })
  }
}

function errorResponse(
  message: string,
  failureKind: ContactFailureKind,
): ContactFormState {
  return {
    result: {
      status: 'error',
      error: { '': [message] },
    },
    success: false,
    failureKind,
  }
}

export async function contactFormAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

  let rateLimitResult: Awaited<ReturnType<typeof checkRateLimit>>
  try {
    rateLimitResult = await checkRateLimit(ip)
  } catch (error: unknown) {
    logUnknownError('unexpected', 'rate_limit_check_threw', error)
    return {
      result: {
        status: 'error',
        error: { '': [USER_MSG_UNEXPECTED] },
      },
      success: false,
      failureKind: 'unexpected',
    }
  }

  if (!rateLimitResult.success) {
    logContactEvent('rate_limit', 'limit_exceeded', {
      remaining: rateLimitResult.remaining,
      reset: rateLimitResult.reset,
    })
    return errorResponse(USER_MSG_RATE_LIMIT, 'rate_limit')
  }

  const submission = parseWithValibot(formData, {
    schema: contactFormSchema,
  })

  if (submission.status !== 'success') {
    return {
      result: submission.reply(),
      success: false,
      failureKind: 'validation',
    }
  }

  const { name, furigana, email, phone, message } = submission.value

  try {
    const [adminResult, userResult] = await Promise.all([
      resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: env.RESEND_TO_EMAIL,
        replyTo: email,
        subject: `【${siteConfig.siteName}】${name}様からのお問い合わせ`,
        react: ContactAdminEmail({
          name,
          furigana: furigana || undefined,
          email,
          phone: phone || undefined,
          message,
        }),
      }),
      resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: email,
        subject: `【${siteConfig.siteName}】お問い合わせを受け付けました`,
        react: ContactUserEmail({ name, message }),
      }),
    ])

    if (adminResult.error || userResult.error) {
      logContactEvent('send_failed', 'resend_api_error', {
        adminError: adminResult.error
          ? {
              name: adminResult.error.name,
              message: adminResult.error.message,
            }
          : null,
        userError: userResult.error
          ? {
              name: userResult.error.name,
              message: userResult.error.message,
            }
          : null,
      })
      return {
        result: submission.reply({
          formErrors: [USER_MSG_SEND_FAILED],
        }),
        success: false,
        failureKind: 'send_failed',
      }
    }

    return {
      result: submission.reply({ resetForm: true }),
      success: true,
    }
  } catch (error: unknown) {
    logUnknownError('unexpected', 'email_send_threw', error)
    return {
      result: submission.reply({
        formErrors: [USER_MSG_UNEXPECTED],
      }),
      success: false,
      failureKind: 'unexpected',
    }
  }
}
