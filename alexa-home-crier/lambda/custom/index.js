'use strict';

const Alexa = require('ask-sdk-core');
const sprintf = require('sprintf-js').sprintf;
// use 'ask-sdk' if standard SDK module is installed
const Messages = {
    'LaunchRequest': {
        'fr-FR': "Je suis votre crieur public personnel. Quelle annonce voulez-vous que je fasse?",
        'en-US': "I am your personnal town crier. What would you like I annouce?"
    },
    'InvalidSlot': {
        'fr-FR': "Désolé, je n'ai pas compris",
        'en-US': "Sorry, I did not understand"
    },
    'AMAZON.HelpIntent': {
        'fr-FR': "",
        'en-US': ""
    },
    'AMAZON.StopIntent': {
        'fr-FR': "",
        'en-US': ""
    },
    'AnnouncementIntent': {
        0: {
            'fr-FR': 'Oyez <break time="250ms"/> Oyez <break time="500ms"/> Il est temps de %1$s',
            'en-US': 'Hear ye <break time="500ms"/> it is time %1$s <break time="500ms"/> It has been said <break time="250ms"/> and well said'
        },
        1: {
            'fr-FR': '<say-as interpret-as="interjection">youhou</say-as><break time="250ms"/> Mes petits chatons d\'amour <break time="250ms"/> Il est temps de %1$s <break time="250ms"/> <say-as interpret-as="interjection">miaou</say-as>',
            'en-US': '<say-as interpret-as="interjection">yoo hoo</say-as><break time="500ms"/> Honeys <break time="250ms"/> It is time %1$s'
        },
        2: {
            'fr-FR': '<say-as interpret-as="interjection">ding dong</say-as><break time="250ms"/> On écoute les petits coeurs <break time="500ms"/> Il est temps de %1$s',
            'en-US': '<say-as interpret-as="interjection">cock a doodle doo</say-as><break time="250ms"/> Wake up sweeties <break time="500ms"/> It is time %1$s'
        },
        3: {
            'fr-FR': '<say-as interpret-as="interjection">en garde</say-as><break time="500ms"/> Votre attention <break time="200ms"/> Il est temps de %1$s <break time="250ms"/><say-as interpret-as="interjection">pas facile, hein?</say-as>',
            'en-US': '<say-as interpret-as="interjection">dun dun dun</say-as><break time="500ms"/> Your attention <break time="200ms"/> little smeely things <break time="500ms"/> it is time %1$s'
        }
    }
};

// Code for the handlers here
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            
        let requestName = handlerInput.requestEnvelope.request.type;
        let requestLocale = handlerInput.requestEnvelope.request.locale;
        const speechText = Messages[requestName][requestLocale];

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const AnnouncementIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AnnouncementIntent';

    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        let requestName = handlerInput.requestEnvelope.request.intent.name;        
        let requestLocale = handlerInput.requestEnvelope.request.locale;
        let announcement = "";
        const slot = handlerInput.requestEnvelope.request.intent.slots.Announcement;
        if (slot && slot.value) {
            announcement = slot.value.toLowerCase();
        }
        let speechText = "";
        if (announcement != "") {
            let dice_size = 4;
            let dice = Math.floor(Math.random() * dice_size);
            let response = Messages[requestName][dice][requestLocale];
            speechText = sprintf(response, announcement);
        } else {
            speechText =  Messages['InvalidSlot'][requestLocale];
        }
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        let requestName = handlerInput.requestEnvelope.request.intent.name;
        let requestLocale = handlerInput.requestEnvelope.request.locale;
        const speechText = Messages[requestName][requestLocale];

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        let requestLocale = handlerInput.requestEnvelope.request.locale;
        //const speechText = Messages['InvalidSlot'][requestLocale];
        const speechText = "Erreur";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    },
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(LaunchRequestHandler,
        AnnouncementIntentHandler,
        HelpIntentHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();