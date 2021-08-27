console.clear();
const config = require('./Data/config.json');
// Require the necessary discord.js classes
require('dotenv').config();
const { Client, Intents } = require('discord.js');
// Create a new client instance
const client = new Client({ intents: 32767 });

// Functions
function getUserFromMention(mention) {
    if (!mention) return;
    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);
        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }
        return client.users.cache.get(mention);
    }
}


// --------------- BOT EVENTS -----------------
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('you cry.', { 
        type: 'WATCHING' 
    });
});

var bullyTarget;

// Join server message
client.on('guildCreate', async (guild) => {
    console.log(`[Server]: Joined \"${guild.name}\"!`);
    await client.users.cache.get(guild.ownerId).send({
        content: 'You\'ll ***regret*** adding me.',
        files: [{
          attachment: 'img/trollge.jpg',
          name: 'trollge.jpg'
        }]
      })
      .then(console.log('[Bot]: Sent join message to server owner :D'))
      .catch(console.error);
});

// Leave server message
client.on('guildDelete', (guild) => {
    console.log(`[Server]: Left \"${guild.name}\" :(`);
});

// Check if message starts with command prefix, if not it returns
client.on('messageCreate', async (message) => {
    if(!message.content.startsWith(config.prefix)){
        return;
    }else{
        console.log(`[${message.author.tag}]: ${message.content}`);
    }

    // Creates array of words after prefix
    const args = message.content.substring(config.prefix.length).split(/ +/);
    console.log(args);

    // Commands
    let botReply;
    let mentionedUser;

    switch(args[0].toLowerCase()){
        case 'help':
            botReply = `Here's what I can do: \n ${config.prefix}Bully <@user> \n ${config.prefix}Current \n ${config.prefix}Clear`;
            break;
        case 'bully':
            mentionedUser = getUserFromMention(args[1]);
            if(typeof mentionedUser !== 'undefined'){
                if(mentionedUser.tag == client.user.tag){
                    botReply = 'I\'m not going to bully myself.';
                }else{
                    bullyTarget = mentionedUser;
                    botReply = `Now bullying ${bullyTarget.username}.`
                }
            }else{
                botReply = 'What kind of idiot does it take to not be able to use a command properly?'
            }
            break;
        case 'current':
            if(typeof bullyTarget !== 'undefined'){
                botReply = `Currently shitting on ${bullyTarget}.`
            }else{
                botReply = 'No target yet.'
            }
            break;
        case 'clear':
            bullyTarget = undefined;
            botReply = 'No longer bullying.'
            break;
        default:
            botReply = 'You messed up the command ya clown.'
    }
    await message.reply(botReply)
    .then(console.log(`[Bot]: ${botReply}\n`))
    .catch(console.error);
});

// Check if bully target typed


// Authorize access to bot
client.login(process.env.DISCORDJS_BOT_TOKEN);