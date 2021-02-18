import Discord from 'discord.js'

/** Initialization options for your cordless bot */
export type InitOptions<T extends CustomContext = {}> = {
  /** The functions used by your bot */
  functions: BotFunction<T>[]
  /** A custom context object which will extend the context passed to your functions' callbacks and conditions */
  context?: T
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

export type BotFunction<T extends CustomContext = {}> = {
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
  condition: (msg: Discord.Message, context: Context<T>) => boolean
  /** Called whenever this function should run */
  callback: (
    msg: Discord.Message,
    context: Context<T>,
  ) => void | Promise<void> | Promise<Discord.Message>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CustomContext = Record<string, any>

export type Context<T extends CustomContext = {}> = {
  client: Discord.Client
  functions: BotFunction<T>[]
} & T
