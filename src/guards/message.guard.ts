import { ArgsOf, Discord, GuardFunction } from 'discordx';

@Discord()
export class MessageGuard {
  static NotSimpleCommand: GuardFunction<ArgsOf<'messageCreate'>> = async ([message], client, next) => {
    if (!message.content.startsWith(client.prefix.toString())) {
      await next();
    }
  };

  static RegExp(regexp: RegExp) {
    const guard: GuardFunction<ArgsOf<'messageCreate'>> = async ([message]: ArgsOf<'messageCreate'>, _, next) => {
      if (regexp.test(message.content)) {
        await next();
      }
    };
    return guard;
  }
}
