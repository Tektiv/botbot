import { DATABASE } from 'resources/sqlite/sqlite.service';
import { CasinoStreakModel } from './streak/streak.service';

export class CasinoDatabase {
  static streak: DATABASE<CasinoStreakModel>;
}
