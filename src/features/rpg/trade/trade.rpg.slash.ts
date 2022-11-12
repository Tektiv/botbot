import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, MessageActionRowComponentBuilder } from '@discordjs/builders';
import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  GuildMember,
} from 'discord.js';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';
import { RPGFishService } from '../fish/fish.rpg.service';

@Discord()
@SlashGroup({ description: "Let's trade with someone...", name: 'trade' })
export class TradeSlash {
  @SlashGroup('trade')
  @Slash({ description: 'Trade one of your fish with someone else' })
  async fish(
    @SlashOption({
      description: 'One of your fish you want to trade',
      name: 'your_fish',
      required: true,
      type: ApplicationCommandOptionType.String,
      autocomplete: async function (interaction: AutocompleteInteraction) {
        interaction.respond(
          (await RPGFishService.fishesFromUser(interaction.user))
            .filter((fish) => new RegExp(interaction.options.getFocused(true).value).test(fish.name))
            .slice(0, 24)
            .map((fish) => ({
              name: `${fish.raritySymbol} ${fish.name.capitalize()} - x${fish.quantity}`,
              value: fish.name,
            })),
        );
      },
    })
    fishName: string,
    @SlashOption({
      description: 'The user you want to trade with',
      name: 'trader',
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    })
    trader: GuildMember,
    @SlashOption({
      description: 'One of the trader fish',
      name: 'trader_fish',
      required: true,
      type: ApplicationCommandOptionType.String,
      autocomplete: async function (interaction: AutocompleteInteraction) {
        const traderId = interaction.options.get('trader')!.value;
        if (traderId == null) {
          return;
        }

        await interaction.guild?.members.fetch();
        const trader = interaction.client.users.cache.get(traderId.toString());
        if (trader == null) {
          return;
        }

        interaction.respond(
          (await RPGFishService.fishesFromUser(trader))
            .filter((fish) => new RegExp(interaction.options.getFocused(true).value).test(fish.name))
            .slice(0, 24)
            .map((fish) => ({ name: `${fish.raritySymbol} ${fish.name.capitalize()}`, value: fish.name })),
        );
      },
    })
    traderFishName: string,
    interaction: CommandInteraction,
  ) {
    const fish = RPGFishService.fishFromName(fishName);
    const traderFish = RPGFishService.fishFromName(traderFishName);

    if (fish == null || traderFish == null) {
      interaction.reply({
        content: 'Unknown fish(es)...',
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🤝 Fish trading request')
      .setDescription(`${trader}, ${interaction.user.username} wants to trade with you`)
      .addFields({
        name: 'You will trade',
        value: `${traderFish?.raritySymbol} ${traderFish?.name.capitalize()}`,
        inline: true,
      })
      .addFields({
        name: 'They will trade',
        value: `${fish?.raritySymbol} ${fish?.name.capitalize()}`,
        inline: true,
      })
      .setTimestamp();

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder().setLabel('Accept').setStyle(ButtonStyle.Success).setCustomId('fish_trade_accept'),
      new ButtonBuilder().setLabel('Refuse').setStyle(ButtonStyle.Secondary).setCustomId('fish_trade_refuse'),
    );

    const reply = await interaction.reply({
      embeds: [embed],
      components: [row],
    });

    reply
      .createMessageComponentCollector({
        filter: <any>((click: ButtonInteraction) => click.user.id === trader.user.id),
      })
      .on('collect', async (click: ButtonInteraction) => {
        const accepted = click.customId === 'fish_trade_accept';
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel(accepted ? 'Accepted' : 'Refused')
            .setStyle(accepted ? ButtonStyle.Success : ButtonStyle.Secondary)
            .setCustomId('fish_trade_concluded')
            .setDisabled(true),
        );

        if (!accepted) {
          click.message.edit({
            components: [row],
          });
          click.deferUpdate();
          return;
        }

        if (
          await RPGFishService.tradeFish(
            { user: interaction.user, fish: fish! },
            { user: trader.user, fish: traderFish! },
          )
        ) {
          click.message.edit({
            components: [row],
          });
          click.deferUpdate();
          return;
        }

        click.reply({
          content: 'Error while trading...',
          ephemeral: true,
        });
      });
  }
}