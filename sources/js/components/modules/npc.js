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
                    val: row[9].replace('x', ' × ')
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

        card.container.classList.add('mod--large-cover');
        card.pushIcon('footer', 'left-bottom', {
            icon: 'level',
            text: data.level
        });
        card.pushIcon('cover', 'left-bottom', {
            icon: 'attribute-spells-offensive',
            text: data.attack.val
        });
        if (data.heal.val) {
            card.pushIcon('cover', 'left-bottom', {
                icon: 'spell-heal',
                text: data.heal.val
            });
        }
        if (data.potion.val) {
            card.pushIcon('cover', 'left-bottom', {
                icon: 'item-potion',
                text: data.potion.val
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

        card.pushIcon('cover', 'right-bottom', {
            icon: 'spell-counter',
            text: data.defense.val
        });
        card.pushIcon('footer', 'left-bottom', {
            icon: 'money',
            text: data.wanted
        });

        const ranks = ['brąz', 'srebro', 'złoto'];

        card.pushIcon('footer', 'left-bottom', {
            icon: 'cube',
            scale: 0.9,
            index: `rank-${ranks.indexOf(data.reward) + 1}`
        });
    }
}
