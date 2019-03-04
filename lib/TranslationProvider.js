'use babel';

export default class TranslationProvider {
    getKey() {
        return atom.config.get('atom-translator-tooltips.key');
    }

    getDefaultTraslationLang(){
        return atom.config.get('atom-translator-tooltips.lang');
    }

    getTranslationProvider() {
        return atom.config.get('atom-translator-tooltips.source');
    }

    // Tear down any state and detach
    translate(lang, text, callback) {
        if(this.getTranslationProvider() == "Google Translation"){
            this.googleTranslator(lang, text, callback);
        } else {
            this.yandexTranslator(lang, text, callback);
        }
    }

    yandexTranslator(lang, text, callback) {
        var parameters = "key="+this.getKey()+"&text="+text+"&lang="+lang;

        var encodeUrl = require('encodeurl');

        fetch(encodeUrl("https://translate.yandex.net/api/v1.5/tr.json/translate?"+parameters)).then(function(response) {
          return response.json();
        }).then(function(data) {
            if(data.code == 401){
                atom.notifications.addError(data.message);
            } else if(data['text'].length){
                callback(data['text'][0]);
            }
        });
    }

    googleTranslator(lang, text, callback) {
        var parameters = "key="+this.getKey()+"&q="+text+"&target="+lang;

        var encodeUrl = require('encodeurl');

        fetch(encodeUrl("https://translation.googleapis.com/language/translate/v2?"+parameters)).then(function(response) {
          return response.json();
        }).then(function(data) {
            if(data['data'] && data['data']['translations'].length){
                callback(data['data']['translations'][0].translatedText);
            } else if(data.error && data.error.message){
                atom.notifications.addError(data.error.message);
            }
        });
    }

    getSupportedLanguages(callback) {
        var parameters = "key="+this.getKey()+"&ui=en";

        fetch("https://translate.yandex.net/api/v1.5/tr.json/getLangs?"+parameters).then(function(response) {
            return response.json();
        }).then(function(data) {
            callback(data['langs']);
        });
    }
}
