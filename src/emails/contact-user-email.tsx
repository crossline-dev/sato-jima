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

interface ContactUserEmailProps {
  name: string
  message: string
}

export function ContactUserEmail({ name, message }: ContactUserEmailProps) {
  return (
    <Html lang='ja'>
      <Head />
      <Preview>【TRIANGLE SHOP】お問い合わせを受け付けました</Preview>
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto' }}>
          <Heading style={{ fontSize: '18px' }}>
            お問い合わせありがとうございます
          </Heading>

          <Text style={{ fontSize: '16px', lineHeight: '1.6' }}>{name} 様</Text>
          <Text style={{ fontSize: '16px', lineHeight: '1.6' }}>
            この度はTRIANGLE
            SHOPへお問い合わせいただき、誠にありがとうございます。
            <br />
            以下の内容でお問い合わせを受け付けました。
          </Text>

          <Section style={{ margin: '24px 0' }}>
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

          <Text style={{ fontSize: '16px', lineHeight: '1.6' }}>
            内容を確認の上、担当者より折り返しご連絡いたします。
            <br />
            なお、お問い合わせの内容によっては回答にお時間をいただく場合がございます。
            あらかじめご了承ください。
          </Text>

          <Text style={{ fontSize: '12px', marginTop: '32px' }}>
            ※このメールは自動送信です。本メールへの返信はお控えください。
          </Text>
          <Text style={{ fontSize: '12px' }}>TRIANGLE SHOP</Text>
        </Container>
      </Body>
    </Html>
  )
}
