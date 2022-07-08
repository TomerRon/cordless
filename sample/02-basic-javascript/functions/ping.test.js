import { jest } from '@jest/globals'
import ping from './ping'

describe('ping', () => {
  const mockContext = {}

  describe('condition', () => {
    const { condition } = ping

    describe('when the message content is ping', () => {
      const mockMsg = {
        content: 'ping',
      }

      it('returns true', () => {
        expect(condition(mockMsg, mockContext)).toBe(true)
      })
    })

    describe('when the message content is not ping', () => {
      const mockMsg = {
        content: 'foobar',
      }

      it('returns false', () => {
        expect(condition(mockMsg, mockContext)).toBe(false)
      })
    })
  })

  describe('callback', () => {
    const { callback } = ping

    const mockMsg = {
      reply: jest.fn(),
    }

    it('replies with pong', async () => {
      await callback(mockMsg, mockContext)

      expect(mockMsg.reply).toHaveBeenCalledWith('pong')
    })
  })
})
