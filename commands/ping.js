module.exports = {
  name: 'ping',
  description: 'ping!',
  cooldown: 5,
  execute(message) {
    message.channel.send('pong!!');
  },
};
