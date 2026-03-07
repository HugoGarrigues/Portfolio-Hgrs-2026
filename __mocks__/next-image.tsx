import React from 'react'

type ImageProps = {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  draggable?: boolean
  [key: string]: unknown
}

export default function Image({ src, alt, width, height, className, draggable }: ImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} className={className} draggable={draggable} />
  )
}
