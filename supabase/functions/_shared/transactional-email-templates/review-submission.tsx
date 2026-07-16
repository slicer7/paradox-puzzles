/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  productTitle?: string
  productHandle?: string
  reviewerName?: string
  reviewerEmail?: string
  rating?: number
  title?: string
  text?: string
  submittedAt?: string
  approveUrl?: string
  rejectUrl?: string
}

const Email = ({
  productTitle = 'a product',
  productHandle = '',
  reviewerName = 'Anonymous',
  reviewerEmail = '',
  rating = 5,
  title = '',
  text = '',
  submittedAt = new Date().toISOString(),
  approveUrl = '',
  rejectUrl = '',
}: Props) => {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)
  const formattedDate = new Date(submittedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>New {rating}★ review for {productTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New review submitted</Heading>
          <Text style={muted}>
            Someone just left a review on Paradox Puzzle Box.
          </Text>

          <Section style={card}>
            <Text style={label}>Product</Text>
            <Text style={value}>
              {productTitle}
              {productHandle ? ` (${productHandle})` : ''}
            </Text>

            <Hr style={hr} />

            <Text style={label}>Rating</Text>
            <Text style={{ ...value, fontSize: '20px', color: '#c9a961' }}>
              {stars} ({rating}/5)
            </Text>

            <Hr style={hr} />

            <Text style={label}>Reviewer</Text>
            <Text style={value}>
              {reviewerName}
              {reviewerEmail ? ` — ${reviewerEmail}` : ''}
            </Text>

            {title ? (
              <>
                <Hr style={hr} />
                <Text style={label}>Title</Text>
                <Text style={{ ...value, fontWeight: 600 }}>{title}</Text>
              </>
            ) : null}

            <Hr style={hr} />

            <Text style={label}>Review</Text>
            <Text style={reviewText}>{text}</Text>

            <Hr style={hr} />

            <Text style={label}>Submitted</Text>
            <Text style={value}>{formattedDate}</Text>
          </Section>

          <Text style={footerNote}>
            To publish this review on the site, add it to{' '}
            <code style={code}>src/data/reviews.ts</code> in the project.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: Email,
  subject: (data: Props) =>
    `New ${data.rating ?? 5}★ review for ${data.productTitle ?? 'your store'}`,
  displayName: 'Review submission notification',
  to: 'paradoxpuzzlebox@gmail.com',
  previewData: {
    productTitle: 'The Pillar',
    productHandle: 'the-pillar',
    reviewerName: 'Jane D.',
    reviewerEmail: 'jane@example.com',
    rating: 5,
    title: 'Best gift ever',
    text: 'My brother spent 45 minutes trying to open his birthday card. Worth every penny.',
    submittedAt: new Date().toISOString(),
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Georgia, "Cormorant Garamond", serif',
}
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = {
  color: '#0a0a0a',
  fontFamily: 'Georgia, "Cinzel", serif',
  fontSize: '26px',
  fontWeight: 700,
  margin: '0 0 8px',
}
const muted = { color: '#6b6b6b', fontSize: '14px', margin: '0 0 24px' }
const card = {
  border: '1px solid #e5e5e5',
  borderRadius: '10px',
  padding: '20px 24px',
  backgroundColor: '#fafaf7',
}
const label = {
  color: '#6b6b6b',
  fontSize: '11px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px',
}
const value = { color: '#0a0a0a', fontSize: '15px', margin: '0 0 4px' }
const reviewText = {
  color: '#0a0a0a',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}
const hr = { borderColor: '#e5e5e5', margin: '14px 0' }
const footerNote = {
  color: '#6b6b6b',
  fontSize: '12px',
  marginTop: '20px',
  textAlign: 'center' as const,
}
const code = {
  backgroundColor: '#f0f0ea',
  padding: '2px 6px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '12px',
}
