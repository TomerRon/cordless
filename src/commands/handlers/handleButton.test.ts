import { ButtonInteraction, Client } from 'discord.js'
import handleButton from './handleButton'

describe('handleButton', () => {
  beforeEach(jest.clearAllMocks)

  const mockButtonHandlerMap: Record<string, jest.Mock> = {
    'button-a': jest.fn(),
    'button-b': jest.fn(),
    'button-c': jest.fn(),
  }

  const mockContext = {
    client: jest.fn() as unknown as Client,
    handlers: [],
    foo: 'bar',
  }

  describe('when none of the handlers match the interaction', () => {
    const mockInteraction = {
      customId: 'not-found',
    } as unknown as ButtonInteraction

    it('should ignore the interaction', () => {
      handleButton({
        buttonHandlerMap: mockButtonHandlerMap,
        interaction: mockInteraction,
        context: mockContext,
      })

      Object.values(mockButtonHandlerMap).forEach((handler) =>
        expect(handler).not.toHaveBeenCalled(),
      )
    })
  })

  describe('when one of the handlers matches the interaction', () => {
    const mockInteraction = {
      customId: 'button-c',
    } as unknown as ButtonInteraction

    it('should call the handler of the matching button', () => {
      handleButton({
        buttonHandlerMap: mockButtonHandlerMap,
        interaction: mockInteraction,
        context: mockContext,
      })

      expect(mockButtonHandlerMap['button-a']).not.toHaveBeenCalled()
      expect(mockButtonHandlerMap['button-b']).not.toHaveBeenCalled()

      expect(mockButtonHandlerMap['button-c']).toHaveBeenCalledWith({
        interaction: mockInteraction,
        context: mockContext,
      })
    })
  })
})
