import Card from './card';

export default class Deck {
    constructor(params) {
        this.params = params;
        this.cards = [];

        if (params.back) {
            this.cards.push(new Card({
                back: this.params.back,
                format: this.params.format,
                regions: this.params.regions
            }));
        }
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
        let backCard;

        if (this.params.back) {
            backCard = this.cards[0];

            this.cards.shift();
        }
        this.cards.sort(() => Math.random() - 0.5);
        if (this.params.back) this.cards.unshift(backCard);
    }
}
