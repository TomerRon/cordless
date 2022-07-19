import {
  SlashCommandBuilder,
  SlashCommandRoleOption,
} from '@discordjs/builders'
import { ChannelType } from 'discord-api-types/v10'
import { BotCommandOption } from '../../types'
import buildOptions from './buildOptions'

describe('buildOptions', () => {
  beforeEach(jest.clearAllMocks)

  const mockCmd: Partial<Record<keyof SlashCommandBuilder, jest.Mock>> = {
    addStringOption: jest.fn().mockReturnThis(),
    addIntegerOption: jest.fn().mockReturnThis(),
    addBooleanOption: jest.fn().mockReturnThis(),
    addUserOption: jest.fn().mockReturnThis(),
    addChannelOption: jest.fn().mockReturnThis(),
    addRoleOption: jest.fn().mockReturnThis(),
    addMentionableOption: jest.fn().mockReturnThis(),
    addNumberOption: jest.fn().mockReturnThis(),
    addAttachmentOption: jest.fn().mockReturnThis(),
  }

  const mockBuilder: Record<string, jest.Mock> = {
    setName: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setRequired: jest.fn().mockReturnThis(),
    addChoices: jest.fn().mockReturnThis(),
    addChannelTypes: jest.fn().mockReturnThis(),
    setMinValue: jest.fn().mockReturnThis(),
    setMaxValue: jest.fn().mockReturnThis(),
  }

  describe('when there are no options', () => {
    it('does not add any options to the command', () => {
      buildOptions(mockCmd as unknown as SlashCommandBuilder, [])

      Object.values(mockCmd).forEach((mock) =>
        expect(mock).not.toHaveBeenCalled(),
      )
    })
  })

  describe('when one option is passed', () => {
    const option: BotCommandOption = {
      type: 'ROLE',
      name: 'mock-option',
      description: 'mock-description',
    }

    it('adds the relevant option to the command', () => {
      buildOptions(mockCmd as unknown as SlashCommandBuilder, [option])

      const { addRoleOption, ...rest } = mockCmd

      Object.values(rest).forEach((mock) => expect(mock).not.toHaveBeenCalled())

      expect(addRoleOption).toHaveBeenCalledWith(expect.any(Function))

      const callback = addRoleOption?.mock.calls[0][0] as (
        o: SlashCommandRoleOption,
      ) => SlashCommandRoleOption

      callback(mockBuilder as unknown as SlashCommandRoleOption)

      expect(mockBuilder.setName).toHaveBeenCalledWith(option.name)
      expect(mockBuilder.setDescription).toHaveBeenCalledWith(
        option.description,
      )
      expect(mockBuilder.setRequired).toHaveBeenCalledWith(false)
    })
  })

  describe('when multiple options are passed', () => {
    const optionA: BotCommandOption = {
      type: 'STRING',
      name: 'mock-option-a',
      description: 'mock-description-a',
      required: true,
      choices: [
        {
          name: 'choice-1-name',
          value: 'choice-1-value',
        },
        {
          name: 'choice-2-name',
          value: 'choice-2-value',
        },
      ],
    }

    const optionB: BotCommandOption = {
      type: 'STRING',
      name: 'mock-option-b',
    }

    const optionC: BotCommandOption = {
      type: 'NUMBER',
      name: 'mock-option-c',
      min: 5,
      max: 50,
    }

    const options = [optionA, optionB, optionC]

    beforeEach(() => {
      buildOptions(mockCmd as unknown as SlashCommandBuilder, options)
    })

    it('adds option A to the command', () => {
      expect(mockCmd.addStringOption).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
      )

      const callback = mockCmd.addStringOption?.mock.calls[0][0] as jest.Mock

      callback(mockBuilder)

      expect(mockBuilder.setName).toHaveBeenNthCalledWith(1, optionA.name)
      expect(mockBuilder.setDescription).toHaveBeenNthCalledWith(
        1,
        optionA.description,
      )
      expect(mockBuilder.setRequired).toHaveBeenNthCalledWith(
        1,
        optionA.required,
      )
      expect(mockBuilder.addChoices).toHaveBeenNthCalledWith(
        1,
        ...optionA.choices,
      )
    })

    it('adds option B to the command', () => {
      expect(mockCmd.addStringOption).toHaveBeenNthCalledWith(
        2,
        expect.any(Function),
      )

      const callback = mockCmd.addStringOption?.mock.calls[1][0] as jest.Mock

      callback(mockBuilder)

      expect(mockBuilder.setName).toHaveBeenNthCalledWith(1, optionB.name)
      expect(mockBuilder.setDescription).toHaveBeenNthCalledWith(
        1,
        'No description',
      )
      expect(mockBuilder.setRequired).toHaveBeenNthCalledWith(1, false)
      expect(mockBuilder.addChoices).not.toHaveBeenCalled()
    })

    it('adds option C to the command', () => {
      expect(mockCmd.addNumberOption).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
      )

      const callback = mockCmd.addNumberOption?.mock.calls[0][0] as jest.Mock

      callback(mockBuilder)

      expect(mockBuilder.setName).toHaveBeenNthCalledWith(1, optionC.name)
      expect(mockBuilder.setDescription).toHaveBeenNthCalledWith(
        1,
        'No description',
      )
      expect(mockBuilder.setRequired).toHaveBeenNthCalledWith(1, false)
      expect(mockBuilder.setMinValue).toHaveBeenNthCalledWith(1, optionC.min)
      expect(mockBuilder.setMaxValue).toHaveBeenNthCalledWith(1, optionC.max)
    })

    it('does not add any other options', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { addStringOption, addNumberOption, ...rest } = mockCmd

      Object.values(rest).forEach((mock) => expect(mock).not.toHaveBeenCalled())
    })
  })

  describe('snapshots', () => {
    const options: BotCommandOption[] = [
      {
        type: 'STRING',
        name: 'mock-option-a',
      },
      {
        type: 'STRING',
        name: 'mock-option-b',
        description: 'mock-descrption-b',
        required: true,
        choices: [
          {
            name: 'choice-1-name',
            value: 'choice-1-value',
          },
          {
            name: 'choice-2-name',
            value: 'choice-2-value',
          },
        ],
      },
      {
        type: 'INTEGER',
        name: 'mock-option-c',
      },
      {
        type: 'INTEGER',
        name: 'mock-option-d',
        description: 'mock-descrption-d',
        required: true,
        min: 10,
        max: 1337,
        choices: [
          {
            name: 'choice-1-name',
            value: 12,
          },
          {
            name: 'choice-2-name',
            value: 345,
          },
        ],
      },
      {
        type: 'BOOLEAN',
        name: 'mock-option-e',
      },
      {
        type: 'BOOLEAN',
        name: 'mock-option-f',
        description: 'mock-descrption-f',
        required: true,
      },
      {
        type: 'USER',
        name: 'mock-option-g',
      },
      {
        type: 'USER',
        name: 'mock-option-h',
        description: 'mock-descrption-h',
        required: true,
      },
      {
        type: 'CHANNEL',
        name: 'mock-option-i',
      },
      {
        type: 'CHANNEL',
        name: 'mock-option-j',
        description: 'mock-descrption-j',
        required: true,
        channelTypes: [ChannelType.GuildText, ChannelType.GuildVoice],
      },
      {
        type: 'ROLE',
        name: 'mock-option-k',
      },
      {
        type: 'ROLE',
        name: 'mock-option-l',
        description: 'mock-descrption-l',
        required: true,
      },
      {
        type: 'MENTIONABLE',
        name: 'mock-option-m',
      },
      {
        type: 'MENTIONABLE',
        name: 'mock-option-n',
        description: 'mock-descrption-n',
        required: true,
      },
      {
        type: 'NUMBER',
        name: 'mock-option-o',
      },
      {
        type: 'NUMBER',
        name: 'mock-option-p',
        description: 'mock-descrption-p',
        required: true,
        min: 10,
        max: 1337,
        choices: [
          {
            name: 'choice-1-name',
            value: 12,
          },
          {
            name: 'choice-2-name',
            value: 345,
          },
        ],
      },
      {
        type: 'ATTACHMENT',
        name: 'mock-option-q',
      },
      {
        type: 'ATTACHMENT',
        name: 'mock-option-r',
        description: 'mock-descrption-r',
        required: true,
      },
    ]

    it('matches the snapshot', () => {
      buildOptions(mockCmd as unknown as SlashCommandBuilder, options)

      Object.values(mockCmd).forEach((fn) => {
        expect(fn).toHaveBeenNthCalledWith(1, expect.any(Function))
        expect(fn).toHaveBeenNthCalledWith(2, expect.any(Function))

        const callbackA = fn.mock.calls[0][0] as jest.Mock

        callbackA(mockBuilder)

        const callbackB = fn.mock.calls[1][0] as jest.Mock

        callbackB(mockBuilder)
      })

      Object.entries(mockBuilder).forEach(([key, fn]) =>
        expect(fn.mock.calls).toMatchSnapshot(key),
      )
    })
  })
})
