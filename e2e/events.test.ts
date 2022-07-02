import { Client, Message } from 'discord.js'
import { v4 as uuidv4 } from 'uuid'
import { BotFunction, InitOptions } from '../src'
import { setupClients } from './utils'

describe('events', () => {
  beforeEach(jest.clearAllMocks)

  let cordlessClient: Client
  let userClient: Client
  let sendMessageAndWaitForIt: (content: string) => Promise<Message>

  const testPing = `[events] - ${uuidv4()}`

  const setupTest = async (functions: InitOptions['functions']) => {
    const setup = await setupClients({
      functions,
    })

    cordlessClient = setup.cordlessClient
    userClient = setup.userClient
    sendMessageAndWaitForIt = setup.sendMessageAndWaitForIt
  }

  afterEach(async () => {
    // In this file we have to create a new client in each test
    // So we wait 1 second between tests to prevent flakiness
    await new Promise<void>((resolve) => setTimeout(resolve, 1000))
  })

  describe('when initialized with one function without an explicit event', () => {
    const pingCallbackSpy = jest.fn()
    const ping: BotFunction = {
      condition: (msg) => msg.content === testPing,
      callback: (msg) => {
        pingCallbackSpy(msg)
      },
    }

    beforeAll(async () => {
      await setupTest([ping])
    })

    afterAll(() => {
      cordlessClient.destroy()
      userClient.destroy()
    })

    it('should subscribe the function to messageCreate events', async () => {
      const message = await sendMessageAndWaitForIt(testPing)

      expect(pingCallbackSpy).toHaveBeenCalledWith(message)
    })
  })

  describe('when initialized with a messageCreate function event', () => {
    const pingCallbackSpy = jest.fn()

    const ping: BotFunction<'messageCreate'> = {
      event: 'messageCreate',
      condition: (msg) => msg.content === testPing,
      callback: (msg) => {
        pingCallbackSpy(msg)
      },
    }

    beforeAll(async () => {
      await setupTest([ping])
    })

    afterAll(() => {
      cordlessClient.destroy()
      userClient.destroy()
    })

    it('should subscribe the function to messageCreate events', async () => {
      const message = await sendMessageAndWaitForIt(testPing)

      expect(pingCallbackSpy).toHaveBeenCalledWith(message)
    })
  })

  describe('when initialized with some functions that are not messageCreate', () => {
    const messageDeleteFnCallbackSpy = jest.fn()
    const messageDeleteFn: BotFunction<'messageDelete'> = {
      event: 'messageDelete',
      condition: () => true,
      callback: (msg) => {
        messageDeleteFnCallbackSpy(msg)
      },
    }

    const channelCreateFnCallbackSpy = jest.fn()
    const channelCreateFn: BotFunction<'channelCreate'> = {
      event: 'channelCreate',
      condition: () => true,
      callback: (channel) => {
        channelCreateFnCallbackSpy(channel)
      },
    }

    beforeAll(async () => {
      await setupTest([messageDeleteFn, channelCreateFn])
    })

    afterAll(() => {
      cordlessClient.destroy()
      userClient.destroy()
    })

    it('should not respond to messageCreate events', async () => {
      await sendMessageAndWaitForIt(testPing)

      expect(messageDeleteFnCallbackSpy).not.toHaveBeenCalled()
      expect(channelCreateFnCallbackSpy).not.toHaveBeenCalled()
    })

    it('should respond to messageDelete events', async () => {
      const message = await sendMessageAndWaitForIt(testPing)

      expect(messageDeleteFnCallbackSpy).not.toHaveBeenCalled()
      expect(channelCreateFnCallbackSpy).not.toHaveBeenCalled()

      await message.delete()

      // Wait half a second for the bot to receive the messageDelete event
      await new Promise<void>((resolve) => setTimeout(resolve, 500))

      expect(messageDeleteFnCallbackSpy).toHaveBeenCalledWith(message)
      expect(channelCreateFnCallbackSpy).not.toHaveBeenCalled()
    })
  })
})
