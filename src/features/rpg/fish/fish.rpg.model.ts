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
      case RPGFishRarity.ULTRA_RARE:
        return 1;
      case RPGFishRarity.RARE:
        return 5;
      case RPGFishRarity.UNCOMMON:
        return 20;
      case RPGFishRarity.COMMON:
      default:
        return 100;
    }
  }

  get raritySymbol(): string {
    switch (this.rarity) {
      case RPGFishRarity.ULTRA_RARE:
        return '🟠';
      case RPGFishRarity.RARE:
        return '🟡';
      case RPGFishRarity.UNCOMMON:
        return '🟢';
      case RPGFishRarity.COMMON:
      default:
        return '⚪️';
    }
  }
}
