console.clear();
const config = require('./Data/config.json');
// Require the necessary modules
const insulter = require('insult');
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
    console.log(`[Client] Logged in as ${client.user.tag}!\n`);
    client.user.setActivity('you cry.', { 
        type: 'WATCHING' 
    });
});

var bullyTarget;
var lastInsultGenerated;

// Join server message
client.on('guildCreate', async (guild) => {
    console.log(`[Client]: Joined \"${guild.name}\"!\n`);
    await client.users.cache.get(guild.ownerId).send({
        content: 'You\'ll ***regret*** adding me.',
        files: [{
          attachment: 'src/Data/trollge.jpg',
          name: 'trollge.jpg'
        }]
      })
      .then(console.log('[Client]: Sent join message to server owner :D\n'))
      .catch(console.error);
});

// Leave server message
client.on('guildDelete', (guild) => {
    console.log(`[Client]: Left \"${guild.name}\" :(\n`);
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

    if(message.author !== bullyTarget){
        switch(args[0].toLowerCase()){
            case 'help':
                botReply = `**Once you set my target, I'll have a ~35% chance to make fun of them when they type**\nHere's what I can do:\n\t${config.prefix}Bully *<@user>*\n\t${config.prefix}Current\n\t${config.prefix}Clear`;
                break;
            case 'bully':
                mentionedUser = getUserFromMention(args[1]);
                if(typeof mentionedUser !== 'undefined'){
                    if(mentionedUser == client.user){
                        botReply = 'I\'m not going to bully myself.';
                    }else if(mentionedUser == bullyTarget) {
                        botReply = 'I\'m already doing that.';
                    }else if(typeof bullyTarget !== 'undefined'){
                        bullyTarget = mentionedUser;
                        botReply = `Switching target to ${bullyTarget}.`
                    }else{
                        bullyTarget = mentionedUser;
                        botReply = `Now bullying ${bullyTarget}.`
                    }
                }else{
                    botReply = 'What kind of idiot does it take to not be able to use a command properly?'
                }
                break;
            case 'current':
                if(typeof bullyTarget !== 'undefined'){
                    botReply = `Currently shitting on ${bullyTarget}.`
                }else{
                    botReply = 'I\'m currently not bullying anyone.'
                }
                break;
            case 'clear':
                if(typeof bullyTarget !== 'undefined'){
                    botReply = `No longer bullying ${bullyTarget}.`
                    bullyTarget = undefined;
                }else{
                    botReply = 'I\'m currently not bullying anyone.'
                }
                break;
            default:
                botReply = 'You messed up the command ya clown.'
        }
    // If target is typing command
    }else{
        switch(args[0].toLowerCase()){
            case 'help':
                botReply = 'Help yourself shitwad.';
                break;
            case 'bully':
                mentionedUser = getUserFromMention(args[1]);
                if(typeof mentionedUser !== 'undefined'){
                    if(mentionedUser == client.user){
                        botReply = 'I\'m not going to bully myself.';
                    }else if(mentionedUser == bullyTarget) {
                        botReply = 'I\'m already doing that.';
                    }else{
                        botReply = 'Yeah uh, that\'s not how it works buddy. You\'re the target.'
                    }
                }else{
                    botReply = 'You can\'t even use the command correctly, sad.'
                }
                break;
            case 'current':
                botReply = `Currently shitting on your dumb ass.`
                break;
            case 'clear':
                botReply = 'Ask someone a little more intelligent than yourself to let you go.'
                break;
            default:
                botReply = 'You messed up the command, but I didn\'t expect any better from you.'
        }
    }
    await message.reply(botReply)
        .then(console.log(`[${client.user.tag}]: ${botReply}\n`))
        .catch(console.error);
});

// Check if bully target typed
client.on('messageCreate', async (message) => {
    if(message.content.startsWith(config.prefix)){
        return;
    }else if(message.author == bullyTarget){
        console.log(`*[${message.author.tag}]: ${message.content}`);

        // Send insult on percent chance and ensure not repeating itself
        let roll = Math.random()
        if(roll > 0.65){
            let botReply = insulter.Insult();
            while(botReply == lastInsultGenerated){
                botReply = insulter.Insult();
            }
            await message.reply(botReply)
        .then(console.log(`[${client.user.tag}]: ${botReply}\n`))
        .catch(console.error);
        }else{
            console.log('[Client]: Did not roll insult chance.\n');
        }
    }
});

// Authorize access to bot
client.login(process.env.DISCORDJS_BOT_TOKEN);