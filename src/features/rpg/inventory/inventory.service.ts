import { PRIMARY_KEY, SQLite } from 'resources/sqlite/sqlite.service';
import { STRING } from 'sequelize';
import { RPGDatabase } from '../rpg.database';

export type InventoryModel = {
  user: string;
};

export class RPGInventoryService {
  static async init() {
    RPGDatabase.inventory = SQLite.sequelize.define('user_inventory', {
      id: PRIMARY_KEY,
      user: STRING,
    });
  }
}
