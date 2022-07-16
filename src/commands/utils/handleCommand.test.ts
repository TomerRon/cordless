import { Client, CommandInteraction } from 'discord.js'
import { BotCommand } from '../../types'
import handleCommand from './handleCommand'

describe('handleCommand', () => {
  beforeEach(jest.clearAllMocks)

  const mockCommandA = {
    name: 'command-a',
    description: 'command-a-desc',
    handler: jest.fn(),
  }

  const mockCommandB = {
    name: 'command-b',
    description: 'command-b-desc',
    handler: jest.fn(),
  }

  const mockCommands: BotCommand[] = [mockCommandA, mockCommandB]

  const mockContext = {
    client: jest.fn() as unknown as Client,
    functions: [],
    foo: 'bar',
  }

  it('should ignore the interaction if it does not match any of the commands', () => {
    const mockInteraction = {
      commandName: 'not-found',
    } as CommandInteraction

    handleCommand({
      commands: mockCommands,
      context: mockContext,
      interaction: mockInteraction,
    })

    expect(mockCommandA.handler).not.toHaveBeenCalled()
    expect(mockCommandB.handler).not.toHaveBeenCalled()
  })

  it('should call the handler of the command that matches the interaction', () => {
    const mockInteraction = {
      commandName: mockCommandB.name,
    } as CommandInteraction

    handleCommand({
      commands: mockCommands,
      context: mockContext,
      interaction: mockInteraction,
    })

    expect(mockCommandA.handler).not.toHaveBeenCalled()
    expect(mockCommandB.handler).toHaveBeenCalledWith({
      context: mockContext,
      interaction: mockInteraction,
    })
  })
})
