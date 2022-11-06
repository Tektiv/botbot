import { ObjectUtils } from '@utils/object.util';
import { Request } from '@utils/request.util';
import { Config } from 'assets/config/config.service';
import { Guild, GuildEmoji } from 'discord.js';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

export class EmojiService {
  static emojisRepo: Record<string, string> = {};

  static async init() {
    this.emojisRepo = await firstValueFrom(
      Request.get(`${Config.get('CUSTOM_EMOJI.URL', '')}/latest?meta=false`, {
        headers: {
          'X-Master-Key': Config.get('CUSTOM_EMOJI.KEY', ''),
        },
      }).pipe(
        map((result: Record<string, string>) =>
          ObjectUtils.fromEntries(Object.entries(result).map(([name, url]) => [name.remove(':'), url])),
        ),
      ),
    );
  }

  static async push(name: string, url: string): Promise<void> {
    this.emojisRepo = await firstValueFrom(
      Request.put(
        `${Config.get('CUSTOM_EMOJI.URL', '')}`,
        {
          ...this.emojisRepo,
          [name.remove(':')]: url,
        },
        {
          headers: { 'X-Master-Key': Config.get('CUSTOM_EMOJI.KEY', '') },
        },
      ).pipe(
        map((response: Record<string, string>) =>
          ObjectUtils.fromEntries(Object.entries(response.record).map(([name, url]) => [name.remove(':'), url])),
        ),
      ),
    );
  }

  static async replaceEmojis(text: string, guild: Guild): Promise<string> {
    const emojis: Record<string, string> = {};

    await Promise.all(
      text
        .split(' ')
        .filter((word) => this.emojisRepo[word.remove(':')] != null)
        .removeDuplicates()
        .map(async (name) => {
          if (!emojis[name]) {
            emojis[name] = await this.addToGuild(guild, name);
          }
        }),
    );
    Object.entries(emojis).forEach(([name, emoji]) => (text = text.replace(new RegExp(name, 'g'), emoji)));
    return text;
  }

  static async addToGuild(guild: Guild, name: string): Promise<string> {
    return new Promise(async (resolve) => {
      const emoji = await guild.emojis.create({
        name: name.remove(':'),
        attachment: this.emojisRepo[name.remove(':')],
      });
      resolve(emoji.toString());
    });
  }

  static removeFromGuild(guild: Guild, id: string): Promise<GuildEmoji> | undefined {
    return guild.emojis.resolve(id)?.delete();
  }

  static async removeByName(guild: Guild, name: string) {
    await guild.fetch();

    const emoji = guild.emojis.cache.find((emoji) => emoji.name === name);
    if (emoji) {
      return this.removeFromGuild(guild, emoji?.id!);
    }
  }
}

export async function Emoji(name: string, guild: Guild): Promise<string> {
  await guild.fetch();

  return (
    guild.emojis.cache.find((emoji) => emoji.name === name.remove(':')) ||
    (EmojiService.emojisRepo[name.remove(':')] != null ? await EmojiService.replaceEmojis(name, guild) : name)
  ).toString();
}

// type EmojiModel = {
//   name: string;
//   url: string;
// };

// export class EmojiService2 {
//   // static customEmojis: Record<string, string> = {};
//   static database: ModelStatic<Model<EmojiModel, EmojiModel>>;

//   static async init() {
//     this.database = SQLite.sequelize.define('emoji', {
//       name: STRING,
//       url: STRING,
//     });
//     await this.database.sync();

//     this.customEmojis = this.database.findAll();

//     this.customEmojis = await firstValueFrom(
//       Request.get(`${Config.get('CUSTOM_EMOJI.URL', '')}/latest?meta=false`, {
//         headers: {
//           'X-Master-Key': Config.get('CUSTOM_EMOJI.KEY', ''),
//         },
//       }).pipe(
//         map((result: Record<string, string>) =>
//           ObjectUtils.fromEntries(Object.entries(result).map(([name, url]) => [name.remove(':'), url])),
//         ),
//       ),
//     );
//   }

//   static async push(name: string, url: string): Promise<void> {
//     this.customEmojis = await firstValueFrom(
//       Request.put(
//         `${Config.get('CUSTOM_EMOJI.URL', '')}`,
//         {
//           ...this.customEmojis,
//           [name.remove(':')]: url,
//         },
//         {
//           headers: { 'X-Master-Key': Config.get('CUSTOM_EMOJI.KEY', '') },
//         },
//       ).pipe(
//         map((response: Record<string, string>) =>
//           ObjectUtils.fromEntries(Object.entries(response.record).map(([name, url]) => [name.remove(':'), url])),
//         ),
//       ),
//     );
//   }

//   static async replaceEmojis(text: string, guild: Guild): Promise<string> {
//     const emojis: Record<string, string> = {};

//     await Promise.all(
//       text
//         .split(' ')
//         .filter((word) => this.customEmojis[word.remove(':')] != null)
//         .removeDuplicates()
//         .map(async (name) => {
//           if (!emojis[name]) {
//             emojis[name] = await this.addToGuild(guild, name);
//           }
//         }),
//     );
//     Object.entries(emojis).forEach(([name, emoji]) => (text = text.replace(new RegExp(name, 'g'), emoji)));
//     return text;
//   }

//   static async addToGuild(guild: Guild, name: string): Promise<string> {
//     return new Promise(async (resolve) => {
//       const emoji = await guild.emojis.create({
//         name: name.remove(':'),
//         attachment: this.customEmojis[name.remove(':')],
//       });
//       resolve(emoji.toString());
//     });
//   }

//   static removeFromGuild(guild: Guild, name: string): Promise<GuildEmoji> | undefined {
//     return guild.emojis.resolve(name)?.delete();
//   }

//   static get(name: string) {
//     return this.database.findOne({ where: { name } });
//   }
// }
