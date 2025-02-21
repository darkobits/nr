import os from 'node:os'

import { describe, it, expect, vi } from 'vitest'

import { LogPipe } from './log-pipe'

describe('LogPipe', () => {
  it('should require a log function in constructor', () => {
    // @ts-expect-error Testing invalid input
    expect(() => new LogPipe()).toThrow()
    // @ts-expect-error Testing invalid input
    expect(() => new LogPipe('not a function')).toThrow()
  })

  it('should call log function with written content', async () => {
    const mockLog = vi.fn()
    const pipe = new LogPipe(mockLog)

    await new Promise<void>(resolve => {
      pipe._write('test message', 'utf8', error => {
        expect(error).toBeUndefined()
        expect(mockLog).toHaveBeenCalledWith('test message')
        resolve()
      })
    })
  })

  it('should handle empty strings', async () => {
    const mockLog = vi.fn()
    const pipe = new LogPipe(mockLog)

    await new Promise<void>(resolve => {
      pipe._write('', 'utf8', error => {
        expect(error).toBeUndefined()
        expect(mockLog).not.toHaveBeenCalled()
        resolve()
      })
    })
  })

  it('should strip trailing EOL while preserving other EOLs', async () => {
    const mockLog = vi.fn()
    const pipe = new LogPipe(mockLog)
    const input = `line1${os.EOL}line2${os.EOL}`

    await new Promise<void>(resolve => {
      pipe._write(input, 'utf8', error => {
        expect(error).toBeUndefined()
        expect(mockLog).toHaveBeenCalledWith(`line1${os.EOL}line2`)
        resolve()
      })
    })
  })

  it('should preserve ANSI escape sequences while handling EOL', async () => {
    const mockLog = vi.fn()
    const pipe = new LogPipe(mockLog)
    const input = `\u001B[32mcolored text\u001B[0m${os.EOL}`

    await new Promise<void>(resolve => {
      pipe._write(input, 'utf8', error => {
        expect(error).toBeUndefined()
        expect(mockLog).toHaveBeenCalledWith('\u001B[32mcolored text\u001B[0m')
        resolve()
      })
    })
  })

  it('should handle Buffer input', async () => {
    const mockLog = vi.fn()
    const pipe = new LogPipe(mockLog)
    const input = Buffer.from('test message')

    await new Promise<void>(resolve => {
      // @ts-expect-error _write accepts Buffer in Node.js but TS doesn't know
      pipe._write(input, 'utf8', error => {
        expect(error).toBeUndefined()
        expect(mockLog).toHaveBeenCalledWith('test message')
        resolve()
      })
    })
  })

  it('should preserve non-trailing EOLs', async () => {
    const mockLog = vi.fn()
    const pipe = new LogPipe(mockLog)
    const input = `line1${os.EOL}line2${os.EOL}line3${os.EOL}`

    await new Promise<void>(resolve => {
      pipe._write(input, 'utf8', error => {
        expect(error).toBeUndefined()
        expect(mockLog).toHaveBeenCalledWith(`line1${os.EOL}line2${os.EOL}line3`)
        resolve()
      })
    })
  })
})