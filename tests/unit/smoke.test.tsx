import { render, screen } from '@testing-library/react'

test('renders a trivial component', () => {
  render(<div>Hello Vitest</div>)
  expect(screen.getByText('Hello Vitest')).toBeInTheDocument()
})
