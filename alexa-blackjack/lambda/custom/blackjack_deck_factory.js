var Deck = require('./deck.js');

module.exports = class BlackjackDeckFactory
{
    constructor() {}
    Create() {
        let card_values = [1,2,3,4,5,7,7,8,9,10,10,10,10];
        let card_figures = ['as','2','3','4','5','6','7','8','9','10','jack','queen','king'];
        let card_colors = ['clubs','diamonds', 'hearts','Spades'];
        let cards = [];
        for (let color_index in card_colors) 
        {
            for (let index=  0; index < card_values.length; index++) 
            {                
                cards.push({'value':card_values[index], 'name':card_figures[index] + ' of ' + card_colors[color_index]});
            }
        }
        var deck = new Deck();
        deck.cards = cards;
        return deck;
            
    }
}