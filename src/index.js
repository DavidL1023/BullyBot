console.clear();
// Require the necessary discord.js classes
require('dotenv').config();
const { Client, Intents } = require('discord.js');
// Create a new client instance
const client = new Client({ intents: 32767 });


// --------------- BOT EVENTS -----------------
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const prefix = '%';

//Join server message
client.on('guildCreate', async (guild) => {
    console.log(`[Server]: Joined \"${guild.name}\"!`);
    await client.users.cache.get(guild.ownerId).send({
        content: 'You\'ll regret adding me.',
        files: [{
          attachment: 'images/trollge.jpg',
          name: 'trollge.jpg'
        }]
      }).catch(console.error);
    console.log('[Bot]: Sent join message to server owner :D')
});

//Leave server message
client.on('guildDelete', (guild) => {
    console.log(`[Server]: Left \"${guild.name}\" :(`);
});

//Check if message starts with command prefix, if not it returns
client.on('messageCreate', async (message) => {
    if(!message.content.startsWith(prefix)){
        return;
    }else{
        console.log(`[${message.author.tag}]: ${message.content}`);
    }

    //Creates array of words after prefix
    const args = message.content.substring(prefix.length).split(/ +/);

    //Commands
    let reply;
    switch(args[0]){
        case 'help':
        case 'Help':
            reply = `Here's what commands I have: \n ${prefix}Hello \n ${prefix}Say`;
            await message.reply(reply).catch(console.error);
            break;
        case 'hello':
        case 'Hello':
            reply = `yo`;
            await message.reply(reply).catch(console.error);
            break;
        case 'say':
        case 'Say':
            reply = args.slice(1).join(' ');
            await message.reply(reply).catch(console.error);
            break;
    }
    console.log(`[Bot]: ${reply}\n`);
});


// Authorize access to bot
client.login(process.env.DISCORDJS_BOT_TOKEN);