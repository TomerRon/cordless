import Discord from 'discord.js'
import { InitArgs } from './types'

export const init = ({ functions }: InitArgs) => {
  const client = new Discord.Client()

  client.on('message', async (msg) => {
    if (msg.author.id === client.user?.id) {
      return
    }

    const result = functions.find(({ condition }) => condition(msg))

    await result?.callback(msg)
  })

  return client
}
