import { User } from 'discord.js';
import { CasinoDatabase } from './casino.database';
import { CasinoStreakService } from './streak/streak.service';
import { ConsoleHelper, Logger } from '@utils/logger';

export class CasinoService {
  static async init() {
    await this._init.streak();

    Logger.log(`${ConsoleHelper.Check} Casino`);
  }

  private static _init = {
    streak: async () => {
      await CasinoStreakService.init();
      await CasinoDatabase.streak.sync();
    },
  };

  static getUser = {
    streak: async (user: User) => {
      let streak = await CasinoDatabase.streak.findOne({ where: { user: user.id } });
      if (!streak) {
        streak = await CasinoDatabase.streak.create({ user: user.id });
      }
      return streak;
    },
  };
}
