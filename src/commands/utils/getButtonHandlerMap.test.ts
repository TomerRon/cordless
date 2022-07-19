import {
  BotCommand,
  BotCommandWithHandler,
  BotCommandWithSubcommands,
} from '../../types'
import getButtonHandlerMap from './getButtonHandlerMap'

describe('getButtonHandlerMap', () => {
  const mockCommandWithHandlerA: BotCommandWithHandler = {
    name: 'command-a',
    components: [
      {
        label: 'component-a-label',
        handler: 'command-a-component-a-handler' as unknown as () => void,
      },
    ],
    handler: jest.fn(),
  }

  const mockCommandWithHandlerB: BotCommandWithHandler = {
    name: 'command-b',
    handler: jest.fn(),
  }

  const mockSubcommandA: BotCommandWithHandler = {
    name: 'subcommand-a',
    components: [
      {
        label: 'component-a-label',
        style: 'LINK',
        url: 'component-a-url',
      },
    ],
    handler: jest.fn(),
  }

  const mockSubcommandB: BotCommandWithHandler = {
    name: 'subcommand-b',
    components: [
      {
        label: 'component-a-label',
        handler: 'subcommand-b-component-a-handler' as unknown as () => void,
      },
      {
        label: 'component-b-label',
        style: 'LINK',
        url: () => Promise.resolve('component-b-url'),
      },
      {
        label: 'component-c-label',
        style: 'SUCCESS',
        handler: 'subcommand-b-component-c-handler' as unknown as () => void,
      },
    ],
    handler: jest.fn(),
  }

  const mockCommandWithSubcommands: BotCommandWithSubcommands = {
    name: 'command-c',
    description: 'command-c-desc',
    subcommands: [mockSubcommandA, mockSubcommandB],
  }

  const mockCommands: BotCommand[] = [
    mockCommandWithHandlerA,
    mockCommandWithHandlerB,
    mockCommandWithSubcommands,
  ]

  it('returns a map of button<->handler', () => {
    expect(getButtonHandlerMap(mockCommands)).toStrictEqual({
      'command-a-component-a-label-0': 'command-a-component-a-handler',
      'subcommand-b-component-a-label-0': 'subcommand-b-component-a-handler',
      'subcommand-b-component-c-label-2': 'subcommand-b-component-c-handler',
    })
  })
})
