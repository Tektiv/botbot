import { UserGuard } from '@guards/user.guard';
import { RegExps } from 'commons/regexp.list';
import { ReactionEmoji } from 'discord.js';
import { ArgsOf, Discord, Guard, On } from 'discordx';
import { EmojiService } from 'features/emoji/emoji.service';

@Discord()
export class BotbotMessageEvent {
  @On({ event: 'messageCreate' })
  @Guard(UserGuard.BotbotMessage)
  async cleanEmojisInMessage([message]: ArgsOf<'messageCreate'>) {
    const emojis = (message.content.match(RegExps.customEmojis) || [])
      .filter((emoji) => EmojiService.emojisRepo[emoji.match(RegExps.customEmoji)![1]] != null)
      .removeDuplicates();
    await Promise.all(
      emojis.map(
        async (emoji) => await EmojiService.removeFromGuild(message.guild!, emoji.match(RegExps.customEmoji)![2]),
      ),
    );
  }

  @On({ event: 'messageReactionAdd' })
  @Guard(UserGuard.BotbotReaction)
  async cleanEmojisInReaction([reaction]: ArgsOf<'messageReactionAdd'>) {
    if (EmojiService.emojisRepo[(<ReactionEmoji>(<any>reaction)._emoji).name!.remove(':')] != null) {
      await EmojiService.removeFromGuild(reaction.message.guild!, (<ReactionEmoji>(<any>reaction)._emoji).id!);
    }
  }
}
