const TelegramBot = require('node-telegram-bot-api');
var request = require('request');

var comandos = ["/start",
	"/echo",
	"/meme"
];
// replace the value below with the Telegram token you receive from @BotFather
const token = '428109668:AAGHXQ2kHCXS2dAA1wiyJabNozxz9Czw8TQ';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
	if (!msg.text.startsWith("/")) {
		console.log('Received your message: ' + msg.text + " - From: " + msg.from.first_name);
		const chatId = msg.chat.id;
	}
});

bot.onText(/\/start/, (msg) => {

	const chatId = msg.chat.id;

	bot.sendMessage(chatId, "Meme bot v.1");
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {


	const chatId = msg.chat.id;
	const resp = match[1]; // the captured "whatever"

	bot.sendMessage(chatId, resp);
});

bot.onText(/\/meme/, (msg, match) => {

	const chatId = msg.chat.id;
	bot.sendChatAction(chatId, "typing");

	getPic().then( picURL => sendPic(picURL, chatId)).catch( _ => bot.sendMessage(chatId, "Error retrieving the image"));
	
});

bot.onText(/\/pic +(.+)/, (msg, match) => {

	const chatId = msg.chat.id;

	const url = match[1];

	bot.sendChatAction(chatId, "typing");

	console.log("tring to fetch: " + url);

	sendPic(url, chatId);
	
});

function getPic() {

	return new Promise((resolve) => {
		//return rndURL(pics);
		request({ url: 'https://api.imgflip.com/get_memes', json: true }, function (err, res, json) {
			if (err) {
				throw err;
			}

			var elem = json.data.memes[Math.floor(Math.random() * json.data.memes.length)].url;

			
			resolve(elem);
		});

	});
}

function sendPic(url, chatId) {

	var requestSettings = {
		url: url,
		encoding: null
	};


	request(requestSettings, function (error, response, buffer) {
		if (!error && response.statusCode == 200) {
			if (url.endsWith(".gif") || url.endsWith(".mp4") ) {
				bot.sendDocument(chatId, buffer)
			} else {
				bot.sendPhoto(chatId, buffer)
			}
		}
		else {

			throw error;
		}
	});

}


