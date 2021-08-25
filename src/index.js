// Javascript imports
const Discord = require("discord.js");
require('dotenv').config();
// Create required objects for Discord
const intents = new Discord.Intents(32767);
const client = new Discord.Client({ intents });

// Bot events
let prefix = "!";

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
    //Check if message starts with command prefix, if not it returns
    if(!message.content.startsWith(prefix)){
        return;
    }

    //Creates array of commands after prefix
    const args = message.content.substring(prefix.length).split(/ +/);

    switch(args[0]){
        case "hello":
            message.reply("yo");
            break;
        case "say":
            message.reply(args.slice(1).join(" "));
            break;
    }

});


// Authorize access to bot
client.login(process.env.DISCORDJS_BOT_TOKEN);