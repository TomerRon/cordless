import { BotCommandWithHandler } from 'cordless'

const ping: BotCommandWithHandler = {
  name: 'ping',
  description: 'Responds to your ping with a pong!',
  handler: ({ interaction }) => interaction.reply('Pong!'),
}

export default ping
