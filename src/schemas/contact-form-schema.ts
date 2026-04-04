/**
 * @agent-guard
 * バリデーションスキーマ（src/schemas/）の運用ルール
 *
 * - 新規スキーマは Valibot で作成すること（Zod 禁止）
 * - 既存の Zod スキーマはそのまま維持し、積極的に書き換えない
 * - このスキーマはフォーム4層構成のうち「スキーマ層」に該当する:
 *   スキーマ(Valibot) → Server Action(parseWithValibot) → フック(useActionState) → コンポーネント(Conform)
 *
 * @see docs/adr/004-valibot-migration-policy.md
 * @see docs/agent-rules/01-principles.md §8（フォームの実装パターン）
 */

import { isValidPhoneNumber } from 'libphonenumber-js'
import * as v from 'valibot'

export const contactFormSchema = v.object({
  name: v.pipe(
    v.string('お名前を入力してください'),
    v.nonEmpty('お名前を入力してください'),
    v.maxLength(100, '100文字以内で入力してください'),
  ),
  furigana: v.optional(
    v.pipe(
      v.string('ふりがなを正しく入力してください'),
      v.maxLength(100, '100文字以内で入力してください'),
    ),
  ),
  email: v.pipe(
    v.string('メールアドレスを入力してください'),
    v.nonEmpty('メールアドレスを入力してください'),
    v.email('有効なメールアドレスを入力してください'),
  ),
  phone: v.optional(
    v.pipe(
      v.string('電話番号を正しく入力してください'),
      v.check(
        value => value === '' || isValidPhoneNumber(value, 'JP'),
        '有効な電話番号を入力してください',
      ),
    ),
  ),
  message: v.pipe(
    v.string('お問い合わせ内容を入力してください'),
    v.nonEmpty('お問い合わせ内容を入力してください'),
    v.maxLength(2000, '2000文字以内で入力してください'),
  ),
  privacy: v.pipe(
    v.optional(v.boolean(), false),
    v.check(value => value === true, 'プライバシーポリシーに同意してください'),
  ),
})

export type ContactFormInput = v.InferInput<typeof contactFormSchema>
