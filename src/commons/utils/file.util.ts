import { existsSync, readFileSync, writeFileSync } from 'fs';

export class FileUtils {
  static exists(path: string): boolean {
    try {
      return existsSync(path);
    } catch (_) {
      return false;
    }
  }

  static json = {
    create: (path: string, content: string): boolean => {
      try {
        writeFileSync(path, content, 'utf8');
        return true;
      } catch (_) {
        return false;
      }
    },
    read: <T = Record<string, any>>(path: string): T | undefined => {
      try {
        return JSON.parse(readFileSync(path, 'utf8'));
      } catch (_) {
        return undefined;
      }
    },
  };
}
