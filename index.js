const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token } = require('./cfg.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//membuat cooldown
const cooldowns = new Discord.Collection();

client.once('ready', () => {
  console.log(`Bot ${client.user.tag} Telah di Aktifkan`);
});

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
  //untuk menggunakan alias. contoh : command purge, bisa digunakn clier, menggunakan alias
  	|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  //untuk membatasi command yang tidak bisa digunakan di DM
  if (command.guildOnly && message.channel.type !== 'text') {
    return message.replay('Saya tidak bisa menjalankan perintah ini di dalam DM!');
  }

  if (command.args && !args.length) {
    let reply = `Anda tidak memberikan argumen apa pun, ${message.author}!`;

    if (command.usage) {
      reply += `\nGunakan: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  //untuk membuat cooldown saat menggunakan command agar user tidak spam
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`Tunggu ${timeLeft.toFixed(1)} detik sebelum menggunakan kembali command \`${command.name}\`.`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.replay('ada yang salah saat mencoba menjalankan perintah ini!');
  }

});

client.login(token);
