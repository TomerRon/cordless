import {
  BotCommand,
  BotCommandWithHandler,
  BotCommandWithSubcommands,
  CustomContext,
} from '../../types'

/**
 * Returns true if the given BotCommand is a BotCommandWithHandler
 */
export const isCommandWithHandler = <C extends CustomContext>(
  command: BotCommand<C>,
): command is BotCommandWithHandler<C> =>
  Object.prototype.hasOwnProperty.call(command, 'handler')

/**
 * Returns true if the given BotCommand is a BotCommandWithHandler
 */
export const isCommandWithSubcommands = <C extends CustomContext>(
  command: BotCommand<C>,
): command is BotCommandWithSubcommands<C> =>
  Object.prototype.hasOwnProperty.call(command, 'subcommands')
