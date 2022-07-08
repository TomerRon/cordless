const ping = {
  condition: (msg) => msg.content === 'ping',
  callback: (msg) => msg.reply('pong'),
}

export default ping
