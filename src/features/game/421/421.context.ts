import { Embeds } from 'commons/discord/embeds.discord';
import { Guilds } from 'commons/discord/guilds.discord';
import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  MessageContextMenuCommandInteraction,
} from 'discord.js';
import { ContextMenu, Discord } from 'discordx';
import { Game421 } from './421.game';
import { Username } from 'commons/discord/user.discord';

@Discord()
export class Game421Context {
  @ContextMenu({
    name: 'Play a game of 421',
    type: ApplicationCommandType.User,
    nameLocalizations: {
      fr: 'Proposer une partie de 421',
    },
  })
  async messageHandler(interaction: MessageContextMenuCommandInteraction, client: Client) {
    if (interaction.guild == null) {
      interaction.reply(Embeds.error('Command not available in DMs'));
      return;
    }

    const sender = interaction.user;
    const receiver = interaction.guild.members.cache.get(interaction.targetId)!;

    if (receiver.user.bot) {
      interaction.reply(Embeds.error('Command cannot be used on a bot'));
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('🎲 421 game request')
      .setDescription(
        `${receiver}, **${await Username(sender, interaction.guild)}** wants to play a game of 421 with you!`,
      );

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder().setLabel('Accept').setStyle(ButtonStyle.Success).setCustomId('421_game_accept'),
      new ButtonBuilder().setLabel('Refuse').setStyle(ButtonStyle.Secondary).setCustomId('421_game_refuse'),
    );

    const reply = await interaction.reply({
      embeds: [embed],
      components: [row],
    });

    reply.createMessageComponentCollector().on('collect', async (click: ButtonInteraction) => {
      if (click.user.id !== receiver.user.id) {
        click.reply(Embeds.warning('This interaction is not for you'));
        return;
      }

      const accepted = click.customId === '421_game_accept';
      const replyRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel(accepted ? 'Accepted' : 'Refused')
          .setStyle(accepted ? ButtonStyle.Success : ButtonStyle.Secondary)
          .setCustomId('421_game_concluded')
          .setDisabled(true),
      );

      if (!accepted) {
        click.message.edit({
          components: [replyRow],
        });
        click.deferUpdate();
        return;
      }

      const game = new Game421(sender, receiver.user);
      game.sender.throwAllDice();
      game.receiver.throwAllDice();

      const emojiGuild = client.guilds.cache.get(Guilds.botbot)!;
      await emojiGuild.fetch();

      const winEmbed = new EmbedBuilder()
        .addFields({
          name: `${await Username(game.sender.user, interaction.guild!)}`,
          value: `${game.sender.hand.toEmbed(emojiGuild)}`,
          inline: true,
        })
        .addFields({
          name: `${await Username(game.receiver.user, interaction.guild!)}`,
          value: `${game.receiver.hand.toEmbed(emojiGuild)}`,
          inline: true,
        });

      const winner = game.winner?.user;
      if (winner == null) {
        winEmbed.setAuthor({ name: "That's a draw 🤷" });
      } else {
        winEmbed.setAuthor({
          name: `${await Username(winner, interaction.guild!)} is the winner! 🏆`,
          iconURL: winner.avatarURL()?.toString(),
        });
      }

      click.message.edit({
        embeds: [winEmbed],
        components: [],
      });
      click.deferUpdate();
    });
  }
}
