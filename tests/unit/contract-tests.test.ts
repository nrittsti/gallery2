import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { FilterContext } from '../../src/context/GalleryContext'
import { usePhotos } from '../../src/hooks/usePhotos'
import type { FilterType } from '../../src/types/FilterType'
import type { LightboxType } from '../../src/types/LightboxType'
import type { PhotoProps } from '../../src/types/PhotoProps'
import photosData from '../../src/assets/photos.json'
import { validateShape, hasRequiredFields } from './contract-helpers'
import { mockPhotos } from './fixtures'

describe('Contract: FilterType', () => {
  const validFilter: FilterType = {
    year: null,
    setYear: () => {},
  }

  const filterShape = {
    year: 'any',
    setYear: 'function',
  }

  it('valid FilterType passes shape check', () => {
    expect(validateShape(validFilter, filterShape)).toEqual([])
  })

  it('accepts year as number', () => {
    const withYear: FilterType = { year: 2025, setYear: () => {} }
    expect(validateShape(withYear, filterShape)).toEqual([])
  })

  it('detects missing setYear', () => {
    const broken = { year: null } as FilterType
    expect(validateShape(broken, filterShape)).toContain('Missing field: setYear')
  })

  it('detects wrong setYear type', () => {
    const broken = { year: null, setYear: 'not-a-function' } as unknown as FilterType
    const errors = validateShape(broken, filterShape)
    expect(errors.some(e => e.includes('setYear'))).toBe(true)
  })
})

describe('Contract: LightboxType', () => {
  const validLightbox: LightboxType = {
    show: false,
    setShow: () => {},
    index: 0,
    setIndex: () => {},
  }

  const lightboxShape = {
    show: 'boolean',
    setShow: 'function',
    index: 'number',
    setIndex: 'function',
  }

  it('valid LightboxType passes shape check', () => {
    expect(validateShape(validLightbox, lightboxShape)).toEqual([])
  })

  it('detects missing show field', () => {
    const broken = { index: 0, setShow: () => {}, setIndex: () => {} } as unknown as LightboxType
    expect(validateShape(broken, lightboxShape)).toContain('Missing field: show')
  })

  it('detects wrong index type', () => {
    const broken = { show: true, setShow: () => {}, index: 'zero', setIndex: () => {} } as unknown as LightboxType
    const errors = validateShape(broken, lightboxShape)
    expect(errors.some(e => e.includes('index'))).toBe(true)
  })
})

describe('Contract: PhotoProps adapter schema', () => {
  const structuralFields: (keyof PhotoProps)[] = [
    'year', 'grid', 'lightbox', 'width', 'height', 'file',
  ]
  const exifFields: (keyof PhotoProps)[] = [
    'createdate', 'make', 'cameramodelname', 'lensmodel',
    'focallengthin35mmformat', 'aperturevalue', 'exposuretime', 'iso', 'flash',
  ]

  it('mock photos have all structural fields', () => {
    for (const photo of mockPhotos) {
      expect(hasRequiredFields(photo, structuralFields)).toBe(true)
    }
  })

  it('photos.json entries have all structural fields', () => {
    for (const photo of photosData as PhotoProps[]) {
      expect(hasRequiredFields(photo, structuralFields)).toBe(true)
    }
  })

  it('exif fields are strings when present', () => {
    for (const photo of photosData as PhotoProps[]) {
      for (const field of exifFields) {
        if (photo[field] !== undefined && photo[field] !== null) {
          expect(typeof photo[field]).toBe('string')
        }
      }
    }
  })

  it('photo year is a number', () => {
    for (const photo of photosData as PhotoProps[]) {
      expect(typeof photo.year).toBe('number')
    }
  })

  it('photo dimensions are numbers', () => {
    for (const photo of photosData as PhotoProps[]) {
      expect(typeof photo.width).toBe('number')
      expect(typeof photo.height).toBe('number')
    }
  })

  it('photo grid and lightbox paths are strings', () => {
    for (const photo of photosData as PhotoProps[]) {
      expect(typeof photo.grid).toBe('string')
      expect(typeof photo.lightbox).toBe('string')
    }
  })
})

describe('Contract: usePhotos output shape', () => {
  it('mock photos satisfy PhotoProps interface', () => {
    const photoShape = {
      year: 'number',
      grid: 'string',
      lightbox: 'string',
      width: 'number',
      height: 'number',
      file: 'string',
    }
    for (const photo of mockPhotos) {
      expect(validateShape(photo, photoShape)).toEqual([])
    }
  })

  it('partial metadata photo has valid structural fields', () => {
    const partialPhoto = mockPhotos[0]
    partialPhoto.createdate = ''
    const shape = validateShape(partialPhoto, {
      year: 'number', grid: 'string', lightbox: 'string', file: 'string',
    })
    expect(shape).toEqual([])
  })

  it('actual usePhotos return values satisfy PhotoProps shape', () => {
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(FilterContext, { value: { year: null, setYear: () => {} } }, children)
    const { result } = renderHook(() => usePhotos(), { wrapper })
    const photoShape = {
      year: 'number', grid: 'string', lightbox: 'string',
      width: 'number', height: 'number', file: 'string',
    }
    for (const photo of result.current) {
      expect(validateShape(photo, photoShape)).toEqual([])
    }
  })
})
