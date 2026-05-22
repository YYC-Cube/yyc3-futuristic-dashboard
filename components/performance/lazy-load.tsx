"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface LazyLoadProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  rootMargin?: string
  threshold?: number
  className?: string
}

export function LazyLoad({
  children,
  fallback = <div className="animate-pulse bg-slate-700 rounded h-20" />,
  rootMargin = "50px",
  threshold = 0.1,
  className,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
        }
      },
      {
        rootMargin,
        threshold,
      },
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [rootMargin, threshold, hasLoaded])

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  )
}
