import { MessageGuard } from '@guards/message.guard';
import { UserGuard } from '@guards/user.guard';
import { ArgsOf, Discord, Guard, On } from 'discordx';
import { Emoji } from 'features/emoji/emoji.service';
import { MessageTriggerList } from './trigger.list';
import { MessageTriggerAction } from './trigger.model';

@Discord()
export class MessageTriggerEvent {
  private async performAction(
    action: MessageTriggerAction,
    [message]: ArgsOf<'messageCreate'>,
    ...args: any[]
  ): Promise<void> {
    switch (action) {
      case MessageTriggerAction.REACT: {
        const emojis = await Promise.all(args.map(async (emoji) => await Emoji(emoji, message.guild!)));
        await message.react(emojis.pickOne());
        return;
      }
      case MessageTriggerAction.CHANNEL_MESSAGE: {
        await message.channel.send(args.pickOne());
        return;
      }
      case MessageTriggerAction.FUNCTION: {
        return new Promise(async (resolve) => {
          resolve(await args[0]([message], ...args));
        });
      }
    }
  }

  @On({ event: 'messageCreate' })
  @Guard(UserGuard.NotBotbotMessage, MessageGuard.NotSimpleCommand)
  triggers([message]: ArgsOf<'messageCreate'>) {
    const found = MessageTriggerList.find((trigger) => {
      let { content } = message;
      if (trigger.twinLetters) {
        content = content.removeTwinLetters();
      }
      return trigger.regexp.test(content);
    });

    if (found) {
      this.performAction(found.action, [message], ...found.args);
    }
  }
}
