import TelegramApi from "node-telegram-bot-api";
import { againOptions, gameOptions } from "./options.js";

const token = "6161068936:AAGgDmVz8DYJmneq5600HPtrSRHYt2Zi1QA";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать !"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Начальное приветствие",
    },
    {
      command: "/info",
      description: "Получить информацию о пользователе",
    },
    {
      command: "/game",
      description: "Игра - угадай цифру",
    },
  ]);

  bot.on("message", async (message) => {
    const text = message.text;
    const chatId = message.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/175/10e/17510e63-2d89-41ec-a18c-1e3351dd42b1/4.webp"
      );
      return bot.sendMessage(chatId, "Добро пожаловать в Хиккин Бот");
    }

    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебя зовут ${message.from.first_name}`);
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я тебя не понимаю, попробуй еще раз!");
  });

  bot.on("callback_query", async (message) => {
    const data = message.data;
    const chatId = message.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    console.log(data, chats[chatId]);

    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, я загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
