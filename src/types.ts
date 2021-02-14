import Discord from 'discord.js'

/** Initialization options for your cordless bot */
export type InitOptions = {
  /** The functions used by your bot */
  functions: BotFunction[]
}

export type BotFunction = {
  /** Determines whether or not this function should run */
  condition: (msg: Discord.Message) => boolean
  /** Called whenever this function should run */
  callback: (
    msg: Discord.Message,
  ) => void | Promise<void> | Promise<Discord.Message>
}
