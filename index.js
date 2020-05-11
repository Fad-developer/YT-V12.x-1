const Discord = require("discord.js");
const fs = require('fs');
const client = new Discord.Client();
let cfg = require("./cfg.json");
client.commands = new Discord.Collection();
let cooldown = new Set();
let cdseconds = 5;

const prefix = cfg.prefix;

fs.readdir("./commands", (err, files) => {

 if(err) console.log(err);

 let jsfile = files.filter(f => f.split(".").pop() === "js")
 if(jsfile.length <= 0){
   console.log("Tidak bisa menemukan CMD");
   return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    client.commands.set(props.help.name, props);
  });

});


client.on("message", async message => {
 if(message.author.bot) return;
 if(message.channel.type === "dm") return;

if(!message.content.startsWith(prefix)) return;

if(cooldown.has(message.author.id)){
  message.delete();
  return message.reply("cooldown 5 Detik!")
}

  cooldown.add(message.author.id);

 let messageArray = message.content.split(" ");
 let cmd = messageArray[0];
 let args = messageArray.slice(1);

 let commandfile = client.commands.get(cmd.slice(prefix.length));
 if(commandfile) commandfile.run(client, message, args);

setTimeout(() => {
  cooldown.delete(message.author.id)
}, cdseconds * 1000)

 });

client.login(cfg.token);
