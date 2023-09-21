export class DateUtils {
  /**
   * Returns
   * - -1:&nbsp; &nbsp;&nbsp;date1 is greater
   * - &nbsp;0: &nbsp;&nbsp;dates are equal
   * - &nbsp;1: &nbsp;&nbsp;date2 is greater
   */
  static compare(date1: Date, date2: Date): number {
    return Math.sign(date2.getTime() - date1.getTime());
  }

  static dateDifferenceInDays(date1: Date, date2: Date): number {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  static getMonthNumberFromName(month: string): number {
    return new Date(Date.parse(`${month} 1, 2000`)).getMonth() + 1;
  }

  static getHourNumberFromFormat(hour: string): number {
    return (parseInt(hour) + (hour.includes('PM') ? 12 : 0)) % 24;
  }
}
