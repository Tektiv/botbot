export type CardValue = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export const CardValues: CardValue[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export enum CardSymbol {
  SPADE = '♠️',
  CLUB = '♣️',
  DIAMOND = '♦️',
  HEART = '♥️',
}
export class Card {
  value: CardValue;
  symbol: CardSymbol;

  constructor(value: CardValue, symbol: CardSymbol) {
    this.value = value;
    this.symbol = symbol;
  }

  toString() {
    return `${this.symbol}${this.value}`;
  }
}

export class Deck extends Array<Card> {
  constructor(...cards: Card[]) {
    super();
    if (cards?.length > 0) {
      this.push(...cards);
    } else {
      Object.values(CardSymbol).forEach((symbol) => this.push(...CardValues.map((value) => new Card(value, symbol))));
    }
  }

  shuffle() {
    return this.randomise() as Deck;
  }

  draw = this.pop;

  empty() {
    while (this.length > 0) {
      this.pop();
    }
  }

  toString() {
    return this.map((card) => card.toString()).join(' ');
  }
}
