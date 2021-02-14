import { Client, ClientEvents, Message } from 'discord.js'
import { init } from './init'
import { InitOptions, BotFunction } from './types'

const mockClientUserId = 'foobar-client-user-id'
const mockOn: jest.Mock<Client['on']> = jest.fn()
const mockBaseClient = { user: { id: mockClientUserId }, on: mockOn }

jest.mock('discord.js', () => ({
  Client: jest
    .fn()
    .mockImplementation(() => (mockBaseClient as unknown) as Client),
}))

describe('init', () => {
  beforeEach(jest.clearAllMocks)

  const mockAuthorUserId = 'foobar-author-user-id'
  const mockMsg = {
    author: {
      id: mockAuthorUserId,
    },
    content: 'ping',
  } as Message

  const pingCallbackSpy = jest.fn()
  const pingFunction: BotFunction = {
    condition: (msg) => msg.content === 'ping',
    callback: pingCallbackSpy,
  }

  const setupTest = (options: InitOptions) => {
    init(options)

    expect(mockOn).toHaveBeenCalledWith('message', expect.any(Function))

    return mockOn.mock.calls[0][1] as (...args: ClientEvents['message']) => void
  }

  it("should call a function's callback if it matches the condition", () => {
    const handler = setupTest({ functions: [pingFunction] })

    handler(mockMsg)

    expect(pingCallbackSpy).toHaveBeenCalledWith(mockMsg)
  })

  it("should not call a function's callback if it does not match the condition", () => {
    const handler = setupTest({ functions: [pingFunction] })

    handler({
      ...mockMsg,
      content: 'Foobar',
    } as Message)

    expect(pingCallbackSpy).not.toHaveBeenCalled()
  })

  it('should ignore a message if it was authored by the bot', () => {
    const handler = setupTest({ functions: [pingFunction] })

    handler({
      ...mockMsg,
      author: {
        id: mockClientUserId,
      },
    } as Message)

    expect(pingCallbackSpy).not.toHaveBeenCalled()
  })

  it('should ignore a message if the client has no user', () => {
    const mockClient = (Client as unknown) as jest.Mock<Client>

    mockClient.mockImplementationOnce(
      () => (({ ...mockBaseClient, user: undefined } as unknown) as Client),
    )

    const handler = setupTest({ functions: [pingFunction] })

    handler(mockMsg)

    expect(pingCallbackSpy).not.toHaveBeenCalled()
  })
})
