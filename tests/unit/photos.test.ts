import { describe, it, expect } from 'vitest'
import { filterByYear, sortByFileDesc, getAvailableYears } from '../../src/utils/photos'
import { mockPhotos } from './fixtures'

describe('filterByYear', () => {
  it('returns all photos when year is null', () => {
    const result = filterByYear(mockPhotos, null)
    expect(result).toHaveLength(mockPhotos.length)
    expect(result).toEqual(mockPhotos)
  })

  it('returns only photos matching the specified year', () => {
    const result = filterByYear(mockPhotos, 2024)
    expect(result).toHaveLength(2)
    expect(result.every(p => p.year === 2024)).toBe(true)
  })

  it('returns empty array when year has no matches', () => {
    const result = filterByYear(mockPhotos, 2020)
    expect(result).toHaveLength(0)
  })

  it('does not mutate the original array', () => {
    const original = [...mockPhotos]
    filterByYear(mockPhotos, 2024)
    expect(mockPhotos).toEqual(original)
  })

  it('returns a new array instance', () => {
    const result = filterByYear(mockPhotos, null)
    expect(result).not.toBe(mockPhotos)
  })
})

describe('sortByFileDesc', () => {
  it('returns photos in descending file-name order', () => {
    const result = sortByFileDesc(mockPhotos)
    const files = result.map(p => p.file)
    const expected = [...files].sort().reverse()
    expect(files).toEqual(expected)
  })

  it('does not mutate the original array', () => {
    const original = [...mockPhotos]
    sortByFileDesc(mockPhotos)
    expect(mockPhotos).toEqual(original)
  })

  it('returns a new array instance', () => {
    const result = sortByFileDesc(mockPhotos)
    expect(result).not.toBe(mockPhotos)
  })

  it('handles single-element array', () => {
    const single = [mockPhotos[0]]
    const result = sortByFileDesc(single)
    expect(result).toHaveLength(1)
    expect(result[0]).toBe(single[0])
  })

  it('handles empty array', () => {
    const result = sortByFileDesc([])
    expect(result).toHaveLength(0)
  })

  it('sorts z before a (descending)', () => {
    const result = sortByFileDesc(mockPhotos)
    const zIndex = result.findIndex(p => p.file === 'z-photo.jpg')
    const aIndex = result.findIndex(p => p.file === 'a-photo.jpg')
    expect(zIndex).toBeLessThan(aIndex)
  })
})

describe('getAvailableYears', () => {
  it('returns unique years sorted descending', () => {
    const result = getAvailableYears(mockPhotos)
    expect(result).toEqual([2025, 2024, 2023])
  })

  it('handles single year', () => {
    const singleYear = mockPhotos.filter(p => p.year === 2025)
    const result = getAvailableYears(singleYear)
    expect(result).toEqual([2025])
  })

  it('handles empty array', () => {
    const result = getAvailableYears([])
    expect(result).toEqual([])
  })
})
