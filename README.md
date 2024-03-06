# ChuckBot

ChuckBot is a Telegram bot that provides hard cold facts about Chuck Norris with automatic translation. ChuckBot scrapes jokes from a website using Cheerio and uses the Azure Translation API for translation. It is built using the Node.js library `node-telegram-bot-api` and deployed to Azure. You can chat with ChuckBot at [https://t.me/ChuckNorris101_bot](https://t.me/ChuckNorris101_bot).

## Features

- ChuckBot provides Chuck Norris jokes and facts in multiple languages.
- Jokes are scraped in real-time using Cheerio to keep the content fresh.
- Automatic translation is powered by the Azure Translation API, allowing users to enjoy jokes in their preferred language.
- Deployed on an Azure for 24/7 availability.

## How to Use ChuckBot

1. Start a chat with ChuckBot by visiting [@ChuckNorris101_bot](https://t.me/ChuckNorris101_bot).
2. Send a message to ChuckBot to get a Chuck Norris joke or fact in your preferred language. (`Set language english` for example)
3. Then the bot will respond with a 'no problem' message in the language you specified.
4. Send a message to ChuckBot again with a number between 1 and 100 to get a joke or fact. (`1` for example)
5. ChuckBot will respond with a joke or fact, ensuring a good laugh.

## Deployment

ChuckBot is deployed on an Azure Web App
