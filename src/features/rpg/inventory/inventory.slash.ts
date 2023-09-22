import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { RPGService } from '../rpg.service';
import { Configuration } from 'commons/helpers/config';

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
}
