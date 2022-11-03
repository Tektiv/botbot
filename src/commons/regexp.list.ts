export class RegExps {
  static emojis = /:\w+:/g;
  static customEmojis = /<a?:\w+:\d+>/g;
  static customEmoji = /<a?:(\w+):(\d+)>/;
  static url = /^https?\:\/\//;
  static notUrl = /^(?!https?\:\/\/)/;
}
