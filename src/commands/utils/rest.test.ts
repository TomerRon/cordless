import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { registerCommands } from './rest'

const mockRest = {
  setToken: jest.fn().mockReturnThis(),
  put: jest.fn().mockResolvedValue(undefined),
}

jest.mock('@discordjs/rest', () => ({
  REST: jest.fn().mockImplementation(() => mockRest),
}))

describe('rest utils', () => {
  describe('registerCommands', () => {
    const mockCommands = ['botCommand' as unknown as SlashCommandBuilder]
    const mockToken = 'mock-token'
    const mockApplicationId = 'mock-application-id'

    it('registers the commands', () => {
      registerCommands({
        applicationId: mockApplicationId,
        commands: mockCommands,
        token: mockToken,
      })

      expect(REST).toHaveBeenCalledWith({ version: '10' })
      expect(mockRest.setToken).toHaveBeenCalledWith(mockToken)
      expect(mockRest.put).toHaveBeenCalledWith(
        Routes.applicationCommands(mockApplicationId),
        { body: mockCommands },
      )
    })
  })
})
