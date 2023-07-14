import { MathUtils } from '@utils/math.util';
import { Guild, User } from 'discord.js';

class Game421Hand extends Array<number | null> {
  get value() {
    const hand = [...this].sort((a, b) => (b ?? 0) - (a ?? 0)) as number[];
    const reversed = [...this].sort((a, b) => (a ?? 0) - (b ?? 0)) as number[];
    const flatten = +hand.join('');

    if (flatten === 421) {
      return 2000;
    }

    if (reversed[0] === 1 && reversed[1] === 1) {
      if (reversed[2] === 1) {
        return 1950;
      }
      return 1900 + reversed[2];
    }

    if (hand[0] === hand[1] && hand[0] === hand[2]) {
      return 1800 + hand[0];
    }

    if (hand[0] === hand[1] + 1 && hand[1] === hand[2] + 1) {
      return 1700 + hand[0];
    }

    return flatten;
  }

  toEmbed(guild: Guild): string {
    return [...this]
      .sort((a, b) => (b ?? 0) - (a ?? 0))
      .map((value) =>
        value === 0 ? '❓' : guild.emojis.cache.find((emoji) => emoji.name === `die${value}`)?.toString(),
      )
      .join(' ');
  }
}

class Game421Player {
  user: User;
  hand: Game421Hand = new Game421Hand(null, null, null);

  constructor(user: User) {
    this.user = user;
  }

  throwAllDice() {
    this.hand = new Game421Hand(MathUtils.random(1, 6), MathUtils.random(1, 6), MathUtils.random(1, 6));
  }

  throwDie(index: number) {
    this.hand[index] = MathUtils.random(1, 6);
  }
}

export class Game421 {
  sender: Game421Player;
  receiver: Game421Player;

  constructor(sender: User, receiver: User) {
    this.sender = new Game421Player(sender);
    this.receiver = new Game421Player(receiver);
  }

  get winner() {
    if (this.sender.hand.value > this.receiver.hand.value) {
      return this.sender;
    } else if (this.sender.hand.value < this.receiver.hand.value) {
      return this.receiver;
    }
    return null;
  }
}
