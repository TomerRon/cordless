import { Client, CommandInteraction, MessageActionRow } from 'discord.js'
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
    functions: [],
    foo: 'bar',
  }

  const mockInteraction = {
    options: {
      getSubcommand: jest.fn(),
    },
  }

  const mockComponents = ['row' as unknown as MessageActionRow]

  const buildComponentsSpy = jest
    .spyOn(buildComponentsModule, 'default')
    .mockResolvedValue(mockComponents)

  describe('when none of the commands match the interaction', () => {
    const mockCommandName = 'not-found'

    it('should ignore the interaction', async () => {
      await handleCommand({
        commands: mockCommands,
        commandName: mockCommandName,
        context: mockContext,
        interaction: mockInteraction as unknown as CommandInteraction,
      })

      expect(mockCommandWithHandlerA.handler).not.toHaveBeenCalled()
      expect(mockCommandWithHandlerB.handler).not.toHaveBeenCalled()
      expect(mockSubcommandA.handler).not.toHaveBeenCalled()
      expect(mockSubcommandB.handler).not.toHaveBeenCalled()
      expect(buildComponentsSpy).not.toHaveBeenCalled()
    })
  })

  describe('when a BotCommandWithHandler matches the interaction', () => {
    const mockCommandName = mockCommandWithHandlerB.name

    it('should call the handler of the matching command', async () => {
      await handleCommand({
        commands: mockCommands,
        commandName: mockCommandName,
        context: mockContext,
        interaction: mockInteraction as unknown as CommandInteraction,
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
        interaction: mockInteraction as unknown as CommandInteraction,
        context: mockContext,
      })
    })
  })

  describe('when a BotCommandWithSubcommands matches the interaction', () => {
    const mockCommandName = mockCommandWithSubcommands.name

    describe('when none of the subcommands match the interaction', () => {
      beforeEach(() => {
        mockInteraction.options.getSubcommand.mockReturnValueOnce('not-found')
      })

      it('should ignore the interaction', async () => {
        await handleCommand({
          commands: mockCommands,
          commandName: mockCommandName,
          context: mockContext,
          interaction: mockInteraction as unknown as CommandInteraction,
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
          commandName: mockCommandName,
          context: mockContext,
          interaction: mockInteraction as unknown as CommandInteraction,
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
          interaction: mockInteraction as unknown as CommandInteraction,
          context: mockContext,
        })

        expect(mockInteraction.options.getSubcommand).toHaveBeenCalled()
      })
    })
  })
})
