import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { RPGInteraction } from '../rpg.interaction';
import { Skill } from '../skill/skill.model';
import { RPGFishService } from './fish.rpg.service';

@Discord()
export class RPGFishSlash {
  @Slash({ description: "Hope you'll catch something nice!" })
  async fish(interaction: CommandInteraction) {
    const fish = await RPGFishService.actions.fish(interaction.user);

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`🎣 ${fish.catch.phrase}`)
      .addFields({ name: 'Rarity', value: `${fish.rarityTo.symbol()} ${fish.rarity}` })
      .setThumbnail(fish.icon);

    if (fish.catch.joke) {
      embed.setDescription(fish.catch.joke);
    }

    await interaction.reply({
      embeds: [embed],
    });

    await RPGInteraction.checkForLevelUp(interaction, Skill.FISHING, fish.rarityTo.xp());
  }
}
