import sheetLoader from './sheet-loader';
import Deck from './deck';

export default class DeckHandler {
    constructor(item) {
        this.container = item;
        this.isPlayable = item.classList.contains('playable');
        this.fakeFontPreload();
        this.init(item);
    }

    async init(item) {
        const module = item.getAttribute('data-module');

        if (this.isPlayable) {
            const title = item.getAttribute('data-title');

            this.createPlayableUI(title);
        }
        await this.loadModule(module);
        await this.loadSheetData(module);
        this.createDeck();
        this.createCards();
        this.displayCards();
        this.attachEvents();
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
    }

    displayCards() {
        this.container.querySelectorAll('.card').forEach(item => {
            item.parentNode.removeChild(item);
        });
        if (this.isPlayable) this.deck.shuffle();
        this.deck.getCards().forEach(card => {
            this.container.appendChild(card.getNode());
            card.fitTextInRegions();
        });
        if (this.isPlayable) this.nextCard();
    }

    createPlayableUI(titleText) {
        const ui = document.createElement('div');
        const draw = document.createElement('a');
        const shuffle = document.createElement('a');
        const title = document.createElement('span');

        ui.classList.add('ui');
        draw.href = '#';
        shuffle.href = '#';
        draw.classList.add('ui-button');
        shuffle.classList.add('ui-button');
        draw.classList.add('ui-button--draw');
        shuffle.classList.add('ui-button--shuffle');
        title.classList.add('ui-title');
        title.innerText = titleText;

        ui.appendChild(draw);
        ui.appendChild(shuffle);
        ui.appendChild(title);
        this.container.appendChild(ui);

        draw.addEventListener('click', e => {
            this.nextCard();

            e.preventDefault();
        });
        shuffle.addEventListener('click', e => {
            this.shuffleCards();

            e.preventDefault();
        });
    }

    nextCard() {
        const cards = this.container.querySelectorAll('.card');
        const current = this.container.querySelector('.current');

        if (!current) {
            cards[0].classList.add('current');
        } else {
            current.classList.remove('current');
            if (current.nextElementSibling) {
                current.nextElementSibling.classList.add('current');
            } else {
                this.displayCards();
            }
        }
    }

    shuffleCards() {
        const current = this.container.querySelector('.current');

        current.classList.remove('current');
        this.displayCards();
    }

    attachEvents() {
        document.body.addEventListener('font-resized', () => {
            this.deck.getCards().forEach(card => {
                card.resetTextInRegions();
                card.fitTextInRegions();
            });
        });
        this.container.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', e => {
                const clone = e.currentTarget.cloneNode(true);
                const zoom = document.createElement('div');
                const scale = window.innerHeight / e.currentTarget.offsetHeight * 0.95;

                zoom.classList.add('zoom');
                zoom.style.transform = `scale(${scale})`;
                zoom.appendChild(clone);
                document.body.appendChild(zoom);

                zoom.addEventListener('click', () => {
                    zoom.parentNode.removeChild(zoom);
                });
            });
        });
    }
}
