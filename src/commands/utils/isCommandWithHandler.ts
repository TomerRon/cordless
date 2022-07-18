import { BotCommand, BotCommandWithHandler, CustomContext } from '../../types'

/**
 * Type guard - returns true if the given BotCommand is a BotCommandWithHandler
 */
const isCommandWithHandler = <C extends CustomContext>(
  command: BotCommand<C>,
): command is BotCommandWithHandler<C> =>
  Object.prototype.hasOwnProperty.call(command, 'handler')

export default isCommandWithHandler
