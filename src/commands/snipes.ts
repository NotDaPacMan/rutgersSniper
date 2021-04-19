import { Command, CommandMessage, Guard } from '@typeit/discord';
import * as Discord from 'discord.js';
import { NotBot } from '../guards/notABot';

import Settings from '../models/settings';
import Users from '../models/users';

export default class Snipes {
  @Command('snipes')
  @Guard(NotBot)
  async snipes(message: CommandMessage) {
    const d_id = message.author.id;
    const snipeUsers: any[] = await Users.find({ d_id: d_id });

    const embed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setTitle('Course Sniper')
      .setURL('https://sims.rutgers.edu/webreg/')
      .setDescription('Current Snipes')
      .setTimestamp();

    if (snipeUsers.length != 0) {
      for (let course of snipeUsers[0].courses) {
        embed.addFields({
          name: `${course.name == '' ? 'Invalid section number or name not yet set' : course.name}`,
          value: `Section: ${course.num}`,
          inline: true,
        });
      }
    }

    await message.channel.send(embed);
    console.log('!snipe completed\n');
  }
}
