import { test, suite } from 'node:test'
import assert from 'node:assert'
import { px, pct, fmt, n } from '../src/utils.ts'

suite('Utils functions', () => {
  test('should format pixels correctly', () => {
    assert.equal(px(10), '10px')
  })

  test('should format percentages correctly', () => {
    assert.equal(pct(50), '50%')
  })

  test('should format numbers with fmt correctly', () => {
    const formatted = fmt(3.14159)
    assert.equal(typeof formatted, 'string')
    assert.equal(Number.parseFloat(formatted), 3.1416)
  })

  test('should parse numbers with n correctly', () => {
    assert.equal(n('3.14'), 3.14)
  })
})