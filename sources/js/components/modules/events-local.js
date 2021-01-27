export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1Rx5PuhFijHkyTLQWaOySk_yMYAk8Wpw0lfGsDyHjJRA',
            tabs: ['Wydarzenia']
        };
        this.deckSettings = {
            format: 'oversize',
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        sheet.shift();
        sheet.forEach((row, i) => {
            if (!row.includes('') && row.length >= 10) {
                this.sets[i] = {
                    title: 'Wydarzenie lokalne',
                    target: row[0],
                    narrative: row[3],
                    order: row[4],
                    defaultOrFailure: {
                        narrative: row[6],
                        outcome: row[7]
                    },
                    success: {
                        narrative: row[8],
                        outcome: row[9]
                    }
                };
            }
        });
    }

    renderer(card) {
        const data = card.params.data;
        const hasOrder = data.order !== '×';

        const target = card.createTextNode(data.target, {
            classes: ['description'],
            wrapper: 'strong'
        });
        const narrative = card.createTextNode(data.narrative, {
            classes: ['description', 'description--dots-below'],
            wrapper: 'em'
        });
        const order = card.createTextNode(data.order, {
            classes: ['description', 'description--dots-below'],
            wrapper: 'strong'
        });
        const defaultOrFailureNarrative = card.createTextNode(data.defaultOrFailure.narrative, {
            classes: ['description', 'description--dots'],
            wrapper: 'em',
            prefix: '<strong>Sukces:</strong> '
        });
        const defaultOrFailureOutcome = card.createTextNode(data.defaultOrFailure.outcome, {
            classes: ['description', 'description--dots-below']
        });
        const successNarrative = card.createTextNode(data.success.narrative, {
            classes: ['description', 'description--dots'],
            wrapper: 'em',
            prefix: '<strong>Sukces:</strong> '
        });
        const successOutcome = card.createTextNode(data.success.outcome, {
            classes: ['description']
        });

        card.container.querySelector('.region--position-content').appendChild(target);
        card.container.querySelector('.region--position-content').appendChild(narrative);
        if (hasOrder) card.container.querySelector('.region--position-content').appendChild(order);
        if (hasOrder) card.container.querySelector('.region--position-content').appendChild(defaultOrFailureNarrative);
        card.container.querySelector('.region--position-content').appendChild(defaultOrFailureOutcome);
        if (hasOrder) card.container.querySelector('.region--position-content').appendChild(successNarrative);
        if (hasOrder) card.container.querySelector('.region--position-content').appendChild(successOutcome);
    }
}
