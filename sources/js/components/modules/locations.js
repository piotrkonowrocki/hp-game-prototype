export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1_SWyAOszjzE-lMBPT9EYnXwjnaDhh040yT8EzQ971ho',
            tabs: ['Pola']
        };
        this.deckSettings = {
            format: 'mini',
            back: 'location',
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        sheet.shift();
        sheet.forEach((row, i) => {
            if (row[0] !== row[1]) {
                this.sets[i] = {
                    title: 'Lokacja',
                    area: row[0],
                    field: row[1]
                };
            }
        });
    }

    renderer(card) {
        const data = card.params.data;

        const area = card.createTextNode(data.area, {
            classes: ['description'],
            wrapper: 'strong'
        });
        const field = card.createTextNode(data.field, {
            classes: ['description']
        });

        card.container.classList.add('mod--middle');
        card.container.querySelector('.region--position-content').appendChild(area);
        card.container.querySelector('.region--position-content').appendChild(field);
    }
}
