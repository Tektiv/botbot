import { ArgsOf, Discord, GuardFunction } from 'discordx';
import { MathUtils } from '@utils/math.util';

@Discord()
export class MiscGuard {
  static Random(probability: number) {
    const guard: GuardFunction<ArgsOf<'messageCreate'>> = async (_, __, next) => {
      const random = MathUtils.random(1, probability);
      if (random === probability) {
        return next();
      }
    };
    return guard;
  }
}
