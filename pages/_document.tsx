import { Html, Head, Main, NextScript } from 'next/document';

// This file prevents Next.js from trying to use Pages Router
export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

