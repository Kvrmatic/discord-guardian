const path = require('path');
const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
const database = require('../database/index.js');
const { ownerID, prefix } = require('../config.js');

module.exports = class GuardianClient extends AkairoClient {
    constructor() {
        super({ ownerID }, { disableEveryone: true })

        this.commandHandler = new CommandHandler(this, {
            directory: path.join(__dirname, '..', 'commands/'),
            prefix
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: path.join(__dirname, '..', 'listeners/')
        });

    }

    async login(token) {
        this.commandHandler.loadAll();
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll();
        await database.init();
        return super.login(token);
    }
}