import { Command, CommandMessage, Guard } from '@typeit/discord';
import { NotBot } from '../guards/notABot';
import { admin } from '../guards/admin';

import monitorCourses from '../scripts/monitorCourses';

import Settings from '../models/settings';

export default abstract class on {
  @Command('on')
  @Guard(NotBot)
  @Guard(admin)
  async on(message: CommandMessage) {
    await message.channel.send('```' + `Entered command is '!on'\nConfirm with 'y' or 'n'` + '```');

    let stopped = false;
    let exit = false;

    const collector = message.channel.createMessageCollector((msg) => msg.author.id == message.author.id, {
      time: 60000,
    });

    for await (const m of collector) {
      if (m.content.toLowerCase() == 'n') {
        collector.stop();
        stopped = true;
        exit = true;
      } else if (m.content.toLowerCase() == 'y') {
        collector.stop();
        stopped = true;
      }
    }

    if (exit) {
      await message.channel.send('```Command canceled```');
      console.log('Canceled\n');
      return;
    } else if (!stopped) {
      await message.channel.send('```Command timed out, stopping```');
      console.log('Timed out\n');
      return;
    }

    const settingsArray: any[] = await Settings.find();

    if (!settingsArray[0].status) {
      await Settings.updateOne({ _id: settingsArray[0]._id }, { $set: { status: true } })
        .then(async () => {
          await message.channel.send('```' + `Successfully turned on` + '```');
          console.log('Successfully turned on\n');
        })
        .catch((err) => console.log(err));

      monitorCourses();
    } else {
      await message.channel.send('```Monitoring is already on```');
      console.log('!on completed\n');
    }
  }
}
