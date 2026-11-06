import { describe, it, expect } from 'vitest'

function isAuthorized(role: string | null, allowed: string[]): boolean {
  return role !== null && allowed.includes(role)
}

describe('role authorization', () => {
  it('allows learner for learner route', () => {
    expect(isAuthorized('learner', ['learner'])).toBe(true)
  })
  it('denies learner for admin route', () => {
    expect(isAuthorized('learner', ['admin'])).toBe(false)
  })
  it('denies null role', () => {
    expect(isAuthorized(null, ['learner', 'admin'])).toBe(false)
  })
  it('allows admin for mentor-or-admin route', () => {
    expect(isAuthorized('admin', ['mentor', 'admin'])).toBe(true)
  })
})
