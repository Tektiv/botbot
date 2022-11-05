import { Request } from '@utils/request.util';
import { User } from 'discord.js';
import { DATABASE, PRIMARY_KEY, SQLite } from 'resources/sqlite/sqlite.service';
import { firstValueFrom } from 'rxjs';
import { NUMBER, Optional, STRING, UUID } from 'sequelize';
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

  static async fish(user: User) {
    const fish = this.fishRepo.pickOneUsingWeight(this.fishRepo.map((fish) => fish.weight));

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

    return fish;
  }
}
