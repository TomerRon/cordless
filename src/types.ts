import { APIApplicationCommandOptionChoice } from 'discord-api-types/v10'
import Discord, {
  ActionRowBuilder,
  ApplicationCommandOptionAllowedChannelTypes,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  ClientEvents,
  ClientOptions,
  InteractionResponse,
} from 'discord.js'

/** Initialization options for your cordless bot */
export type InitOptions<C extends CustomContext = {}> = {
  /**
   * Your bot token.
   *
   * @see https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-bot-s-token
   */
  token: string
  /** The commands used by your bot. */
  commands?: BotCommand<C>[]
  /** The event handlers used by your bot. */
  handlers?: BotEventHandler<any, C>[] // eslint-disable-line @typescript-eslint/no-explicit-any
  /** A custom context object which will extend the context passed to your commands and event handlers */
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
}

export type BotCommand<C extends CustomContext = {}> =
  | BotCommandWithHandler<C>
  | BotCommandWithSubcommands<C>

export interface BotCommandWithHandler<C extends CustomContext = {}>
  extends BotCommandBase {
  handler: (
    args: BotCommandHandlerArgs<C>,
  ) => void | Promise<InteractionResponse<boolean> | void>
  components?: BotCommandComponent<C>[]
  options?: BotCommandOption[]
  subcommands?: never
}

export type BotCommandHandlerArgs<C extends CustomContext = {}> = {
  interaction: ChatInputCommandInteraction
  context: Context<C>
  components?: ActionRowBuilder<ButtonBuilder>[]
}

export type BotCommandComponent<C extends CustomContext = {}> =
  | BotCommandButtonComponent<C>
  | BotCommandLinkComponent<C>

export interface BotCommandButtonComponent<C extends CustomContext = {}>
  extends BotCommandButtonComponentBase {
  style?: Exclude<ButtonStyle, ButtonStyle.Link>
  handler: BotCommandButtonHandler<C>
}

export type BotCommandButtonHandler<C extends CustomContext = {}> = (
  args: BotCommandButtonHandlerArgs<C>,
) => void | Promise<InteractionResponse<boolean> | void>

export interface BotCommandLinkComponent<C extends CustomContext = {}>
  extends BotCommandButtonComponentBase {
  style: ButtonStyle.Link
  url:
    | string
    | ((
        args: Omit<BotCommandHandlerArgs<C>, 'components'>,
      ) => string | Promise<string>)
}

type BotCommandButtonComponentBase = {
  label: string
  style?: ButtonStyle
}

export type BotCommandButtonHandlerArgs<C extends CustomContext = {}> = {
  interaction: ButtonInteraction
  context: Context<C>
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
  type: ApplicationCommandOptionType.String
  choices?: APIApplicationCommandOptionChoice<string>[]
}

export interface BotCommandIntegerOption extends BotCommandOptionBase {
  type: ApplicationCommandOptionType.Integer
  choices?: APIApplicationCommandOptionChoice<number>[]
  min?: number
  max?: number
}

export interface BotCommandBooleanOption extends BotCommandOptionBase {
  type: ApplicationCommandOptionType.Boolean
}

export interface BotCommandUserOption extends BotCommandOptionBase {
  type: ApplicationCommandOptionType.User
}

export interface BotCommandChannelOption extends BotCommandOptionBase {
  type: ApplicationCommandOptionType.Channel
  channelTypes?: ApplicationCommandOptionAllowedChannelTypes[]
}

export interface BotCommandRoleOption extends BotCommandOptionBase {
  type: ApplicationCommandOptionType.Role
}

export interface BotCommandMentionableOption extends BotCommandOptionBase {
  type: ApplicationCommandOptionType.Mentionable
}

export interface BotCommandNumberOption extends BotCommandOptionBase {
  type: ApplicationCommandOptionType.Number
  choices?: APIApplicationCommandOptionChoice<number>[]
  min?: number
  max?: number
}

export interface BotCommandAttachmentOption extends BotCommandOptionBase {
  type: ApplicationCommandOptionType.Attachment
}

type BotCommandOptionBase = {
  type: ApplicationCommandOptionType
  name: string
  description?: string
  required?: boolean
}

export type BotEventHandler<
  E extends keyof ClientEvents = 'messageCreate',
  C extends CustomContext = {},
> = {
  /**
   * The event this handler should subscribe to (default: "messageCreate").
   */
  event?: E
  /** Determines whether or not the callback should run */
  condition: (...args: [...ClientEvents[E], Context<C>]) => boolean
  /** Called whenever an event that matches the condition is received */
  callback: (
    ...args: [...ClientEvents[E], Context<C>]
  ) => void | Promise<Discord.Message | void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CustomContext = Record<string, any>

export type Context<C extends CustomContext = {}> = {
  client: Discord.Client<true>
  handlers: BotEventHandler<any, C>[] // eslint-disable-line @typescript-eslint/no-explicit-any
} & C
