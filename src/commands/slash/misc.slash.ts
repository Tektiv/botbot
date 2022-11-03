import { MathUtils } from '@utils/math.util';
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export class MiscSlash {
  @Slash({ description: 'ping' })
  ping(interaction: CommandInteraction) {
    interaction.reply('pong!');
  }

  @Slash({ description: 'OH yOU WAnNA mOcK SOmeThiNg?' })
  mock(
    @SlashOption({
      description: 'mEssaGe TO mocK',
      name: 'message',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    message: string,
    interaction: CommandInteraction,
  ) {
    interaction.reply(
      message.map((letter) => (MathUtils.random(0, 1) === 0 ? letter.toUpperCase() : letter.toLowerCase())),
    );
  }
}
