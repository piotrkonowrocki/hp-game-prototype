import Card from './card';

export default class Deck {
    constructor(params) {
        this.params = params;
        this.cards = [];
    }

    createCard(data) {
        const card = new Card({
            data,
            format: this.params.format,
            regions: this.params.regions,
            renderDefaultValues: this.params.renderDefaultValues,
            renderCustomValues: this.params.renderer
        });

        this.cards.push(card);
    }

    getCards() {
        return this.cards;
    }

    shuffle() {
        this.cards.sort(() => Math.random() - 0.5);
    }
}
