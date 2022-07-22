import {
  ApplicationCommandType,
  Client,
  Interaction,
  InteractionType,
  SlashCommandBuilder,
} from 'discord.js'
import { BotCommand, BotCommandButtonHandler, Context } from '../types'
import * as buildCommandsModule from './builders/buildCommands'
import * as handleButtonModule from './handlers/handleButton'
import * as handleCommandModule from './handlers/handleCommand'
import initCommands, { InitCommandsArgs } from './init'
import * as getButtonHandlerMapModule from './utils/getButtonHandlerMap'
import * as restModule from './utils/rest'

describe('initCommands', () => {
  beforeEach(jest.clearAllMocks)

  const mockApplicationId = 'mock-application-id'
  const mockClient: Client<true> = {
    on: jest.fn(),
    application: { id: mockApplicationId },
  } as unknown as Client<true>
  const mockCommands: BotCommand[] = ['botCommand' as unknown as BotCommand]
  const mockContext: Context = { client: mockClient, handlers: [] }
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

  const mockButtonHandlerMap: Record<string, BotCommandButtonHandler> = {
    foo: jest.fn(),
  }

  const buildCommandsSpy = jest
    .spyOn(buildCommandsModule, 'default')
    .mockReturnValue(mockResolvedCommands)

  const registerCommandsSpy = jest
    .spyOn(restModule, 'registerCommands')
    .mockReturnValue(undefined)

  const getButtonHandlerMapSpy = jest
    .spyOn(getButtonHandlerMapModule, 'default')
    .mockReturnValue(mockButtonHandlerMap)

  describe('when the commands are successfully initialized', () => {
    beforeEach(() => {
      initCommands(mockArgs)
    })

    it('registers the commands and subscribes to interactionCreate', () => {
      expect(buildCommandsSpy).toHaveBeenCalledWith(mockCommands)
      expect(registerCommandsSpy).toHaveBeenCalledWith({
        applicationId: mockApplicationId,
        commands: mockResolvedCommands,
        token: mockToken,
      })
      expect(getButtonHandlerMapSpy).toHaveBeenCalledWith(mockCommands)
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
      const handleButtonSpy = jest
        .spyOn(handleButtonModule, 'default')
        .mockResolvedValue(undefined)

      const isButtonSpy = jest.fn().mockReturnValue(false)

      const mockInteraction = {
        type: 'unknown',
        isButton: isButtonSpy,
      } as unknown as Interaction

      beforeEach(() => {
        interactionCreateHandler = (mockClient.on as jest.Mock).mock
          .calls[0][1] as (interaction: Interaction) => void
      })

      describe('when the interaction is a command', () => {
        const commandInteraction = {
          ...mockInteraction,
          type: InteractionType.ApplicationCommand,
          commandType: ApplicationCommandType.ChatInput,
        }

        it('calls handleCommand', () => {
          interactionCreateHandler(commandInteraction as unknown as Interaction)

          expect(isButtonSpy).not.toHaveBeenCalled()
          expect(handleCommandSpy).toHaveBeenCalledWith({
            commands: mockCommands,
            interaction: commandInteraction,
            context: mockContext,
          })
          expect(handleButtonSpy).not.toHaveBeenCalled()
        })
      })

      describe('when the interaction is a button', () => {
        beforeEach(() => {
          isButtonSpy.mockReturnValueOnce(true)
        })

        it('calls handleButton', () => {
          interactionCreateHandler(mockInteraction)

          expect(isButtonSpy).toHaveBeenCalled()
          expect(handleCommandSpy).not.toHaveBeenCalled()
          expect(handleButtonSpy).toHaveBeenCalledWith({
            buttonHandlerMap: mockButtonHandlerMap,
            interaction: mockInteraction,
            context: mockContext,
          })
        })
      })

      describe('when the interaction is something else', () => {
        it('does nothing', () => {
          interactionCreateHandler(mockInteraction)

          expect(isButtonSpy).toHaveBeenCalled()
          expect(handleCommandSpy).not.toHaveBeenCalled()
          expect(handleButtonSpy).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('when there are no commands', () => {
    beforeEach(() => {
      buildCommandsSpy.mockReturnValueOnce([])
    })

    it('registers the commands without subscribing to interactionCreate', () => {
      initCommands({ ...mockArgs, commands: [] })

      expect(buildCommandsSpy).toHaveBeenCalledWith([])
      expect(registerCommandsSpy).toHaveBeenCalledWith({
        applicationId: mockApplicationId,
        commands: [],
        token: mockToken,
      })
      expect(getButtonHandlerMapSpy).not.toHaveBeenCalled()
      expect(mockClient.on).not.toHaveBeenCalled()
    })
  })
})
