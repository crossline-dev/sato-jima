'use client'

import parse from 'html-react-parser'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  type Dimension,
  parseDimensions,
  parsePrecautions,
} from '@/utils/metafield-parsers'
import { parseRichText } from '@/utils/rich-text-parser'

interface ProductMetafieldsProps {
  materials?: { value: string } | null
  dimensions?: { value: string } | null
  materialFeature?: { value: string } | null
  precautions?: { value: string } | null
}

export function ProductMetafields({
  materials,
  dimensions,
  materialFeature,
  precautions,
}: ProductMetafieldsProps) {
  const dimensionsList = parseDimensions(dimensions?.value)
  const precautionsList = parsePrecautions(precautions?.value)
  const materialFeatureHtml = parseRichText(materialFeature?.value)

  // 表示するデータがない場合は何も表示しない
  const hasContent =
    materials?.value ||
    dimensionsList.length > 0 ||
    materialFeatureHtml ||
    precautionsList.length > 0

  if (!hasContent) {
    return null
  }

  return (
    <Accordion type='multiple' className='w-full'>
      {/* 素材 */}
      {materials?.value && (
        <AccordionItem value='materials'>
          <AccordionTrigger className='cursor-pointer'>素材</AccordionTrigger>
          <AccordionContent>
            <p className='whitespace-pre-wrap text-muted-foreground'>
              {materials.value}
            </p>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* 寸法・スペック */}
      {dimensionsList.length > 0 && (
        <AccordionItem value='dimensions'>
          <AccordionTrigger className='cursor-pointer'>
            サイズ・スペック
          </AccordionTrigger>
          <AccordionContent>
            <DimensionsTable dimensions={dimensionsList} />
          </AccordionContent>
        </AccordionItem>
      )}

      {/* 素材特徴 */}
      {materialFeatureHtml && (
        <AccordionItem value='material-feature'>
          <AccordionTrigger className='cursor-pointer'>
            素材特徴
          </AccordionTrigger>
          <AccordionContent>
            <div className='prose prose-sm text-muted-foreground'>
              {parse(materialFeatureHtml)}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* 注意事項 */}
      {precautionsList.length > 0 && (
        <AccordionItem value='precautions'>
          <AccordionTrigger className='cursor-pointer'>
            注意事項
          </AccordionTrigger>
          <AccordionContent>
            <ul className='list-disc space-y-1 pl-5 text-muted-foreground'>
              {precautionsList.map(item => (
                <li key={item} className='leading-loose'>
                  {item}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  )
}

/**
 * 寸法テーブルコンポーネント
 */
function DimensionsTable({ dimensions }: { dimensions: Dimension[] }) {
  return (
    <table className='w-full border-collapse border border-border text-sm'>
      <tbody>
        {dimensions.map(dim => (
          <tr
            key={dim.label}
            className='border-border border-b last:border-b-0'>
            <th className='border-border border-r bg-muted/50 px-3 py-2 text-left font-normal text-muted-foreground'>
              {dim.label}
            </th>
            <td className='px-3 py-2 text-right font-en'>{dim.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
