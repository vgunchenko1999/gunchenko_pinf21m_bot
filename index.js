const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const token = '5770305135:AAE9E2fUH7GoaH9TLLvNa1AxblE65fYyKwU';

const bot = new TelegramApi(token, {polling: true});

const chats = {};
const scores = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать!');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
};

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие.'},
        {command: '/info', description: 'Получить информацию о пользователе.'},
        {command: '/game', description: 'Игра угадай цифру.'},
        {command: '/score', description: 'Количество баллов.'}
    ]);
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start'){
            scores[chatId] = 0;
            await bot.sendSticker(chatId, 'https://tgram.ru/wiki/stickers/img/FunnyAnimalsGif/gif/12.gif');
            return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот от Владислава Гунченко.');
        }else if (text === '/info')
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}.`);
        else if (text === '/game')
            return startGame(chatId);
        else if (text === '/score')
            return bot.sendMessage(chatId, `Твой счёт: ${scores[chatId]}.`);
        else
            return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз!');
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again')
            return startGame(chatId);
        else if (data == chats[chatId]){
            scores[chatId]++;
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}. Твой счёт увеличился на 1 балл.`, againOptions);
        }
        else
            return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}.`, againOptions);
    });
};

start();