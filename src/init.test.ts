import { Client, Intents, Message } from 'discord.js'
import * as getHelpFunctionModule from './functions/help'
import { init } from './init'
import { BotFunction, InitOptions } from './types'
import * as handleMessageModule from './utils/handleMessage'

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

  const handleMessageSpy = jest
    .spyOn(handleMessageModule, 'default')
    .mockResolvedValue(undefined)

  const setupTest = (options?: Partial<InitOptions>) => {
    init({ ...mockOptions, ...options })

    return onSpy.mock.calls[0][1] as (msg: Message) => void
  }

  it('should initialize the client with the default intents', () => {
    setupTest()

    expect(Client).toHaveBeenCalledWith({
      intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
    })
  })

  it('should subscribe to message events', () => {
    setupTest()

    expect(onSpy).toHaveBeenCalledWith('messageCreate', expect.any(Function))
  })

  it('should call handleMessage when a message was received', () => {
    const onMessageHandler = setupTest()

    onMessageHandler(mockMsg)

    expect(handleMessageSpy).toHaveBeenCalledWith(mockMsg, {
      client: mockBaseClient,
      functions: mockOptions.functions,
    })
  })

  it('should throw an error if a function has spaces in its name', () => {
    const badFn: BotFunction = { ...mockFunction, name: 'bad name' }

    expect(() => setupTest({ functions: [badFn] })).toThrow(
      'A function cannot have spaces in its name.',
    )
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
      const onMessageHandler = setupTest({ helpCommand: mockHelpCommand })

      onMessageHandler(mockMsg)

      const context = handleMessageSpy.mock.calls[0][1]

      // The first function should be the one returned from getHelpFunction
      expect(context.functions[0]).toStrictEqual(mockHelpFunction)
      expect(getHelpFunctionSpy).toHaveBeenCalledWith(mockHelpCommand)
    })

    it('should not add a help function when helpCommand is not passed', () => {
      const onMessageHandler = setupTest({ helpCommand: undefined })

      onMessageHandler(mockMsg)

      const context = handleMessageSpy.mock.calls[0][1]

      expect(context.functions[0]).not.toStrictEqual(mockHelpFunction)
      expect(getHelpFunctionSpy).not.toHaveBeenCalled()
    })
  })
})
