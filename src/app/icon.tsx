import { ImageResponse } from 'next/og'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: '#2A2F3A',
        width: 64,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        color: '#1B6FCC',
        fontSize: 42,
        fontWeight: 900,
        fontFamily: 'sans-serif',
        letterSpacing: '-2px',
      }}
    >
      M
    </div>,
    { width: 64, height: 64 }
  )
}
