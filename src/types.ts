import Discord from 'discord.js'

export type InitArgs = {
  functions: BotFunction[]
}

export type BotFunction = {
  condition: (msg: Discord.Message) => boolean
  callback: (
    msg: Discord.Message,
  ) => void | Promise<void> | Promise<Discord.Message>
}
