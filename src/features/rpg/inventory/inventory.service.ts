import { User } from 'discord.js';
import { PRIMARY_KEY, SQLite } from 'resources/sqlite/sqlite.service';
import { NUMBER, STRING } from 'sequelize';
import { RPGDatabase } from '../rpg.database';
import { RPGService } from '../rpg.service';

export type InventoryModel = {
  user: string;
  balance?: number;
};

export class RPGInventoryService {
  static async init() {
    RPGDatabase.inventory = SQLite.sequelize.define('user_inventory', {
      id: PRIMARY_KEY,
      user: STRING,
      balance: { type: NUMBER, defaultValue: 0 },
    });
  }

  static patch = {
    balance: {
      add: async (user: User, amount: number) => {
        const inventoryEntry = await RPGService.getUser.inventory(user);
        await inventoryEntry.increment('balance', { by: amount });
      },
    },
  };
}
