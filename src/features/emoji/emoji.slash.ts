import { EmojiService } from 'features/emoji/emoji.service';
import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export class EmojiSlash {
  @Slash({ description: 'Displays a custom emoji' })
  async emoji(
    @SlashOption({
      autocomplete: function (interaction: AutocompleteInteraction) {
        interaction.respond(
          Object.keys(EmojiService.customEmojis)
            .filter((emoji) => new RegExp(interaction.options.getFocused(true).value).test(emoji))
            .slice(0, 24)
            .map((emoji) => ({ name: emoji, value: `:${emoji}:` })),
        );
      },
      description: 'Emoji name',
      name: 'name',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    emoji: string,
    interaction: CommandInteraction,
  ) {
    interaction.reply(await EmojiService.replaceEmojis(emoji, interaction.guild!));
  }

  @Slash({ description: 'Adds a custom emoji' })
  async emoji_add(
    @SlashOption({
      description: 'Emoji name',
      name: 'name',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    name: string,
    @SlashOption({
      description: 'Emoji URL',
      name: 'url',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    url: string,
    interaction: CommandInteraction,
  ) {
    await EmojiService.push(name, url);
    interaction.reply({ content: await EmojiService.replaceEmojis(`:${name}:`, interaction.guild!), ephemeral: true });
  }
}
