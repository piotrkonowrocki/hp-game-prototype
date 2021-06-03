import Resizer from './components/resizer';
import DeckHandler from './components/deck-handler';
import SpeechControl from './components/speech-control';

class App {
    constructor() {
        this.init();
    }

    init() {
        if (document.querySelector('.deck')) new Resizer();
        document.querySelectorAll('.deck').forEach(item => {
            new DeckHandler(item);
        });

        new SpeechControl();
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
