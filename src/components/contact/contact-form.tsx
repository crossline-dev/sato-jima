'use client'

import {
  getFormProps,
  getInputProps,
  getTextareaProps,
} from '@conform-to/react'
import { getValibotConstraint, parseWithValibot } from '@conform-to/valibot'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import {
  type ContactFormState,
  contactFormAction,
} from '@/actions/contact-form-action'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useSafeForm } from '@/hooks/use-safe-form'
import { contactFormSchema } from '@/schemas/contact-form-schema'

const initialState: ContactFormState = {
  result: null,
  success: false,
}

export function ContactForm() {
  const router = useRouter()

  const [state, action, isPending] = useActionState<ContactFormState, FormData>(
    async (_prev, formData) => {
      const result = await contactFormAction(_prev, formData)

      if (result.success) {
        router.push('/contact/thanks')
      }

      return result
    },
    initialState,
  )

  const [form, fields] = useSafeForm({
    lastResult: state.result,
    constraint: getValibotConstraint(contactFormSchema),
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
    defaultValue: {
      name: '',
      furigana: '',
      email: '',
      phone: '',
      message: '',
      privacy: false,
    },
    onValidate({ formData }) {
      return parseWithValibot(formData, { schema: contactFormSchema })
    },
  })

  return (
    <form
      {...getFormProps(form)}
      action={action}
      className='space-y-6'
      noValidate>
      {form.errors && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
          {form.errors.map(error => (
            <p key={error} className='text-red-600 text-sm'>
              {error}
            </p>
          ))}
        </div>
      )}

      <FieldGroup>
        {/* お名前（必須） */}
        <Field data-invalid={!fields.name.valid || undefined}>
          <FieldLabel htmlFor={fields.name.id}>
            お名前
            <span className='text-destructive text-xs'>*</span>
          </FieldLabel>
          <Input
            {...getInputProps(fields.name, { type: 'text' })}
            placeholder='例：山田 太郎'
          />
          <FieldError>{fields.name.errors?.[0]}</FieldError>
        </Field>

        {/* ふりがな（任意） */}
        <Field data-invalid={!fields.furigana.valid || undefined}>
          <FieldLabel htmlFor={fields.furigana.id}>ふりがな</FieldLabel>
          <Input
            {...getInputProps(fields.furigana, { type: 'text' })}
            placeholder='例：やまだ たろう'
          />
          <FieldError>{fields.furigana.errors?.[0]}</FieldError>
        </Field>

        {/* メールアドレス（必須） */}
        <Field data-invalid={!fields.email.valid || undefined}>
          <FieldLabel htmlFor={fields.email.id}>
            メールアドレス
            <span className='text-destructive text-xs'>*</span>
          </FieldLabel>
          <Input
            {...getInputProps(fields.email, { type: 'email' })}
            placeholder='例：example@email.com'
          />
          <FieldError>{fields.email.errors?.[0]}</FieldError>
        </Field>

        {/* 電話番号（任意） */}
        <Field data-invalid={!fields.phone.valid || undefined}>
          <FieldLabel htmlFor={fields.phone.id}>電話番号</FieldLabel>
          <Input
            {...getInputProps(fields.phone, { type: 'tel' })}
            placeholder='例：090-1234-5678'
          />
          <FieldError>{fields.phone.errors?.[0]}</FieldError>
        </Field>

        {/* お問い合わせ内容（必須） */}
        <Field data-invalid={!fields.message.valid || undefined}>
          <FieldLabel htmlFor={fields.message.id}>
            お問い合わせ内容
            <span className='text-destructive text-xs'>*</span>
          </FieldLabel>
          <Textarea
            {...getTextareaProps(fields.message)}
            placeholder='お問い合わせ内容をご記入ください'
            rows={10}
          />
          <FieldError>{fields.message.errors?.[0]}</FieldError>
        </Field>

        {/* プライバシーポリシー同意（必須） */}
        <Field
          orientation='horizontal'
          data-invalid={!fields.privacy.valid || undefined}>
          <Checkbox
            key={fields.privacy.key}
            id={fields.privacy.id}
            name={fields.privacy.name}
            required={fields.privacy.required}
            checked={
              fields.privacy.value === 'on' ||
              (fields.privacy.value === undefined &&
                fields.privacy.initialValue === 'on')
            }
            aria-invalid={!fields.privacy.valid || undefined}
            aria-describedby={
              fields.privacy.errors ? `${fields.privacy.id}-error` : undefined
            }
            onCheckedChange={checked => {
              form.update({
                name: fields.privacy.name,
                value: checked === true ? 'on' : undefined,
              })
            }}
          />
          <div className='space-y-1'>
            <FieldLabel htmlFor={fields.privacy.id} className='cursor-pointer'>
              <a
                href='/privacy-policy'
                target='_blank'
                rel='noopener noreferrer'
                className='underline underline-offset-4 hover:text-primary'>
                プライバシーポリシー
              </a>
              に同意する
              <span className='text-destructive text-xs'>*</span>
            </FieldLabel>
            <FieldError id={`${fields.privacy.id}-error`}>
              {fields.privacy.errors?.[0]}
            </FieldError>
          </div>
        </Field>
      </FieldGroup>

      <div className='mt-8 flex justify-center'>
        <Button type='submit' className='w-full md:w-auto' disabled={isPending}>
          {isPending ? <Spinner size='sm' /> : '送信する'}
        </Button>
      </div>
    </form>
  )
}
