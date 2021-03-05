export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1Ck62iGAG9hzaVxHO103L4YDAycGqUBcLGwnss-ScsVg',
            tabs: ['Przeszukiwanie']
        };
        this.deckSettings = {
            format: 'mini',
            back: 'search',
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        sheet.shift();
        sheet.forEach((row, i) => {
            this.sets[i] = {
                title: 'Przeszukiwanie',
                narrative: row[0],
                order: row[1]
            };
        });
    }

    renderer(card) {
        const data = card.params.data;

        const narrative = card.createTextNode(data.narrative, {
            classes: ['description'],
            wrapper: 'em'
        });
        const order = card.createTextNode(data.order, {
            classes: ['description'],
            wrapper: 'strong'
        });

        card.container.querySelector('.region--position-content').appendChild(narrative);
        card.container.querySelector('.region--position-content').appendChild(order);
    }
}
