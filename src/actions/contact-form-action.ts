'use server'

import type { SubmissionResult } from '@conform-to/react'
import { parseWithValibot } from '@conform-to/valibot'
import { headers } from 'next/headers'
import { Resend } from 'resend'
import { ContactAdminEmail } from '@/emails/contact-admin-email'
import { ContactUserEmail } from '@/emails/contact-user-email'
import { env } from '@/env/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { contactFormSchema } from '@/schemas/contact-form-schema'

const resend = new Resend(env.RESEND_API_KEY)

export type ContactFormState = {
  result: SubmissionResult | null
  success: boolean
}

function errorResponse(message: string): ContactFormState {
  return {
    result: {
      status: 'error',
      error: { '': [message] },
    },
    success: false,
  }
}

export async function contactFormAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // 1. レートリミットチェック（IP）
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

  const rateLimitResult = await checkRateLimit(ip)
  if (!rateLimitResult.success) {
    return errorResponse(
      '送信回数の上限に達しました。しばらく時間をおいてから再度お試しください。',
    )
  }

  // 2. Valibot バリデーション
  const submission = parseWithValibot(formData, {
    schema: contactFormSchema,
  })

  if (submission.status !== 'success') {
    return {
      result: submission.reply(),
      success: false,
    }
  }

  const { name, furigana, email, phone, message } = submission.value

  // 3. メール送信（Promise.all）
  try {
    const [adminResult, userResult] = await Promise.all([
      resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: env.RESEND_TO_EMAIL,
        replyTo: email,
        subject: `【TRIANGLE SHOP】${name}様からのお問い合わせ`,
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
        subject: '【TRIANGLE SHOP】お問い合わせを受け付けました',
        react: ContactUserEmail({ name, message }),
      }),
    ])

    if (adminResult.error || userResult.error) {
      return {
        result: submission.reply({
          formErrors: [
            'メールの送信に失敗しました。時間をおいて再度お試しください。',
          ],
        }),
        success: false,
      }
    }

    return {
      result: submission.reply({ resetForm: true }),
      success: true,
    }
  } catch {
    return {
      result: submission.reply({
        formErrors: [
          '送信中にエラーが発生しました。時間をおいて再度お試しください。',
        ],
      }),
      success: false,
    }
  }
}
