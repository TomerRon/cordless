import { init } from 'cordless'
import dotenv from 'dotenv'
import ping from './functions/ping.js'

dotenv.config()

const client = init({ functions: [ping] })

client.on('ready', (client) => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.login(process.env.BOT_TOKEN)
