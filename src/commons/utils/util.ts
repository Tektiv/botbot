import { firstValueFrom, timer } from 'rxjs';

export class Utils {
  static async sleep(milliseconds: number): Promise<void> {
    await firstValueFrom(timer(milliseconds));
    return;
  }

  static getValue(obj: Record<any, any>, path: string, defaultValue: any = null) {
    if (path === '') {
      return obj || defaultValue;
    }
    return path.split('.').reduce((r, val) => (r ? r[val] : defaultValue), obj);
  }
}
