import { firstValueFrom, timer } from 'rxjs';

export class Utils {
  static async sleep(milliseconds: number): Promise<void> {
    await firstValueFrom(timer(milliseconds));
    return;
  }
}
