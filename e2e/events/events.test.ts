import { Client, Message } from 'discord.js'
import { v4 as uuidv4 } from 'uuid'
import { BotEventHandler, InitOptions } from '../../src'
import { setupClients } from '../utils'

describe('events', () => {
  beforeEach(jest.clearAllMocks)

  let cordlessClient: Client
  let userClient: Client
  let sendMessageAndWaitForIt: (content: string) => Promise<Message>

  const testPing = `[events] - ${uuidv4()}`

  const setupTest = async (handlers: InitOptions['handlers']) => {
    const setup = await setupClients({
      handlers,
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

  describe('when initialized with one event handler without an explicit event', () => {
    const pingCallbackSpy = jest.fn()
    const ping: BotEventHandler = {
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

    it('should subscribe the event handler to messageCreate events', async () => {
      const message = await sendMessageAndWaitForIt(testPing)

      expect(pingCallbackSpy).toHaveBeenCalledWith(message)
    })
  })

  describe('when initialized with a messageCreate event handler', () => {
    const pingCallbackSpy = jest.fn()

    const ping: BotEventHandler<'messageCreate'> = {
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

    it('should subscribe the event handler to messageCreate events', async () => {
      const message = await sendMessageAndWaitForIt(testPing)

      expect(pingCallbackSpy).toHaveBeenCalledWith(message)
    })
  })

  describe('when initialized with some event handlers that are not messageCreate', () => {
    const messageDeleteHandlerCallbackSpy = jest.fn()
    const messageDeleteHandler: BotEventHandler<'messageDelete'> = {
      event: 'messageDelete',
      condition: () => true,
      callback: (msg) => {
        messageDeleteHandlerCallbackSpy(msg)
      },
    }

    const channelCreateHandlerCallbackSpy = jest.fn()
    const channelCreateHandler: BotEventHandler<'channelCreate'> = {
      event: 'channelCreate',
      condition: () => true,
      callback: (channel) => {
        channelCreateHandlerCallbackSpy(channel)
      },
    }

    beforeAll(async () => {
      await setupTest([messageDeleteHandler, channelCreateHandler])
    })

    afterAll(() => {
      cordlessClient.destroy()
      userClient.destroy()
    })

    it('should not respond to messageCreate events', async () => {
      await sendMessageAndWaitForIt(testPing)

      expect(messageDeleteHandlerCallbackSpy).not.toHaveBeenCalled()
      expect(channelCreateHandlerCallbackSpy).not.toHaveBeenCalled()
    })

    it('should respond to messageDelete events', async () => {
      const message = await sendMessageAndWaitForIt(testPing)

      expect(messageDeleteHandlerCallbackSpy).not.toHaveBeenCalled()
      expect(channelCreateHandlerCallbackSpy).not.toHaveBeenCalled()

      await message.delete()

      // Wait half a second for the bot to receive the messageDelete event
      await new Promise<void>((resolve) => setTimeout(resolve, 500))

      expect(messageDeleteHandlerCallbackSpy).toHaveBeenCalledWith(message)
      expect(channelCreateHandlerCallbackSpy).not.toHaveBeenCalled()
    })
  })
})
