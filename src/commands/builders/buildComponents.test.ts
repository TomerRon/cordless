import { ButtonStyle, ChatInputCommandInteraction, Client } from 'discord.js'
import { BotCommandComponent, BotCommandWithHandler } from '../../types'
import buildComponents from './buildComponents'

const mockActionRowBuilder = {
  addComponents: jest.fn().mockReturnThis(),
}

const mockButtonBuilder = {
  setCustomId: jest.fn().mockReturnThis(),
  setLabel: jest.fn().mockReturnThis(),
  setStyle: jest.fn().mockReturnThis(),
  setURL: jest.fn().mockReturnThis(),
}

jest.mock('discord.js', () => {
  const originalModule = jest.requireActual('discord.js')

  return {
    ...originalModule,
    ActionRowBuilder: jest.fn().mockImplementation(() => mockActionRowBuilder),
    ButtonBuilder: jest.fn().mockImplementation(() => mockButtonBuilder),
  }
})

describe('buildComponents', () => {
  beforeEach(jest.clearAllMocks)

  const mockCommand: BotCommandWithHandler = {
    name: 'command-a',
    description: 'command-a-desc',
    handler: jest.fn(),
  }

  const mockInteraction = {} as unknown as ChatInputCommandInteraction

  const mockContext = {
    client: jest.fn() as unknown as Client,
    handlers: [],
    foo: 'bar',
  }

  describe('when the command has no components', () => {
    it('does nothing', async () => {
      expect(
        await buildComponents({
          command: mockCommand,
          interaction: mockInteraction,
          context: mockContext,
        }),
      ).toBeUndefined()
    })
  })

  describe('when the command has an empty list of components', () => {
    it('does nothing', async () => {
      expect(
        await buildComponents({
          command: { ...mockCommand, components: [] },
          interaction: mockInteraction,
          context: mockContext,
        }),
      ).toBeUndefined()
    })
  })

  describe('when the command has one interactive button', () => {
    const mockComponent: BotCommandComponent = {
      label: 'component-a-label',
      style: ButtonStyle.Primary,
      handler: jest.fn(),
    }

    it('builds a row with the component', async () => {
      expect(
        await buildComponents({
          command: { ...mockCommand, components: [mockComponent] },
          interaction: mockInteraction,
          context: mockContext,
        }),
      ).toStrictEqual([mockActionRowBuilder])

      expect(mockButtonBuilder.setCustomId).toHaveBeenCalledWith(
        `command-a-component-a-label-0`,
      )
      expect(mockButtonBuilder.setLabel).toHaveBeenCalledWith(
        mockComponent.label,
      )
      expect(mockButtonBuilder.setStyle).toHaveBeenCalledWith(
        mockComponent.style,
      )
      expect(mockButtonBuilder.setURL).not.toHaveBeenCalled()

      expect(mockActionRowBuilder.addComponents).toHaveBeenCalledWith([
        mockButtonBuilder,
      ])
    })
  })

  describe('when the command has one link button with a string url', () => {
    const mockComponent: BotCommandComponent = {
      label: 'component-a-label',
      style: ButtonStyle.Link,
      url: 'component-url',
    }

    it('builds a row with the component', async () => {
      expect(
        await buildComponents({
          command: { ...mockCommand, components: [mockComponent] },
          interaction: mockInteraction,
          context: mockContext,
        }),
      ).toStrictEqual([mockActionRowBuilder])

      expect(mockButtonBuilder.setCustomId).not.toHaveBeenCalled()
      expect(mockButtonBuilder.setLabel).toHaveBeenCalledWith(
        mockComponent.label,
      )
      expect(mockButtonBuilder.setStyle).toHaveBeenCalledWith(
        mockComponent.style,
      )
      expect(mockButtonBuilder.setURL).toHaveBeenCalledWith(mockComponent.url)

      expect(mockActionRowBuilder.addComponents).toHaveBeenCalledWith([
        mockButtonBuilder,
      ])
    })
  })

  describe('when the command has one link button with a url resolve callback', () => {
    const mockResolvedUrl = 'component-url'
    const mockComponent: BotCommandComponent = {
      label: 'component-a-label',
      style: ButtonStyle.Link,
      url: jest.fn().mockResolvedValue(mockResolvedUrl),
    }

    it('builds a row with the component', async () => {
      expect(
        await buildComponents({
          command: { ...mockCommand, components: [mockComponent] },
          interaction: mockInteraction,
          context: mockContext,
        }),
      ).toStrictEqual([mockActionRowBuilder])

      expect(mockButtonBuilder.setCustomId).not.toHaveBeenCalled()
      expect(mockButtonBuilder.setLabel).toHaveBeenCalledWith(
        mockComponent.label,
      )
      expect(mockButtonBuilder.setStyle).toHaveBeenCalledWith(
        mockComponent.style,
      )
      expect(mockButtonBuilder.setURL).toHaveBeenCalledWith(mockResolvedUrl)

      expect(mockActionRowBuilder.addComponents).toHaveBeenCalledWith([
        mockButtonBuilder,
      ])

      expect(mockComponent.url).toHaveBeenCalledWith({
        interaction: mockInteraction,
        context: mockContext,
      })
    })
  })

  describe('snapshots', () => {
    const mockComponentA: BotCommandComponent = {
      label: 'component-a-label',
      style: ButtonStyle.Primary,
      handler: jest.fn(),
    }

    const mockComponentB: BotCommandComponent = {
      label: 'component-b-label',
      style: ButtonStyle.Link,
      url: 'component-c-url',
    }

    const mockComponentC: BotCommandComponent = {
      label: 'component-c-label',
      handler: jest.fn(),
    }

    const mockComponentD: BotCommandComponent = {
      label: 'component-d-label',
      style: ButtonStyle.Link,
      url: () => Promise.resolve('component-c-url'),
    }

    const mockComponentE: BotCommandComponent = {
      label: 'component-e-label',
      style: ButtonStyle.Danger,
      handler: jest.fn(),
    }

    const mockComponents = [
      mockComponentA,
      mockComponentB,
      mockComponentC,
      mockComponentD,
      mockComponentE,
    ]

    it('matches the snapshot', async () => {
      expect(
        await buildComponents({
          command: { ...mockCommand, components: mockComponents },
          interaction: mockInteraction,
          context: mockContext,
        }),
      ).toStrictEqual([mockActionRowBuilder])

      expect(mockActionRowBuilder.addComponents).toHaveBeenCalledWith([
        mockButtonBuilder,
        mockButtonBuilder,
        mockButtonBuilder,
        mockButtonBuilder,
        mockButtonBuilder,
      ])

      Object.entries(mockButtonBuilder).forEach(([key, fn]) =>
        expect(fn.mock.calls).toMatchSnapshot(key),
      )
    })
  })
})
