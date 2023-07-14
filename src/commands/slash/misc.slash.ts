import { MathUtils } from '@utils/math.util';
import { Guilds } from 'commons/discord/guilds.discord';
import { ApplicationCommandOptionType, Client, CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export class MiscSlash {
  @Slash({ description: 'OH yOU WAnNA mOcK SOmeThiNg?' })
  async mock(
    @SlashOption({
      description: 'mEssaGe TO mocK',
      name: 'message',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    message: string,
    interaction: CommandInteraction,
    client: Client,
  ) {
    const emojiGuild = client.guilds.cache.get(Guilds.ketchup);
    await emojiGuild?.fetch();

    interaction.reply(
      `${emojiGuild?.emojis.cache.find((emoji) => emoji.name === 'mock')} ${message.map((letter) =>
        MathUtils.random(0, 1) === 0 ? letter.toUpperCase() : letter.toLowerCase(),
      )}`,
    );
  }
}
