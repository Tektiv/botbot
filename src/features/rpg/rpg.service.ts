import { User } from 'discord.js';
import { Op } from 'sequelize';
import { RPGFishService } from './fish/fish.rpg.service';
import { RPGInventoryService } from './inventory/inventory.service';
import { RPGDatabase } from './rpg.database';
import { Skills } from './skill/skill.model';
import { RPGSkillService } from './skill/skill.service';

export class RPGService {
  static async init() {
    await this._init.inventory();
    await this._init.fish();

    await this._init.skills();
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

    skills: async () => {
      await RPGSkillService.init();
      await RPGDatabase.skills.sync();
    },
  };

  static getUser = {
    inventory: async (user: User) => {
      let inventory = await RPGDatabase.inventory.findOne({ where: { user: user.id } });
      if (!inventory) {
        inventory = await RPGDatabase.inventory.create({ user: user.id });
      }
      return inventory;
    },

    skill: async (user: User, skill: Skills) => {
      let skillEntry = await RPGDatabase.skills.findOne({ where: { user: user.id, skill } });
      if (!skillEntry) {
        skillEntry = await RPGDatabase.skills.create({ user: user.id, skill });
      }
      return skillEntry;
    },
    skills: async (user: User) => await RPGDatabase.skills.findAll({ where: { user: user.id, xp: { [Op.gt]: 0 } } }),
  };
}
