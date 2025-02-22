const Discord = require('discord.js');
const Command = require('./command.js');
const Event = require('./event.js');
const config = require('../jsons/config.json');

const intents = new Discord.Intents(32767);

const fs = require('fs');

//Класс клиента
class Client extends Discord.Client {
    constructor() {
        super({ intents })

        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection()

        this.prefix = config.prefix;
    }

    RunBot(token) {       
        //Обработчик команд
        const commandFiles = fs.readdirSync('./commands/')
            .filter(file => file.endsWith('.js'));
            /**
             * @type {Command[]}
             */

        const commands = commandFiles.map(file => require(`../commands/${file}`));

        commands.forEach(cmd => {
            console.log(`Команда: ${cmd.name} была загружена!`);
            this.commands.set(cmd.name, cmd);
        })

        fs.readdirSync('./events/')
            .filter(file => file.endsWith('.js'))
            .forEach(file => {
                /**
                 * @type {Event}
                 */
                const event = require(`../events/${file}`)
                console.log(`Ивент: ${event.event} был загружен`)
                this.on(event.event, event.run.bind(null, this))
            })

        //Логин бота
        this.login(token).catch(err => {
            if (err == "Error [TOKEN_INVALID]: An invalid token was provided.") {
                return console.log("Ошибка:\nТокен недействителен или он отсутствует\n\nEvilMC\nc0d9d by DesConnet");
            }
            return console.log(err)
        })
    }
}

module.exports = Client;