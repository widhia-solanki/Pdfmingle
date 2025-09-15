// src/components/FeedbackButton.tsx

import dynamic from 'next/dynamic'

// This dynamically imports the client-side component and disables server-side rendering (ssr: false).
// This is the key to fixing the build.
const ClientFeedbackButton = dynamic(
  () => import('./ClientFeedbackButton').then((mod) => mod.ClientFeedbackButton),
  { ssr: false }
)

export const FeedbackButton = () => {
  return <ClientFeedbackButton />
}
