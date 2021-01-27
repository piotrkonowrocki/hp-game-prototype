import sheetLoader from './sheet-loader';
import Deck from './deck';

export default class DeckHandler {
    constructor(item) {
        this.container = item;
        this.fakeFontPreload();
        this.init(item.getAttribute('data-module'));
    }

    async init(module) {
        await this.loadModule(module);
        await this.loadSheetData(module);
        this.createDeck();
        this.createCards();
        this.displayCards();
    }

    fakeFontPreload() {
        const container = document.createElement('div');

        container.classList.add('fake-font-preload');
        container.innerHTML += '<p class="sans-serif">Lorem ipsum dolor sit amet</p>';
        container.innerHTML += '<p class="sans-serif"><strong>Lorem ipsum dolor sit amet</strong></p>';
        container.innerHTML += '<p class="sans-serif"><em>Lorem ipsum dolor sit amet</em></p>';
        container.innerHTML += '<p class="serif">Lorem ipsum dolor sit amet</p>';
        container.innerHTML += '<p class="serif"><strong>Lorem ipsum dolor sit amet</strong></p>';
        container.innerHTML += '<p class="serif"><em>Lorem ipsum dolor sit amet</em></p>';

        document.body.appendChild(container);
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
        // this.deck.createCard(this.module.sets[9]);
    }

    displayCards() {
        this.deck.getCards().forEach(card => {
            this.container.appendChild(card.getNode());
            card.fitTextInRegions();
        });
    }
}
