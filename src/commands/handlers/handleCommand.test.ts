import {
  ActionRowBuilder,
  ButtonBuilder,
  ChatInputCommandInteraction,
  Client,
} from 'discord.js'
import {
  BotCommand,
  BotCommandWithHandler,
  BotCommandWithSubcommands,
} from '../../types'
import * as buildComponentsModule from '../builders/buildComponents'
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
    handlers: [],
    foo: 'bar',
  }

  const mockComponents = ['row' as unknown as ActionRowBuilder<ButtonBuilder>]

  const buildComponentsSpy = jest
    .spyOn(buildComponentsModule, 'default')
    .mockResolvedValue(mockComponents)

  describe('when none of the commands match the interaction', () => {
    const mockInteraction = {
      commandName: 'not-found',
    }

    it('should ignore the interaction', async () => {
      await handleCommand({
        commands: mockCommands,
        context: mockContext,
        interaction: mockInteraction as unknown as ChatInputCommandInteraction,
      })

      expect(mockCommandWithHandlerA.handler).not.toHaveBeenCalled()
      expect(mockCommandWithHandlerB.handler).not.toHaveBeenCalled()
      expect(mockSubcommandA.handler).not.toHaveBeenCalled()
      expect(mockSubcommandB.handler).not.toHaveBeenCalled()
      expect(buildComponentsSpy).not.toHaveBeenCalled()
    })
  })

  describe('when a BotCommandWithHandler matches the interaction', () => {
    const mockInteraction = {
      commandName: mockCommandWithHandlerB.name,
    }

    it('should call the handler of the matching command', async () => {
      await handleCommand({
        commands: mockCommands,
        context: mockContext,
        interaction: mockInteraction as unknown as ChatInputCommandInteraction,
      })

      expect(mockCommandWithHandlerA.handler).not.toHaveBeenCalled()
      expect(mockCommandWithHandlerB.handler).toHaveBeenCalledWith({
        context: mockContext,
        interaction: mockInteraction,
        components: mockComponents,
      })
      expect(mockSubcommandA.handler).not.toHaveBeenCalled()
      expect(mockSubcommandB.handler).not.toHaveBeenCalled()

      expect(buildComponentsSpy).toHaveBeenCalledWith({
        command: mockCommandWithHandlerB,
        interaction: mockInteraction as unknown as ChatInputCommandInteraction,
        context: mockContext,
      })
    })
  })

  describe('when a BotCommandWithSubcommands matches the interaction', () => {
    const mockInteraction = {
      commandName: mockCommandWithSubcommands.name,
      options: {
        getSubcommand: jest.fn(),
      },
    }

    describe('when none of the subcommands match the interaction', () => {
      beforeEach(() => {
        mockInteraction.options.getSubcommand.mockReturnValueOnce('not-found')
      })

      it('should ignore the interaction', async () => {
        await handleCommand({
          commands: mockCommands,
          context: mockContext,
          interaction:
            mockInteraction as unknown as ChatInputCommandInteraction,
        })

        expect(mockCommandWithHandlerA.handler).not.toHaveBeenCalled()
        expect(mockCommandWithHandlerB.handler).not.toHaveBeenCalled()
        expect(mockSubcommandA.handler).not.toHaveBeenCalled()
        expect(mockSubcommandB.handler).not.toHaveBeenCalled()
        expect(buildComponentsSpy).not.toHaveBeenCalled()

        expect(mockInteraction.options.getSubcommand).toHaveBeenCalled()
      })
    })

    describe('when a subcommand matches the interaction', () => {
      beforeEach(() => {
        mockInteraction.options.getSubcommand.mockReturnValueOnce(
          mockSubcommandB.name,
        )
      })

      it('should call the handler of the matching subcommand', async () => {
        await handleCommand({
          commands: mockCommands,
          context: mockContext,
          interaction:
            mockInteraction as unknown as ChatInputCommandInteraction,
        })

        expect(mockCommandWithHandlerA.handler).not.toHaveBeenCalled()
        expect(mockCommandWithHandlerB.handler).not.toHaveBeenCalled()
        expect(mockSubcommandA.handler).not.toHaveBeenCalled()
        expect(mockSubcommandB.handler).toHaveBeenCalledWith({
          context: mockContext,
          interaction: mockInteraction,
          components: mockComponents,
        })

        expect(buildComponentsSpy).toHaveBeenCalledWith({
          command: mockSubcommandB,
          interaction:
            mockInteraction as unknown as ChatInputCommandInteraction,
          context: mockContext,
        })

        expect(mockInteraction.options.getSubcommand).toHaveBeenCalled()
      })
    })
  })
})
