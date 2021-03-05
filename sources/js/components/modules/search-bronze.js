export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1Ck62iGAG9hzaVxHO103L4YDAycGqUBcLGwnss-ScsVg',
            tabs: ['Zawartość']
        };
        this.deckSettings = {
            format: 'mini',
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        sheet.shift();
        sheet.forEach((row, i) => {
            this.sets[i] = {
                title: 'Przeszukiwanie',
                content: row[0]
            };
        });
    }

    renderer(card) {
        const data = card.params.data;

        const content = card.createTextNode(data.content, {
            classes: ['description'],
            wraper: 'strong'
        });

        card.container.classList.add('mod--middle');
        card.container.querySelector('.region--position-content').appendChild(content);
    }
}
