export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1-9Xzo81Pp8kiXkCDSs7yTxhQHrDwY7c7Y8YXba80zrM',
            tabs: ['Słabe i mocne strony']
        };
        this.deckSettings = {
            format: 'mini',
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        const print = false;

        sheet.shift();
        sheet.forEach((row, i) => {
            if (i > 0) {
                const categories = ['Umiejętność aktywna', 'Umiejętność pasywna', 'Słaba strona'];

                row.forEach((col, j) => {
                    const k = Math.ceil(j / 4);

                    if ((j - 1) % 4 > 0) {
                        if (!print || (j - 1) % 4 > 1) {
                            this.sets[`${i}-${j}`] = {
                                title: row[k * 4 - 3],
                                category: categories[k - 1],
                                effect: col.split(/\r?\n/u),
                                level: (j - 1) % 4
                            };
                        }
                    }
                });
            }
        });
    }

    renderer(card) {
        const data = card.params.data;

        data.effect.forEach(text => {
            if (!text.startsWith('Atak:') && !text.startsWith('Kontra:')) {
                const effect = card.createTextNode(card.boldWordInText(text, 'Akcja: '), {
                    classes: ['description', 'description--dots', 'description--small']
                });

                card.container.querySelector('.region--position-content').appendChild(effect);
            } else {
                if (!card.container.querySelector('.summon-stats')) {
                    const stats = document.createElement('ul');

                    stats.classList.add('summon-stats');
                    card.container.querySelector('.region--position-content').appendChild(stats);
                }
                const values = text.split(':');
                const stat = document.createElement('li');
                const icon = document.createElement('img');
                const val = document.createElement('span');

                values[0] = values[0].replace('Atak', 'damage');
                values[0] = values[0].replace('Kontra', 'spell-counter');

                icon.src = `../img/content/${values[0]}.png`;
                icon.classList.add('icon-image');
                val.innerText = values[1];
                val.classList.add('icon-text');

                stat.appendChild(icon);
                stat.appendChild(val);
                card.container.querySelector('.summon-stats').appendChild(stat);
            }
        });

        card.pushIcon('footer', 'left-bottom', {
            icon: 'level',
            text: data.level
        });
    }
}
