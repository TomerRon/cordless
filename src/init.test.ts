import { Client, Intents, Message } from 'discord.js'
import * as initCommandsModule from './commands/init'
import * as getHelpFunctionModule from './functions/help'
import { init } from './init'
import { BotCommand, BotFunction, InitOptions } from './types'
import * as handleEvent from './utils/handleEvent'

const onceSpy = jest.fn()
const loginSpy = jest.fn()
const mockNotLoggedInClient = {
  once: onceSpy,
  login: loginSpy,
} as unknown as Client<false>

const onSpy = jest.fn()
const mockLoggedInClient = {
  on: onSpy,
  application: {
    id: 'mock-application-id',
  },
} as unknown as Client<true>

onceSpy.mockImplementation((_, callback) => callback(mockLoggedInClient))

jest.mock('discord.js', () => {
  const originalModule = jest.requireActual('discord.js')

  return {
    ...originalModule,
    Client: jest.fn().mockImplementation(() => mockNotLoggedInClient),
  }
})

describe('init', () => {
  beforeEach(jest.clearAllMocks)

  const mockToken = 'mock-token'

  const mockMsg = {
    content: 'ping',
  } as Message

  const mockCommands: BotCommand[] = [
    {
      name: 'ping',
      description: 'ping-desc',
      handler: jest.fn(),
    },
  ]

  const mockFunction: BotFunction = {
    condition: (msg) => msg.content === 'ping',
    callback: jest.fn(),
  }

  const mockOptions: InitOptions = {
    commands: mockCommands,
    functions: [mockFunction],
    token: mockToken,
  }

  const handleEventSpy = jest
    .spyOn(handleEvent, 'default')
    .mockResolvedValue(undefined)

  const initCommandsSpy = jest
    .spyOn(initCommandsModule, 'default')
    .mockReturnValue(undefined)

  const setupTest = (options?: Partial<InitOptions>) =>
    init({ ...mockOptions, ...options })

  it('should throw an error if a function has spaces in its name', async () => {
    const badFn: BotFunction = { ...mockFunction, name: 'bad name' }

    await expect(() => setupTest({ functions: [badFn] })).rejects.toThrow(
      'A function cannot have spaces in its name.',
    )
    expect(loginSpy).not.toHaveBeenCalled()
    expect(initCommandsSpy).not.toHaveBeenCalled()
  })

  it('should initialize the client with the default intents', async () => {
    await setupTest()

    expect(Client).toHaveBeenCalledWith({
      intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
    })
  })

  it('should initialize the client with the provided intents', async () => {
    const intents = [
      Intents.FLAGS.GUILD_BANS,
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    ]

    await setupTest({ intents })

    expect(Client).toHaveBeenCalledWith({
      intents,
    })
  })

  it('should subscribe to message events', async () => {
    await setupTest()

    expect(onSpy).toHaveBeenCalledWith('messageCreate', expect.any(Function))
  })

  it('should call initCommands with the given commands', async () => {
    await setupTest()

    expect(initCommandsSpy).toHaveBeenCalledWith({
      client: mockLoggedInClient,
      commands: mockCommands,
      context: {
        client: mockLoggedInClient,
        functions: mockOptions.functions,
      },
      token: mockToken,
    })
  })

  it('should call initCommands with an empty list of commands by default', async () => {
    await setupTest({ commands: undefined })

    expect(initCommandsSpy).toHaveBeenCalledWith({
      client: mockLoggedInClient,
      commands: [],
      context: {
        client: mockLoggedInClient,
        functions: mockOptions.functions,
      },
      token: mockToken,
    })
  })

  it('should return a logged-in client', async () => {
    const client = await setupTest()

    expect(client).toStrictEqual(mockLoggedInClient)
    expect(loginSpy).toHaveBeenCalledWith(mockToken)
    expect(onceSpy).toHaveBeenCalledWith('ready', expect.any(Function))
  })

  it('should call handleEvent when an appropriate event was received', async () => {
    await setupTest()

    const eventHandler = onSpy.mock.calls[0][1] as (msg: Message) => void

    eventHandler(mockMsg)

    expect(handleEventSpy).toHaveBeenCalledWith([mockMsg], [mockFunction], {
      client: mockLoggedInClient,
      functions: mockOptions.functions,
    })
  })

  it('should handle many functions and map each one to an event handler', async () => {
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

    await setupTest({ functions: mockFunctions })

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
          client: mockLoggedInClient,
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

    it('should add a help function when helpCommand is passed', async () => {
      const mockHelpCommand = 'foobar-help-command'

      await setupTest({ helpCommand: mockHelpCommand })

      const eventHandler = onSpy.mock.calls[0][1] as (msg: Message) => void

      eventHandler(mockMsg)

      const context = handleEventSpy.mock.calls[0][2]

      // The first function should be the one returned from getHelpFunction
      expect(context.functions[0]).toStrictEqual(mockHelpFunction)
      expect(getHelpFunctionSpy).toHaveBeenCalledWith(mockHelpCommand)
    })

    it('should not add a help function when helpCommand is not passed', async () => {
      await setupTest({ helpCommand: undefined })

      const eventHandler = onSpy.mock.calls[0][1] as (msg: Message) => void

      eventHandler(mockMsg)

      const context = handleEventSpy.mock.calls[0][2]

      expect(context.functions[0]).not.toStrictEqual(mockHelpFunction)
      expect(getHelpFunctionSpy).not.toHaveBeenCalled()
    })
  })
})
