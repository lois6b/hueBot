const TelegramBot = require('node-telegram-bot-api');
var request = require('request');
var mensajes = ["Comeme los huevos", 
				"Me saben los huevos a aceituna", 
				"Programo en Java y te meto la raba", 
				"Me comes el huevo en enero si no es primero",
				"Vale, me has pillado, soy un bot... cómeme los bytes",
				"Si reordenas las letras de 'TOM MARBOLO RIDDLE' se convierte en 'CÓMEME LOS HUEVOS'",
				"Soy un tipo educado: cuando llego a un sitio siempre doy los huevos días",
				"Fui con otros cinco amigos al desierto e hicimos una sombra de tres pares de huevos",
				"Las gallinas quieren mucho a sus hijos: les cuesta un huevo tenerlos",
				"Chúpame los huevos y déjamelos como nuevos",
				"Qué bien me comió los huevos el puente",
				"Serás un ser más longevo si primero me comes el huevo",
				"De puente a puente y me comes los huevos de frente"
				];
				
var comandos= ["/start",
			   "/echo",
			   "/pic"
			  ];
// replace the value below with the Telegram token you receive from @BotFather
const token = '428109668:AAGHXQ2kHCXS2dAA1wiyJabNozxz9Czw8TQ';

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

bot.onText(/\/pic( .+)?/, (msg, match) => {

	const chatId = msg.chat.id;
	var resp = match[1];

	var url =  resp ? resp : 'https://i.imgur.com/g8dfYnq.png';
	
	var requestSettings = {
		url: url,
		encoding: null
	};
	if(resp.endsWith(".gif")){
		request(requestSettings, function (error, response, buffer) {
			if (!error && response.statusCode == 200) {
				bot.sendDocument(chatId, buffer)
			}
			else{
	
				bot.sendMessage(chatId, "error retrieving the gif");
			}
		});
	}else{
		request(requestSettings, function (error, response, buffer) {
			if (!error && response.statusCode == 200) {
				bot.sendPhoto(chatId, buffer)
			}
			else{
	
				bot.sendMessage(chatId, "error retrieving the pic");
			}
		});
	}
	
  });

bot.onText(/\/start/, (msg) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Bienvenido a mis huevos redondos v.2");
});


/*bot.on('sticker', (msg) => {
	const chatId = msg.chat.id;
    bot.sendPhoto(chatId, "http://i.imgur.com/VRYdhuD.png");
});*/

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
	if( !msg.text.startsWith("/")){
		console.log('Received your message: ' + msg.text + " - From: " + msg.from.first_name);
		const chatId = msg.chat.id;
		if(msg.text.includes("vives")){
			bot.sendLocation(chatId, 43.2351181, -5.7755287);
		}else{
			bot.sendChatAction(chatId, "typing");
			bot.sendMessage(chatId, generateText());
		}
	}
});




function generateText(){
	
	//10% of the time it will say: 
	var txt10 ="En el cielo las estrellas, en el suelo el alambrado. Y en la raja de tu culo mi chorizo colorado";

	if(Math.random() > 0.8){
		//.log(txt)
		return txt10;
	}else{
		return rndMensaje(mensajes);
	}
	
}

function rndMensaje(array){
	
	return array[Math.floor(Math.random()*array.length)];
}