export const metadata = {
  title: 'CREMA Contents Generator',
  description: '크리마 전용 콘텐츠 생성 도구',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
        <script dangerouslySetInnerHTML={{__html: `
          tailwind.config = {
            darkMode:"class",
            theme:{extend:{colors:{"primary":"#3182f6","surface":"#f8f9fb","on-surface":"#191c1e","on-surface-variant":"#4e5968","outline-variant":"#e5e8eb","surface-container-low":"#f2f4f6","surface-container":"#eceef0"},fontFamily:{"headline":["Plus Jakarta Sans","Noto Sans KR","sans-serif"],"body":["Inter","Noto Sans KR","sans-serif"]},borderRadius:{"DEFAULT":"1rem","lg":"1.5rem","xl":"2rem","2xl":"2.5rem","3xl":"3rem","full":"9999px"}}},
          }
        `}} />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
