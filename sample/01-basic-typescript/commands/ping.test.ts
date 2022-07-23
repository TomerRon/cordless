import { Context } from 'cordless'
import { ChatInputCommandInteraction } from 'discord.js'
import ping from './ping'

describe('ping', () => {
  const mockInteraction = {
    reply: jest.fn(),
  } as unknown as ChatInputCommandInteraction

  const mockContext = {
    foo: 'bar',
  } as unknown as Context

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
