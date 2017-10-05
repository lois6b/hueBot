const { exec } = require('child_process');


const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '466152875:AAEHmy_km5-w9vKpv9WjXUKBf4XKnCzsSyc';

var commands = {
	"battery" : "termux-battery-status",
	"location" : "termux-location -p network"
	
	
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
        //console.log(msg);
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

bot.onText(/\/(start)/, (msg) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Bienvenido a mi móvil");
});

bot.onText(/\/(\w+)/, (msg, match) => {

	var text  =  match[1];
	if(text != "start"){
		var command = commands[text];
		if( command){
			sendCommand( command,msg);
		}else{
			bot.sendMessage(chatId, "No se reconoce ese comando");
		}
	}

});

function sendCommand(command, msg){
	
	const chatId = msg.chat.id;
	exec(command, (error, stdout, stderr) => { 
		if (error) { 
				console.error(`exec error: ${error}`); return; 
		} 
		consoleMsg(msg);
		
		var json = JSON.parse(stdout);
		
		if(command == "location"){
			bot.sendLocation(chatId, json["latitude"] , json["longitude"]);
		}
		if(command == "battery"){
			bot.sendMessage(chatId, json["percentage"] + "%");
		}
		//bot.sendMessage(chatId, json);
		
	});
	
}

function consoleMsg(msg){
	console.log("Message from: " + msg.from.first_name + " -> " + msg.text);
	
}
