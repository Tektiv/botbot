import { Embeds } from 'commons/discord/embeds.discord';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
} from 'discord.js';
import { Discord, Slash } from 'discordx';
import { Emoji2 } from 'features/emoji/emoji.service';
import { BlackjackGame } from './blackjack.game';

@Discord()
export class BlackjackSlash {
  @Slash({ description: 'Jack Black drawing a black jack in blackjack' })
  async blackjack(interaction: CommandInteraction) {
    const game = new BlackjackGame();

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
        click.reply(Embeds.warning('This interaction is not for you'));
        return;
      }

      click.deferUpdate();

      if (click.customId === 'blackjack_hit' && game.hit()) {
        await reply.edit({
          embeds: [await this.gameEmbed(game)],
        });
        return;
      }

      const state = game.stay();
      await reply.edit({
        embeds: [this.finishEmbed(game, state)],
        components: [],
      });
      return;
    });
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

  private finishEmbed(game: BlackjackGame, state: number) {
    const messages = [
      ':no_entry_sign:  Busted!',
      ':no_entry_sign:  You lost',
      ":shrug: That's a draw",
      ':tada:  You won!',
      ':champagne:  BLACKJACK!!',
    ];

    return new EmbedBuilder()
      .setTitle(messages[state + 2])
      .addFields({
        name: `Dealer hand (${game.dealerHand.value})`,
        value: `**${game.dealerHand.toString(false)}**`,
      })
      .addFields({
        name: `Your hand (${game.playerHand.value})`,
        value: `**${game.playerHand.toString(false)}**`,
      });
  }
}
