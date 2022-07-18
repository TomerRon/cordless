import { BotCommandWithHandler, BotCommandWithSubcommands } from '../../types'
import isCommandWithHandler from './isCommandWithHandler'

describe('isCommandWithHandler', () => {
  const mockBotCommandWithHandler: BotCommandWithHandler = {
    name: 'mock-command-with-handler',
    handler: () => undefined,
  }

  const mockBotCommandWithSubcommands: BotCommandWithSubcommands = {
    name: 'mock-command-with-handler',
    subcommands: [],
  }

  it('returns true when the given BotCommand is a BotCommandWithHandler', () => {
    expect(isCommandWithHandler(mockBotCommandWithHandler)).toBe(true)
  })

  it('returns false when the given BotCommand is not a BotCommandWithHandler', () => {
    expect(isCommandWithHandler(mockBotCommandWithSubcommands)).toBe(false)
  })
})
