import { Configuration } from '@helpers/config';
import { Embeds } from 'commons/discord/embeds.discord';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { Emoji2 } from 'features/emoji/emoji.service';
import { InventoryModel } from 'features/rpg/inventory/inventory.service';
import { RPGService } from 'features/rpg/rpg.service';
import { Model } from 'sequelize';
import { BLACKJACK, BlackjackGame } from './blackjack.game';

type Inventory = Model<InventoryModel, InventoryModel>;

@Discord()
export class BlackjackSlash {
  @Slash({ description: 'Jack Black drawing a black jack in blackjack' })
  async blackjack(
    @SlashOption({
      description: 'How much do you want to bet?',
      name: 'bet',
      required: false,
      type: ApplicationCommandOptionType.Number,
    })
    bet = 0,
    interaction: CommandInteraction,
  ) {
    const inventory = await RPGService.getUser.inventory(interaction.user);
    const balance = inventory.get('balance') as number;

    if (balance < bet) {
      interaction.reply(Embeds.nope(`You don't have enough ${Configuration.credits.trim()} in your balance.`));
      return;
    }

    const game = new BlackjackGame();

    if (game.playerHand.value === BLACKJACK) {
      await interaction.reply({
        embeds: [await this.finishGame(game, inventory, bet)],
        components: [],
      });
      return;
    }

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder().setLabel('Hit').setStyle(ButtonStyle.Secondary).setCustomId('blackjack_hit'),
      new ButtonBuilder().setLabel('Stay').setStyle(ButtonStyle.Secondary).setCustomId('blackjack_stay'),
    );

    const reply = await interaction.reply({
      embeds: [await this.gameEmbed(game)],
      components: [row],
    });

    reply.createMessageComponentCollector().on('collect', async (click: ButtonInteraction) => {
      if (click.user.id !== interaction.user.id) {
        click.reply(Embeds.nope('This interaction is not for you'));
        return;
      }

      click.deferUpdate();

      if (click.customId === 'blackjack_hit' && game.hit()) {
        await reply.edit({
          embeds: [await this.gameEmbed(game)],
        });
        return;
      }

      await reply.edit({
        embeds: [await this.finishGame(game, inventory, bet)],
        components: [],
      });
      return;
    });
  }

  private async finishGame(game: BlackjackGame, inventory: Inventory, bet: number): Promise<EmbedBuilder> {
    const state = game.stay();
    if (bet > 0) {
      switch (state) {
        case -2:
        case -1:
          await inventory.decrement('balance', { by: bet });
          break;
        case 1:
          await inventory.increment('balance', { by: bet });
          break;
        case 2:
          await inventory.increment('balance', { by: Math.ceil(1.5 * bet) });
          break;
        default:
      }
    }

    return await this.finishEmbed(game, state, bet);
  }

  private async gameEmbed(game: BlackjackGame) {
    return new EmbedBuilder()
      .setTitle(`${await Emoji2('playingcard')}  Blackjack`)
      .addFields({
        name: `Dealer hand (${game.dealerHand.value})`,
        value: `**${game.dealerHand.toString(false)}**`,
      })
      .addFields({
        name: `Your hand (${game.playerHand.value})`,
        value: `**${game.playerHand.toString(false)}**`,
      });
  }

  private async finishEmbed(game: BlackjackGame, state: number, bet: number) {
    const messages = [
      ':no_entry_sign:  Busted!',
      ':no_entry_sign:  You lost',
      ":shrug: That's a draw",
      ':tada:  You won!',
      ':champagne:  BLACKJACK!!',
    ];
    const betMessages = [
      `You lost ${bet}${Configuration.credits}...`,
      `You lost ${bet}${Configuration.credits}...`,
      'At least you did not lost anything',
      `You won ${2 * bet}${Configuration.credits}!`,
      `You won ${Math.ceil(2.5 * bet)}${Configuration.credits}!`,
    ];

    const embed = new EmbedBuilder()
      .setTitle(messages[state + 2])
      .addFields({
        name: `Dealer hand (${game.dealerHand.value})`,
        value: `**${game.dealerHand.toString(false)}**`,
      })
      .addFields({
        name: `Your hand (${game.playerHand.value})`,
        value: `**${game.playerHand.toString(false)}**`,
      });

    if (bet > 0) {
      embed.setFooter({
        text: betMessages[state + 2],
      });
    }

    return embed;
  }
}
