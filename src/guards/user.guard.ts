import { ArgsOf, Discord, GuardFunction } from 'discordx';

@Discord()
export class UserGuard {
  static BotbotMessage: GuardFunction<ArgsOf<'messageCreate'>> = async ([message], client, next) => {
    if (client.user?.id === message.author.id) {
      await next();
    }
  };

  static NotBotbotMessage: GuardFunction<ArgsOf<'messageCreate'>> = async ([message], client, next) => {
    if (client.user?.id !== message.author.id) {
      await next();
    }
  };

  static BotbotReaction: GuardFunction<ArgsOf<'messageReactionAdd'>> = async ([, user], client, next) => {
    if (user.id === client.user?.id) {
      await next();
    }
  };

  static BotbotInteraction: GuardFunction<ArgsOf<'interactionCreate'>> = async ([interaction], client, next) => {
    if (interaction.user.id === client.user?.id) {
      await next();
    }
  };
}
