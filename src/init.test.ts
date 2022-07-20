import { Client, Intents } from 'discord.js'
import * as initCommandsModule from './commands/init'
import * as initEventsModule from './events/init'
import { init } from './init'
import { BotCommand, BotEventHandler, InitOptions } from './types'

const onceSpy = jest.fn()
const loginSpy = jest.fn()
const mockNotLoggedInClient = {
  once: onceSpy,
  login: loginSpy,
} as unknown as Client<false>

const mockLoggedInClient = {
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

  const mockCommands: BotCommand[] = [
    {
      name: 'ping',
      description: 'ping-desc',
      handler: jest.fn(),
    },
  ]

  const mockEventHandler: BotEventHandler = {
    condition: (msg) => msg.content === 'ping',
    callback: jest.fn(),
  }

  const mockOptions: InitOptions = {
    commands: mockCommands,
    handlers: [mockEventHandler],
    token: mockToken,
  }

  const initCommandsSpy = jest
    .spyOn(initCommandsModule, 'default')
    .mockReturnValue(undefined)

  const initEventsSpy = jest
    .spyOn(initEventsModule, 'default')
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

  it('should call initCommands with the given commands', async () => {
    await setupTest()

    expect(initCommandsSpy).toHaveBeenCalledWith({
      client: mockLoggedInClient,
      commands: mockCommands,
      context: {
        client: mockLoggedInClient,
        handlers: mockOptions.handlers,
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
        handlers: mockOptions.handlers,
      },
      token: mockToken,
    })
  })

  it('should call initEvents with the given event handlers', async () => {
    await setupTest()

    expect(initEventsSpy).toHaveBeenCalledWith({
      client: mockLoggedInClient,
      handlers: [mockEventHandler],
      context: {
        client: mockLoggedInClient,
        handlers: mockOptions.handlers,
      },
    })
  })

  it('should call initEvents with an empty list of event handlers by default', async () => {
    await setupTest({ handlers: undefined })

    expect(initEventsSpy).toHaveBeenCalledWith({
      client: mockLoggedInClient,
      handlers: [],
      context: {
        client: mockLoggedInClient,
        handlers: [],
      },
    })
  })

  it('should return a logged-in client', async () => {
    const client = await setupTest()

    expect(client).toStrictEqual(mockLoggedInClient)
    expect(loginSpy).toHaveBeenCalledWith(mockToken)
    expect(onceSpy).toHaveBeenCalledWith('ready', expect.any(Function))
  })
})
