import {
  BotCommand,
  BotCommandWithHandler,
  BotCommandWithSubcommands,
} from '../../types'
import * as addOptionsToCmdModule from './addOptionsToCmd'
import build from './build'

const mockSlashCommandBuilder = {
  setName: jest.fn().mockReturnThis(),
  setDescription: jest.fn().mockReturnThis(),
  addSubcommand: jest.fn().mockReturnThis(),
}

jest.mock('@discordjs/builders', () => ({
  SlashCommandBuilder: jest
    .fn()
    .mockImplementation(() => mockSlashCommandBuilder),
}))

describe('build', () => {
  const mockCommandWithHandlerA: BotCommandWithHandler = {
    name: 'command-a',
    description: 'command-a-desc',
    handler: jest.fn(),
  }

  const mockCommandWithHandlerB: BotCommandWithHandler = {
    name: 'command-b',
    options: [
      {
        type: 'STRING',
        name: 'foobar',
      },
    ],
    handler: jest.fn(),
  }

  const mockSubcommandA: BotCommandWithHandler = {
    name: 'subcommand-a',
    description: 'subcommand-a-desc',
    handler: jest.fn(),
  }

  const mockSubcommandB: BotCommandWithHandler = {
    name: 'subcommand-b',
    options: [
      {
        type: 'STRING',
        name: 'subcommand-foobar',
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

  const addOptionsToCmdSpy = jest
    .spyOn(addOptionsToCmdModule, 'default')
    .mockReturnValue()

  it('returns a list of SlashCommandBuilders', () => {
    expect(build(mockCommands)).toStrictEqual([
      mockSlashCommandBuilder,
      mockSlashCommandBuilder,
      mockSlashCommandBuilder,
    ])
  })

  describe('building commands', () => {
    beforeEach(() => {
      build(mockCommands)
    })

    it('builds the first command', () => {
      expect(mockSlashCommandBuilder.setName).toHaveBeenNthCalledWith(
        1,
        mockCommandWithHandlerA.name,
      )
      expect(mockSlashCommandBuilder.setDescription).toHaveBeenNthCalledWith(
        1,
        mockCommandWithHandlerA.description,
      )
      expect(addOptionsToCmdSpy).toHaveBeenNthCalledWith(
        1,
        mockSlashCommandBuilder,
        [],
      )
    })

    it('builds the second command', () => {
      expect(mockSlashCommandBuilder.setName).toHaveBeenNthCalledWith(
        2,
        mockCommandWithHandlerB.name,
      )
      expect(mockSlashCommandBuilder.setDescription).toHaveBeenNthCalledWith(
        2,
        'No description',
      )
      expect(addOptionsToCmdSpy).toHaveBeenNthCalledWith(
        2,
        mockSlashCommandBuilder,
        mockCommandWithHandlerB.options,
      )
    })

    it('builds the third command', () => {
      expect(mockSlashCommandBuilder.setName).toHaveBeenNthCalledWith(
        3,
        mockCommandWithSubcommands.name,
      )
      expect(mockSlashCommandBuilder.setDescription).toHaveBeenNthCalledWith(
        3,
        mockCommandWithSubcommands.description,
      )
    })

    it('builds the first subcommand', () => {
      expect(mockSlashCommandBuilder.addSubcommand).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
      )

      const callback = mockSlashCommandBuilder.addSubcommand.mock.calls[0][0]

      Object.values(mockSlashCommandBuilder).forEach((mock) => mock.mockClear())
      addOptionsToCmdSpy.mockClear()

      callback(mockSlashCommandBuilder)

      expect(mockSlashCommandBuilder.setName).toHaveBeenNthCalledWith(
        1,
        mockSubcommandA.name,
      )
      expect(mockSlashCommandBuilder.setDescription).toHaveBeenNthCalledWith(
        1,
        mockSubcommandA.description,
      )
      expect(addOptionsToCmdSpy).toHaveBeenNthCalledWith(
        1,
        mockSlashCommandBuilder,
        [],
      )
    })

    it('builds the second subcommand', () => {
      expect(mockSlashCommandBuilder.addSubcommand).toHaveBeenNthCalledWith(
        2,
        expect.any(Function),
      )

      const callback = mockSlashCommandBuilder.addSubcommand.mock.calls[1][0]

      Object.values(mockSlashCommandBuilder).forEach((mock) => mock.mockClear())
      addOptionsToCmdSpy.mockClear()

      callback(mockSlashCommandBuilder)

      expect(mockSlashCommandBuilder.setName).toHaveBeenNthCalledWith(
        1,
        mockSubcommandB.name,
      )
      expect(mockSlashCommandBuilder.setDescription).toHaveBeenNthCalledWith(
        1,
        'No description',
      )
      expect(addOptionsToCmdSpy).toHaveBeenNthCalledWith(
        1,
        mockSlashCommandBuilder,
        mockSubcommandB.options,
      )
    })
  })
})
