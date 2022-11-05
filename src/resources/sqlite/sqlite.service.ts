import { IConfig } from 'assets/config/config.model';
import { Config } from 'assets/config/config.service';
import { Model, ModelStatic, Sequelize, UUID, UUIDV4 } from 'sequelize';

export type DATABASE<MODEL extends Record<string, any>, CONSTRUCTOR extends Record<string, any> = MODEL> = ModelStatic<
  Model<MODEL, CONSTRUCTOR>
>;
export const PRIMARY_KEY = { type: UUID, defaultValue: UUIDV4, primaryKey: true };

export class SQLite {
  static sequelize: Sequelize;

  static init() {
    const sqliteConfig = Config.get<IConfig['SQLITE']>('SQLITE');
    SQLite.sequelize = new Sequelize('botbot_db', sqliteConfig.USER, sqliteConfig.PASSWORD, {
      host: sqliteConfig.HOST ?? 'localhost',
      dialect: 'sqlite',
      logging: false,
      storage: 'src/resources/sqlite/database.sqlite',
    });
  }

  static async getId<T extends Record<string, any>, U extends Record<string, any> = T>(
    model: Model<T, U> | Promise<Model<T, U>>,
  ) {
    if (model instanceof Promise) {
      return (<string>await (await model).get('id'))!;
    } else {
      return (<string>await model.get('id'))!;
    }
  }
}
