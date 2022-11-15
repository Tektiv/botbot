import { Request } from '@utils/request.util';
import { User } from 'discord.js';
import { PRIMARY_KEY, SQLite } from 'resources/sqlite/sqlite.service';
import { firstValueFrom } from 'rxjs';
import { NUMBER, Op, STRING, UUID } from 'sequelize';
import { RPGDatabase } from '../rpg.database';
import { RPGService } from '../rpg.service';
import { RPGFish, RPGFishes, RPGFishRarity } from './fish.rpg.model';

export type InventoryFishModel = {
  userInventoryId: string;
  fish: string;
  quantity: number;
};

export class RPGFishService {
  static fishes: RPGFishes = new RPGFishes();

  static async init() {
    const fishesJSON = await firstValueFrom(
      Request.get('https://raw.githubusercontent.com/alexislours/ACNHAPI/master/fish.json'),
    );

    this.fishes = new RPGFishes(
      ...Object.entries(JSON.parse(fishesJSON)).map(([name, data]: [string, any]) => new RPGFish(name, data)),
    );

    RPGDatabase.fishInventory = SQLite.sequelize.define('inventory_fish', {
      id: PRIMARY_KEY,
      userInventoryId: UUID,
      fish: STRING,
      quantity: { type: NUMBER, defaultValue: 0 },
    });
  }

  static actions = {
    fish: async (user: User): Promise<RPGFish> => {
      const fish = this.fishes
        .available()
        .of.rarity(Object.values(RPGFishRarity).pickOneUsingWeight([100, 20, 5, 1]))
        .pickOne();
      await this.patch.userFish.add(user, fish);
      return fish;
    },
    trade: async (trade1: { user: User; fish: RPGFish }, trade2: { user: User; fish: RPGFish }): Promise<boolean> => {
      try {
        await this.patch.userFish.add(trade1.user, trade2.fish);
        await this.patch.userFish.add(trade2.user, trade1.fish);

        await this.patch.userFish.remove(trade1.user, trade1.fish);
        await this.patch.userFish.remove(trade2.user, trade2.fish);
        return true;
      } catch (_) {
        return false;
      }
    },
  };

  static get = {
    fishesFromUser: async (user: User): Promise<(RPGFish & { quantity: number })[]> => {
      const userInventoryId = await SQLite.getId(RPGService.getUser.inventory(user));
      const fishes = await RPGDatabase.fishInventory.findAll({
        where: { userInventoryId, quantity: { [Op.gt]: 0 } },
        attributes: ['quantity', ['fish', 'name']],
      });

      return fishes.map((fishEntry) => {
        const fish: any = this.fishes.find((fish) => fish.name === fishEntry.get('name'));
        fish.quantity = fishEntry.get('quantity');
        return fish;
      });
    },
  };

  static count = {
    fishOccurences: async (fish: RPGFish): Promise<number> => {
      const fishes = await RPGDatabase.fishInventory.findAll({
        where: { fish: fish.name },
        attributes: ['quantity'],
      });

      return fishes.reduce((sum, fishEntry) => sum + <number>fishEntry.get('quantity'), 0);
    },
  };

  static patch = {
    userFish: {
      add: async (user: User, fish: RPGFish) => {
        const userInventoryId = await SQLite.getId(RPGService.getUser.inventory(user));
        let fishEntry = await RPGDatabase.fishInventory.findOne({
          where: { userInventoryId, fish: fish.name },
        });
        if (!fishEntry) {
          fishEntry = await RPGDatabase.fishInventory.create({
            userInventoryId,
            fish: fish.name,
          });
        }
        await fishEntry.increment('quantity');
      },
      remove: async (user: User, fish: RPGFish) => {
        const userInventoryId = await SQLite.getId(RPGService.getUser.inventory(user));
        const fishEntry = await RPGDatabase.fishInventory.findOne({
          where: { userInventoryId, fish: fish.name },
        });
        if (!fishEntry) {
          return;
        }
        await fishEntry.decrement('quantity');
      },
    },
  };
}
