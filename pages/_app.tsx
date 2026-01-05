import type { AppProps } from 'next/app';

// This file prevents Next.js from trying to use Pages Router
// We're using App Router, so this just exports a dummy component
export default function App({ Component, pageProps }: AppProps) {
  return null;
}

