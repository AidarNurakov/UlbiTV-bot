const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '1909348979:AAGcKiuFAwIQ-kpu5XA13eSswSMFxwKtpew'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я задагаю цифру от 0 до 9, а ты должен ее угадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай число '}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
    
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/76c/f21/76cf2156-c7bb-364e-a219-13e36bdcf4e4/6.webp')
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм`)
        }
       if(text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.username}`)
       }
       if(text === '/game'){
          return startGame(chatId)
       }
       return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз')
       
    })
    
    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again') {
            return startGame(chatId)
        }
        if(data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
        
    })

}

start()