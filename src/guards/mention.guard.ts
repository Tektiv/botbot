import { ArgsOf, Discord, GuardFunction } from 'discordx';

@Discord()
export class MentionGuard {
  static Botbot: GuardFunction<ArgsOf<'messageCreate'>> = async ([message], client, next) => {
    if (message.mentions.members?.has(client.user?.id!) || message.content.includes('<@&524858039300259850>')) {
      await next();
    }
  };

  static NotBotbot: GuardFunction<ArgsOf<'messageCreate'>> = async ([message], client, next) => {
    if (!message.mentions.members?.has(client.user?.id!)) {
      await next();
    }
  };
}
