import { jest } from '@jest/globals'
import ping from './ping'

describe('ping', () => {
  const mockInteraction = {
    reply: jest.fn(),
  }

  const mockContext = {
    foo: 'bar',
  }

  describe('handler', () => {
    const { handler } = ping

    it('replies with pong', async () => {
      await handler({
        interaction: mockInteraction,
        context: mockContext,
      })

      expect(mockInteraction.reply).toHaveBeenCalledWith('Pong!')
    })
  })
})
