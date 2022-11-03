export enum MessageTriggerAction {
  CHANNEL_MESSAGE,
  FUNCTION,
  REACT,
}

export type MessageTrigger = {
  regexp: RegExp;
  action: MessageTriggerAction;
  args: any[];
  twinLetters?: boolean;
};
