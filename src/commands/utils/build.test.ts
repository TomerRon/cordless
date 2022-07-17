import { BotCommand } from '../../types'
import * as addOptionsToCmdModule from './addOptionsToCmd'
import build from './build'

const mockSlashCommandBuilder = {
  setName: jest.fn().mockReturnThis(),
  setDescription: jest.fn().mockReturnThis(),
}

jest.mock('@discordjs/builders', () => ({
  SlashCommandBuilder: jest
    .fn()
    .mockImplementation(() => mockSlashCommandBuilder),
}))

describe('build', () => {
  const mockCommandA: BotCommand = {
    name: 'command-a',
    description: 'command-a-desc',
    handler: jest.fn(),
  }

  const mockCommandB: BotCommand = {
    name: 'command-b',
    description: 'command-b-desc',
    options: [
      {
        type: 'STRING',
        name: 'foobar',
      },
    ],
    handler: jest.fn(),
  }

  const mockCommands: BotCommand[] = [mockCommandA, mockCommandB]

  const addOptionsToCmdSpy = jest
    .spyOn(addOptionsToCmdModule, 'default')
    .mockReturnValue()

  it('returns a list of SlashCommandBuilders', () => {
    expect(build(mockCommands)).toStrictEqual([
      mockSlashCommandBuilder,
      mockSlashCommandBuilder,
    ])

    expect(mockSlashCommandBuilder.setName).toHaveBeenNthCalledWith(
      1,
      mockCommandA.name,
    )
    expect(mockSlashCommandBuilder.setDescription).toHaveBeenNthCalledWith(
      1,
      mockCommandA.description,
    )
    expect(addOptionsToCmdSpy).toHaveBeenNthCalledWith(
      1,
      mockSlashCommandBuilder,
      [],
    )

    expect(mockSlashCommandBuilder.setName).toHaveBeenNthCalledWith(
      2,
      mockCommandB.name,
    )
    expect(mockSlashCommandBuilder.setDescription).toHaveBeenNthCalledWith(
      2,
      mockCommandB.description,
    )
    expect(addOptionsToCmdSpy).toHaveBeenNthCalledWith(
      2,
      mockSlashCommandBuilder,
      mockCommandB.options,
    )
  })
})
