import { EmbedBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { RPGService } from './rpg.service';
import { Skill, SkillsData } from './skill/skill.model';
import { RPGSkillService } from './skill/skill.service';

export class RPGInteraction {
  static async checkForLevelUp(interaction: CommandInteraction, skill: Skill, xp: number) {
    const skillData = SkillsData[skill];

    const levels = {
      current: RPGSkillService.utils.xpToLevel(
        <number>(await RPGService.getUser.skill(interaction.user, skill)).get('xp'),
      ),
      new: RPGSkillService.utils.xpToLevel(
        <number>(await RPGSkillService.patch.addXp(interaction.user, skill, xp)).get('xp'),
      ),
    };
    if (levels.new > levels.current) {
      const levelUpEmbed = new EmbedBuilder()
        .setAuthor({ name: 'Level up!', iconURL: 'https://i.imgur.com/AkPIGBW.png' })
        .setDescription(`Your ${skillData.emoji} **${skillData.label}** level is now **${levels.new}**!`);

      if (interaction.replied) {
        interaction.followUp({ embeds: [levelUpEmbed], ephemeral: true });
      } else {
        interaction.reply({ embeds: [levelUpEmbed], ephemeral: true });
      }
    }
  }
}
