import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ContactAdminEmailProps {
  name: string
  furigana?: string
  email: string
  phone?: string
  message: string
}

export function ContactAdminEmail({
  name,
  furigana,
  email,
  phone,
  message,
}: ContactAdminEmailProps) {
  return (
    <Html lang='ja'>
      <Head />
      <Preview>【TRIANGLE SHOP】{name}様からのお問い合わせ</Preview>
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto' }}>
          <Heading style={{ fontSize: '18px' }}>
            お問い合わせがありました
          </Heading>

          <Section style={{ marginBottom: '16px' }}>
            <Text style={{ fontSize: '12px', marginBottom: '4px' }}>
              お名前
            </Text>
            <Text style={{ fontSize: '16px', marginTop: '0' }}>
              {name}
              {furigana && <span> ({furigana})</span>}
            </Text>
          </Section>

          <Section style={{ marginBottom: '16px' }}>
            <Text style={{ fontSize: '12px', marginBottom: '4px' }}>
              メールアドレス
            </Text>
            <Text style={{ fontSize: '16px', marginTop: '0' }}>{email}</Text>
          </Section>

          {phone && (
            <Section style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '12px', marginBottom: '4px' }}>
                電話番号
              </Text>
              <Text style={{ fontSize: '16px', marginTop: '0' }}>{phone}</Text>
            </Section>
          )}

          <Section style={{ marginBottom: '16px' }}>
            <Text style={{ fontSize: '12px', marginBottom: '4px' }}>
              お問い合わせ内容
            </Text>
            <Text
              style={{
                fontSize: '16px',
                marginTop: '0',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
              }}>
              {message}
            </Text>
          </Section>

          <Text style={{ fontSize: '12px', marginTop: '32px' }}>
            TRIANGLE SHOP お問い合わせフォームより送信
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
