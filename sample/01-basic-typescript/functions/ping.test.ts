import { Context } from 'cordless'
import { Message } from 'discord.js'
import ping from './ping'

describe('ping', () => {
  const mockContext = {} as Context

  describe('condition', () => {
    const { condition } = ping

    describe('when the message content is ping', () => {
      const mockMsg = {
        content: 'ping',
      } as Message

      it('returns true', () => {
        expect(condition(mockMsg, mockContext)).toBe(true)
      })
    })

    describe('when the message content is not ping', () => {
      const mockMsg = {
        content: 'foobar',
      } as Message

      it('returns false', () => {
        expect(condition(mockMsg, mockContext)).toBe(false)
      })
    })
  })

  describe('callback', () => {
    const { callback } = ping

    const mockMsg = {
      reply: jest.fn(),
    } as unknown as Message

    it('replies with pong', async () => {
      await callback(mockMsg, mockContext)

      expect(mockMsg.reply).toHaveBeenCalledWith('pong')
    })
  })
})
