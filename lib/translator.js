'use babel';

import TranslationProvider from './TranslationProvider';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,
  translationProvider: null,

  config: {
      source: {
          title: "Select Translation Service Provider",
          type: 'string',
          description: 'Translation Service Provider',
          default: 'Yandex',
          enum: ['Yandex','Google Translation'],
          order: 1
      },
      lang: {
         title: 'Translate To Language',
         description: 'Specify which language to translate by default (e.g. `ar` or `en`). Arabic will be default',
         type: 'string',
         default: 'ar',
         order: 2
     },
     key: {
         title: 'Translation API Key',
         description: 'Set Translation API Key Provided By your translation service provider. https://github.com/bhaskardabhi/atom-translator#api-key',
         type: 'string',
         default: '',
         order: 3
     },
     enableTooltips: {
         title: "Enable translation into tooltips",
         type: "boolean",
         description: 'If disabled, selected text will be replaced by translation',
         default: true,
         order: 4
     }
   },

  activate(state) {
      this.translationProvider = new TranslationProvider();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-translator:toggle': () => this.toggle()
    }));
  },

  deactivate() {
      if(this.translationProvider){
          this.translationProvider.destroy();
      }

      this.subscriptions.dispose();
  },

  serialize() {
  },

  toggle() {
      if(!this.translationProvider.getDefaultTraslationLang()){
          atom.notifications.addWarning("Setup default translation language");
          return true;
      }
      if(!this.translationProvider.getKey()){
          atom.notifications.addWarning("Setup Yandex Translation key");
          return true;
      }

     var editor = atom.workspace.getActiveTextEditor();

     if(editor && editor.getLastSelection() && editor.getLastSelection().getText()){
         var selection = editor.getLastSelection();

         this.translationProvider.translate(this.translationProvider.getDefaultTraslationLang(),selection.getText(), function (word) {
            // add tooltips
            if (atom.config.get('atom-translator.enableTooltips')) {
    					if (this.tooltips) {
    						this.tooltips.dispose();
    					}
    					const editorView = atom.views.getView(editor);
    					const cursorPos = editorView.querySelector('.cursor');

    					tooltips = atom.tooltips.add(cursorPos, {
    						title: word,
    						trigger: "manual",
    						placement: "bottom",
    						template: "<div class='tooltip' role='tooltip'><div class='tooltip-arrow tooltip-arrow-translate'></div><div class='tooltip-inner tooltip-inner-translate'></div></div>"
    					});

    					atom.workspace.onDidChangeActivePaneItem(() => {
    						tooltips.dispose();
    					});
    					editor.onDidChangeSelectionRange(() => {
    						tooltips.dispose();
    					});
    					atom.views.getView(editor).onDidChangeScrollTop(() => {
    						tooltips.dispose();
    					});
    				}
    				else {
    					selection.insertText(word);
    				}
         });
     }
 },
};
