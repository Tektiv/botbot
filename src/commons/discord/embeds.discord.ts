import { EmbedBuilder } from 'discord.js';

export const Embeds = {
  success: (message: string) => ({
    embeds: [
      new EmbedBuilder()
        .setColor('#4CAF4F')
        .setAuthor({ name: 'Success', iconURL: 'https://i.imgur.com/861VWre.png' })
        .setDescription(message),
    ],
    ephemeral: true,
  }),

  error: (message: string) => ({
    embeds: [
      new EmbedBuilder()
        .setColor('#E24C4B')
        .setAuthor({ name: 'Error', iconURL: 'https://i.imgur.com/nmknsmv.png' })
        .setDescription(message),
    ],
    ephemeral: true,
  }),

  warning: (message: string) => ({
    embeds: [
      new EmbedBuilder()
        .setColor('#FEC048')
        .setAuthor({ name: 'Warning', iconURL: 'https://i.imgur.com/hohXFb9.png' })
        .setDescription(message),
    ],
    ephemeral: true,
  }),
};
