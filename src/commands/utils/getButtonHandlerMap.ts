import {
  BotCommand,
  BotCommandButtonHandler,
  BotCommandWithHandler,
  CustomContext,
} from '../../types'
import { isCommandWithHandler } from './guards'

/**
 * For a given list of BotCommands,
 * returns a map of button customId<->handler.
 */
const getButtonHandlerMap = <C extends CustomContext = {}>(
  commands: BotCommand<C>[],
): Record<string, BotCommandButtonHandler<C>> => {
  const buttonHandlerMap: Record<string, BotCommandButtonHandler<C>> = {}

  const resolvedCommands: BotCommandWithHandler<C>[] = commands
    .map((command) =>
      isCommandWithHandler(command) ? command : command.subcommands,
    )
    .flat()

  resolvedCommands.forEach((command) => {
    if (!command.components?.length) return

    command.components.forEach((component, i) => {
      if (component.style === 'LINK') return

      const customId = `${command.name}-${component.label}-${i}`

      buttonHandlerMap[customId] = component.handler
    })
  })

  return buttonHandlerMap
}

export default getButtonHandlerMap
