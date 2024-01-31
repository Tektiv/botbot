import { EmbedBuilder } from 'discord.js';

export const Embeds = {
  success: (...message: string[]) => ({
    embeds: [
      new EmbedBuilder()
        .setColor('#4CAF4F')
        .setAuthor({ name: 'Success', iconURL: 'https://i.imgur.com/861VWre.png' })
        .setDescription(message.join('/n')),
    ],
    ephemeral: true,
  }),

  error: (...message: string[]) => ({
    embeds: [
      new EmbedBuilder()
        .setColor('#E24C4B')
        .setAuthor({ name: 'Error', iconURL: 'https://i.imgur.com/nmknsmv.png' })
        .setDescription(message.join('/n')),
    ],
    ephemeral: true,
  }),

  nope: (...message: string[]) => ({
    embeds: [new EmbedBuilder().setTitle('🚫  Nope').setDescription(message.join('\n'))],
    ephemeral: true,
  }),
};
