import levenshtein from 'fast-levenshtein';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

export default class SpeechControl {
    constructor() {
        this.keyword = 'asystent';
        this.commands = {
            wylosuj: '.ui-button--draw',
            powiększ: '.current',
            zamknij: '',
            powtórz: ''
        };
        this.decks = [...document.querySelectorAll('.playable')].map(item => item.getAttribute('data-speech'));
        this.maxDeviation = 5;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'pl-PL';

        this.includeGrammar();
        this.renderOutput();
        this.startListening();
        this.attachEvents();
    }

    attachEvents() {
        this.recognition.addEventListener('result', e => {
            this.validateResults(e.results)
                .then(this.callAssistant.bind(this))
                .then(this.callCommand.bind(this))
                .then(this.callDeck.bind(this))
                .then(this.takeAction.bind(this))
                .catch(response => {
                    // eslint-disable-next-line no-console
                    console.log(`Rejection: ${response}`);
                });
        });
        this.recognition.addEventListener('end', () => {
            // eslint-disable-next-line no-console
            console.log('listener stream ended');
            this.recognition.stop();
            this.startListening();
        });
    }

    includeGrammar() {
        const speechRecognitionList = new SpeechGrammarList();
        let grammar = [this.keyword];

        grammar = grammar.concat(this.commands);
        grammar = grammar.concat(this.decks);
        grammar = `#JSGF V1.0; grammar commands; public <command> = ${grammar.join(' | ')} ;`;

        speechRecognitionList.addFromString(grammar, 1);
        this.recognition.grammars = speechRecognitionList;
    }

    renderOutput() {
        this.output = document.createElement('div');

        this.output.classList.add('speech-output');
        document.body.appendChild(this.output);
    }

    startListening() {
        // eslint-disable-next-line no-console
        console.log('listener stream started');
        this.recognition.start();
    }

    validateResults(results) {
        return new Promise((resolve, reject) => {
            if (results[0].isFinal) {
                const transcript = results[0][0].transcript.toLowerCase().split(' ');

                // eslint-disable-next-line no-console
                console.log(`Exact transcription: "${transcript.join(' ')}"`);
                this.output.innerText = transcript.join(' ');
                if (transcript.length >= 2) resolve(transcript);
                else reject(`Transcription had only ${transcript.length} word`);
            }
        });
    }

    callAssistant(results) {
        return new Promise((resolve, reject) => {
            if (this.isInDeviationRange(results[0], this.keyword)) resolve(results);
            else reject('The assistant wasn\'t called');
        });
    }

    callCommand(results) {
        return new Promise((resolve, reject) => {
            const closest = this.getClosestTranscription(Object.keys(this.commands), results[1]);

            if (this.isInDeviationRange(results[1], closest)) {
                results.action = closest;
                results.ui = this.commands[closest];
                resolve(results);
            } else reject(`Unable to find command: "${results[1]}"`);
        });
    }

    callDeck(results) {
        return new Promise((resolve, reject) => {
            if (this.commands[results.action].length) {
                // eslint-disable-next-line arrow-body-style
                const fullCommand = results.reduce((prev, cur, i) => {
                    return i > 1 ? `${prev} ${cur}`.trim() : '';
                });
                const closest = this.getClosestTranscription(this.decks, fullCommand);

                if (this.isInDeviationRange(fullCommand, closest)) {
                    results.deck = closest;
                    resolve(results);
                } else reject(`Unable to find deck: "${fullCommand}"`);
            } else resolve(results);
        });
    }

    takeAction(results) {
        if (results.deck) {
            const deck = document.querySelector(`[data-speech="${results.deck}"`);
            const ui = deck.querySelector(results.ui);

            if (document.querySelector('.zoom')) document.querySelector('.zoom').click();
            ui.click();
            if (results.action === 'wylosuj') deck.querySelector('.current').click();

            this.repeat = {
                action: results.action,
                ui: results.ui,
                deck: results.deck
            };
        } else if (results.action === 'zamknij') {
            if (document.querySelector('.zoom')) document.querySelector('.zoom').click();
        } else if (results.action === 'powtórz') {
            this.takeAction(this.repeat);
        }
    }

    getClosestTranscription(commands, transcript) {
        const levenshteinDistances = commands.map(command => levenshtein.get(transcript, command));
        const i = levenshteinDistances.indexOf(Math.min.apply(Math, levenshteinDistances));

        return commands[i];
    }

    isInDeviationRange(a, b, mod = 0) {
        return levenshtein.get(a, b) < 3 + mod;
    }
}
