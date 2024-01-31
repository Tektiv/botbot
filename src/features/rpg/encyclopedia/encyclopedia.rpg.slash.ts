import { EmbedBuilder } from '@discordjs/builders';
import { Configuration } from '@helpers/config';
import { Embeds } from 'commons/discord/embeds.discord';
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
        if (!Configuration.checkIfFeatureIsEnabled('fish')) {
          return;
        }

        const fishes = RPGFishService.fishes.filter(
          (fish) =>
            new RegExp(interaction.options.getFocused(true).value.toLowerCase()).test(fish.name.toLowerCase()) &&
            fish?.name != null,
        );

        if (<any>fishes[0] === 0) {
          interaction.respond([]);
          return;
        }

        interaction.respond(
          fishes.slice(0, 24).map((fish) => ({
            name: fish.name.capitalize(),
            value: fish.name,
          })),
        );
      },
    })
    fishName: string,
    interaction: CommandInteraction,
  ) {
    if (!Configuration.checkIfFeatureIsEnabled('fish', interaction)) {
      return;
    }

    const fish = RPGFishService.fishes.find((fish) => fish.name === fishName);
    if (fish == null) {
      interaction.reply(Embeds.error(`Fish **${fishName}** not found...`));
      return;
    }

    const quantity = await RPGFishService.count.fishByUser(fish, interaction.user);
    const embed = new EmbedBuilder()
      .setTitle(`${fish.name.capitalize()}`)
      .addFields({ name: 'Rarity', value: `${fish.rarityTo.symbol()} ${fish.rarity}` })
      .addFields({ name: '# you fished', value: quantity.toString() })
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
