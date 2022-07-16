import { BotCommand } from '../../types'
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
  const mockCommandA = {
    name: 'command-a',
    description: 'command-a-desc',
    handler: jest.fn(),
  }

  const mockCommandB = {
    name: 'command-b',
    description: 'command-b-desc',
    handler: jest.fn(),
  }

  const mockCommands: BotCommand[] = [mockCommandA, mockCommandB]

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

    expect(mockSlashCommandBuilder.setName).toHaveBeenNthCalledWith(
      2,
      mockCommandB.name,
    )
    expect(mockSlashCommandBuilder.setDescription).toHaveBeenNthCalledWith(
      2,
      mockCommandB.description,
    )
  })
})
