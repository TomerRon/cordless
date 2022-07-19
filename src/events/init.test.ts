import { Client, Message } from 'discord.js'
import { BotFunction, Context } from '../types'
import initEvents, { InitEventsArgs } from './init'
import * as handleEventModule from './handlers/handleEvent'

describe('initEvents', () => {
  // A function without an explicit event will map to a messageCreate handler
  const fnA: BotFunction = {
    condition: jest.fn(),
    callback: jest.fn(),
  }

  const fnB: BotFunction<'channelCreate'> = {
    event: 'channelCreate',
    condition: jest.fn(),
    callback: jest.fn(),
  }

  const fnC: BotFunction<'messageCreate'> = {
    event: 'messageCreate',
    condition: jest.fn(),
    callback: jest.fn(),
  }

  const fnD: BotFunction<'messageDelete'> = {
    event: 'messageDelete',
    condition: jest.fn(),
    callback: jest.fn(),
  }

  const fnE: BotFunction<'channelCreate'> = {
    event: 'channelCreate',
    condition: jest.fn(),
    callback: jest.fn(),
  }

  const mockFunctions = [fnA, fnB, fnC, fnD, fnE]

  const mockClient = {
    on: jest.fn(),
  } as unknown as Client<true>

  const mockContext: Context = { client: mockClient, functions: [] }

  const mockArgs: InitEventsArgs = {
    client: mockClient,
    functions: mockFunctions,
    context: mockContext,
  }

  const mockMsg = {
    content: 'ping',
  } as Message

  const handleEventSpy = jest
    .spyOn(handleEventModule, 'default')
    .mockResolvedValue(undefined)

  it('should handle many functions and map each one to an event handler', async () => {
    initEvents(mockArgs)

    const expectedEvents = {
      messageCreate: [fnA, fnC],
      channelCreate: [fnB, fnE],
      messageDelete: [fnD],
    }

    Object.entries(expectedEvents).forEach(([event, expectedFns], i) => {
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
        expectedFns,
        mockContext,
      )
    })

    expect(handleEventSpy.mock.calls).toMatchSnapshot()
  })
})
