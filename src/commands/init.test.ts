import { SlashCommandBuilder } from '@discordjs/builders'
import { Client, Interaction } from 'discord.js'
import { BotCommand, Context } from '../types'
import initCommands, { InitCommandsArgs } from './init'
import * as buildModule from './utils/build'
import * as handleCommandModule from './utils/handleCommand'
import * as registerCommandsModule from './utils/registerCommands'

describe('initCommands', () => {
  beforeEach(jest.clearAllMocks)

  const mockApplicationId = 'mock-application-id'
  const mockClient: Client<true> = {
    on: jest.fn(),
    application: { id: mockApplicationId },
  } as unknown as Client<true>
  const mockCommands: BotCommand[] = ['botCommand' as unknown as BotCommand]
  const mockContext: Context = { client: mockClient, functions: [] }
  const mockToken = 'mock-token'

  const mockArgs: InitCommandsArgs<{}> = {
    client: mockClient,
    commands: mockCommands,
    context: mockContext,
    token: mockToken,
  }

  const mockResolvedCommands: SlashCommandBuilder[] = [
    'slashCommandBuilder' as unknown as SlashCommandBuilder,
  ]

  const buildSpy = jest
    .spyOn(buildModule, 'default')
    .mockReturnValue(mockResolvedCommands)

  const registerCommandsSpy = jest
    .spyOn(registerCommandsModule, 'default')
    .mockReturnValue(undefined)

  describe('when the commands are successfully initialized', () => {
    beforeEach(() => {
      initCommands(mockArgs)
    })

    it('registers the commands and subscribes to interactionCreate', () => {
      expect(buildSpy).toHaveBeenCalledWith(mockCommands)
      expect(registerCommandsSpy).toHaveBeenCalledWith({
        applicationId: mockApplicationId,
        commands: mockResolvedCommands,
        token: mockToken,
      })
      expect(mockClient.on).toHaveBeenCalledWith(
        'interactionCreate',
        expect.any(Function),
      )
    })

    describe('interactionCreate handler', () => {
      let interactionCreateHandler: (interaction: Interaction) => void

      const handleCommandSpy = jest
        .spyOn(handleCommandModule, 'default')
        .mockResolvedValue(undefined)

      const isCommandSpy = jest.fn()

      const mockInteraction = {
        isCommand: isCommandSpy,
      } as unknown as Interaction

      beforeEach(() => {
        interactionCreateHandler = (mockClient.on as jest.Mock).mock
          .calls[0][1] as (interaction: Interaction) => void
      })

      describe('when the interaction is a command', () => {
        beforeEach(() => {
          isCommandSpy.mockReturnValueOnce(true)
        })

        it('calls handleCommand', () => {
          interactionCreateHandler(mockInteraction)

          expect(isCommandSpy).toHaveBeenCalled()
          expect(handleCommandSpy).toHaveBeenCalledWith({
            commands: mockCommands,
            context: mockContext,
            interaction: mockInteraction,
          })
        })
      })

      describe('when the interaction is not a command', () => {
        beforeEach(() => {
          isCommandSpy.mockReturnValueOnce(false)
        })

        it('does nothing', () => {
          interactionCreateHandler(mockInteraction)

          expect(isCommandSpy).toHaveBeenCalled()
          expect(handleCommandSpy).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('when there are no commands', () => {
    beforeEach(() => {
      buildSpy.mockReturnValueOnce([])
    })

    it('does nothing', () => {
      initCommands({ ...mockArgs, commands: [] })

      expect(buildSpy).toHaveBeenCalledWith([])
      expect(registerCommandsSpy).not.toHaveBeenCalled()
      expect(mockClient.on).not.toHaveBeenCalled()
    })
  })
})
