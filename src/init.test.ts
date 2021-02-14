import { Client, Message } from 'discord.js'
import { init } from './init'
import * as handleMessageModule from './utils/handleMessage'
import { InitOptions } from './types'

const onSpy = jest.fn()
const mockBaseClient = ({ on: onSpy } as unknown) as Client

jest.mock('discord.js', () => ({
  Client: jest.fn().mockImplementation(() => mockBaseClient),
}))

describe('init', () => {
  beforeEach(jest.clearAllMocks)

  const mockMsg = {
    content: 'ping',
  } as Message

  const mockOptions: InitOptions = { functions: [] }

  const handleMessageSpy = jest
    .spyOn(handleMessageModule, 'default')
    .mockResolvedValue(undefined)

  it('should subscribe to message events', () => {
    init(mockOptions)

    expect(onSpy).toHaveBeenCalledWith('message', expect.any(Function))
  })

  it('should call handleMessage when a message was received', () => {
    init(mockOptions)

    const onMessageHandler = onSpy.mock.calls[0][1] as (msg: Message) => void

    onMessageHandler(mockMsg)

    expect(handleMessageSpy).toHaveBeenCalledWith(
      mockMsg,
      mockBaseClient,
      mockOptions,
    )
  })
})
