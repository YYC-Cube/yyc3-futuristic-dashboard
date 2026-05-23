"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  quality?: number
  placeholder?: "blur" | "empty" | "skeleton"
  blurDataURL?: string
  sizes?: string
  onLoad?: () => void
  onError?: (retryCount: number) => void
  lazy?: boolean
  threshold?: number
  rootMargin?: string
  showSkeleton?: boolean
  skeletonClassName?: string
  onClick?: () => void
}

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

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
  lazy = true,
  threshold = 0.1,
  rootMargin = "200px",
  showSkeleton = true,
  skeletonClassName = "",
  onClick,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority)
  const [hasError, setHasError] = useState(false)
  const [isVisible, setIsVisible] = useState(priority || !lazy)
  const [retryCount, setRetryCount] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lazy || isVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, isVisible, rootMargin, threshold])

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    setHasError(false)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        if (imgRef.current) {
          imgRef.current.src = src
        }
      }, RETRY_DELAY * (retryCount + 1))
    } else {
      setIsLoading(false)
      setHasError(true)
      onError?.(retryCount)
    }
  }, [retryCount, src, onError])

  if (!isVisible && lazy) {
    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden", className)}
        style={!fill ? { width, height } : undefined}
      >
        {showSkeleton && (
          <div className={cn(
            "absolute inset-0 bg-slate-800 animate-pulse",
            skeletonClassName
          )} />
        )}
      </div>
    )
  }

  if (hasError) {
    return (
      <div
        className={cn(
          "bg-slate-800 flex items-center justify-center text-slate-500",
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        <div className="text-center p-4">
          <svg
            className="w-8 h-8 mx-auto mb-2 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs">图片加载失败</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {(isLoading && showSkeleton) && (
        <div className={cn(
          "absolute inset-0 bg-slate-800 animate-pulse",
          skeletonClassName
        )} />
      )}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder === "blur" ? "blur" : undefined}
        blurDataURL={blurDataURL}
        sizes={sizes || (fill ? "100vw" : undefined)}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          onClick && "cursor-pointer"
        )}
      />
    </div>
  )
}

export function ProductImage({
  src,
  alt,
  size = 100,
  className = "",
}: {
  src: string
  alt: string
  size?: number
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      quality={80}
      sizes={`${size}px`}
      className={cn("rounded-lg object-cover", className)}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFAAAAwAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AKwAYAFgAUAJgAoAFABWAGgAcABgAyAFAEIAMgBQAyAH//9k="
      lazy
      threshold={0.05}
      showSkeleton
    />
  )
}

export function AvatarImage({
  src,
  alt,
  size = 40,
  className = "",
}: {
  src?: string
  alt: string
  size?: number
  className?: string
}) {
  const fallbackSrc = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(alt)}&backgroundColor=0891b2&textColor=ffffff`

  return (
    <OptimizedImage
      src={src || fallbackSrc}
      alt={alt}
      width={size}
      height={size}
      quality={75}
      sizes={`${size}px`}
      className={cn("rounded-full object-cover", className)}
      lazy
      threshold={0.1}
      showSkeleton
      skeletonClassName="rounded-full"
    />
  )
}

export function BackgroundImage({
  src,
  alt,
  children,
  overlay = true,
  overlayOpacity = "from-slate-900/90 via-slate-900/50 to-transparent",
}: {
  src: string
  alt: string
  children?: React.ReactNode
  overlay?: boolean
  overlayOpacity?: string
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
        lazy={false}
        showSkeleton={false}
      />
      {overlay && (
        <div className={cn("absolute inset-0 bg-gradient-to-t", overlayOpacity)} />
      )}
      {children && (
        <div className="absolute inset-0 z-10 flex items-end p-6">{children}</div>
      )}
    </div>
  )
}

export function GalleryImage({
  src,
  alt,
  index,
  onClick,
  className = "",
}: {
  src: string
  alt: string
  index: number
  onClick?: (index: number) => void
  className?: string
}) {
  const isAboveFold = index < 3

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      quality={isAboveFold ? 90 : 75}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={cn(
        "cursor-pointer hover:scale-105 transition-transform duration-300 rounded-lg",
        className
      )}
      onClick={() => onClick?.(index)}
      lazy={!isAboveFold}
      threshold={0.05}
      rootMargin="100px"
      showSkeleton
    />
  )
}

const imageConfig = {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 60,
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
}

export default imageConfig
