import { Client, Message } from 'discord.js'
import { BotEventHandler, CustomContext } from '../../types'
import handleEvent from './handleEvent'
import * as isSelfEvent from '../utils/isSelfEvent'

describe('handleEvent', () => {
  beforeEach(jest.clearAllMocks)

  const mockMsg = {
    content: 'ping',
  } as Message

  const mockClient = {
    user: { id: 'test-user-id' },
  } as Client

  const pingOneCallbackSpy = jest.fn()
  const pingOneEventHandler: BotEventHandler = {
    condition: (msg) => msg.content === 'ping',
    callback: pingOneCallbackSpy,
  }

  const pingTwoCallbackSpy = jest.fn()
  const pingTwoEventHandler: BotEventHandler = {
    condition: (msg) => msg.content === 'ping',
    callback: pingTwoCallbackSpy,
  }

  const mockHandlers: BotEventHandler[] = [
    pingOneEventHandler,
    pingTwoEventHandler,
  ]

  const isSelfEventSpy = jest
    .spyOn(isSelfEvent, 'default')
    .mockReturnValue(false)

  const setupTest: (args?: {
    msg?: Partial<Omit<Message, 'valueOf'>>
    client?: Partial<Client>
    context?: CustomContext
  }) => Promise<void> = ({ msg, client, context = {} } = {}) =>
    handleEvent([{ ...mockMsg, ...msg } as Message], mockHandlers, {
      client: { ...mockClient, ...client } as Client,
      handlers: mockHandlers,
      ...context,
    })

  it('should ignore an event if the client has no user', async () => {
    await setupTest({
      client: { ...mockClient, user: undefined },
    })

    expect(isSelfEventSpy).not.toHaveBeenCalled()
    expect(pingOneCallbackSpy).not.toHaveBeenCalled()
    expect(pingTwoCallbackSpy).not.toHaveBeenCalled()
  })

  describe('when the event is a self event', () => {
    beforeEach(() => {
      isSelfEventSpy.mockReturnValueOnce(true)
    })

    it('should ignore the event', async () => {
      await setupTest()

      expect(isSelfEventSpy).toHaveBeenCalledWith(
        [mockMsg],
        mockClient.user?.id,
      )
      expect(pingOneCallbackSpy).not.toHaveBeenCalled()
      expect(pingTwoCallbackSpy).not.toHaveBeenCalled()
    })
  })

  it('should call the callback of the first handler that matches the condition', async () => {
    await setupTest()

    expect(isSelfEventSpy).toHaveBeenCalledWith([mockMsg], mockClient.user?.id)
    expect(pingOneCallbackSpy).toHaveBeenCalledWith(mockMsg, {
      client: mockClient,
      handlers: mockHandlers,
    })
    expect(pingTwoCallbackSpy).not.toHaveBeenCalled()
  })

  it("should call a handler's callback with custom context", async () => {
    const customContext = { foo: 'bar' }

    await setupTest({ context: customContext })

    expect(isSelfEventSpy).toHaveBeenCalledWith([mockMsg], mockClient.user?.id)
    expect(pingOneCallbackSpy).toHaveBeenCalledWith(mockMsg, {
      client: mockClient,
      handlers: mockHandlers,
      ...customContext,
    })
    expect(pingTwoCallbackSpy).not.toHaveBeenCalled()
  })

  it("should ignore the event if none of the handlers' conditions match", async () => {
    const msg = { content: 'Foobar' }

    await setupTest({ msg })

    expect(isSelfEventSpy).toHaveBeenCalledWith([msg], mockClient.user?.id)
    expect(pingOneCallbackSpy).not.toHaveBeenCalled()
    expect(pingTwoCallbackSpy).not.toHaveBeenCalled()
  })
})
