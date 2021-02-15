import { BotFunction } from '../types'

const getHelpFunction = (command: string): BotFunction => ({
  name: 'help',
  description: `Shows this help screen.\n\nUsage: ${command} or ${command} <function>`,
  condition: (msg) =>
    msg.content === command || msg.content.startsWith(`${command} `),
  callback: (msg, functions) => {
    const functionName = msg.content.split(' ')[1]

    const getAllFunctions = () => {
      const namedFunctions = functions.filter((f) => f.name)
      const unnamedFunctionsCount = functions.length - namedFunctions.length

      const namedFunctionsString = namedFunctions
        .map(({ name }) => `**${name}**\n`)
        .join('')
      const unnamedFunctionsString =
        unnamedFunctionsCount > 1
          ? `\nThere are also ${unnamedFunctionsCount} unnamed functions.`
          : unnamedFunctionsCount === 1
          ? `\nThere is also 1 unnamed function.`
          : ''

      return `List of available functions: (Use \`${command} <function>\` for details about a specific function)\n>>> ${namedFunctionsString}${unnamedFunctionsString}`
    }

    const getFunctionDetails = () => {
      const fn = functions.find((f) => f.name === functionName)

      if (!fn) {
        return `There's no function called **${functionName}**. Use \`${command}\` for a list of all functions.`
      }

      return `>>> **${fn.name}**\n${fn.description || 'No description.'}`
    }

    const response = functionName ? getFunctionDetails() : getAllFunctions()

    msg.channel.send(response)
  },
})

export default getHelpFunction
