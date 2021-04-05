export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1wV_aw_DR3o5BWZRZd4LrmZRT-x8K0cgHB2vxuRpV_tI',
            tabs: ['Postaci niezależne']
        };
        this.deckSettings = {
            format: 'standard',
            back: 'npc',
            renderDefaultValues: true,
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        sheet.shift();
        sheet.forEach((row, i) => {
            this.sets[i] = {
                title: row[0],
                cover: 'npc',
                category: row[1],
                level: row[2],
                attack: {
                    val: row[3],
                    status: row[4]
                },
                defense: {
                    val: row[5],
                    status: row[6]
                },
                heal: {
                    val: row[7],
                    status: row[8]
                },
                potion: {
                    val: row[9]
                },
                movement: row[10],
                support: {
                    order: row[11],
                    limit: row[12]
                },
                wanted: row[13],
                reward: row[14]
            };
        });
    }

    renderer(card) {
        const data = card.params.data;
        /* eslint-disable quote-props */
        const statuses = {
            'Agonia': 'agony',
            'Choroba': 'disease',
            'Oszołomienie': 'stun',
            'Unieruchomienie': 'immobilize',
            'Zranienie': 'wound',
            'Niewrażliwość': 'immunity',
            'Odporność': 'resistance',
            'Regeneracja': 'regeneration'
        };
        /* eslint-enable */

        card.container.classList.add('mod--large-cover');
        card.pushIcon('footer', 'left-bottom', {
            icon: `level${data.level === 'Elitarny' ? '-special' : ''}`,
            text: data.level !== 'Elitarny' ? data.level : false
        });
        card.pushIcon('cover', 'left-bottom', {
            icon: 'damage',
            text: data.attack.val,
            addition: data.attack.status ? ['+', `status-${statuses[data.attack.status]}`] : false
        });
        if (data.heal.val) {
            card.pushIcon('cover', 'left-bottom', {
                icon: 'spell-heal',
                text: data.heal.val,
                addition: data.heal.status ? ['+', `status-${statuses[data.heal.status]}`] : false
            });
        }
        if (data.potion.val) {
            card.pushIcon('cover', 'left-bottom', {
                icon: 'item-potion',
                text: data.potion.val.replace('x', ' × ')
            });
        }

        const movement = card.createTextNode(data.movement, {
            classes: ['description'],
            prefix: '<strong>Ruch:</strong> '
        });

        card.container.querySelector('.region--position-content').appendChild(movement);

        if (data.support.order) {
            const order = `${data.support.order}${data.support.limit ? ` /×${data.support.limit}` : ''}`;
            const support = card.createTextNode(order, {
                classes: ['description'],
                prefix: '<strong>Wsparcie:</strong> '
            });

            card.container.querySelector('.region--position-content').appendChild(support);
        }

        if (data.level === 'Elitarny') {
            const support = card.createTextNode('Dopóki ta postać znajduje się w grze, wszystkie pogłoski są niedostępne.', {
                classes: ['description'],
                prefix: '<strong>Elitarny :</strong> '
            });

            card.container.querySelector('.region--position-content').appendChild(support);
        }

        card.pushIcon('cover', 'right-bottom', {
            icon: 'spell-counter',
            text: data.defense.val,
            addition: data.defense.status ? ['+', `status-${statuses[data.defense.status]}`] : false
        });
        if (data.wanted) {
            card.pushIcon('footer', 'left-bottom', {
                icon: 'money',
                text: data.wanted
            });
        }

        if (data.reward) {
            const ranks = ['brąz', 'srebro', 'złoto'];

            card.pushIcon('footer', 'left-bottom', {
                icon: 'cube',
                scale: 0.9,
                index: `rank-${ranks.indexOf(data.reward) + 1}`
            });
        }
    }
}
