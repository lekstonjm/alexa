'use strict';
const Alexa = require("alexa-sdk");
const appId = 'amzn1.ask.skill.540b1f8f-ce19-40cf-821f-c7306668e615'; //'amzn1.echo-sdk-ams.app.your-skill-id';
const DeckFactory = require('./blackjack_deck_factory.js');
const Deck = require('./deck.js');

const db='arn:aws:dynamodb:us-east-1:108856141835:table/blackjack'

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.dynamoDBTableName = 'blackjack';
    alexa.registerHandlers(newSessionHandlers, newCardHandlers, startGameHandlers, runningGameHandlers);
    alexa.execute();
};

const states = {
    STARTMODE:'_STARTMODE',
    RUNNINGMODE:'_RUNNINGMODE',
};

const newSessionHandlers = {
    'NewSession': function() {
        this.handler.state = states.STARTMODE;
        this.response.speak('Welcome to blackjack game.')
            .listen('Would you like play?');
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
      this.response.speak("Goodbye!");
      this.emit(':responseReady');
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    }
};

const newCardHandlers = {
    'NewCard' : function() {        
        let deck = new Deck(this.attributes['deck']);
        let card = deck.Draw();
        
        let player_hand = new Deck(this.attributes['player_hand']);
        player_hand.Push(card);
        let value = player_hand.Evaluate();
        
        if (value > 21) {
            this.handler.state = states.STARTMODE;
            this.response.speak("Unfortunately, your total exceed 21. You loose this game.")
                .listen("Do you want start a new game ?");
        } else {
            this.response.speak("You get " + card.name + " .")
                .listen("Do you want a card?");
        }
        this.attributes['deck'] = deck;
        this.attributes['player_hand'] = player_hand;
        this.emit(':responseReady');
    },
    'NoMoreCard' : function() {
        
        let deck = new Deck(this.attributes['deck']);
        let player_hand = new Deck(this.attributes['player_hand']);
        let alexa_hand = new Deck(this.attributes['alexa_hand']);

        let player_value = player_hand.Evaluate();
        let alexa_value = alexa_hand.Evaluate();
        ;
        let card_list = "";
        while (alexa_value < player_value && this.attributes['deck'].cards.length > 0) {
            let card = deck.Draw();
            alexa_hand.Push(card);
            if (card_list != "") {
                card_list = card_list + ", ";
            }
            card_list = card_list + card.name;
            alexa_value = alexa_hand.Evaluate();
        }
        let message = "I draw "+card_list+".";
        if (alexa_value > 21) {
            message = message + "Congratulation, you win."; 
        } else {
            message = message + "Unfortunately, you loose."; 
        }
        this.attributes['deck'] = deck;
        this.attributes['alexa_hand'] = alexa_hand;
        this.handler.state = states.STARTMODE;
        this.response.speak(message)
            .listen("Do you want start a new game?");
        this.emit(':responseReady');

    }
};

const startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'NewSession': function () {
        console.log("NEWSESSION");
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'AMAZON.HelpIntent': function() {
        console.log("HELPINTENT");
        const message = 'Each turn,  I will propose you a card.' 
        +'If you accept it, your score is updated to the card value.'
        +'If you refuse it, you won\'t have anymore and It will be my turn to draw cards.'
        +'The winner is the one who have the totals of his cards closest but less than 21.'
        this.response.speak(message).listen('Do you want continue?');
        this.emit(':responseReady');
    },
    'AMAZON.YesIntent': function() {
        console.log("YESINTENT");
        this.handler.state = states.RUNNINGMODE;
        let deck_factory = new DeckFactory();
        var deck = deck_factory.Create();
        deck.Shuffle();
        this.attributes['deck'] = deck;
        this.attributes['player_hand'] = new Deck();
        this.attributes['alexa_hand'] = new Deck();
        this.response.speak('Great! ' 
            + 'I just shuffled the deck.')
            .listen('Do you want a card?');
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function() {
        console.log("NOINTENT");
        this.response.speak('Ok, see you next time!');
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
      console.log("STOPINTENT");
      this.response.speak("Goodbye!");
      this.emit(':responseReady');
    },
    "AMAZON.CancelIntent": function() {
      console.log("CANCELINTENT");
      this.response.speak("Goodbye!");
      this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log("SESSIONENDEDREQUEST");
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        console.log("UNHANDLED");
        const message = 'Say yes to continue, or no to end the game.';
        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    }
});

const runningGameHandlers = Alexa.CreateStateHandler(states.RUNNINGMODE,{
    "AMAZON.StopIntent": function() {
      this.response.speak("Goodbye!");
      this.emit(':responseReady');
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'AMAZON.YesIntent': function() {
        this.emit('NewCard');
    },
    'AMAZON.NoIntent': function() {
        this.emit('NoMoreCard');
    },    
    'NewCardIntent': function () {
        this.emit('NewCard');
    },
    'NoMoreCardIntent': function () {
        this.emit('NoMoreCard');
    },           
    'Unhandled': function() {
        console.log("UNHANDLED");
        const message = 'Say yes for a new car, or no to stop drawing.';
        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    }
});