import { Client, Message } from 'discord.js'
import { BotEventHandler, Context } from '../types'
import initEvents, { InitEventsArgs } from './init'
import * as handleEventModule from './handlers/handleEvent'

describe('initEvents', () => {
  // An event handler without an explicit event will map to messageCreate
  const handlerA: BotEventHandler = {
    condition: jest.fn(),
    callback: jest.fn(),
  }

  const handlerB: BotEventHandler<'channelCreate'> = {
    event: 'channelCreate',
    condition: jest.fn(),
    callback: jest.fn(),
  }

  const handlerC: BotEventHandler<'messageCreate'> = {
    event: 'messageCreate',
    condition: jest.fn(),
    callback: jest.fn(),
  }

  const handlerD: BotEventHandler<'messageDelete'> = {
    event: 'messageDelete',
    condition: jest.fn(),
    callback: jest.fn(),
  }

  const handlerE: BotEventHandler<'channelCreate'> = {
    event: 'channelCreate',
    condition: jest.fn(),
    callback: jest.fn(),
  }

  const mockEventHandlers = [handlerA, handlerB, handlerC, handlerD, handlerE]

  const mockClient = {
    on: jest.fn(),
  } as unknown as Client<true>

  const mockContext: Context = {
    client: mockClient,
    handlers: mockEventHandlers,
  }

  const mockArgs: InitEventsArgs = {
    client: mockClient,
    handlers: mockEventHandlers,
    context: mockContext,
  }

  const mockMsg = {
    content: 'ping',
  } as Message

  const handleEventSpy = jest
    .spyOn(handleEventModule, 'default')
    .mockResolvedValue(undefined)

  it('should process many event handlers and map each one to the appropriate discord.js event handler', async () => {
    initEvents(mockArgs)

    const expectedEvents = {
      messageCreate: [handlerA, handlerC],
      channelCreate: [handlerB, handlerE],
      messageDelete: [handlerD],
    }

    Object.entries(expectedEvents).forEach(([event, expectedHandlers], i) => {
      expect(mockClient.on).toHaveBeenNthCalledWith(
        i + 1,
        event,
        expect.any(Function),
      )

      const eventHandler = (mockClient.on as jest.Mock).mock.calls[i][1] as (
        msg: Message,
      ) => void

      eventHandler(mockMsg)

      expect(handleEventSpy).toHaveBeenNthCalledWith(
        i + 1,
        [mockMsg],
        expectedHandlers,
        mockContext,
      )
    })

    expect(handleEventSpy.mock.calls).toMatchSnapshot()
  })
})
