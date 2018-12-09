var DeckFactory = require('./blackjack_deck_factory.js');

let deck_factory = new DeckFactory();

let deck = deck_factory.Create();

console.log(deck);
console.log(deck.Evaluate());

deck.Shuffle();
console.log(deck);

let card = deck.Draw();
console.log(card);
console.log(deck);
