import { Card, Deck } from '../casino.model';

export const BLACKJACK = 21;

class BlackjackHand extends Array<Card> {
  constructor() {
    super();
  }

  private getValues(cards = this.map((_) => _), result = [0]): number[] {
    const card = cards.pop();
    if (card === undefined) {
      return result;
    }

    if (card.value === 'A') {
      result = result.map((value) => value + 1).concat(result.map((value) => value + 11));
    } else {
      result = result.map((value) => {
        const cardValue: number = ['J', 'Q', 'K'].includes(card.value) ? 10 : Number(card.value);
        return value + cardValue;
      });
    }
    return this.getValues(cards, result);
  }

  get possibleValues(): number[] {
    return this.getValues();
  }

  get value(): number {
    if (this.possibleValues.includes(BLACKJACK)) {
      return BLACKJACK;
    }
    return Math.max(0, ...this.possibleValues.filter((value) => value < BLACKJACK)) || Math.min(...this.possibleValues);
  }

  toString(showPossibilites = true) {
    let str = `${this.map((card) => card.toString()).join(' ')}`;
    if (showPossibilites) {
      str += ` (${this.possibleValues.join('/')})`;
    }
    return str;
  }
}

export class BlackjackGame {
  deck: Deck;
  dealerHand: BlackjackHand;
  playerHand: BlackjackHand;

  constructor() {
    this.deck = new Deck().shuffle();

    this.dealerHand = new BlackjackHand();
    this.dealerHand.push(this.deck.draw()!);

    this.playerHand = new BlackjackHand();
    this.playerHand.push(this.deck.draw()!);
    this.playerHand.push(this.deck.draw()!);
  }

  hit() {
    this.playerHand.push(this.deck.draw()!);
    return this.playerHand.value < BLACKJACK;
  }

  stay() {
    if (this.playerHand.value === BLACKJACK) {
      return 2;
    }
    if (this.playerHand.value > BLACKJACK) {
      return -2;
    }

    while (this.dealerHand.value < 17 && this.dealerHand.value <= this.playerHand.value) {
      this.dealerHand.push(this.deck.draw()!);
    }

    if (this.dealerHand.value > 21) {
      return 1;
    }

    return Math.sign(this.playerHand.value - this.dealerHand.value);
  }
}
