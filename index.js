const {
    Client,
    Intents,
    MessageEmbed
} = require('discord.js');
const {
    token,
    prefix,
    guildId,
    roleId
} = require('./config.json'); //use new token!
const {
    schedule
} = require('./schedule.json');
var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;
// Create a new client instance
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

function jobber(channel, action) {
    var job = new CronJob(
        '0 */10 6-18 * * 1-5',
        async () => {
                //console.log(job.nextDates(5));
                var closest = checkSchedule();
                //message.channel.send(closest);
                if (closest) {
                    channel.send(closest);

                }
            },
            null,
            true,
            'Europe/Riga'

    );
    if (action == "start")
        job.start();
    if (action == "stop")
        job.stop();
}

client.on("messageCreate", async message => {

    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    var a = new Date();
    var day = a.getDay();

    if (command == "ping") {
        message.reply("pong!")
    } else
    if (command == "start") {

        message.reply("Countdown started!");
        jobber(message.channel, "start");
    } else
    if (command == "stop") {
        jobber(message.channel, "stop");
        message.reply("Countdown stopped!");
    } else
    if (command == "showday") {
        message.channel.send({
            embeds: [embedMaker(day)]
        });
    } else
    if (command == "closest") {
        var closest = checkSchedule();
        if (closest) {
            message.channel.send(closest);
        } else {
            message.channel.send("Nothing in 30 min");
        }
    }


});
// When the client is ready, run this code (only once)
client.on('ready', () => {
    console.log('Ready!');

    const guild = client.guilds.cache.get("687689447529381888");
    var commands;

    if (guild) {
        commands = guild.commands;
    } else {
        commands = client.application?.commandss
    }
    commands.create({
        name: 'ping',
        description: 'Replies with pong.',
    });
    commands.create({
        name: 'start',
        description: 'Start schedule countdown',
    });
    commands.create({
        name: 'stop',
        description: 'Stops schedule countdown',
    });
    commands.create({
        name: 'showday',
        description: "Shows today's schedule",
    });
    commands.create({
        name: 'closest',
        description: "Shows next lesson in 30 min range",
    })
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const {
        commandName,
        options
    } = interaction;
    if (commandName === 'ping') {
        interaction.reply("pong!");

    }
    if (commandName === 'start') {
        interaction.reply("Countdown started!");
        jobber(interaction.channel, "start");
    }
    if (commandName === 'stop') {
        jobber(interaction.channel, "stop");
        interaction.reply("Countdown stopped!");
    }
    if (commandName === 'showday') {
        var a = new Date();
        var day = a.getDay();
        interaction.reply({
            embeds: [embedMaker(day)]
        });
    }
    if (commandName === 'closest') {
        var closest = checkSchedule();
        if (closest) {
            interaction.reply(closest);
        } else {
            interaction.reply("Nothing in 30 min");
        }
    }
})

// Login to Discord with your client's token
client.login(token);

function embedMaker(day) {
    var a = new Date();
    var day = a.getDay();
    const embed = new MessageEmbed()
        .setTitle("Today's schedule:")
        .setDescription(schedule[day - 1].day)
        .setColor(0x00AE86)
        .setTimestamp();
    for (var i = 0; i < schedule[day - 1].lessons.length; i++) {
        embed.addField(schedule[day - 1].lessons[i].lessonNumber.toString() + ".", schedule[day - 1].lessons[i].lessonName + " " + schedule[day - 1].lessons[i].hour + ":" + schedule[day - 1].lessons[i].minute);
    }
    return embed;
}

function checkSchedule() { //check closest lesson
    var a = new Date();
    var day = a.getDay();
    var hour = a.getHours();
    var minute = a.getMinutes();
    for (var i = 0; i < schedule[day - 1].lessons.length; i++) {
        var l = schedule[day - 1].lessons[i]; //lesson alias
        var hm = hour * 60 + minute;
        
        if (((l.hour * 60 + l.minute) - hm) <= 30 && (l.hour * 60 + l.minute) >= hm)
            return "<@&" + roleId + "> "+l.lessonName + " starting in " + ((l.hour * 60 + l.minute) - hm) + " minutes!";
    }
    return null;
}