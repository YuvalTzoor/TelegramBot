const express = require("express");
const app = express();
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const { v4: uuidv4 } = require("uuid");

const port = process.env.PORT || 3000;
const token = process.env.TELEGRAM_TOKEN;
console.log(token);
const bot = new TelegramBot(token, { polling: true });
let key = process.env.TRANSLATOR_TEXT_SUBSCRIPTION_KEY;
console.log(key);
let endpoint = "https://api.cognitive.microsofttranslator.com";

let location = process.env.LOCATION;
// Store user states and languages
const userStates = {};
const userLanguages = {};
function getLanguageCode(language) {
	const languageMap = {
		english: "en",
		hebrew: "he",
		russian: "ru",
		spanish: "es",
		french: "fr",
		german: "de",
		italian: "it",
		portuguese: "pt",
		dutch: "nl",
		swedish: "sv",
		chinese: "zh",
		japanese: "ja",
		korean: "ko",
		arabic: "ar",
		czech: "cs",
		danish: "da",
		finnish: "fi",
		greek: "el",
		hindi: "hi",
		norwegian: "no",
		polish: "pl",
		romanian: "ro",
		turkish: "tr",
		ukrainian: "uk",
		vietnamese: "vi",
		thai: "th",
	};
	return languageMap[language.toLowerCase()] || null;
}

bot.on("text", async (msg) => {
	//console.log(msg);
	const chatId = msg.chat.id;
	const text = msg.text.trim().toLowerCase();
	let langCode;
	//console.log(text);
	// Set language command
	if (text === "/start") {
		bot.sendMessage(
			chatId,
			"Welcome to Chuck Norris Jokes Bot!\nPlease start by setting your desired language by typing 'set language' followed by the language you want to use.\nFor example, 'set language spanish'.\nThen, choose a number between 1 to 100 to get a funny Chuck Norris joke!\n*The default Language is English."
		);
		return;
	}
	while (
		!text.startsWith("set language") &&
		userStates[chatId] != "waiting for joke number"
	) {
		bot.sendMessage(
			chatId,
			"Please start by setting your desired language by typing 'set language' followed by the language you want to use.\nFor example, 'set language spanish'."
		);
		return;
	}
	if (text.startsWith("set language")) {
		const language = text.substring("set language".length).trim();
		langCode = getLanguageCode(language);

		if (langCode) {
			userLanguages[chatId] = language;
			userStates[chatId] = "waiting for joke number";
			axios({
				baseURL: endpoint,
				url: "/translate",
				method: "post",
				headers: {
					"Ocp-Apim-Subscription-Key": key,
					"Ocp-Apim-Subscription-Region": location,
					"Content-type": "application/json",
					"X-ClientTraceId": uuidv4().toString(),
				},
				params: {
					"api-version": "3.0",
					from: "en",
					to: langCode,
				},
				data: [
					{
						text: "No problem, please choose a number between 1 to 100 to get an awesome joke (: ",
					},
				],
				responseType: "json",
			})
				.then(function (response) {
					const reply = response.data[0].translations[0].text;
					bot.sendMessage(chatId, reply);
				})
				.catch(function (error) {
					console.error(error);
					bot.sendMessage(
						chatId,
						"Sorry, an error occurred while setting the language."
					);
				});
		} else {
			bot.sendMessage(
				chatId,
				"The language is not supported. Please try a different one."
			);
			userStates[chatId] = null; // Reset the state if language not supported
		}
		return;
	}

	// Respond to joke number if in 'waiting for joke number' state
	if (userStates[chatId] === "waiting for joke number") {
		console.log("waiting for joke number");
		//will chack if the text is a decimal number
		function isDouble(txt) {
			num = Number(txt);
			return num % 1 !== 0;
		}
		console.log(
			"Is the joke number that was entered was a Double number? :" +
				isDouble(text)
		);
		if (
			!isNaN(text) &&
			parseInt(text) >= 1 &&
			parseInt(text) <= 100 &&
			!isDouble(text)
		) {
			try {
				const { data } = await axios.get(
					"https://heresajoke.com/chuck-norris-jokes"
				);
				const $ = cheerio.load(data);
				const jokes = [];
				$("ol li").each((index, element) => {
					jokes.push($(element).text());
				});
				// console.log(jokes);
				let jokeIndex = parseInt(text) - 1;
				let joke = jokes[jokeIndex];
				console.log("The chosen joke was:" + joke);
				langCode = getLanguageCode(userLanguages[chatId]);

				axios({
					baseURL: endpoint,
					url: "/translate",
					method: "post",
					headers: {
						"Ocp-Apim-Subscription-Key": key,
						"Ocp-Apim-Subscription-Region": location,
						"Content-type": "application/json",
						"X-ClientTraceId": uuidv4().toString(),
					},
					params: {
						"api-version": "3.0",
						from: "en",
						to: langCode,
					},
					data: [{ text: joke }],
					responseType: "json",
				})
					.then(function (response) {
						let translatedJoke = response.data[0].translations[0].text;
						const finalReply = `${text}. ${translatedJoke}`;
						bot.sendMessage(chatId, finalReply);
					})
					.catch(function (error) {
						console.error(error);
						bot.sendMessage(
							chatId,
							"Sorry, an error occurred while translating the joke."
						);
					});
			} catch (error) {
				console.error(error);
				bot.sendMessage(
					chatId,
					"An error occurred while fetching jokes. Please try again later."
				);
			}
		} else {
			// If the message is not a number between 1 and 100, inform the user
			bot.sendMessage(
				chatId,
				"Please send an integer number between 1 and 100 for a joke."
			);
		}
	} else {
		bot.sendMessage(
			chatId,
			"Sorry, I could not find a joke with that number. Please try with a number between 1 and 100."
		);
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
