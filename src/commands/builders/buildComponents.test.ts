import { Client, CommandInteraction } from 'discord.js'
import { BotCommandComponent, BotCommandWithHandler } from '../../types'
import buildComponents from './buildComponents'

const mockMessageActionRow = {
  addComponents: jest.fn().mockReturnThis(),
}

const mockMessageButton = {
  setCustomId: jest.fn().mockReturnThis(),
  setLabel: jest.fn().mockReturnThis(),
  setStyle: jest.fn().mockReturnThis(),
  setURL: jest.fn().mockReturnThis(),
}

jest.mock('discord.js', () => {
  const originalModule = jest.requireActual('discord.js')

  return {
    ...originalModule,
    MessageActionRow: jest.fn().mockImplementation(() => mockMessageActionRow),
    MessageButton: jest.fn().mockImplementation(() => mockMessageButton),
  }
})

describe('buildComponents', () => {
  beforeEach(jest.clearAllMocks)

  const mockCommand: BotCommandWithHandler = {
    name: 'command-a',
    description: 'command-a-desc',
    handler: jest.fn(),
  }

  const mockInteraction = {} as unknown as CommandInteraction

  const mockContext = {
    client: jest.fn() as unknown as Client,
    functions: [],
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
      style: 'PRIMARY',
      handler: jest.fn(),
    }

    it('builds a row with the component', async () => {
      expect(
        await buildComponents({
          command: { ...mockCommand, components: [mockComponent] },
          interaction: mockInteraction,
          context: mockContext,
        }),
      ).toStrictEqual([mockMessageActionRow])

      expect(mockMessageButton.setCustomId).toHaveBeenCalledWith(
        `command-a-component-a-label-0`,
      )
      expect(mockMessageButton.setLabel).toHaveBeenCalledWith(
        mockComponent.label,
      )
      expect(mockMessageButton.setStyle).toHaveBeenCalledWith(
        mockComponent.style,
      )
      expect(mockMessageButton.setURL).not.toHaveBeenCalled()

      expect(mockMessageActionRow.addComponents).toHaveBeenCalledWith([
        mockMessageButton,
      ])
    })
  })

  describe('when the command has one link button with a string url', () => {
    const mockComponent: BotCommandComponent = {
      label: 'component-a-label',
      style: 'LINK',
      url: 'component-url',
    }

    it('builds a row with the component', async () => {
      expect(
        await buildComponents({
          command: { ...mockCommand, components: [mockComponent] },
          interaction: mockInteraction,
          context: mockContext,
        }),
      ).toStrictEqual([mockMessageActionRow])

      expect(mockMessageButton.setCustomId).not.toHaveBeenCalled()
      expect(mockMessageButton.setLabel).toHaveBeenCalledWith(
        mockComponent.label,
      )
      expect(mockMessageButton.setStyle).toHaveBeenCalledWith(
        mockComponent.style,
      )
      expect(mockMessageButton.setURL).toHaveBeenCalledWith(mockComponent.url)

      expect(mockMessageActionRow.addComponents).toHaveBeenCalledWith([
        mockMessageButton,
      ])
    })
  })

  describe('when the command has one link button with a url resolve callback', () => {
    const mockResolvedUrl = 'component-url'
    const mockComponent: BotCommandComponent = {
      label: 'component-a-label',
      style: 'LINK',
      url: jest.fn().mockResolvedValue(mockResolvedUrl),
    }

    it('builds a row with the component', async () => {
      expect(
        await buildComponents({
          command: { ...mockCommand, components: [mockComponent] },
          interaction: mockInteraction,
          context: mockContext,
        }),
      ).toStrictEqual([mockMessageActionRow])

      expect(mockMessageButton.setCustomId).not.toHaveBeenCalled()
      expect(mockMessageButton.setLabel).toHaveBeenCalledWith(
        mockComponent.label,
      )
      expect(mockMessageButton.setStyle).toHaveBeenCalledWith(
        mockComponent.style,
      )
      expect(mockMessageButton.setURL).toHaveBeenCalledWith(mockResolvedUrl)

      expect(mockMessageActionRow.addComponents).toHaveBeenCalledWith([
        mockMessageButton,
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
      style: 'PRIMARY',
      handler: jest.fn(),
    }

    const mockComponentB: BotCommandComponent = {
      label: 'component-b-label',
      style: 'LINK',
      url: 'component-c-url',
    }

    const mockComponentC: BotCommandComponent = {
      label: 'component-c-label',
      handler: jest.fn(),
    }

    const mockComponentD: BotCommandComponent = {
      label: 'component-d-label',
      style: 'LINK',
      url: () => Promise.resolve('component-c-url'),
    }

    const mockComponentE: BotCommandComponent = {
      label: 'component-e-label',
      style: 'DANGER',
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
      ).toStrictEqual([mockMessageActionRow])

      expect(mockMessageActionRow.addComponents).toHaveBeenCalledWith([
        mockMessageButton,
        mockMessageButton,
        mockMessageButton,
        mockMessageButton,
        mockMessageButton,
      ])

      Object.entries(mockMessageButton).forEach(([key, fn]) =>
        expect(fn.mock.calls).toMatchSnapshot(key),
      )
    })
  })
})
