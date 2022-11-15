import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { RPGInteraction } from '../rpg.interaction';
import { RPGService } from '../rpg.service';
import { Skill, SkillsData } from './skill.model';
import { RPGSkillService } from './skill.service';

@Discord()
export class SkillSlash {
  @Slash({ description: "Let's see how strong you are..." })
  async skills(interaction: CommandInteraction) {
    const skills = await RPGService.getUser.skills(interaction.user);

    if (skills.length === 0) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('✨ Skills progression')
            .setDescription(
              "You don't have any skills right now.\nYou may get one as soon as you are going on an adventure!",
            ),
        ],
        ephemeral: true,
      });
      return;
    }

    const skillsEmbed = new EmbedBuilder().setDescription('✨ Skills progression');
    skills.forEach((skillEntry) => {
      const skill = <Skill>skillEntry.get('skill');
      const xp = <number>skillEntry.get('xp');
      const skillData = SkillsData[skill];

      const progression = RPGSkillService.utils.progression(xp);
      const stepProgression = Math.floor(progression * 15);
      const percentageProgression = Math.floor(progression * 1000) / 10;

      skillsEmbed.addFields({
        name: `${skillData.emoji} ${skillData.label} - ${RPGSkillService.utils.xpToLevel(xp)}`,
        value: `${'█'.repeat(stepProgression)}${'░'.repeat(15 - stepProgression)} ${percentageProgression}%`,
        inline: true,
      });
    });

    interaction.reply({
      embeds: [skillsEmbed],
      ephemeral: true,
    });
  }
}
