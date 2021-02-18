import { Message, TextChannel, Client } from 'discord.js'
import getHelpFunction from './help'
import { BotFunction, Context } from '../types'

describe('getHelpFunction', () => {
  beforeEach(jest.clearAllMocks)

  const mockFunction: BotFunction = {
    name: 'foo',
    description: 'bar',
    condition: () => false,
    callback: () => undefined,
  }

  const mockCommand = '!helpme'

  const helpFunction = getHelpFunction(mockCommand)

  const mockContext: Context = {
    client: {} as Client,
    functions: [mockFunction],
  }

  it('should return a function', () => {
    expect(helpFunction).toMatchObject({
      name: 'help',
      description: `Shows this help screen.\n\nUsage: ${mockCommand} or ${mockCommand} <function>`,
      condition: expect.any(Function),
      callback: expect.any(Function),
    })
  })

  describe('condition', () => {
    const { condition } = helpFunction

    it('should return true when the message content is the command', () => {
      expect(condition({ content: mockCommand } as Message, mockContext)).toBe(
        true,
      )
    })

    it('should return true when the message content is the command followed by args', () => {
      expect(
        condition({ content: `${mockCommand} foobar` } as Message, mockContext),
      ).toBe(true)
    })

    it('should return false for other cases', () => {
      const values: string[] = [
        `${mockCommand}foo`,
        `foo${mockCommand}`,
        ` ${mockCommand}`,
        'helpme',
        '!helpm',
        '! helpme',
        'foobar',
      ]

      values.map((value) =>
        expect(condition({ content: value } as Message, mockContext)).toBe(
          false,
        ),
      )
    })
  })

  describe('callback', () => {
    const sendSpy = jest.fn()

    const { callback } = helpFunction
    const mockMsg = {
      channel: {
        send: sendSpy as TextChannel['send'],
      },
      content: mockCommand,
    } as Message

    describe('should return the main help message', () => {
      it('should return a list of functions when there are no unnamed functions', () => {
        callback(mockMsg, mockContext)

        const expected = `List of available functions: (Use \`${mockCommand} <function>\` for details about a specific function)\n>>> **${mockFunction.name}**\n`

        expect(sendSpy).toHaveBeenCalledWith(expected)
      })

      it('should return a list of functions when there is one unnamed function', () => {
        callback(mockMsg, {
          ...mockContext,
          functions: [
            mockFunction,
            { condition: () => true, callback: () => undefined },
          ],
        })

        const expected = `List of available functions: (Use \`${mockCommand} <function>\` for details about a specific function)\n>>> **${mockFunction.name}**\n\nThere is also 1 unnamed function.`

        expect(sendSpy).toHaveBeenCalledWith(expected)
      })

      it('should return a list of functions when there are multiple unnamed functions', () => {
        callback(mockMsg, {
          ...mockContext,
          functions: [
            mockFunction,
            { condition: () => true, callback: () => undefined },
            { condition: () => true, callback: () => undefined },
          ],
        })

        const expected = `List of available functions: (Use \`${mockCommand} <function>\` for details about a specific function)\n>>> **${mockFunction.name}**\n\nThere are also 2 unnamed functions.`

        expect(sendSpy).toHaveBeenCalledWith(expected)
      })
    })

    describe('should return details for a specific function', () => {
      it('with a description', () => {
        callback(
          {
            ...mockMsg,
            content: `${mockCommand} ${mockFunction.name}`,
          } as Message,
          mockContext,
        )

        const expected = `>>> **${mockFunction.name}**\n${mockFunction.description}`

        expect(sendSpy).toHaveBeenCalledWith(expected)
      })

      it('without a description', () => {
        const fn: BotFunction = { ...mockFunction, description: undefined }

        callback(
          {
            ...mockMsg,
            content: `${mockCommand} ${fn.name}`,
          } as Message,
          { ...mockContext, functions: [fn] },
        )

        const expected = `>>> **${fn.name}**\nNo description.`

        expect(sendSpy).toHaveBeenCalledWith(expected)
      })

      it('should return an error message if called with a non-existent function', () => {
        const fnName = 'does-not-exist'

        callback(
          {
            ...mockMsg,
            content: `${mockCommand} ${fnName}`,
          } as Message,
          mockContext,
        )

        const expected = `There's no function called **${fnName}**. Use \`${mockCommand}\` for a list of all functions.`

        expect(sendSpy).toHaveBeenCalledWith(expected)
      })
    })
  })
})
