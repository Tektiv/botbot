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
import { RPGService } from '../rpg.service';
import { Skills } from '../skill/skill.model';
import { RPGSkillService } from '../skill/skill.service';
import { RPGFishService } from './fish.rpg.service';

@Discord()
export class RPGFishSlash {
  @Slash({ description: "Hope you'll catch something nice!" })
  async fish(interaction: CommandInteraction) {
    const fish = await RPGFishService.actions.fish(interaction.user);

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`🎣 ${fish.catch.phrase}`)
      .setDescription(fish.catch.joke)
      .addFields({ name: 'Rarity', value: `${fish.rarityTo.symbol()} ${fish.rarity}` })
      .setThumbnail(fish.icon);

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      new ButtonBuilder().setLabel('Share').setStyle(ButtonStyle.Secondary).setCustomId('fish_caught_share'),
    );

    const reply = await interaction.reply({
      embeds: [embed],
      // components: [row],
      // ephemeral: true,
    });

    const fishingLevel = {
      current: RPGSkillService.utils.xpToLevel(
        <number>(await RPGService.getUser.skill(interaction.user, Skills.FISHING)).get('xp'),
      ),
      new: RPGSkillService.utils.xpToLevel(
        <number>(await RPGSkillService.patch.addXp(interaction.user, Skills.FISHING, fish.rarityTo.xp())).get('xp'),
      ),
    };
    if (fishingLevel.new > fishingLevel.current) {
      const levelUpEmbed = new EmbedBuilder()
        .setAuthor({ name: 'Level up!', iconURL: 'https://i.imgur.com/AkPIGBW.png' })
        .setDescription(`Your 🎣 **Fishing** level is now **${fishingLevel.new}**!`);
      interaction.followUp({ embeds: [levelUpEmbed], ephemeral: true });
    }

    // reply.createMessageComponentCollector().on('collect', (click: ButtonInteraction) => {
    //   const sharedRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    //     new ButtonBuilder()
    //       .setLabel('Shared')
    //       .setStyle(ButtonStyle.Secondary)
    //       .setCustomId('fish_caught_shared')
    //       .setDisabled(true),
    //   );
    //   interaction.editReply({
    //     components: [sharedRow],
    //   });

    //   interaction.channel?.send({
    //     embeds: [
    //       embed.setTitle(`${interaction.user.username} caught a ${fish.name.capitalize()}!`).setDescription(null),
    //     ],
    //   });
    //   click.deferUpdate();
    // });
  }
}
