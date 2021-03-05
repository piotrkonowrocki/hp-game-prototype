import Resizer from './components/resizer';
import DeckHandler from './components/deck-handler';

class App {
    constructor() {
        this.init();
    }

    init() {
        if (document.querySelector('.deck')) new Resizer();
        document.querySelectorAll('.deck').forEach(item => {
            new DeckHandler(item);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new App());
