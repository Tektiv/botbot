import { Request } from '@utils/request.util';
import { User } from 'discord.js';
import { DATABASE, PRIMARY_KEY, SQLite } from 'resources/sqlite/sqlite.service';
import { firstValueFrom } from 'rxjs';
import { NUMBER, Op, Optional, STRING, UUID } from 'sequelize';
import { RPGService } from '../rpg.service';
import { RPGFish } from './fish.rpg.model';

type InventoryFishModel = {
  userInventoryId: string;
  fish: string;
  quantity: number;
};

export class RPGFishService {
  static fishRepo: RPGFish[] = [];
  static fishInventoryDB: DATABASE<InventoryFishModel, Optional<InventoryFishModel, 'quantity'>>;

  static async init() {
    const fishesJSON = await firstValueFrom(
      Request.get('https://raw.githubusercontent.com/alexislours/ACNHAPI/master/fish.json'),
    );

    this.fishRepo = Object.entries(JSON.parse(fishesJSON)).map(
      ([name, data]: [string, any]) => new RPGFish(name, data),
    );

    this.fishInventoryDB = SQLite.sequelize.define('inventory_fish', {
      id: PRIMARY_KEY,
      userInventoryId: UUID,
      fish: STRING,
      quantity: { type: NUMBER, defaultValue: 0 },
    });
  }

  static fishFromName(name: string): RPGFish | undefined {
    return this.fishRepo.find((fish) => fish.name === name);
  }

  static async fish(user: User): Promise<RPGFish> {
    const fish = this.fishRepo.pickOneUsingWeight(this.fishRepo.map((fish) => fish.weight));
    await this.addFishToUser(user, fish);
    return fish;
  }

  static async tradeFish(
    trade1: { user: User; fish: RPGFish },
    trade2: { user: User; fish: RPGFish },
  ): Promise<boolean> {
    try {
      await this.addFishToUser(trade1.user, trade2.fish);
      await this.addFishToUser(trade2.user, trade1.fish);

      await this.removeFishFromUser(trade1.user, trade1.fish);
      await this.removeFishFromUser(trade2.user, trade2.fish);
      return true;
    } catch (_) {
      return false;
    }
  }

  static async fishesFromUser(user: User): Promise<(RPGFish & { quantity: number })[]> {
    const userInventoryId = await SQLite.getId(RPGService.inventory.getByUser(user.id));
    const fishes = await this.fishInventoryDB.findAll({
      where: { userInventoryId, quantity: { [Op.gt]: 0 } },
      attributes: ['quantity', ['fish', 'name']],
    });

    return fishes.map((fishEntry) => {
      const fish: any = this.fishRepo.find((fish) => fish.name === fishEntry.get('name'));
      fish.quantity = fishEntry.get('quantity');
      return fish;
    });
  }

  static async addFishToUser(user: User, fish: RPGFish) {
    const userInventoryId = await SQLite.getId(RPGService.inventory.getByUser(user.id));
    let fishEntry = await this.fishInventoryDB.findOne({
      where: { userInventoryId, fish: fish.name },
    });
    if (!fishEntry) {
      fishEntry = await this.fishInventoryDB.create({
        userInventoryId,
        fish: fish.name,
      });
    }
    await fishEntry.increment('quantity');
  }

  static async removeFishFromUser(user: User, fish: RPGFish) {
    const userInventoryId = await SQLite.getId(RPGService.inventory.getByUser(user.id));
    const fishEntry = await this.fishInventoryDB.findOne({
      where: { userInventoryId, fish: fish.name },
    });
    if (!fishEntry) {
      return;
    }
    await fishEntry.decrement('quantity');
  }
}
