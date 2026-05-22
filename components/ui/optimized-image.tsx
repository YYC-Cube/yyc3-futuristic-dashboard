import Image from "next/image"
import { useState } from "react"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  sizes?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = "",
  quality = 85,
  placeholder = "empty",
  blurDataURL,
  sizes,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      <div
        className={`bg-slate-800 flex items-center justify-center ${className}`}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-slate-500 text-sm">图片加载失败</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes || fill ? "100vw" : undefined}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  )
}

export function ProductImage({ src, alt, size = 100 }: { src: string; alt: string; size?: number }) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      quality={80}
      sizes={`${size}px`}
      className="rounded-lg"
    />
  )
}

export function AvatarImage({ src, alt, size = 40 }: { src?: string; alt: string; size?: number }) {
  const fallbackSrc = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(alt)}&backgroundColor=0891b2&textColor=ffffff`

  return (
    <OptimizedImage
      src={src || fallbackSrc}
      alt={alt}
      width={size}
      height={size}
      quality={75}
      sizes={`${size}px`}
      className="rounded-full"
    />
  )
}

export function BackgroundImage({
  src,
  alt,
  children,
  overlay = true,
}: {
  src: string
  alt: string
  children?: React.ReactNode
  overlay?: boolean
}) {
  return (
    <div className="relative w-full h-full min-h-[300px]">
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        quality={75}
        sizes="100vw"
        priority
        className="object-cover"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
      )}
      {children && (
        <div className="absolute inset-0 z-10 flex items-end p-6">{children}</div>
      )}
    </div>
  )
}

const imageConfig = {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256],
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 60,
}

export default imageConfig
