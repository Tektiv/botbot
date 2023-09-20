import { DateUtils } from '@utils/date.util';
import { User } from 'discord.js';
import { PRIMARY_KEY, SQLite } from 'resources/sqlite/sqlite.service';
import { DATE, NUMBER, STRING } from 'sequelize';
import { CasinoDatabase } from '../casino.database';
import { CasinoService } from '../casino.service';

export type CasinoStreakModel = {
  user: string;
  streak?: number;
  last?: Date;
};

export class CasinoStreakService {
  static async init() {
    CasinoDatabase.streak = SQLite.sequelize.define('casino_streak', {
      id: PRIMARY_KEY,
      user: STRING,
      streak: { type: NUMBER, defaultValue: 0 },
      last: { type: DATE, defaultValue: null },
    });
  }

  static actions = {
    daily: async (user: User): Promise<boolean> => {
      const timestamp = new Date();
      const streakEntry = await CasinoService.getUser.streak(user);
      const lastStreak = streakEntry.get('last') as Date;
      let streakCount = 1;

      if (lastStreak != null) {
        const difference = DateUtils.dateDifferenceInDays(lastStreak, timestamp);
        if (difference <= 0) {
          return false;
        }

        streakCount = streakEntry.get('streak') as number;
        if (difference === 1) {
          streakCount += 1;
        } else {
          streakCount = 1;
        }
      }

      streakEntry.set('streak', streakCount);
      streakEntry.set('last', timestamp);
      await streakEntry.save();

      return true;
    },
  };
}
