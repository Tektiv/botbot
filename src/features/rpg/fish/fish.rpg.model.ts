import { User } from 'discord.js';
import { RPGService } from '../rpg.service';
import { Skill } from '../skill/skill.model';
import { RPGSkillService } from '../skill/skill.service';
import { ArrayUtils } from '@utils/array.util';
import { DateUtils } from '@utils/date.util';

export enum RPGFishRarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  ULTRA_RARE = 'Ultra-rare',
}

export class RPGFish {
  name: string;
  catch: {
    phrase: string;
    joke: string | undefined;
  };
  rarity: RPGFishRarity;
  price: number;
  icon: string;

  availability: {
    months: number[];
    hours: number[];
  };

  constructor(data: Record<string, any>) {
    this.name = data.name;
    this.rarity = data.rarity;
    this.price = data.sell_nook;
    this.icon = data.image_url;

    const match = data.catchphrases[0].match(new RegExp(`^(.*${this.name}(?:!|\.\.\.)) (.*)$`, 'i'));
    this.catch = {
      phrase: match?.[1] ?? `I caught a ${this.name}!`,
      joke: match?.[2],
    };

    const months = data.north.availability_array
      .map((availability: { months: string }) => availability.months.replace(/ (?!y)/g, ''))
      .join(';');
    const time = data.north.availability_array[0].time.replace(/ (?!d)/g, '');
    this.availability = {
      months: this.mapAvailabilityToNumbers(months),
      hours: this.mapAvailabilityToNumbers(time.includes('&') ? 'All day' : time),
    };
  }

  private mapAvailabilityToNumbers(data: string): number[] {
    if (data === 'All year') {
      return ArrayUtils.generateNumbersFromXToY(1, 12);
    }
    if (data === 'All day') {
      return ArrayUtils.generateNumbersFromXToY(0, 23);
    }

    if (data.includes('AM') || data.includes('PM')) {
      const hours = data.split('–').map(DateUtils.getHourNumberFromFormat);
      if (hours.length === 1) {
        return [hours[0]];
      }
      return ArrayUtils.generateNumbersFromXToY(hours[0], hours[1], 23);
    } else {
      const availabilities = data.split(';').map((availability) => {
        const months = availability.split('–').map(DateUtils.getMonthNumberFromName);
        if (months.length === 1) {
          return months[0];
        }
        return ArrayUtils.generateNumbersFromXToY(months[0], months[1], 12, 1);
      });
      return availabilities.flat();
    }
  }

  rarityTo = {
    symbol: (rarity = this.rarity): string => {
      const index = Object.values(RPGFishRarity).indexOf(rarity);
      return ['⚪️', '🟢', '🟡', '🟠'][index] ?? '⚪️';
    },
    xp: (rarity = this.rarity): number => {
      const index = Object.values(RPGFishRarity).indexOf(rarity);
      return [10, 50, 200, 1000][index] ?? 10;
    },
  };

  get monthAvailability(): string {
    const formatter = new Intl.DateTimeFormat('en', { month: 'long' });

    const split = this.splitToFollowingNumbers(this.availability.months, 1);
    return split
      .map((months) => {
        const { first, last } = months;

        if (first === 1 && last === 12) {
          return 'All year';
        }

        const firstDate = new Date();
        firstDate.setMonth(first - 1);

        if (first === last) {
          return formatter.format(firstDate).capitalize();
        }

        const lastDate = new Date();
        lastDate.setMonth(last - 1);

        return `${formatter.format(firstDate).capitalize()}-${formatter.format(lastDate).capitalize()}`;
      })
      .join(' & ');
  }

  get hoursAvailability(): string {
    const split = this.splitToFollowingNumbers(this.availability.hours);
    return split
      .map((hours) => {
        const { first, last } = hours;

        if (first === 0 && last === 23) {
          return 'All day';
        }

        const firstDate = new Date();
        firstDate.setHours(first);

        if (first === last) {
          return firstDate.getHours().toString().padStart(2, '0');
        }

        const lastDate = new Date();
        lastDate.setHours(last);

        return `${firstDate.getHours().toString().padStart(2, '0')}h-${lastDate
          .getHours()
          .toString()
          .padStart(2, '0')}h`;
      })
      .join(' & ');
  }

  private splitToFollowingNumbers(numbers: number[], preventSkipAt = 0): number[][] {
    return numbers.reduce((agg: number[][], number, index) => {
      if (index === 0 || (number !== preventSkipAt && agg.last.last !== number - 1)) {
        agg.push([number]);
      } else {
        agg.last.push(number);
      }
      return agg;
    }, []);
  }
}

export class RPGFishes extends Array<RPGFish> {
  constructor(...items: RPGFish[]) {
    super();
    this.push(...items);
  }

  findByName = (name: string) => this.find((fish) => fish.name === name);

  of = {
    rarity: (rarity: RPGFishRarity) => <RPGFishes>this.filter((fish) => fish.rarity === rarity),
  };

  available = () => <RPGFishes>this.filter((fish) => {
      const now = new Date();
      return fish.availability.months.includes(now.getMonth() + 1) && fish.availability.hours.includes(now.getHours());
    });

  weighRarity = async (user: User) => {
    const weights = [100, 20, 5, 1];
    const maxLevelWeights = [100, 50, 20, 5];
    const fishingLevel = RPGSkillService.utils.xpToLevel(
      <number>(await RPGService.getUser.skill(user, Skill.FISHING)).get('xp'),
    );

    const rarity = Object.values(RPGFishRarity).pickOneUsingWeight(
      weights.map((weight, index) => weight + (maxLevelWeights[index] - weight) * (fishingLevel / 100)),
    );
    return <RPGFishes>this.of.rarity(rarity);
  };
}
