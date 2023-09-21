import { MessageGuard } from '@guards/message.guard';
import { MiscGuard } from '@guards/misc.guard';
import { UserGuard } from '@guards/user.guard';
import { MathUtils } from '@utils/math.util';
import { Utils } from '@utils/util';
import { ArgsOf, Discord, Guard, On } from 'discordx';

@Discord()
export class UserMessageEvent {
  @On({ event: 'messageCreate' })
  @Guard(UserGuard.NotBotbotMessage, MessageGuard.NotSimpleCommand, MessageGuard.RegExp(/ing$/i))
  pingPong([message]: ArgsOf<'messageCreate'>) {
    message.channel.send(message.content.replace(/ing$/, 'ong').replace(/ING$/, 'ONG'));
  }

  @On({ event: 'messageCreate' })
  @Guard(UserGuard.NotBotbotMessage, MessageGuard.NotSimpleCommand, MiscGuard.Random(40))
  async random([message]: ArgsOf<'messageCreate'>) {
    await Utils.sleep(MathUtils.random(3, 6) * 1000);

    const reactions = [`👁️ 🫦 👁️`, `👁️ 👄 👁️`, 'classe'];
    message.channel.send(reactions.pickOne());
  }
}
