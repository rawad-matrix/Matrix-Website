import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  const logoBuffer = readFileSync(join(process.cwd(), 'public/images/logo.jpg'))
  const src = `data:image/jpeg;base64,${logoBuffer.toString('base64')}`

  return new ImageResponse(
    <div
      style={{
        background: 'white',
        width: 64,
        height: 64,
        display: 'flex',
        overflow: 'hidden',
        borderRadius: 8,
      }}
    >
      {/* objectFit cover + left position crops to just the M mark */}
      <img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'left center',
        }}
      />
    </div>,
    { width: 64, height: 64 }
  )
}
