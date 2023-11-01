const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.TOKEN;
const axios = require("axios");
const cheerio = require("cheerio");

const bot = new TelegramBot(token, { polling: true });
//test
bot.onText(/\/echo (.+)/, (msg, match) => {
	// 'msg' is the received Message from Telegram
	// 'match' is the result of executing the regexp above on the text content
	// of the message
	console.log(msg);
	const chatId = msg.chat.id;
	const resp = match[1]; // the captured "whatever"

	// send back the matched "whatever" to the chat
	bot.sendMessage(chatId, resp);
});
bot.onText(/\/jokes/, async (msg, match) => {
	const chatId = msg.chat.id;

	try {

		const { data } = await axios.get(
			"https://heresajoke.com/chuck-norris-jokes/"
		);

		console.log(data);
		// Initialize cheerio
		const $ = cheerio.load(data);

		// console.log($);

		// Scrape jokes
		const jokes = [];
		$("ol li").each((index, element) => {
			const joke = $(element).text();
			jokes.push(joke);
		});
		console.log(jokes);
		
        const jokesArry = jokes[0];
        console.log(jokesArry);
	
		bot.sendMessage(chatId, `Here are some jokes:\n\n${jokesArry}`);
	} catch (error) {
		// Handle error
		bot.sendMessage(
			chatId,
			"An error occurred while fetching jokes. Please try again later."
		);
		console.error(error);
	}
});
// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", (msg) => {
	const chatId = msg.chat.id;
	// console.log(msg);

	// send a message to the chat acknowledging receipt of their message
	bot.sendMessage(chatId, "Received your message");
});
