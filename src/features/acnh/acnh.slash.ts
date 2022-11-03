import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { AnimalCrossingService } from './acnh.service';

@Discord()
export class AnimalCrossingSlash {
  @Slash({ description: "Hope you'll catch something nice!" })
  fish(interaction: CommandInteraction) {
    const fish = AnimalCrossingService.fish();

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
