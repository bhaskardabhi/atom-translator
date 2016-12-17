'use babel';

export default class TranslationProvider {
    getKey() {
        return atom.config.get('atom-translator.key');
    }

    getDefaultTraslationLang(){
        return atom.config.get('atom-translator.lang');
    }

    // Tear down any state and detach
    translate(lang, text, callback) {
        var parameters = "key="+this.getKey()+"&text="+text+"&lang="+lang;

        fetch("https://translate.yandex.net/api/v1.5/tr.json/translate?"+parameters).then(function(response) {
          return response.json();
        }).then(function(data) {
            if(data['text'].length){
                callback(data['text'][0]);
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
