import { SlashCommandBuilder } from '@discordjs/builders'
import { BotCommandOption } from '../../types'

/**
 * Adds a list of options to a SlashCommand
 */
const addOptionsToCmd = (
  cmd: SlashCommandBuilder,
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
      case 'STRING':
        cmd.addStringOption((o) => {
          o.setName(name).setDescription(description).setRequired(required)

          if (option.choices) {
            o.addChoices(...option.choices)
          }

          return o
        })
        break

      case 'INTEGER':
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

      case 'BOOLEAN':
        cmd.addBooleanOption((o) =>
          o.setName(name).setDescription(description).setRequired(required),
        )
        break

      case 'USER':
        cmd.addUserOption((o) =>
          o.setName(name).setDescription(description).setRequired(required),
        )
        break

      case 'CHANNEL':
        cmd.addChannelOption((o) => {
          o.setName(name).setDescription(description).setRequired(required)

          if (option.channelTypes) {
            o.addChannelTypes(...option.channelTypes)
          }

          return o
        })
        break

      case 'ROLE':
        cmd.addRoleOption((o) =>
          o.setName(name).setDescription(description).setRequired(required),
        )
        break

      case 'MENTIONABLE':
        cmd.addMentionableOption((o) =>
          o.setName(name).setDescription(description).setRequired(required),
        )
        break

      case 'NUMBER':
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

      case 'ATTACHMENT':
        cmd.addAttachmentOption((o) =>
          o.setName(name).setDescription(description).setRequired(required),
        )
        break
    }
  })
}

export default addOptionsToCmd
