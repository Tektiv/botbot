import '@extensions/array.extension';
import '@extensions/string.extension';

import { importx } from '@discordx/importer';
import { Environment } from '@helpers/environment';
import { ConsoleHelper, Logger } from '@helpers/logger';
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
});

bot.once('ready', async () => {
  // Make sure all guilds are cached
  Logger.group('log', 'Bot syncs...');
  await bot.guilds.fetch();
  Logger.log(`${ConsoleHelper.Check} Guilds`);
  await bot.initApplicationCommands();
  Logger.log(`${ConsoleHelper.Check} Commands`);
  Logger.degroup();

  await EmojiService.init();

  Logger.group('log', 'Databases initialisation...');
  await RPGService.init();
  await CasinoService.init();
  Logger.degroup();

  // To clear all guild commands, uncomment this line,
  // This is useful when moving from guild commands to global commands
  // It must only be executed once
  //
  //  await bot.clearApplicationCommands(
  //    ...bot.guilds.cache.map((g) => g.id)
  //  );

  Logger.log('Bot initialised\nReady to roll!');
});

bot.on('error', (error) => {
  Logger.group('error', `${error.name} - ${error.message}`);
  if (error.stack) {
    Logger.error(error.stack);
  }
  Logger.degroup();
});

bot.on('warn', (message) => Logger.warn(message));

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
    Logger.error('Could not find DISCORD_TOKEN\nCheck your .env file to make sure the value is set');
    process.exit(1);
  }

  SQLite.init();
  Logger.log('SQLite initialised');

  await bot.login(BOT_TOKEN);
}

run();
