export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1JNd32EHCuzakQA7y0-CRminJN0MMKJDXdZanAlwWqjg',
            tabs: ['Poszlaki']
        };
        this.deckSettings = {
            format: 'oversize',
            back: 'deathly-hallows',
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        sheet.shift();
        sheet.forEach((row, i) => {
            const orders = [];

            orders.push(row[3]);
            if (row[4] !== '×') orders.push(row[4]);
            if (row[5] !== '×') orders.push(row[5]);
            this.sets[i] = {
                title: row[0],
                narrative: row[1],
                preparation: row[2],
                orders,
                progressive: row[6] === 'tak',
                traces: row[7],
                additionalReward: row[15]
            };
        });
    }

    renderer(card) {
        const data = card.params.data;
        const hasPreparation = data.preparation !== '×';

        const narrative = card.createTextNode(data.narrative, {
            classes: ['description', 'description--dots-below'],
            wrapper: 'em'
        });
        const preparation = card.createTextNode(data.preparation, {
            classes: ['description', 'description--dots'],
            wrapper: 'strong'
        });
        const additionalReward = card.createTextNode(data.additionalReward, {
            classes: ['description', 'description--dots'],
            prefix: '<strong>Dodatkowa nagroda:</strong> '
        });

        card.container.querySelector('.region--position-content').appendChild(narrative);
        if (hasPreparation) card.container.querySelector('.region--position-content').appendChild(preparation);
        data.orders.forEach((item, i) => {
            const classes = ['description', 'trace-order'];

            if (i === 0 && !hasPreparation) classes.push('description--dots');
            if (data.progressive) classes.push('trace-order--progressive');
            if (i + 1 === data.orders.length) {
                classes.push('trace-order--last');
                classes.push('description--dots-below');
            }
            const order = card.createTextNode(card.boldWordInText(item, 'Akcja:'), {
                classes,
                prefix: '<span class="trace-pointer"></span>'
            });

            card.container.querySelector('.region--position-content').appendChild(order);
        });
        if (data.additionalReward) card.container.querySelector('.region--position-content').appendChild(additionalReward);
        card.pushIcon('footer', 'left-bottom', {
            icon: 'deathly-hallows',
            text: data.traces,
            scale: 0.9
        });
    }
}
