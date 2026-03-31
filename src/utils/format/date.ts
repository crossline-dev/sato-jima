import { cdate } from 'cdate'

/**
 * 日付を「2025.01.25」形式にフォーマットする
 * @param dateString ISO形式の日付文字列
 * @returns フォーマットされた日付文字列
 */
export function formatDate(dateString: string): string {
  return cdate(dateString).format('YYYY.MM.DD')
}
