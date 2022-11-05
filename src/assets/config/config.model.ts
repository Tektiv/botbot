export interface IConfig {
  BOT_TOKEN: string;
  CUSTOM_EMOJI: {
    URL: string;
    KEY: string;
  };
  SQLITE: {
    USER: string;
    PASSWORD: string;
    HOST: string;
  };
}
