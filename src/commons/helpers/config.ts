import { Embeds } from 'commons/discord/embeds.discord';
import { CommandInteraction } from 'discord.js';
import { Environment } from './environment';

type Feature = 'emoji' | 'fish' | 'music';

export class Configuration {
  static credits = Environment.get('CREDITS_NAME').value;

  static checkIfFeatureIsEnabled = (feature: Feature, interaction?: CommandInteraction): boolean => {
    const isEnabled = Environment.get(`${feature.toUpperCase()}_ENABLED`).value === 'true';
    if (!isEnabled && interaction != null) {
      interaction.reply(Embeds.error(`\`/${interaction.commandName}\` is not enabled on this server`));
    }
    return isEnabled;
  };
}
