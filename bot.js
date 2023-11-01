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
	return languageMap[language] || "en"; // Default to English
}
bot.on("text", async (msg) => {
	const chatId = msg.chat.id;
	const text = msg.text;
	let langCode = "";

	// Check for 'set language' command
	if (text.startsWith("set language ")) {
		const language = text.substring(13).toLowerCase();
		userLanguages[chatId] = language;
		langCode = getLanguageCode(language);
		console.log(getLanguageCode(language));
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
				to: [langCode],
			},
			data: [
				{
					text: "No problem",
				},
			],
			responseType: "json",
		}).then(function (response) {
			console.log(JSON.stringify(response.data, null, 4));
			const reply = response.data[0].translations[0].text;
			return bot.sendMessage(chatId, reply);
		});
		
	}

	if (
		userStates[chatId] === "waiting for joke number" &&
		!isNaN(text) &&
		text >= 1 &&
		text <= 100
	) {
		userStates[chatId] = null; // Reset state
		try {
			
			const { data } = await axios.get(
				"https://heresajoke.com/chuck-norris-jokes/"
			);
			const $ = cheerio.load(data);
			const jokes = [];
			$("ol li").each((index, element) => {
				const joke = $(element).text();
				jokes.push(joke);
			});

			let joke = jokes[text]; 
			console.log(userLanguages[chatId] + "after");
			if (userLanguages[chatId]) {
				let langCode = getLanguageCode(userLanguages[chatId]);
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
					data: [
						{
							text: joke,
						},
					],
					responseType: "json",
				}).then(function (response) {
					console.log(JSON.stringify(response.data, null, 4));
					let reply = response.data[0].translations[0].text;
					const finalReply=`${text}. ${reply}`;
					return bot.sendMessage(chatId, finalReply);
				});
				
			}

		} catch (error) {
			console.log(error);
			return bot.sendMessage(chatId, "An error occurred. Please try again.");
		}
	}


});
