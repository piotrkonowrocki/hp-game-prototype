export default class {
    constructor() {
        window.abilityIndex = 0;
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1-9Xzo81Pp8kiXkCDSs7yTxhQHrDwY7c7Y8YXba80zrM',
            tabs: ['Atrybuty', 'Rozwój', 'Techniki', 'Przychód', 'Pozostałe']
        };
        this.deckSettings = {
            format: 'hero',
            regions: ['header', 'content', 'footer'],
            multipleTabs: true,
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet, tab) {
        sheet.shift();

        if (tab === 'Rozwój') {
            let i;

            sheet.forEach(row => {
                if (row[0]) i = row[0];
                else row[0] = i;
            });
        }

        sheet.forEach(row => {
            const i = row[0];

            if (i && !this.sets[i]) {
                this.sets[i] = {
                    title: i
                };
            }
            if (this.sets[i]) {
                if (tab === 'Atrybuty') {
                    this.sets[i].attributes = {
                        'spells-offensive': row[1],
                        'spells-support': row[2],
                        'spells-practical': row[3],
                        knowledge: row[4],
                        influence: row[5],
                        cunning: row[6]
                    };
                }
                if (tab === 'Rozwój') {
                    if (!this.sets[i].progress) this.sets[i].progress = [];
                    this.sets[i].progress.push([row[1], row[2], row[3], row[4]]);
                }
                if (tab === 'Techniki') {
                    this.sets[i].techniques = [
                        [row[2], row[3], row[4], row[5], row[6], row[7], row[8]],
                        [row[10], row[11], row[12], row[13], row[14], row[15], row[16]]
                    ];
                }
                if (tab === 'Przychód') {
                    this.sets[i].income = {
                        moneyMultiplier: row[1],
                        money: row[2],
                        equipment: row[4],
                        explosive: row[6],
                        book: row[8],
                        potion: row[10]
                    };
                }
                if (tab === 'Pozostałe') {
                    this.sets[i].other = {
                        side: row[1],
                        start: row[2]
                    };
                }
            }
        });
    }

    renderer(card) {
        const data = card.params.data;

        card.pushColumns(4);

        for (const [k, v] of Object.entries(data.attributes)) {
            const attribute = card.createAttributeMarker(k, v);

            card.container.querySelector('.column-1').appendChild(attribute);
        }

        setTimeout(() => {
            const abilities = document.querySelectorAll('[data-module="skills"] .card');

            for (let i = 0; i < 3; i++) {
                const col = card.container.querySelector(`.column-${i + 2}`);

                col.insertBefore(abilities[window.abilityIndex].cloneNode(true), col.firstChild);
                window.abilityIndex += 3;
            }
        }, 1000);

        const techniques = card.createTextNode('<strong>Techniki</strong>', {
            classes: ['description', 'description--dots']
        });

        card.container.querySelector('.column-2').appendChild(techniques);
        data.techniques.forEach(schema => {
            const technique = card.createTechniqueDiagram(schema);

            card.container.querySelector('.column-2').appendChild(technique);
        });

        const progress = card.createTextNode('<strong>Rozwój</strong>', {
            classes: ['description']
        });
        const progressGrid = card.createProgressGrid(data.progress);

        card.container.querySelector('.column-3').appendChild(progress);
        card.container.querySelector('.column-3').appendChild(progressGrid);

        const income = card.createTextNode('<strong>Przychód</strong>', {
            classes: ['description']
        });
        const incomeTracks = card.createIncomeTrack(data.income);

        card.container.querySelector('.column-4').appendChild(income);
        incomeTracks.forEach(incomeTrack => {
            card.container.querySelector('.column-4').appendChild(incomeTrack);
        });

        card.pushIcon('footer', 'left-bottom', {
            icon: 'item-equipment-slot-hand'
        });
        card.pushIcon('footer', 'left-bottom', {
            icon: 'item-equipment-slot-clothes'
        });
        card.pushIcon('footer', 'left-bottom', {
            icon: 'item-equipment-slot-talisman'
        });
    }
}
