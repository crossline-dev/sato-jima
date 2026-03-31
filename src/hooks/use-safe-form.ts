import { useForm } from '@conform-to/react'

/** Conform のフォーム形状（フィールド値は unknown で保持）。 */
type FormShape = Record<string, unknown>

type FieldValues<T extends FormShape> = Parameters<typeof useForm<T>>[0]

export const useSafeForm = <T extends FormShape>(
  options: Omit<FieldValues<T>, 'defaultValue'> &
    Required<Pick<FieldValues<T>, 'defaultValue'>>,
): ReturnType<typeof useForm<T>> => useForm<T>(options)
