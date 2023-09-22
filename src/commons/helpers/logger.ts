export const ConsoleFont = {
  _Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',
  FgGrey: '\x1b[90m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m',
  BgGray: '\x1b[100m',
};

export const ConsoleHelper = {
  Check: `${ConsoleFont.FgGreen}✔${ConsoleFont._Reset}`,
  Error: `${ConsoleFont.FgRed}✗${ConsoleFont._Reset}`,
};

export type LoggerType = 'log' | 'debug' | 'warn' | 'error';

const Colors = {
  debug: ConsoleFont.FgMagenta,
  log: ConsoleFont.FgCyan,
  warn: ConsoleFont.FgYellow,
  error: ConsoleFont.FgRed,
};

const Shortens = {
  debug: 'dbug',
  log: 'info',
  warn: 'warn',
  error: 'eror',
};

export class Logger {
  private static groups: { type: LoggerType; name: string }[] = [];

  private static message(type: LoggerType, message: string) {
    const lines = message.split('\n').map((line, index) => {
      let lineWithTabs = `${ConsoleFont._Reset}${line}`;
      if (this.groups.length > 0) {
        lineWithTabs = `${'  '.repeat(this.groups.length - 1)}${ConsoleFont.FgGrey}┃ ${lineWithTabs}`;
      }

      const parts = [
        index === 0 ? `${ConsoleFont.FgGrey}${new Date().toLocaleTimeString('fr')}` : ' '.repeat(8),
        (this.groups.length === 0 || type !== this.groups.last.type) && index === 0
          ? `${Colors[type]}[${Shortens[type]}]`
          : ' '.repeat(6),
        lineWithTabs,
      ];
      return parts.join(' ');
    });

    console[type](lines.join('\n'));
  }

  static debug(message: string) {
    this.message('debug', message);
  }

  static log(message: string) {
    this.message('log', message);
  }

  static warn(message: string) {
    this.message('warn', message);
  }

  static error(message: string) {
    this.message('error', message);
  }

  static group(type: LoggerType, name: string) {
    this[type](name);
    this.groups.push({ type, name });
  }

  static degroup() {
    this.groups.pop();
  }
}
