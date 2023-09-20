import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { RPGService } from '../rpg.service';

@Discord()
export class InventorySlash {
  @Slash({ description: 'Comme dirait Tony Parker...' })
  async balance(interaction: CommandInteraction) {
    const inventory = await RPGService.getUser.inventory(interaction.user);
    const balance = inventory.get('balance') as number;

    const inventoryEmbed = new EmbedBuilder()
      .setTitle('💰 Balance')
      .setDescription(`You have ${balance.toLocaleString('en-GB')} ¢`);

    interaction.reply({
      embeds: [inventoryEmbed],
      ephemeral: true,
    });
  }
}
