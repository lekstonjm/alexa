var Deck = require('./deck.js');

module.exports = class JutsuDeckFactory
{
    constructor() {}
    Create() {
        
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