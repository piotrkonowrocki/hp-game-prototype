export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1WtQqBR7TqGjn3mpavVXF1JwAg3-I1m156pctHLPutkQ',
            tabs: ['Zaklęcia wspomagające']
        };
        this.deckSettings = {
            format: 'standard',
            back: 'attribute-spells-support',
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        sheet.shift();
        sheet.forEach((row, i) => {
            let spellDescription = row[1].split(/\r?\n/u);

            if (row[2]) spellDescription = spellDescription.concat(row[2].split(/\r?\n/u));
            this.sets[i] = {
                title: row[0],
                cover: 'attribute-spells-support',
                category: 'Zaklęcie wspomagające',
                spellDescription,
                footnote: row[3].replace(/\r?\n/u, '<br />'),
                power: row[4],
                cooldown: row[5],
                modifiers: row[6],
                darkMagic: row[7] === 'tak'
            };
        });
    }

    renderer(card) {
        const data = card.params.data;

        if (data.power !== 'nd.') {
            card.pushIcon('cover', 'left-bottom', {
                icon: 'spell-power',
                text: data.power
            });
        }
        card.pushIcon('cover', 'right-bottom', {
            icon: 'duration',
            text: data.cooldown
        });

        data.spellDescription.forEach(item => {
            const classes = ['description'];

            if (item === 'LUB') classes.push('description--or');
            else classes.push('description--dots');
            const description = card.createTextNode(item, {
                classes
            });

            card.container.querySelector('.region--position-content').appendChild(description);
        });

        if (data.footnote) {
            const footnote = card.createTextNode(data.footnote, {
                classes: ['description', 'footnote']
            });

            card.container.querySelector('.region--position-content').appendChild(footnote);
        }

        data.modifiers.split('').forEach(symbol => {
            card.pushIcon('footer', 'left-bottom', {
                icon: `modifier-${symbol}`
            });
        });
    }
}
