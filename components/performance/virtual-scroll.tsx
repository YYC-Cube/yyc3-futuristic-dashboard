"use client"

import { useState, useRef, useMemo, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"

interface VirtualScrollProps<T> {
  items: T[]
  itemHeight: number | ((index: number) => number)
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  overscan?: number
  estimatedItemHeight?: number
  onScroll?: (scrollTop: number, scrollDirection: 'up' | 'down') => void
  onEndReached?: () => void
  endThreshold?: number
  scrollDirection?: 'vertical' | 'horizontal'
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  overscan = 5,
  estimatedItemHeight = 50,
  onScroll,
  onEndReached,
  endThreshold = 100,
  scrollDirection = 'vertical',
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('down')
  const [measuredHeights, setMeasuredHeights] = useState<Record<number, number>>({})
  const scrollElementRef = useRef<HTMLDivElement>(null)
  const lastScrollTopRef = useRef(0)
  const lastScrollLeftRef = useRef(0)

  const getItemHeight = useCallback((index: number): number => {
    if (typeof itemHeight === 'function') return itemHeight(index)
    if (measuredHeights[index]) return measuredHeights[index]
    return itemHeight
  }, [itemHeight, measuredHeights])

  const getOffsetForIndex = useCallback((index: number): number => {
    let offset = 0
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i)
    }
    return offset
  }, [getItemHeight])

  const getTotalHeight = useMemo(() => {
    let total = 0
    for (let i = 0; i < items.length; i++) {
      total += getItemHeight(i)
    }
    return total
  }, [items.length, getItemHeight])

  const visibleRange = useMemo(() => {
    let start = 0
    let end = 0

    if (scrollDirection === 'vertical') {
      start = Math.floor(scrollTop / estimatedItemHeight)
      end = Math.min(start + Math.ceil(containerHeight / estimatedItemHeight), items.length - 1)

      let accumulatedHeight = 0
      for (let i = 0; i < items.length && accumulatedHeight < scrollTop + containerHeight; i++) {
        accumulatedHeight += getItemHeight(i)
        if (accumulatedHeight <= scrollTop) start = i
        end = i
      }
    } else {
      start = Math.floor(scrollLeft / estimatedItemHeight)
      end = Math.min(start + Math.ceil(containerHeight / estimatedItemHeight), items.length - 1)
    }

    const finalStart = Math.max(0, start - overscan)
    const finalEnd = Math.min(items.length - 1, end + overscan)

    return { start: finalStart, end: finalEnd }
  }, [scrollTop, scrollLeft, containerHeight, items.length, overscan, estimatedItemHeight, getItemHeight, scrollDirection])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1)
  }, [items, visibleRange])

  const offsetY = useMemo(() => {
    return getOffsetForIndex(visibleRange.start)
  }, [visibleRange.start, getOffsetForIndex])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop
    const direction = currentScrollTop > lastScrollTopRef.current ? 'down' : 'up'
    
    setScrollTop(currentScrollTop)
    setScrollDir(direction)
    lastScrollTopRef.current = currentScrollTop
    
    onScroll?.(currentScrollTop, direction)

    if (onEndReached) {
      const isNearBottom = currentScrollTop + containerHeight >= getTotalHeight - endThreshold
      if (isNearBottom) {
        onEndReached()
      }
    }
  }, [containerHeight, getTotalHeight, onScroll, onEndReached, endThreshold])

  const handleMeasureItem = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) {
      const height = element.offsetHeight
      setMeasuredHeights(prev => ({
        ...prev,
        [index]: height,
      }))
    }
  }, [])

  useEffect(() => {
    const element = scrollElementRef.current
    if (!element || !onEndReached) return

    const checkIfAtBottom = () => {
      const { scrollTop, scrollHeight, clientHeight } = element
      if (scrollTop + clientHeight >= scrollHeight - endThreshold) {
        onEndReached()
      }
    }

    const observer = new MutationObserver(checkIfAtBottom)
    observer.observe(element, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [onEndReached, endThreshold])

  const isHorizontal = scrollDirection === 'horizontal'
  const sizeProp = isHorizontal ? 'width' : 'height'
  const scrollPos = isHorizontal ? 'scrollLeft' : 'scrollTop'

  return (
    <div
      ref={scrollElementRef}
      className={cn("overflow-auto", className)}
      style={{ [sizeProp]: containerHeight }}
      onScroll={handleScroll}
      role="list"
      aria-label="Virtualized list"
    >
      <div
        style={{
          [isHorizontal ? 'width' : 'height']: getTotalHeight,
          position: 'relative',
          ...(isHorizontal ? { display: 'flex', flexDirection: 'row' } : {}),
        }}
        role="presentation"
      >
        <div
          style={{
            transform: isHorizontal 
              ? `translateX(${getOffsetForIndex(visibleRange.start)}px)` 
              : `translateY(${offsetY}px)`,
            position: isHorizontal ? undefined : 'relative',
            display: isHorizontal ? 'flex' : undefined,
            width: isHorizontal ? 'auto' : '100%',
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              ref={(el) => handleMeasureItem(visibleRange.start + index, el)}
              data-index={visibleRange.start + index}
              role="listitem"
              aria-posinset={visibleRange.start + index + 1}
              aria-setsize={items.length}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface GridVirtualScrollProps<T> {
  items: T[]
  columns: number
  itemHeight: number
  containerHeight: number
  containerWidth?: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  gap?: number
  overscan?: number
  onEndReached?: () => void
}

export function GridVirtualScroll<T>({
  items,
  columns,
  itemHeight,
  containerHeight,
  containerWidth = 800,
  renderItem,
  className,
  gap = 16,
  overscan = 2,
  onEndReached,
}: GridVirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const rowHeight = itemHeight + gap
  const rowCount = Math.ceil(items.length / columns)
  const totalHeight = rowCount * rowHeight

  const visibleStartRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
  const visibleEndRow = Math.min(rowCount - 1, Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan)

  const visibleItems = useMemo(() => {
    const result: Array<{ item: T; index: number }> = []
    for (let row = visibleStartRow; row <= visibleEndRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col
        if (index < items.length) {
          result.push({ item: items[index], index })
        }
      }
    }
    return result
  }, [items, columns, visibleStartRow, visibleEndRow])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop
    setScrollTop(newScrollTop)

    if (onEndReached && newScrollTop + containerHeight >= totalHeight - 100) {
      onEndReached()
    }
  }

  const columnWidth = (containerWidth - gap * (columns - 1)) / columns

  return (
    <div
      ref={scrollElementRef}
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          className="grid"
          style={{
            position: "absolute",
            top: visibleStartRow * rowHeight,
            left: 0,
            right: 0,
            gridTemplateColumns: `repeat(${columns}, ${columnWidth}px)`,
            gap: `${gap}px`,
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div key={index} role="listitem">
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface InfiniteScrollProps<T> {
  items: T[]
  isLoading?: boolean
  hasMore?: boolean
  onLoadMore: () => void
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  threshold?: number
  loader?: React.ReactNode
  endMessage?: React.ReactNode
}

export function InfiniteScroll<T>({
  items,
  isLoading = false,
  hasMore = true,
  onLoadMore,
  renderItem,
  className,
  threshold = 200,
  loader = (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  ),
  endMessage = (
    <div className="text-center py-8 text-slate-500 text-sm">
      没有更多数据了
    </div>
  ),
}: InfiniteScrollProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || isLoading) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore()
        }
      },
      { rootMargin: `${threshold}px` }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore, threshold])

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <div key={index} role="listitem">
          {renderItem(item, index)}
        </div>
      ))}
      
      <div ref={sentinelRef} className="h-1" />
      
      {isLoading && loader}
      {!hasMore && !isLoading && endMessage}
    </div>
  )
}

export function useVirtualScroll(options: {
  itemCount: number
  itemHeight: number | ((index: number) => number)
  containerHeight: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleRange = useMemo(() => {
    const baseHeight = typeof options.itemHeight === 'function' ? 50 : options.itemHeight
    const start = Math.max(0, Math.floor(scrollTop / baseHeight) - (options.overscan ?? 5))
    const end = Math.min(
      options.itemCount - 1,
      Math.ceil((scrollTop + options.containerHeight) / baseHeight) + (options.overscan ?? 5)
    )
    return { start, end }
  }, [scrollTop, options.itemCount, options.itemHeight, options.containerHeight, options.overscan])

  const scrollToIndex = useCallback((index: number) => {
    const element = document.activeElement as HTMLElement
    if (!element) return
    
    let offset = 0
    for (let i = 0; i < index; i++) {
      offset += typeof options.itemHeight === 'function' ? options.itemHeight(i) : options.itemHeight
    }
    element.scrollTo({ top: offset, behavior: 'smooth' })
  }, [options.itemHeight])

  return {
    scrollTop,
    setScrollTop,
    visibleRange,
    scrollToIndex,
  }
}
