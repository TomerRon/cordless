import { Client, Intents, Message } from 'discord.js'
import * as initCommandsModule from './commands/init'
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
})
