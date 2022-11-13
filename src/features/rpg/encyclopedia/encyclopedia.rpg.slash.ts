import { EmbedBuilder } from '@discordjs/builders';
import { ApplicationCommandOptionType, AutocompleteInteraction, CommandInteraction } from 'discord.js';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';
import { RPGFishService } from '../fish/fish.rpg.service';

@Discord()
@SlashGroup({ description: "Let's check the encyclopedia...", name: 'encyclopedia' })
export class EncyclopediaSlash {
  @SlashGroup('encyclopedia')
  @Slash({ description: "Looks fishy, isn't it?" })
  async fish(
    @SlashOption({
      description: 'The fish you want to know more about',
      name: 'fish',
      required: true,
      type: ApplicationCommandOptionType.String,
      autocomplete: async function (interaction: AutocompleteInteraction) {
        interaction.respond(
          RPGFishService.fishRepo
            .filter((fish) => new RegExp(interaction.options.getFocused(true).value).test(fish.name))
            .slice(0, 24)
            .map((fish) => ({
              name: fish.name.capitalize(),
              value: fish.name,
            })),
        );
      },
    })
    fishName: string,
    interaction: CommandInteraction,
  ) {
    const fish = RPGFishService.fishRepo.find((fish) => fish.name === fishName);
    if (fish == null) {
      interaction.reply({
        content: `Fish "${fishName}" not found...`,
        ephemeral: true,
      });
      return;
    }

    const numbers = await RPGFishService.count.fishOccurences(fish);
    const embed = new EmbedBuilder()
      .setTitle(`${fish.name.capitalize()}`)
      .addFields({ name: 'Rarity', value: `${fish.raritySymbol} ${fish.rarity}` })
      .addFields({ name: '# fished', value: numbers.toString() })
      .addFields({ name: 'Months', value: fish.monthAvailability, inline: true })
      .addFields({ name: '\u200b', value: '\u200b', inline: true })
      .addFields({ name: 'Hours', value: fish.hoursAvailability, inline: true })
      .setThumbnail(fish.icon);

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  }
}
