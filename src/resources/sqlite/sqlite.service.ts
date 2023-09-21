import { Environment } from '@utils/env.util';
import { Model, ModelStatic, Sequelize, UUID, UUIDV4 } from 'sequelize';

export type DATABASE<MODEL extends Record<string, any>, CONSTRUCTOR extends Record<string, any> = MODEL> = ModelStatic<
  Model<MODEL, CONSTRUCTOR>
>;
export const PRIMARY_KEY = { type: UUID, defaultValue: UUIDV4, primaryKey: true };

export class SQLite {
  static sequelize: Sequelize;

  static init() {
    SQLite.sequelize = new Sequelize(
      'botbot_db',
      Environment.get('SQLITE_USER').value,
      Environment.get('SQLITE_PWD').value,
      {
        host: Environment.get('SQLITE_HOST').or('localhost').value,
        dialect: 'sqlite',
        logging: false,
        storage: 'src/resources/sqlite/database.sqlite',
      },
    );
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
