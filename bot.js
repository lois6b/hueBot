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

bot.onText(/\/giphy ?(.+)?/, (msg, match) => {

	const chatId = msg.chat.id;
	const num = Number(match[1]);
	num = num || 1;
	bot.sendChatAction(chatId, "typing");

	getGiphy(num).then(
		picArr => picArr.forEach(
			picURL => sendFile(picURL, chatId))).catch(_ => bot.sendMessage(chatId, "Error retrieving the image"));

});

function getGiphy(num) {

	return new Promise((resolve) => {
		//return rndURL(pics);
		request({ url: 'http://api.giphy.com/v1/gifs/trending?api_key=kGHLB8MgkdfU9zPF4OMqOKgD6RXymTlR&limit=' + num, json: true }, function (err, res, json) {
			if (err) {
				throw err;
			}
			var arr = json.data.map(elem => elem.images.original.url);

			resolve(arr);
		});

	});
}

function sendFile(url, chatId) {

	var requestSettings = {
		url: url,
		encoding: null
	};


	request(requestSettings, function (error, response, buffer) {
		if (!error && response.statusCode == 200) {
			console.log("sent: " + url);
			if (url.endsWith(".gif") || url.endsWith(".mp4")) {
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


