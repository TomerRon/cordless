import { Client, CommandInteraction } from 'discord.js'
import {
  BotCommand,
  BotCommandWithHandler,
  BotCommandWithSubcommands,
} from '../../types'
import handleCommand from './handleCommand'

describe('handleCommand', () => {
  beforeEach(jest.clearAllMocks)

  const mockCommandWithHandlerA: BotCommandWithHandler = {
    name: 'command-a',
    handler: jest.fn(),
  }

  const mockCommandWithHandlerB: BotCommandWithHandler = {
    name: 'command-b',
    handler: jest.fn(),
  }

  const mockSubcommandA: BotCommandWithHandler = {
    name: 'subcommand-a',
    handler: jest.fn(),
  }

  const mockSubcommandB: BotCommandWithHandler = {
    name: 'subcommand-b',
    handler: jest.fn(),
  }

  const mockCommandWithSubcommands: BotCommandWithSubcommands = {
    name: 'command-c',
    subcommands: [mockSubcommandA, mockSubcommandB],
  }

  const mockCommands: BotCommand[] = [
    mockCommandWithHandlerA,
    mockCommandWithHandlerB,
    mockCommandWithSubcommands,
  ]

  const mockContext = {
    client: jest.fn() as unknown as Client,
    functions: [],
    foo: 'bar',
  }

  describe('when none of the commands match the interaction', () => {
    const mockInteraction = {
      commandName: 'not-found',
    } as CommandInteraction

    it('should ignore the interaction', () => {
      handleCommand({
        commands: mockCommands,
        context: mockContext,
        interaction: mockInteraction,
      })

      expect(mockCommandWithHandlerA.handler).not.toHaveBeenCalled()
      expect(mockCommandWithHandlerB.handler).not.toHaveBeenCalled()
      expect(mockSubcommandA.handler).not.toHaveBeenCalled()
      expect(mockSubcommandB.handler).not.toHaveBeenCalled()
    })
  })

  describe('when a BotCommandWithHandler matches the interaction', () => {
    const mockInteraction = {
      commandName: mockCommandWithHandlerB.name,
    } as CommandInteraction

    it('should call the handler of the matching command', () => {
      handleCommand({
        commands: mockCommands,
        context: mockContext,
        interaction: mockInteraction,
      })

      expect(mockCommandWithHandlerA.handler).not.toHaveBeenCalled()
      expect(mockCommandWithHandlerB.handler).toHaveBeenCalledWith({
        context: mockContext,
        interaction: mockInteraction,
      })
      expect(mockSubcommandA.handler).not.toHaveBeenCalled()
      expect(mockSubcommandB.handler).not.toHaveBeenCalled()
    })
  })

  describe('when a BotCommandWithSubcommands matches the interaction', () => {
    describe('when none of the subcommands match the interaction', () => {
      const mockInteraction = {
        commandName: mockCommandWithSubcommands.name,
        options: {
          getSubcommand: jest.fn().mockReturnValue('not-found'),
        },
      } as unknown as CommandInteraction

      it('should ignore the interaction', () => {
        handleCommand({
          commands: mockCommands,
          context: mockContext,
          interaction: mockInteraction,
        })

        expect(mockCommandWithHandlerA.handler).not.toHaveBeenCalled()
        expect(mockCommandWithHandlerB.handler).not.toHaveBeenCalled()
        expect(mockSubcommandA.handler).not.toHaveBeenCalled()
        expect(mockSubcommandB.handler).not.toHaveBeenCalled()

        expect(mockInteraction.options.getSubcommand).toHaveBeenCalled()
      })
    })

    describe('when a subcommand matches the interaction', () => {
      const mockInteraction = {
        commandName: mockCommandWithSubcommands.name,
        options: {
          getSubcommand: jest.fn().mockReturnValue(mockSubcommandB.name),
        },
      } as unknown as CommandInteraction

      it('should call the handler of the matching subcommand', () => {
        handleCommand({
          commands: mockCommands,
          context: mockContext,
          interaction: mockInteraction,
        })

        expect(mockCommandWithHandlerA.handler).not.toHaveBeenCalled()
        expect(mockCommandWithHandlerB.handler).not.toHaveBeenCalled()
        expect(mockSubcommandA.handler).not.toHaveBeenCalled()
        expect(mockSubcommandB.handler).toHaveBeenCalledWith({
          context: mockContext,
          interaction: mockInteraction,
        })

        expect(mockInteraction.options.getSubcommand).toHaveBeenCalled()
      })
    })
  })
})
