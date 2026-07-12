import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { FilterContext } from '../../src/context/GalleryContext'
import { usePhotos } from '../../src/hooks/usePhotos'
import type { FilterType } from '../../src/types/FilterType'

function createWrapper(year: number | null) {
  const contextValue: FilterType = { year, setYear: () => {} }
  return function Wrapper({ children }: { children: ReactNode }) {
    return <FilterContext value={contextValue}>{children}</FilterContext>
  }
}

describe('usePhotos', () => {
  it('returns all photos when year is null', () => {
    const { result } = renderHook(() => usePhotos(), { wrapper: createWrapper(null) })
    expect(result.current.length).toBeGreaterThan(0)
  })

  it('returns filtered photos when year is set', () => {
    const { result } = renderHook(() => usePhotos(), { wrapper: createWrapper(2025) })
    expect(result.current.every(p => p.year === 2025)).toBe(true)
  })

  it('returns different results for different years', () => {
    const { result: r2025 } = renderHook(() => usePhotos(), { wrapper: createWrapper(2025) })
    const { result: r2024 } = renderHook(() => usePhotos(), { wrapper: createWrapper(2024) })
    expect(r2025.current.length).not.toBe(r2024.current.length)
  })

  it('returns photos sorted by file descending', () => {
    const { result } = renderHook(() => usePhotos(), { wrapper: createWrapper(null) })
    const files = result.current.map(p => p.file)
    const sorted = [...files].sort().reverse()
    expect(files).toEqual(sorted)
  })

  it('returns referentially stable result when year does not change', () => {
    const { result, rerender } = renderHook(() => usePhotos(), { wrapper: createWrapper(2025) })
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })
})
