import { ApplicationCommandOptionAllowedChannelTypes } from '@discordjs/builders'
import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10'
import Discord, {
  ApplicationCommandOptionType,
  ClientEvents,
  ClientOptions,
  CommandInteraction,
} from 'discord.js'

/** Initialization options for your cordless bot */
export type InitOptions<C extends CustomContext = {}> = {
  /** The commands used by your bot. */
  commands?: BotCommand<C>[]
  /** The functions used by your bot */
  functions: BotFunction<any, C>[] // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Your bot token.
   *
   * @see https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-bot-s-token
   */
  token: string
  /** A custom context object which will extend the context passed to your commands and functions */
  context?: C
  /**
   * Override the default Gateway Intents of the discord.js client.
   *
   * By default, the discord.js client will initialize with the [GUILDS, GUILD_MESSAGES] intents.
   * These default intents should be sufficient in most cases.
   *
   * @see https://discord.com/developers/docs/topics/gateway#gateway-intents
   * @see https://discordjs.guide/popular-topics/intents.html
   */
  intents?: ClientOptions['intents']
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

export type BotCommand<C extends CustomContext = {}> =
  | BotCommandWithHandler<C>
  | BotCommandWithSubcommands<C>

export interface BotCommandWithHandler<C extends CustomContext = {}>
  extends BotCommandBase {
  handler: (args: BotCommandHandlerArgs<C>) => void | Promise<void>
  options?: BotCommandOption[]
  subcommands?: never
}

export interface BotCommandWithSubcommands<C extends CustomContext = {}>
  extends BotCommandBase {
  subcommands: BotCommandWithHandler<C>[]
  handler?: never
  options?: never
}

type BotCommandBase = {
  name: string
  description?: string
}

export type BotCommandHandlerArgs<C extends CustomContext = {}> = {
  interaction: CommandInteraction
  context: Context<C>
}

export type BotCommandOption =
  | BotCommandStringOption
  | BotCommandIntegerOption
  | BotCommandBooleanOption
  | BotCommandUserOption
  | BotCommandChannelOption
  | BotCommandRoleOption
  | BotCommandMentionableOption
  | BotCommandNumberOption
  | BotCommandAttachmentOption

export interface BotCommandStringOption extends BotCommandOptionBase {
  type: 'STRING'
  choices?: APIApplicationCommandOptionChoice<string>[]
}

export interface BotCommandIntegerOption extends BotCommandOptionBase {
  type: 'INTEGER'
  choices?: APIApplicationCommandOptionChoice<number>[]
  min?: number
  max?: number
}

export interface BotCommandBooleanOption extends BotCommandOptionBase {
  type: 'BOOLEAN'
}

export interface BotCommandUserOption extends BotCommandOptionBase {
  type: 'USER'
}

export interface BotCommandChannelOption extends BotCommandOptionBase {
  type: 'CHANNEL'
  channelTypes?: ApplicationCommandOptionAllowedChannelTypes[]
}

export interface BotCommandRoleOption extends BotCommandOptionBase {
  type: 'ROLE'
}

export interface BotCommandMentionableOption extends BotCommandOptionBase {
  type: 'MENTIONABLE'
}

export interface BotCommandNumberOption extends BotCommandOptionBase {
  type: 'NUMBER'
  choices?: APIApplicationCommandOptionChoice<number>[]
  min?: number
  max?: number
}

export interface BotCommandAttachmentOption extends BotCommandOptionBase {
  type: 'ATTACHMENT'
}

type BotCommandOptionBase = {
  type: ApplicationCommandOptionType
  name: string
  description?: string
  required?: boolean
}

export type BotFunction<
  E extends keyof ClientEvents = 'messageCreate',
  C extends CustomContext = {},
> = {
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
  /**
   * The event this function should subscribe to (default: "messageCreate").
   */
  event?: E
  /** Determines whether or not this function should run */
  condition: (...args: [...ClientEvents[E], Context<C>]) => boolean
  /** Called whenever this function should run */
  callback: (
    ...args: [...ClientEvents[E], Context<C>]
  ) => void | Promise<Discord.Message | void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CustomContext = Record<string, any>

export type Context<C extends CustomContext = {}> = {
  client: Discord.Client<true>
  functions: BotFunction<any, C>[] // eslint-disable-line @typescript-eslint/no-explicit-any
} & C
