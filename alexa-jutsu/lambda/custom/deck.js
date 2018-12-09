module.exports = class Deck {
    constructor() {
        this.cards = [];
    }
    Shuffle() {
        let counter = this.cards.length;
        while (counter > 0) {        
            let index = Math.floor(Math.random() * counter);
            counter--;
            let temp = this.cards[counter];
            this.cards[counter] = this.cards[index];
            this.cards[index] = temp; 
        };    
    }
    Draw() {
        if (this.cards.length > 0) {
            let last_position = this.cards.length - 1; 
            let card = this.cards[last_position];
            this.cards = this.cards.slice(0, last_position);
            return card;            
        }
        return null;
    }

    Push(card) {
        this.cards.push(card);
    }

    Evaluate() {
        let value = 0;
        for (let index in this.cards) {
            value += this.cards[index].value;
        }
        return value;
    }

}