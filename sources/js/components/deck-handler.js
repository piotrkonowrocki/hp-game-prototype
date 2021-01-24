import sheetLoader from './sheet-loader';
import Deck from './deck';

export default class DeckHandler {
    constructor(item) {
        this.container = item;
        this.init(item.getAttribute('data-module'));
    }

    async init(module) {
        await this.loadModule(module);
        await this.loadSheetData(module);
        this.createDeck();
        this.createCards();
        this.displayCards();
    }

    async loadModule(module) {
        const Module = (await import(`./modules/${module}`)).default;

        this.module = new Module();
    }

    async loadSheetData() {
        const sheet = await sheetLoader.loadData(this.module.sheetDataSettings);

        this.sheet = sheet;
    }

    createDeck() {
        this.deck = new Deck(this.module.deckSettings);
    }

    createCards() {
        Object.keys(this.sheet).forEach(tab => {
            this.module.parseData(this.sheet[tab], tab);
        });
        Object.keys(this.module.sets).forEach(set => {
            this.deck.createCard(this.module.sets[set]);
        });
    }

    displayCards() {
        this.deck.getCards().forEach(card => {
            this.container.appendChild(card.getNode());
        });
    }
}
