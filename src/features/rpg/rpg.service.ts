import { RPGFishService } from './fish/fish.rpg.service';
import { RPGInventoryService } from './inventory/inventory.service';
import { RPGDatabase } from './rpg.database';

export class RPGService {
  static async init() {
    await this._init.inventory();
    await this._init.fish();
  }

  private static _init = {
    inventory: async () => {
      await RPGInventoryService.init();
      await RPGDatabase.inventory.sync();
    },
    fish: async () => {
      await RPGFishService.init();
      RPGDatabase.inventory.hasMany(RPGDatabase.fishInventory);
      RPGDatabase.fishInventory.belongsTo(RPGDatabase.inventory);
      await RPGDatabase.fishInventory.sync();
    },
  };

  static getUser = {
    inventory: async (user: string) => {
      let inventory = await RPGDatabase.inventory.findOne({ where: { user } });
      if (!inventory) {
        inventory = await RPGDatabase.inventory.create({ user });
      }
      return inventory;
    },
  };
}
