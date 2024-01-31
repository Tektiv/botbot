import { MathUtils } from '@utils/math.util';
import { ArgsOf } from 'discordx';
import { MessageTrigger, MessageTriggerAction } from './trigger.model';

const TriggerRegExps: Record<string, RegExp> = {
  TOUT_OUBLIER: /tout (?:[A-Z\-']+(er|é))+/i,
  ORELSAN_QUETE: /(\d+) ?ans/i,
};

export const MessageTriggerList: MessageTrigger[] = [
  {
    regexp: /^salut$/i,
    action: MessageTriggerAction.CHANNEL_MESSAGE,
    args: ['salut'],
    twinLetters: false,
  },
  {
    regexp: /^suis(-| )moi$/i,
    action: MessageTriggerAction.CHANNEL_MESSAGE,
    args: ['ok'],
    twinLetters: false,
  },
  { regexp: /^pr(ou)?t$/, action: MessageTriggerAction.CHANNEL_MESSAGE, args: ['hehehe'] },
  {
    regexp: /vache/i,
    action: MessageTriggerAction.CHANNEL_MESSAGE,
    args: ['suivre une vache ?'],
  },
  {
    regexp: TriggerRegExps.TOUT_OUBLIER,
    action: MessageTriggerAction.FUNCTION,
    args: [toutOublier],
  },
  {
    regexp: TriggerRegExps.ORELSAN_QUETE,
    action: MessageTriggerAction.FUNCTION,
    args: [orelsanQuete],
  },
  {
    regexp: /j'ai faim/i,
    action: MessageTriggerAction.FUNCTION,
    args: [hungry],
  },
  {
    regexp: /^oui$/,
    action: MessageTriggerAction.CHANNEL_MESSAGE,
    args: ['le footballeur ?'],
  },
];

async function toutOublier([message]: ArgsOf<'messageCreate'>): Promise<void> {
  await message.channel.send(
    `_touuut, il faudrait ${message.content.match(TriggerRegExps.TOUT_OUBLIER)![0].toLowerCase().replace(/é$/, 'er')}_`,
  );
}

async function orelsanQuete([message]: ArgsOf<'messageCreate'>) {
  const match = message.content.match(TriggerRegExps.ORELSAN_QUETE);
  const age = +match![1];
  const next = age + MathUtils.random(1, 3);

  await message.channel.send(`_à ${age} ans j'voulais juste en avoir ${next}_`);
}

async function hungry([message]: ArgsOf<'messageCreate'>) {
  const nextMeal = new Date();
  if (nextMeal.getHours() >= 20) {
    nextMeal.setDate(nextMeal.getDate() + 1);
  }
  if (nextMeal.getHours() >= 12 && nextMeal.getHours() < 20) {
    nextMeal.setHours(20, 0, 0);
  } else {
    nextMeal.setHours(12, 0, 0);
  }

  const diff = Math.abs(nextMeal.getTime() - new Date().getTime());
  const hours = Math.floor(Math.abs(diff) / 1000 / (60 * 60));
  const minutes = Math.floor(Math.abs(diff) / 1000 / 60) % 60;
  const seconds = Math.floor((Math.abs(diff) / 1000) % 60);

  if (hours === 0 && minutes === 0) {
    message.channel.send(`seulement ${seconds} secoooondes !! c'est bientot du cuuuul`);
  } else if (hours === 0 && minutes <= 10) {
    message.channel.send(`${minutes}' ${seconds}" turkish !`);
  } else if (hours === 0 && minutes <= 20) {
    message.channel.send(`${minutes} minutes et ${seconds} secondes restantes, on y est presque !`);
  } else if (hours === 0 && minutes <= 30) {
    message.channel.send(`il reste ${minutes} minutes et ${seconds} secondes, si près mais pourtant si loin...`);
  } else {
    message.channel.send(
      `il reste ${hours} heures, ${minutes} minutes et ${seconds} secondes, on a jamais été aussi proche`,
    );
  }
}
