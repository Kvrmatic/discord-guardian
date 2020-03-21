const { Command } = require('discord-akairo');
const { limits } = require('../../config.js');
const toProperCase = require('../../util/toProperCase.js');

class LimitsCommand extends Command {
    constructor() {
        super('limits', {
            aliases: ['limits'],
            args: [
                {
                    id: 'index',
                    type: 'integer'
                },
                {
                    id: 'value',
                    type: 'integer'
                }
            ],
            channel: 'guild'
        });
    }



    async exec(message, args) {

        // Declare embed
        const embed = this.client.util.embed();

        // Check if the value argument was supplied
        if (args.value) {

            // Input Error Messages
            if (args.index > 10 || args.index < 1) return message.channel.send('Index is not between 1-10.');
            if (args.value > 30 || args.value < 1) return message.channel.send('Value is not between 1-30.');

            let key = Object.keys(limits)[(args.index/2)-1];
            let duration = args.index % 2 === 0 ? 'hour' : 'minute';

            await this.client.settings.set(message.guild.id, `${key}_${duration}`, args.value);
            embed.setDescription(`**${toProperCase(key)} has been changed to ${args.value}**`);

        }

        // Create basic embed for listing current limits
        embed.setTitle(`Server Limits for ${message.guild.name}`)
            .setColor(0x7289DA)
            .setFooter("If any of the defined limits are met, all of the user's roles will be automatically removed.");
        if (!embed.description) embed.setDescription(`Updating Limits: **\`${this.client.commandHandler.prefix(message)}limits index value\`**`);

        // Iterate through default limits to create a list of current limits
        var index = 1;
        for (var k in limits) {
            let minuteLimit = this.client.settings.get(message.guild.id, `${k}_minute`, limits[k].per_minute);
            let hourLimit = this.client.settings.get(message.guild.id, `${k}_hour`, limits[k].per_hour);

            let minuteText = `**${index++}.** Per Minute: **\`${minuteLimit}\`**`;
            let hourText = `**${index++}.** Per Hour: **\`${hourLimit}\`**`;

            embed.addField(toProperCase(k), `${minuteText}\n${hourText}`, true);
        }

        // Send the list of current limits
        message.channel.send(embed.addField('\u200B', '\u200B', true));

    }
}

module.exports = LimitsCommand;