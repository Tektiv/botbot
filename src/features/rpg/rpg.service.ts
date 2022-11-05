import { DATABASE, PRIMARY_KEY, SQLite } from 'resources/sqlite/sqlite.service';
import { STRING } from 'sequelize';
import { RPGFishService } from './fish/fish.rpg.service';

type InventoryModel = {
  user: string;
};

export class RPGService {
  static inventoryDB: DATABASE<InventoryModel>;

  static async init() {
    this.inventoryDB = SQLite.sequelize.define('user_inventory', {
      id: PRIMARY_KEY,
      user: STRING,
    });
    this.inventoryDB.sync();

    await this._init.fish();
  }

  static _init = {
    fish: async () => {
      await RPGFishService.init();
      this.inventoryDB.hasMany(RPGFishService.fishInventoryDB);
      RPGFishService.fishInventoryDB.belongsTo(this.inventoryDB);
      await RPGFishService.fishInventoryDB.sync();
    },
  };

  static inventory = {
    getByUser: async (user: string) => {
      let inventory = await this.inventoryDB.findOne({ where: { user } });
      if (!inventory) {
        inventory = await this.inventoryDB.create({ user });
      }
      return inventory;
    },
  };
}
