export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1WtQqBR7TqGjn3mpavVXF1JwAg3-I1m156pctHLPutkQ',
            tabs: ['Zaklęcia bojowe']
        };
        this.deckSettings = {
            format: 'standard',
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
                cover: 'attribute-spells-offensive',
                category: 'Zaklęcie bojowe',
                spellDescription,
                power: row[3],
                cooldown: row[4],
                modifiers: row[5],
                darkMagic: row[6] === 'tak'
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
            icon: 'spell-cooldown',
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

        data.modifiers.split('').forEach(symbol => {
            card.pushIcon('footer', 'left-bottom', {
                text: `${symbol}&#xFE0E;`
            });
        });
    }
}
