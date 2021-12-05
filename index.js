const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')
const token = '5083943289:AAGkx8ayOKCma8NaFQK7mVYsfTIM_5nJCZ0'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;

    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Сыграть в игру угадай число'},
        {command: '/lol', description: 'Узнать кто тут *идор'},

    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id


        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ef5/8e1/ef58e15f-94a2-3d56-a365-ca06e1339d08/7.webp')
            return  bot.sendMessage(chatId, `Добро пожаловать в телеграм бота ByJumping`)
        }
        if (text === '/info') {
            return  bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        if (text === '/lol') {
            setTimeout(() => {
                bot.sendMessage(chatId, `Поиск завершен, *идор найден, - ${msg.from.first_name}`)
            }, 1000)
            return
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }

        if (data === chats[chatId]) {
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start()
