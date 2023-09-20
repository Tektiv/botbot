import { User } from 'discord.js';
import { CasinoDatabase } from './casino.database';
import { CasinoStreakService } from './streak/streak.service';

export class CasinoService {
  static async init() {
    await this._init.streak();

    console.log('Casino init');
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
