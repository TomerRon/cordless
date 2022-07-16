import { SlashCommandBuilder } from '@discordjs/builders'
import { Client, Interaction } from 'discord.js'
import { BotCommand, Context } from '../types'
import initCommands, { InitCommandsArgs } from './init'
import * as buildModule from './utils/build'
import * as handleCommandModule from './utils/handleCommand'
import * as startRestClientModule from './utils/startRestClient'

describe('initCommands', () => {
  beforeEach(jest.clearAllMocks)

  const mockApplicationId = 'mock-application-id'
  const mockClient: Client = { on: jest.fn() } as unknown as Client
  const mockCommands: BotCommand[] = ['botCommand' as unknown as BotCommand]
  const mockContext: Context = { client: mockClient, functions: [] }
  const mockToken = 'mock-token'

  const mockArgs: InitCommandsArgs<{}> = {
    applicationId: mockApplicationId,
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

  const startRestClientSpy = jest
    .spyOn(startRestClientModule, 'default')
    .mockReturnValue(undefined)

  describe('when the commands are successfully initialized', () => {
    beforeEach(() => {
      initCommands(mockArgs)
    })

    it('starts a REST client and subscribes to interactionCreate', () => {
      expect(buildSpy).toHaveBeenCalledWith(mockCommands)
      expect(startRestClientSpy).toHaveBeenCalledWith({
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
      expect(startRestClientSpy).not.toHaveBeenCalled()
      expect(mockClient.on).not.toHaveBeenCalled()
    })

    it('does nothing even when applicationId was not provided', () => {
      initCommands({ ...mockArgs, commands: [], applicationId: undefined })

      expect(buildSpy).toHaveBeenCalledWith([])
      expect(startRestClientSpy).not.toHaveBeenCalled()
      expect(mockClient.on).not.toHaveBeenCalled()
    })
  })

  describe('when there are commands but the applicationId was not provided', () => {
    let errorSpy: jest.SpyInstance
    let exitSpy: jest.SpyInstance

    beforeEach(() => {
      errorSpy = jest.spyOn(console, 'error').mockReturnValue(undefined)
      exitSpy = jest.spyOn(process, 'exit').mockReturnValue(undefined as never)
    })

    afterAll(() => {
      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('exits with an error', () => {
      initCommands({ ...mockArgs, applicationId: undefined })

      expect(errorSpy).toHaveBeenCalledWith(
        'You must provide an application ID to use commands.',
      )
      expect(exitSpy).toHaveBeenCalledWith(1)

      expect(buildSpy).toHaveBeenCalledWith(mockCommands)
      expect(startRestClientSpy).not.toHaveBeenCalled()
      expect(mockClient.on).not.toHaveBeenCalled()
    })
  })
})
