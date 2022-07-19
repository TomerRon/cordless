import { BotCommandWithHandler, BotCommandWithSubcommands } from '../../types'
import { isCommandWithHandler, isCommandWithSubcommands } from './guards'

describe('commands type guards', () => {
  const mockBotCommandWithHandler: BotCommandWithHandler = {
    name: 'mock-command-with-handler',
    handler: () => undefined,
  }

  const mockBotCommandWithSubcommands: BotCommandWithSubcommands = {
    name: 'mock-command-with-subcommands',
    subcommands: [],
  }

  describe('isCommandWithHandler', () => {
    it('returns true when the given BotCommand is a BotCommandWithHandler', () => {
      expect(isCommandWithHandler(mockBotCommandWithHandler)).toBe(true)
    })

    it('returns false when the given BotCommand is not a BotCommandWithHandler', () => {
      expect(isCommandWithHandler(mockBotCommandWithSubcommands)).toBe(false)
    })
  })

  describe('isCommandWithSubcommands', () => {
    it('returns true when the given BotCommand is a BotCommandWithSubcommands', () => {
      expect(isCommandWithSubcommands(mockBotCommandWithSubcommands)).toBe(true)
    })

    it('returns false when the given BotCommand is not a BotCommandWithSubcommands', () => {
      expect(isCommandWithSubcommands(mockBotCommandWithHandler)).toBe(false)
    })
  })
})
