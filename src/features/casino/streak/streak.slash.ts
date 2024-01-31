import { Embeds } from 'commons/discord/embeds.discord';
import { Configuration } from 'commons/helpers/config';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { RPGInventoryService } from 'features/rpg/inventory/inventory.service';
import { CasinoService } from '../casino.service';
import { CasinoStreakService } from './streak.service';

@Discord()
export class CasinoSlash {
  @Slash({ description: "Don't forget about it!" })
  async daily(interaction: CommandInteraction) {
    const update = await CasinoStreakService.actions.daily(interaction.user);

    if (!update) {
      interaction.reply(Embeds.nope('You already checked in today.', 'Come back tomorrow to continue your streak!'));
      return;
    }

    const streak = (await CasinoService.getUser.streak(interaction.user)).get('streak') as number;
    await RPGInventoryService.patch.balance.add(interaction.user, Math.min(streak, 5) * 100);

    const streakEmbed = new EmbedBuilder()
      .setTitle('✅  Daily claimed')
      .setDescription(`${Math.min(streak, 5) * 100}${Configuration.credits} added to your inventory!`)
      .addFields({ name: 'Current streak', value: streak.toString() });
    interaction.reply({
      embeds: [streakEmbed],
    });
  }
}
