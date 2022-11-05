import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { RPGFishService } from './fish.rpg.service';

@Discord()
export class RPGFishSlash {
  @Slash({ description: "Hope you'll catch something nice!" })
  async fish(interaction: CommandInteraction) {
    const fish = await RPGFishService.fish(interaction.user);

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`🎣 ${fish.catch.phrase}`)
      .setDescription(fish.catch.joke)
      .addFields({ name: 'Rarity', value: `${fish.raritySymbol} ${fish.rarity}` })
      .setThumbnail(fish.icon);

    interaction.reply({
      embeds: [embed],
    });
  }
}
