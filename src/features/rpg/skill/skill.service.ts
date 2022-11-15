import { User } from 'discord.js';
import { PRIMARY_KEY, SQLite } from 'resources/sqlite/sqlite.service';
import { NUMBER, STRING } from 'sequelize';
import { RPGDatabase } from '../rpg.database';
import { RPGService } from '../rpg.service';
import { Skill } from './skill.model';

export class RPGSkillService {
  static async init() {
    RPGDatabase.skills = SQLite.sequelize.define('user_skill', {
      id: PRIMARY_KEY,
      user: STRING,
      skill: STRING,
      xp: { type: NUMBER, defaultValue: 0 },
    });
  }

  static utils = {
    xpToLevel: (xp: number): number => Math.min(100, Math.floor(Math.sqrt(2 * xp + 25) / 10 - 1 / 2)),
    levelToXp: (level: number): number => 50 * level * (level + 1),

    progression: (xp: number): number => {
      const level = this.utils.xpToLevel(xp);
      if (level === 100) {
        return 10;
      }
      const xpLimit = { low: this.utils.levelToXp(level), high: this.utils.levelToXp(level + 1) };
      return (xp - xpLimit.low) / (xpLimit.high - xpLimit.low);
    },
  };

  static patch = {
    addXp: async (user: User, skill: Skill, value: number) => {
      const skillEntry = await RPGService.getUser.skill(user, skill);
      return await skillEntry.update({ xp: <number>skillEntry.get('xp') + value });
    },
  };
}
