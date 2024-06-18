import { MessageTrigger, MessageTriggerAction } from './trigger.model';

export const MessageMentionList: MessageTrigger[] = [
  {
    regexp: /(c|ç)a va/i,
    action: MessageTriggerAction.CHANNEL_MESSAGE,
    args: ['eh beh écoute, ça va bien ouais', 'mmh... pas foufou'],
  },
  {
    regexp: /t('|u )es/i,
    action: MessageTriggerAction.CHANNEL_MESSAGE,
    args: ['va à la merde', 'ça me fait plaisir ce que tu me dis là', 'merci'],
  },
  {
    regexp: /\?/i,
    action: MessageTriggerAction.CHANNEL_MESSAGE,
    args: ['ouais', 'neh', "t'aimerais bien savoir hein ?", 'oé', "j'ai pas les mots"],
  },
  // {
  //   regexp: /(salut|coucou|bonjour)/i,
  //   action: MessageTriggerAction.REACT,
  //   args: ['ralph'],
  // },
  {
    regexp: /^merci/i,
    action: MessageTriggerAction.REACT,
    args: ['nod'],
  },
];
