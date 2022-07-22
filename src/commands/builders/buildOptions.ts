import {
  ApplicationCommandOptionType,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js'
import { BotCommandOption } from '../../types'

/**
 * Adds a list of options to a SlashCommand
 */
const buildOptions = (
  cmd: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  options: BotCommandOption[],
) => {
  options.forEach((option) => {
    const {
      type,
      name,
      description = 'No description',
      required = false,
    } = option

    switch (type) {
      case ApplicationCommandOptionType.String:
        cmd.addStringOption((o) => {
          o.setName(name).setDescription(description).setRequired(required)

          if (option.choices) {
            o.addChoices(...option.choices)
          }

          return o
        })
        break

      case ApplicationCommandOptionType.Integer:
        cmd.addIntegerOption((o) => {
          o.setName(name).setDescription(description).setRequired(required)

          if (option.choices) {
            o.addChoices(...option.choices)
          }

          if (option.min) {
            o.setMinValue(option.min)
          }

          if (option.max) {
            o.setMaxValue(option.max)
          }

          return o
        })
        break

      case ApplicationCommandOptionType.Boolean:
        cmd.addBooleanOption((o) =>
          o.setName(name).setDescription(description).setRequired(required),
        )
        break

      case ApplicationCommandOptionType.User:
        cmd.addUserOption((o) =>
          o.setName(name).setDescription(description).setRequired(required),
        )
        break

      case ApplicationCommandOptionType.Channel:
        cmd.addChannelOption((o) => {
          o.setName(name).setDescription(description).setRequired(required)

          if (option.channelTypes) {
            o.addChannelTypes(...option.channelTypes)
          }

          return o
        })
        break

      case ApplicationCommandOptionType.Role:
        cmd.addRoleOption((o) =>
          o.setName(name).setDescription(description).setRequired(required),
        )
        break

      case ApplicationCommandOptionType.Mentionable:
        cmd.addMentionableOption((o) =>
          o.setName(name).setDescription(description).setRequired(required),
        )
        break

      case ApplicationCommandOptionType.Number:
        cmd.addNumberOption((o) => {
          o.setName(name).setDescription(description).setRequired(required)

          if (option.choices) {
            o.addChoices(...option.choices)
          }

          if (option.min) {
            o.setMinValue(option.min)
          }

          if (option.max) {
            o.setMaxValue(option.max)
          }

          return o
        })
        break

      case ApplicationCommandOptionType.Attachment:
        cmd.addAttachmentOption((o) =>
          o.setName(name).setDescription(description).setRequired(required),
        )
        break
    }
  })
}

export default buildOptions
