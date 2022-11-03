export enum AnimalCrossingFishRarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  ULTRA_RARE = 'Ultra-rare',
}

export class AnimalCrossingFish {
  name: string;
  catch: {
    phrase: string;
    joke: string;
  };
  rarity: AnimalCrossingFishRarity;
  price: number;
  icon: string;

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
  }

  get weight(): number {
    switch (this.rarity) {
      case AnimalCrossingFishRarity.ULTRA_RARE:
        return 1;
      case AnimalCrossingFishRarity.RARE:
        return 5;
      case AnimalCrossingFishRarity.UNCOMMON:
        return 20;
      case AnimalCrossingFishRarity.COMMON:
      default:
        return 100;
    }
  }

  get raritySymbol(): string {
    switch (this.rarity) {
      case AnimalCrossingFishRarity.ULTRA_RARE:
        return '🟠';
      case AnimalCrossingFishRarity.RARE:
        return '🟡';
      case AnimalCrossingFishRarity.UNCOMMON:
        return '🟢';
      case AnimalCrossingFishRarity.COMMON:
      default:
        return '⚪️';
    }
  }
}
