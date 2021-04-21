export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1-9Xzo81Pp8kiXkCDSs7yTxhQHrDwY7c7Y8YXba80zrM',
            tabs: ['Atrybuty', 'Słabe i mocne strony', 'Rozwój', 'Techniki', 'Przychód', 'Pozostałe']
        };
        this.deckSettings = {
            format: 'hero',
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
                        offensiveSpells: row[1],
                        supportSpells: row[2],
                        practicalSpells: row[3],
                        knowledge: row[4],
                        influence: row[5],
                        cunning: row[6]
                    };
                }
                if (tab === 'Słabe i mocne strony') {
                    this.sets[i].abilities = {
                        active: [row[1], row[2]],
                        passive: [row[3], row[4]],
                        weakness: [row[5], row[6]]
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
                        explosive: row[4],
                        book: row[6],
                        potion: row[8]
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

        card.pushColumns(3);

        for (const item of Object.entries(data.abilities)) {
            item[1][0] = `<strong>${item[1][0]}</strong>`;
            item[1][1] = card.boldWordInText(item[1][1], 'Akcja:');
        }
        const abilities = {
            active: card.createTextNode(data.abilities.active.join('<br />'), {
                classes: ['description']
            }),
            passive: card.createTextNode(data.abilities.passive.join('<br />'), {
                classes: ['description']
            }),
            weakness: card.createTextNode(data.abilities.weakness.join('<br />'), {
                classes: ['description', 'description--dots']
            })
        };

        card.container.querySelector('.column-2').appendChild(abilities.active);
        card.container.querySelector('.column-2').appendChild(abilities.passive);
        card.container.querySelector('.column-2').appendChild(abilities.weakness);

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

        card.container.querySelector('.column-3').appendChild(income);
        incomeTracks.forEach(incomeTrack => {
            card.container.querySelector('.column-3').appendChild(incomeTrack);
        });
    }
}