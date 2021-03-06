export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1WtQqBR7TqGjn3mpavVXF1JwAg3-I1m156pctHLPutkQ',
            tabs: ['Zaklęcia indywidualne']
        };
        this.deckSettings = {
            format: 'standard',
            back: 'attribute-spells-practical',
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        sheet.shift();
        sheet.forEach((row, i) => {
            let spellDescription = row[3].split(/\r?\n/u);

            if (row[4]) spellDescription = spellDescription.concat(row[4].split(/\r?\n/u));
            this.sets[i] = {
                title: row[0],
                cover: row[1] === 'Zaklęcie bojowe' ? 'attribute-spells-offensive' : 'attribute-spells-support',
                category: `${row[1]} / ${row[2]}`,
                spellDescription,
                footnote: row[5].replace(/\r?\n/u, '<br />'),
                power: row[6],
                cooldown: row[7],
                modifiers: row[8],
                darkMagic: row[9] === 'tak'
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
