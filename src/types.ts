import Discord from 'discord.js'

/** Initialization options for your cordless bot */
export type InitOptions = {
  /** The functions used by your bot */
  functions: BotFunction[]
  /**
   * Generate a help function for the bot, which will be triggered by the value.
   *
   * For example, given a value of "!help", the following commands will be available:
   *
   * - !help (shows a list of available functions)
   * - !help <function-name> (shows a description and usage instructions for the given function)
   */
  helpCommand?: string
}

export type BotFunction = {
  /**
   * The name of this function (no spaces allowed).
   * It will be displayed in the help function if there is a helpCommand.
   */
  name?: string
  /**
   * The description of this function and usage instructions.
   * It will be displayed in the help function if there is a helpCommand.
   */
  description?: string
  /** Determines whether or not this function should run */
  condition: (msg: Discord.Message) => boolean
  /** Called whenever this function should run */
  callback: (
    msg: Discord.Message,
    functions: BotFunction[],
  ) => void | Promise<void> | Promise<Discord.Message>
}
