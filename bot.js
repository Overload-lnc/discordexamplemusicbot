const Discord = require('discord.js');
const bot = new Discord.Client({disableMentions: 'everyone'});

const token = 'your-token';
const PREFIX =';;';
var servers = {};

const ytdl = require("ytdl-core");

bot.on('ready',()=>{
     console.log('I'm online')
})

bot.on('message',message =>{

    let args = message.content.substring(PREFIX.length).split(" ");
    switch(args[0]){
        case 'play':
            
            function play(connection,message){
                var sve = servers[message.guild.id];

                sve.dispatcher = connection.play(ytdl(sve.queue[0],{filter: 'audioonly'}));
                sve.queue.shift();
                sve.dispatcher.on("end",function(){
                    if(sve.queue[0]){
                        play(connection,message);
                    }else {
                        connection.disconnect();
                    }
                });

            }

            if(!args[1]){
                message.channel.send("Please provide a youtube link");
                return;
            }


 
            if(!servers[message.guild.id]) servers[message.guild.id]={
                queue :[]
            }
            var sve = servers[message.guild.id];

            sve.queue.push(args[1]);

            if(!message.guild.voiceConnection) 
            message.member.voice.channel.join().then(function(connection){
                play(connection,message);
            })

            break;
        case 'skip':
                var sve = servers[message.guild.id];
                if(sve.dispatcher) sve.dispatcher.end();
                message.channel.send("Song skipped")
        break;

        case 'stop':
                var sver = servers[message.guild.id];
                if(message.guild.voiceConnection){
                    for(var i=sve.queue.length -2;i>=0;i--){
                        sve.queue.splice(i,1);
                    }
                    sve.dispatcher.end();
                    message.channel.send("Song ended")
                    console.log('Song paused')
                }
                if(message.guild.connection) message.guild.voiceConnection.disconnect();
        
        break;
    }
})


bot.login(token)
