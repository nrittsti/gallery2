import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { FilterContext, LightboxContext } from '../../src/context/GalleryContext'
import Lightbox from '../../src/components/Lightbox'
import photosData from '../../src/assets/photos.json'
import type { PhotoProps } from '../../src/types/PhotoProps'
import type { FilterType } from '../../src/types/FilterType'
import type { LightboxType } from '../../src/types/LightboxType'

const photos = photosData as PhotoProps[]
const lastIndex = photos.length - 1

function renderLightbox(overrides: Partial<LightboxType & FilterType> = {}) {
  const filterValue: FilterType = { year: null, setYear: () => {}, ...overrides }
  const setShow = vi.fn()
  const setIndex = vi.fn<(cb: ((prev: number) => number) | number) => void>()
  const lightboxValue: LightboxType = {
    show: true, index: 0, setShow, setIndex, ...overrides,
  }

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FilterContext value={filterValue}>
        <LightboxContext value={lightboxValue}>
          {children}
        </LightboxContext>
      </FilterContext>
    )
  }

  return { setShow, setIndex, ...render(<Lightbox />, { wrapper: Wrapper }) }
}

describe('Lightbox navigation boundaries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing when lightbox is open', () => {
    renderLightbox({ show: true })
    expect(screen.getByText(/Photo \d+ of \d+/)).toBeInTheDocument()
  })

  it('renders nothing when lightbox is closed', () => {
    const { container } = renderLightbox({ show: false })
    expect(container.innerHTML).toBe('')
  })

  it('disables prev button at first index', () => {
    renderLightbox({ show: true, index: 0 })
    expect(screen.getByRole('button', { name: /← Previous/i })).toBeDisabled()
  })

  it('enables next button at first index', () => {
    renderLightbox({ show: true, index: 0 })
    expect(screen.getByRole('button', { name: /Next →/i })).not.toBeDisabled()
  })

  it('disables next button at last index', () => {
    renderLightbox({ show: true, index: lastIndex })
    expect(screen.getByRole('button', { name: /Next →/i })).toBeDisabled()
  })

  it('enables prev button at last index', () => {
    renderLightbox({ show: true, index: lastIndex })
    expect(screen.getByRole('button', { name: /← Previous/i })).not.toBeDisabled()
  })

  it('calls setIndex(0) when close button is clicked', () => {
    const { setIndex } = renderLightbox({ show: true, index: 3 })
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    expect(setIndex).toHaveBeenCalledWith(0)
  })

  it('calls setShow(false) when close button is clicked', () => {
    const { setShow } = renderLightbox({ show: true, index: 3 })
    const closeButton = screen.getByLabelText('Close')
    fireEvent.click(closeButton)
    expect(setShow).toHaveBeenCalledWith(false)
  })

  it('handles keyboard Escape to close', () => {
    const { setShow } = renderLightbox({ show: true, index: 1 })
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(setShow).toHaveBeenCalledWith(false)
  })

  it('handles keyboard ArrowLeft to go previous', () => {
    const { setIndex } = renderLightbox({ show: true, index: 2 })
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    const callArg = setIndex.mock.calls[0][0]
    if (typeof callArg === 'function') {
      expect(callArg(2)).toBe(1)
    }
  })

  it('handles keyboard ArrowRight to go next', () => {
    const { setIndex } = renderLightbox({ show: true, index: 2 })
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    const callArg = setIndex.mock.calls[0][0]
    if (typeof callArg === 'function') {
      expect(callArg(2)).toBe(3)
    }
  })

  it('handles Space key to go next', () => {
    const { setIndex } = renderLightbox({ show: true, index: 2 })
    fireEvent.keyDown(window, { key: ' ' })
    const callArg = setIndex.mock.calls[0][0]
    if (typeof callArg === 'function') {
      expect(callArg(2)).toBe(3)
    }
  })

  it('ignores keyboard events when lightbox is closed', () => {
    const { setIndex, setShow } = renderLightbox({ show: false })
    fireEvent.keyDown(window, { key: 'Escape' })
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(setShow).not.toHaveBeenCalled()
    expect(setIndex).not.toHaveBeenCalled()
  })
})

describe('Lightbox metadata display', () => {
  it('displays EXIF metadata labels', () => {
    renderLightbox({ show: true, index: 0 })
    expect(screen.getByText('Photo was taken')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
    expect(screen.getByText('Lens')).toBeInTheDocument()
    expect(screen.getByText('ISO')).toBeInTheDocument()
  })

  it('shows photo file as image alt text', () => {
    renderLightbox({ show: true, index: 0 })
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt')
    expect(img.getAttribute('alt')).toBeTruthy()
  })

  it('renders without crash with photo that has empty metadata fields', () => {
    renderLightbox({ show: true, index: 9 })
    expect(screen.getByText('Photo was taken')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('displays hardcoded copyright regardless of metadata', () => {
    renderLightbox({ show: true, index: 0 })
    expect(screen.getByText('CC BY-NC-ND')).toBeInTheDocument()
  })
})

describe('Lightbox revalidation on data change', () => {
  it('renders with year filter applied', () => {
    render(<RevalidationHarness initialYear={2025} initialIndex={0} />)
    expect(screen.getByText(/Photo 1 of/)).toBeInTheDocument()
  })

  it('renders without crash when index exceeds available photos for a year', () => {
    expect(() => render(<RevalidationHarness initialYear={2025} initialIndex={500} />)).not.toThrow()
  })
})

function RevalidationHarness({ initialYear, initialIndex }: { initialYear: number | null; initialIndex: number }) {
  const [year] = useState<number | null>(initialYear)
  const [show] = useState(true)
  const [index] = useState(initialIndex)

  return (
    <FilterContext value={{ year, setYear: () => {} }}>
      <LightboxContext value={{ show, setShow: () => {}, index, setIndex: () => {} }}>
        <Lightbox />
      </LightboxContext>
    </FilterContext>
  )
}
