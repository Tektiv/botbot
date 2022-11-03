import '@extensions/array.extension';
import '@extensions/string.extension';

import { importx } from '@discordx/importer';
import type { Interaction, Message } from 'discord.js';
import { IntentsBitField } from 'discord.js';
import { Client } from 'discordx';
import { EmojiService } from 'features/emoji/emoji.service';
import { AnimalCrossingService } from 'features/acnh/acnh.service';
import { Config } from 'assets/config/config.service';

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.Guilds,
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
  // await bot.guilds.fetch();

  // Synchronize applications commands with Discord
  await bot.initApplicationCommands();

  Config.load();
  await EmojiService.init();
  await AnimalCrossingService.init();

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

  Config.load();
  const BOT_TOKEN = Config.get('BOT_TOKEN', '');
  if (!BOT_TOKEN) {
    throw Error('Could not find BOT_TOKEN in your environment');
  }
  await bot.login(BOT_TOKEN);
}

run();
