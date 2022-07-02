import { Client, Intents, Message } from 'discord.js'
import * as getHelpFunctionModule from './functions/help'
import { init } from './init'
import { BotFunction, InitOptions } from './types'
import * as handleEvent from './utils/handleEvent'

const onSpy = jest.fn()
const mockBaseClient = { on: onSpy } as unknown as Client

jest.mock('discord.js', () => {
  const originalModule = jest.requireActual('discord.js')

  return {
    ...originalModule,
    Client: jest.fn().mockImplementation(() => mockBaseClient),
  }
})

describe('init', () => {
  beforeEach(jest.clearAllMocks)

  const mockMsg = {
    content: 'ping',
  } as Message

  const mockFunction: BotFunction = {
    condition: (msg) => msg.content === 'ping',
    callback: jest.fn(),
  }

  const mockOptions: InitOptions = { functions: [mockFunction] }

  const handleEventSpy = jest
    .spyOn(handleEvent, 'default')
    .mockResolvedValue(undefined)

  const setupTest = (options?: Partial<InitOptions>) => {
    init({ ...mockOptions, ...options })
  }

  it('should throw an error if a function has spaces in its name', () => {
    const badFn: BotFunction = { ...mockFunction, name: 'bad name' }

    expect(() => setupTest({ functions: [badFn] })).toThrow(
      'A function cannot have spaces in its name.',
    )
  })

  it('should initialize the client with the default intents', () => {
    setupTest()

    expect(Client).toHaveBeenCalledWith({
      intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
    })
  })

  it('should initialize the client with the provided intents', () => {
    const intents = [
      Intents.FLAGS.GUILD_BANS,
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    ]

    setupTest({ intents })

    expect(Client).toHaveBeenCalledWith({
      intents,
    })
  })

  it('should subscribe to message events', () => {
    setupTest()

    expect(onSpy).toHaveBeenCalledWith('messageCreate', expect.any(Function))
  })

  it('should call handleEvent when an appropriate event was received', () => {
    setupTest()

    const eventHandler = onSpy.mock.calls[0][1] as (msg: Message) => void

    eventHandler(mockMsg)

    expect(handleEventSpy).toHaveBeenCalledWith([mockMsg], [mockFunction], {
      client: mockBaseClient,
      functions: mockOptions.functions,
    })
  })

  it('should handle many functions and map each one to an event handler', () => {
    // A function without an explicit event will map to a messageCreate handler
    const fnA: BotFunction = {
      name: 'Function1',
      condition: jest.fn(),
      callback: jest.fn(),
    }

    const fnB: BotFunction<'channelCreate'> = {
      event: 'channelCreate',
      name: 'Function2',
      condition: jest.fn(),
      callback: jest.fn(),
    }

    const fnC: BotFunction<'messageCreate'> = {
      event: 'messageCreate',
      name: 'Function3',
      condition: jest.fn(),
      callback: jest.fn(),
    }

    const fnD: BotFunction<'messageDelete'> = {
      event: 'messageDelete',
      name: 'Function4',
      condition: jest.fn(),
      callback: jest.fn(),
    }

    const fnE: BotFunction<'channelCreate'> = {
      event: 'channelCreate',
      name: 'Function5',
      condition: jest.fn(),
      callback: jest.fn(),
    }

    const mockFunctions = [fnA, fnB, fnC, fnD, fnE]

    setupTest({ functions: mockFunctions })

    const expectedEvents = {
      messageCreate: [fnA, fnC],
      channelCreate: [fnB, fnE],
      messageDelete: [fnD],
    }

    Object.entries(expectedEvents).forEach(([event, expectedFns], i) => {
      expect(onSpy).toHaveBeenNthCalledWith(i + 1, event, expect.any(Function))

      const eventHandler = onSpy.mock.calls[i][1] as (msg: Message) => void

      eventHandler(mockMsg)

      expect(handleEventSpy).toHaveBeenNthCalledWith(
        i + 1,
        [mockMsg],
        expectedFns,
        {
          client: mockBaseClient,
          functions: mockFunctions,
        },
      )
    })

    expect(handleEventSpy.mock.calls).toMatchSnapshot()
  })

  describe('helpCommand', () => {
    const mockHelpFunction: BotFunction = {
      name: 'help',
      condition: () => true,
      callback: () => undefined,
    }

    const getHelpFunctionSpy = jest
      .spyOn(getHelpFunctionModule, 'default')
      .mockReturnValue(mockHelpFunction)

    it('should add a help function when helpCommand is passed', () => {
      const mockHelpCommand = 'foobar-help-command'

      setupTest({ helpCommand: mockHelpCommand })

      const eventHandler = onSpy.mock.calls[0][1] as (msg: Message) => void

      eventHandler(mockMsg)

      const context = handleEventSpy.mock.calls[0][2]

      // The first function should be the one returned from getHelpFunction
      expect(context.functions[0]).toStrictEqual(mockHelpFunction)
      expect(getHelpFunctionSpy).toHaveBeenCalledWith(mockHelpCommand)
    })

    it('should not add a help function when helpCommand is not passed', () => {
      setupTest({ helpCommand: undefined })

      const eventHandler = onSpy.mock.calls[0][1] as (msg: Message) => void

      eventHandler(mockMsg)

      const context = handleEventSpy.mock.calls[0][2]

      expect(context.functions[0]).not.toStrictEqual(mockHelpFunction)
      expect(getHelpFunctionSpy).not.toHaveBeenCalled()
    })
  })
})
