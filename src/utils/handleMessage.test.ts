import { Client, Message, User } from 'discord.js'
import handleMessage from './handleMessage'
import { BotFunction } from '../types'

describe('handleMessage', () => {
  beforeEach(jest.clearAllMocks)

  // The userId belonging to the bot client
  const mockClientUserId = 'foobar-client-user-id'
  // The userId belonging to the message author
  const mockAuthorUserId = 'foobar-author-user-id'

  const mockMsg = {
    author: {
      id: mockAuthorUserId,
    },
    content: 'ping',
  } as Message

  const mockClient = {
    user: { id: mockClientUserId },
  } as Client

  const pingCallbackSpy = jest.fn()
  const pingFunction: BotFunction = {
    condition: (msg) => msg.content === 'ping',
    callback: pingCallbackSpy,
  }

  const mockFunctions: BotFunction[] = [pingFunction]

  const setupTest: (args?: {
    msg?: Partial<Omit<Message, 'valueOf'>>
    client?: Partial<Client>
    functions?: BotFunction[]
  }) => Promise<void> = ({ msg, client, functions = [] } = {}) =>
    handleMessage(
      { ...mockMsg, ...msg } as Message,
      { ...mockClient, ...client } as Client,
      [...mockFunctions, ...functions],
    )

  it("should call a function's callback if it matches the condition", async () => {
    await setupTest()

    expect(pingCallbackSpy).toHaveBeenCalledWith(mockMsg, mockFunctions)
  })

  it("should not call a function's callback if it does not match the condition", async () => {
    await setupTest({ msg: { content: 'Foobar' } })

    expect(pingCallbackSpy).not.toHaveBeenCalled()
  })

  it('should ignore a message if it was authored by the bot', async () => {
    await setupTest({
      msg: {
        author: {
          id: mockClientUserId,
        } as User,
      },
    })

    expect(pingCallbackSpy).not.toHaveBeenCalled()
  })

  it('should ignore a message if the client has no user', async () => {
    await setupTest({ client: { user: undefined } })

    expect(pingCallbackSpy).not.toHaveBeenCalled()
  })
})
