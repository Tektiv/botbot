import '@extensions/array.extension';
import '@extensions/string.extension';

import { importx } from '@discordx/importer';
import { Environment } from '@utils/env.util';
import type { Interaction, Message } from 'discord.js';
import { IntentsBitField } from 'discord.js';
import { Client } from 'discordx';
import 'dotenv/config';
import { CasinoService } from 'features/casino/casino.service';
import { EmojiService } from 'features/emoji/emoji.service';
import { RPGService } from 'features/rpg/rpg.service';
import { SQLite } from 'resources/sqlite/sqlite.service';

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
  ],

  silent: false,

  simpleCommand: {
    prefix: '!',
  },
});

bot.once('ready', async () => {
  // Make sure all guilds are cached
  await bot.guilds.fetch();

  // Synchronize applications commands with Discord
  await bot.initApplicationCommands();

  await EmojiService.init();

  await RPGService.init();
  await CasinoService.init();

  // To clear all guild commands, uncomment this line,
  // This is useful when moving from guild commands to global commands
  // It must only be executed once
  //
  //  await bot.clearApplicationCommands(
  //    ...bot.guilds.cache.map((g) => g.id)
  //  );

  console.log('Bot started');
});

bot.on('interactionCreate', (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on('messageCreate', (message: Message) => {
  bot.executeCommand(message);
});

async function run() {
  await importx(__dirname + '/{events,commands,features, assets}/**/*.{ts,js}');

  const BOT_TOKEN = Environment.get('DISCORD_TOKEN').value;
  if (!BOT_TOKEN) {
    throw Error('Could not find BOT_TOKEN in your environment');
  }

  SQLite.init();

  await bot.login(BOT_TOKEN);
}

run();
