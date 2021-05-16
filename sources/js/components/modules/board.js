/* global ClipboardItem */

import {toPng} from 'html-to-image';
import b64toBlob from 'b64-to-blob';

export default class {
    constructor() {
        this.sets = {};
        this.sheetDataSettings = {
            sheet: '1_SWyAOszjzE-lMBPT9EYnXwjnaDhh040yT8EzQ971ho',
            tabs: ['Pola']
        };
        this.deckSettings = {
            format: 'board',
            regions: ['content'],
            renderer: this.renderer
        };
    }

    parseData(sheet) {
        sheet.shift();
        sheet.forEach((row, i) => {
            if (row[0] !== row[1]) {
                this.sets[i] = {
                    title: 'Lokacja',
                    area: row[0],
                    field: row[1],
                    properties: row[4].split(/\r?\n/u)
                };
            }
        });
    }

    renderer(card) {
        const data = card.params.data;
        const name = document.createElement('span');
        const field = document.createElement('div');

        field.classList.add('field');
        name.classList.add('field-name');

        name.innerHTML = `<span class="place">${data.field}</span><br /><span class="area">${data.area}</span>`;

        field.appendChild(name);
        card.container.querySelector('.region--position-content').appendChild(field);

        if (data.properties[0]) {
            const properties = document.createElement('div');

            properties.classList.add('properties');
            card.container.querySelector('.region--position-content').appendChild(properties);
            data.properties.forEach(item => {
                const property = card.createTextNode(card.boldWordInText(item, 'Akcja:'), {
                    classes: ['description', 'property']
                });

                properties.appendChild(property);
            });
            card.container.querySelector('.region--position-content').appendChild(properties);
        }

        field.addEventListener('click', () => {
            const node = card.getNode();

            setTimeout(() => {
                node.classList.add('loading');
            }, 1);
            toPng(node)
                .then(base64 => {
                    const blob = b64toBlob(base64.replace('data:image/png;base64,', ''), 'image/png');

                    navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]);
                    node.classList.remove('loading');
                });
        });
    }
}
