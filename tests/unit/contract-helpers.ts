export function validateShape(obj: unknown, requiredFields: Record<string, string>): string[] {
  if (typeof obj !== 'object' || obj === null) {
    return ['Input is not an object']
  }
  const errors: string[] = []
  for (const [field, expectedType] of Object.entries(requiredFields)) {
    const value = (obj as Record<string, unknown>)[field]
    const actualType = typeof value
    if (value === undefined) {
      errors.push(`Missing field: ${field}`)
    } else if (actualType !== expectedType && expectedType !== 'any') {
      errors.push(`Field "${field}" expected ${expectedType}, got ${actualType}`)
    }
  }
  return errors
}

export function hasRequiredFields<T extends object>(obj: T, fields: (keyof T)[]): boolean {
  if (obj === null) return false
  return fields.every(f => obj[f] !== undefined && obj[f] !== null)
}
