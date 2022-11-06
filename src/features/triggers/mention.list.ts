import { MessageTrigger, MessageTriggerAction } from './trigger.model';

export const MessageMentionList: MessageTrigger[] = [
  {
    regexp: /(c|ç)a va/,
    action: MessageTriggerAction.CHANNEL_MESSAGE,
    args: ['eh beh écoute, ça va bien ouais', 'mmh... pas foufou'],
  },
  {
    regexp: /t('|u )es/,
    action: MessageTriggerAction.CHANNEL_MESSAGE,
    args: ['va à la merde', 'ça me fait plaisir ce que tu me dis là', "j'allais te dire la même chose", 'merci'],
  },
  {
    regexp: /\?/,
    action: MessageTriggerAction.CHANNEL_MESSAGE,
    args: ['oui', 'non', "t'aimerais bien savoir hein ?"],
  },
];
