const { Client, Intents, MessageEmbed  } = require('discord.js');
const { token, prefix } = require('./config.json');
const{ schedule }=require('./schedule.json')
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on("messageCreate", async message => {

    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
      

    if(command == "ping") {
     message.reply("pong!")
    }else
    if(command=="start"){
        message.reply("countdown started!")
    }else 
    if(command=="showday"){
        var a = new Date();
        var day=a.getDay();
        console.log(day);
        const embed = new MessageEmbed()
            .setDescription(day.toString())
            .setAuthor(message.author.username, message.author.displayAvatarURL)
            .setColor(0x00AE86)
            .setTimestamp();
            for(var i=0;i<schedule[day].lessons.length;i++){
                embed.addField(schedule[day].lessons[i].lessonNumber.toString()+".", schedule[day].lessons[i].lessonName+" "+schedule[day].lessons[i].hour+":"+schedule[day].lessons[i].minute);
            }
        
        message.channel.send({ embeds: [embed] });
    }
    
    
    });
// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
    
});



// Login to Discord with your client's token
client.login(token);