import { init } from 'cordless'
import dotenv from 'dotenv'
import ping from './commands/ping'

dotenv.config()

const main = async () => {
  const client = await init({
    commands: [ping],
    token: process.env.BOT_TOKEN || '',
  })

  console.log(`Logged in as ${client.user.tag}!`)
}

main()
