import { Configuration } from '@helpers/config';
import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { EmojiService } from 'features/emoji/emoji.service';

@Discord()
export class EmojiSlash {
  @Slash({ description: 'Displays a custom emoji' })
  async emoji(
    @SlashOption({
      description: 'Emoji name',
      name: 'name',
      required: true,
      type: ApplicationCommandOptionType.String,
      autocomplete: function (interaction: AutocompleteInteraction) {
        if (!Configuration.checkIfFeatureIsEnabled('emoji')) {
          interaction.respond([]);
        } else {
          interaction.respond(
            Object.keys(EmojiService.emojisRepo)
              .filter((emoji) => new RegExp(interaction.options.getFocused(true).value).test(emoji))
              .slice(0, 24)
              .map((emoji) => ({ name: emoji, value: `:${emoji}:` })),
          );
        }
      },
    })
    emoji: string,
    interaction: CommandInteraction,
  ) {
    if (!Configuration.checkIfFeatureIsEnabled('emoji', interaction)) {
      return;
    }

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
    if (!Configuration.checkIfFeatureIsEnabled('emoji', interaction)) {
      return;
    }

    await EmojiService.push(name, url);
    await interaction.reply({
      content: await EmojiService.replaceEmojis(`:${name}:`, interaction.guild!),
      ephemeral: true,
    });
    await EmojiService.removeByName(interaction.guild!, name);
  }
}
