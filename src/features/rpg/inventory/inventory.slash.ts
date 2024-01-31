import { Embeds } from 'commons/discord/embeds.discord';
import { Username } from 'commons/discord/user.discord';
import { Configuration } from 'commons/helpers/config';
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, GuildMember } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { RPGService } from '../rpg.service';

@Discord()
export class InventorySlash {
  @Slash({ description: 'As Tony Parker would say...' })
  async balance(interaction: CommandInteraction) {
    const inventory = await RPGService.getUser.inventory(interaction.user);
    const balance = inventory.get('balance') as number;

    const inventoryEmbed = new EmbedBuilder()
      .setTitle('💰  Balance')
      .setDescription(`You have ${balance.toLocaleString('en-GB')}${Configuration.credits}`);

    interaction.reply({
      embeds: [inventoryEmbed],
      ephemeral: true,
    });
  }

  @Slash({ description: 'Give a little a bit of your time to me' })
  async give(
    @SlashOption({
      description: "Who's the lucky one?",
      name: 'user',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    })
    user: GuildMember,
    @SlashOption({
      description: 'How much do you want to give?',
      name: 'gift',
      type: ApplicationCommandOptionType.Number,
      required: true,
    })
    gift = 0,
    interaction: CommandInteraction,
  ) {
    const inventory = await RPGService.getUser.inventory(interaction.user);
    const balance = inventory.get('balance') as number;

    if (balance < gift) {
      interaction.reply(Embeds.nope(`You don't have enough ${Configuration.credits.trim()} in your balance.`));
      return;
    }

    const receiverInventory = await RPGService.getUser.inventory(user.user);
    await receiverInventory.increment('balance', { by: gift });
    await inventory.decrement('balance', { by: gift });

    const receiverEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${await Username(interaction.user, interaction.guild!)} sent you a gift 🎁`,
        iconURL: interaction.user.avatarURL()?.toString(),
      })
      .setDescription(`They gave you ${gift}${Configuration.credits}!`);
    await user.send({
      embeds: [receiverEmbed],
    });

    await interaction.reply(
      Embeds.success("Your gift was sent successfully!\nLet's hope they won't loose it all on blackjack..."),
    );
  }
}
