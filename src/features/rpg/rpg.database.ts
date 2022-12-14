import { DATABASE } from 'resources/sqlite/sqlite.service';
import { Optional } from 'sequelize';
import { InventoryFishModel } from './fish/fish.rpg.service';
import { InventoryModel } from './inventory/inventory.service';
import { SkillModel } from './skill/skill.model';

export class RPGDatabase {
  static inventory: DATABASE<InventoryModel>;
  static fishInventory: DATABASE<InventoryFishModel, Optional<InventoryFishModel, 'quantity'>>;

  static skills: DATABASE<SkillModel, Optional<SkillModel, 'xp'>>;
}
