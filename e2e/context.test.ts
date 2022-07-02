import { Client, Message } from 'discord.js'
import { v4 as uuidv4 } from 'uuid'
import { BotFunction, Context } from '../src'
import { setupClients } from './utils'

interface CustomContext {
  foo: string
  getCount: () => number
  setCount: (count: number) => void
}

describe('context', () => {
  let cordlessClient: Client
  let userClient: Client
  let sendMessageAndWaitForIt: (content: string) => Promise<Message>

  const testPing = `[context] - ${uuidv4()}`

  const pingCallbackSpy = jest.fn()
  const ping: BotFunction<'messageCreate', CustomContext> = {
    condition: (msg) => msg.content === testPing,
    callback: pingCallbackSpy,
  }

  const mockFunctions = [ping]

  let mockCount = 0

  const mockCustomContext: CustomContext = {
    foo: 'bar',
    getCount: () => mockCount,
    setCount: (count: number) => {
      mockCount = count
    },
  }

  beforeAll(async () => {
    const setup = await setupClients({
      context: mockCustomContext,
      functions: mockFunctions,
      helpCommand: 'foobar',
    })

    cordlessClient = setup.cordlessClient
    userClient = setup.userClient
    sendMessageAndWaitForIt = setup.sendMessageAndWaitForIt

    await sendMessageAndWaitForIt(testPing)
  })

  afterAll(() => {
    cordlessClient.destroy()
    userClient.destroy()
  })

  it('should have access to the client', async () => {
    const { client } = pingCallbackSpy.mock
      .calls[0][1] as Context<CustomContext>

    expect(client.user?.id).toBe(cordlessClient.user?.id)
  })

  it('should have access to the functions', async () => {
    const { functions } = pingCallbackSpy.mock
      .calls[0][1] as Context<CustomContext>

    expect(functions).toStrictEqual([
      expect.objectContaining({ name: 'help' }),
      ...mockFunctions,
    ])
  })

  it('should have access to custom context', async () => {
    const { foo } = pingCallbackSpy.mock.calls[0][1] as Context<CustomContext>

    expect(foo).toBe(mockCustomContext.foo)
  })

  it('should be able to persist the context between function calls', async () => {
    const { getCount, setCount } = pingCallbackSpy.mock
      .calls[0][1] as Context<CustomContext>

    expect(getCount()).toBe(0)

    setCount(1)

    expect(getCount()).toBe(1)

    await sendMessageAndWaitForIt(testPing)

    const { getCount: getCountSecondPing } = pingCallbackSpy.mock
      .calls[1][1] as Context<CustomContext>

    expect(getCountSecondPing()).toBe(1)
  })
})
