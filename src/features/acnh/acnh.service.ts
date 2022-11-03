import { Request } from '@utils/request.util';
import { firstValueFrom } from 'rxjs';
import { AnimalCrossingFish, AnimalCrossingFishRarity } from './acnh.model';

export class AnimalCrossingService {
  static fishes: AnimalCrossingFish[] = [];

  static async init() {
    const fishesJSON = await firstValueFrom(
      Request.get('https://raw.githubusercontent.com/alexislours/ACNHAPI/master/fish.json'),
    );

    this.fishes = Object.entries(JSON.parse(fishesJSON)).map(
      ([name, data]: [string, any]) => new AnimalCrossingFish(name, data),
    );
  }

  static fish() {
    return this.fishes.pickOneUsingWeight(this.fishes.map((fish) => fish.weight));
  }
}
