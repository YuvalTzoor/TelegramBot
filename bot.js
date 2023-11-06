const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const { v4: uuidv4 } = require("uuid");

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
let key = process.env.TRANSLATOR_TEXT_SUBSCRIPTION_KEY;
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
<<<<<<< HEAD
	return languageMap[language] || null;
}
function isLanguageSupported(language) {
	return !!getLanguageCode(language);
=======
	return languageMap[language.toLowerCase()] || null;
>>>>>>> f81547241946a7e82c9977455d7e10495b4d4bcf
}

bot.on("text", async (msg) => {
	const chatId = msg.chat.id;
<<<<<<< HEAD
	const text = msg.text.trim();
	let langCode = getLanguageCode(userLanguages[chatId] || "english");

	// Check for 'set language' command
	if (text.toLowerCase().startsWith("set language ")) {
		const language = text
			.substring("set language ".length)
			.toLowerCase()
			.trim();
		if (isLanguageSupported(language)) {
			userLanguages[chatId] = language;
			langCode = getLanguageCode(language);
			userStates[chatId] = "waiting for joke number";

=======
	const text = msg.text.trim().toLowerCase();
	let langCode;

	// Set language command
	if (text.startsWith("set language")) {
		const language = text.substring("set language".length).trim();
		langCode = getLanguageCode(language);

		if (langCode) {
			userLanguages[chatId] = language;
			userStates[chatId] = "waiting for joke number";
>>>>>>> f81547241946a7e82c9977455d7e10495b4d4bcf
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
					to: [langCode],
				},
				data: [{ text: "No problem" }],
				responseType: "json",
			})
				.then(function (response) {
					const reply = response.data[0].translations[0].text;
					bot.sendMessage(chatId, reply);
				})
				.catch(function (error) {
<<<<<<< HEAD
					console.log(error);
=======
					console.error(error);
>>>>>>> f81547241946a7e82c9977455d7e10495b4d4bcf
					bot.sendMessage(
						chatId,
						"Sorry, an error occurred while setting the language."
					);
				});
		} else {
<<<<<<< HEAD
			userLanguages[chatId] = undefined;
			userStates[chatId] = undefined;
			bot.sendMessage(
				chatId,
				"The language is not supported, please try a different one."
			);
		}

		return;
	}

	if (
		userStates[chatId] === "waiting for joke number" &&
		!isNaN(text) &&
		+text >= 1 &&
		+text <= 100
	) {
		userStates[chatId] = null;

		try {
			const { data } = await axios.get(
				"https://heresajoke.com/chuck-norris-jokes/"
			);
			const $ = cheerio.load(data);
			const jokes = [];

			$("ol li").each((index, element) => {
				jokes.push($(element).text());
			});

			let jokeIndex = parseInt(text) - 1;
			let joke = jokes[jokeIndex];

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
					to: [langCode],
				},
				data: [{ text: joke }],
				responseType: "json",
			})
				.then(function (response) {
					let translatedJoke = response.data[0].translations[0].text;
					const finalReply = `${text}. ${translatedJoke}`;
					bot.sendMessage(chatId, finalReply).then(() => {
						const restartMessage =
							"To start over please send 'set language' and your selected language like so: set language Spanish";
						bot.sendMessage(chatId, restartMessage);
					});
					console.log(finalReply);
				})
				.catch(function (error) {
					console.log(error);
					bot.sendMessage(
						chatId,
						"Sorry, an error occurred while translating the joke."
					);
				});
		} catch (error) {
			console.log(error);
			bot.sendMessage(
				chatId,
				"An error occurred while fetching jokes. Please try again later."
=======
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
		if (!isNaN(text) && parseInt(text) >= 1 && parseInt(text) <= 100) {
			try {
				const { data } = await axios.get(
					"https://heresajoke.com/chuck-norris-jokes/"
				);
				const $ = cheerio.load(data);
				const jokes = [];
				$("ol li").each((index, element) => {
					jokes.push($(element).text());
				});

				let jokeIndex = parseInt(text) - 1;
				let joke = jokes[jokeIndex];
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
						to: [langCode],
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
				"Please send a number between 1 and 100 for a joke."
>>>>>>> f81547241946a7e82c9977455d7e10495b4d4bcf
			);
		}
	} else {
		bot.sendMessage(
			chatId,
			"Sorry, I could not find a joke with that number. Please try with a number between 1 and 100."
		);
	}
});

