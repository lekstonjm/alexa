'use strict';
const Alexa = require("alexa-sdk");
const appId = 'amzn1.ask.skill.540b1f8f-ce19-40cf-821f-c7306668e615'; //'amzn1.echo-sdk-ams.app.your-skill-id';
const DeckFactory = require('./blackjack_deck_factory.js');
const Deck = require('./deck.js');

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.dynamoDBTableName = 'blackjack';
    alexa.registerHandlers(newSessionHandlers, startGameHandlers, runningGameHandlers);
    alexa.execute();
};

const states = {
    STARTMODE:'_STARTMODE',
    RUNNINGMODE:'_RUNNINGMODE',
};

const newSessionHandlers = {
    'NewSession': function() {
        this.handler.state = states.STARTMODE;
        this.response.speak('Welcome to jutsu game.')
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

const startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'NewSession': function () {
        console.log("NEWSESSION");
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'AMAZON.HelpIntent': function() {
        console.log("HELPINTENT");
        const message = 'here some helps';
        this.response.speak(message).listen('Do you want continue?');
        this.emit(':responseReady');
    },
    'AMAZON.YesIntent': function() {
        console.log("YESINTENT");
        this.handler.state = states.RUNNINGMODE;
        let deck_factory = new DeckFactory();
        let alexa_deck = deck_factory.Create();
        alexa_deck.Shuffle();
        let alexa_hand = new Deck();
        alexa_hand.Add(alexa_deck.Draw(3));
        this.attributes['alexa_deck'] = alexa_deck;
        this.attributes['alexa_hand'] = alexa_hand;
        let player_deck = deck_factory.Create();
        player_deck.Shuffle();
        let player_hand = new Deck();
        player_hand.Add(player_deck.Draw(3));
        this.attributes['player_deck'] = player_deck;        
        this.attributes['player_hand'] = player_hand;
        this.response.speak('Great! ' 
            + 'We just drawed 3 cards. It is your turn.')
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
        console.log("YESINTENT");
        this.emit('NewCardIntent');
    },
    'AMAZON.NoIntent': function() {
        console.log("NOINTENT");
        this.emit('NoMoreCardIntent');
    },    
    'NewCardIntent': function () {
        let card = this.attributes['deck'].Draw();
        this.attributes['player_hand'].Push(card);      ;
        let value = this.attributes['player_hand'].Evaluate();
        if (value > 21) {
            this.response.speak("You get " + card.name+".")
                .listen("Do you want a card?");
        } else {
            this.handler.state = states.STARTMODE;
            this.response.speak("Unfortunately, your total exceed 21. You loose this game.")
                .listen("Do you want start a new game?");
        }
        this.emit(':responseReady');
    },
    'NoMoreCardIntent': function () {
        let player_value = this.attributes['player_hand'].Evaluate();
        let alexa_value = this.attributes['alexa_hand'].Evaluate();
        let card_list = "";
        while (alexa_value < player_value && this.attributes['deck'].cards.length > 0) {
            let card = this.attributes['deck'].Draw();
            this.attributes['alexa_hand'].Push(card);
            if (card_list != "") {
                card_list = card_list + ", ";
            }
            card_list = card_list + card;
            alexa_value = this.attributes['alexa_hand'].Evaluate();
        }
        let message = "I draw "+card_list+".";
        if (alexa_value > 21) {
            message = message + "Congratulation, you win."; 
        } else {
            message = message + "Unfortunately, you loose."; 
        }
        this.handler.state = states.STARTMODE;
        this.speak(message).listen("Do you want start a new game?");
        emit(':responseReady');
    },           
    'Unhandled': function() {
        console.log("UNHANDLED");
        const message = 'Say yes for a new car, or no to stop drawing.';
        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    }
});