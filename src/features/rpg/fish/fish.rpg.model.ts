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
    joke: string;
  };
  rarity: RPGFishRarity;
  price: number;
  icon: string;

  availability: {
    months: number[];
    hours: number[];
  };

  constructor(name: string, data: Record<string, any>) {
    this.name = name.replace(/_/g, ' ');
    this.rarity = data.availability.rarity;
    this.price = data.price;
    this.icon = data.icon_uri;
    const match = (<string>data['catch-phrase']).match(new RegExp(`^(.*${this.name}(?:!|\.\.\.)) (.*)$`));
    this.catch = {
      phrase: match?.[1] ?? `I cautght a ${this.name}!`,
      joke: match?.[2] ?? '-',
    };
    this.availability = {
      months: data.availability['month-array-northern'],
      hours: data.availability['time-array'],
    };
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

  available = () => <RPGFishes>this.filter((fish) => {
      const now = new Date();
      return fish.availability.months.includes(now.getMonth() + 1) && fish.availability.hours.includes(now.getHours());
    });

  of = {
    rarity: (rarity: RPGFishRarity) => <RPGFishes>this.filter((fish) => fish.rarity === rarity),
  };
}
