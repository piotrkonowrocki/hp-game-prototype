import replacementsArray from './replacements-array';

export default class Card {
    constructor(params) {
        this.params = params;
        this.internval = [];

        this.renderLayout();
        if (this.params.back) this.renderBack();
        if (this.params.renderDefaultValues) this.renderDefaultValues();
        if (this.params.renderCustomValues) this.renderCustomValues();
    }

    renderLayout() {
        const regions = this.params.regions || this.determineDefaultRegions();

        this.container = document.createElement('div');

        this.container.classList.add('card');
        this.container.classList.add(`card--format-${this.params.format}`);

        regions.forEach(item => {
            const region = document.createElement('div');

            region.classList.add('region');
            region.classList.add(`region--position-${item}`);

            ['left-top', 'left-bottom', 'right-top', 'right-bottom'].forEach(item2 => {
                const corner = document.createElement('div');

                corner.classList.add('corner');
                corner.classList.add(`corner--position-${item2}`);
                region.appendChild(corner);
            });

            this.container.appendChild(region);
        });
    }

    determineDefaultRegions() {
        const regions = [];
        const footerKeys = ['val', 'slot', 'size', 'darkMagic', 'modifiers', 'duration', 'traces', 'level', 'versus'];

        if (this.params.data) {
            if (this.params.data.title) regions.push('header');
            if (this.params.data.cover) regions.push('cover');
            if (this.params.data.category) regions.push('subheader');
            regions.push('content');
            if (Object.keys(this.params.data).some(item => footerKeys.indexOf(item) >= 0)) regions.push('footer');
        }

        return regions;
    }

    renderBack() {
        const img = document.createElement('img');

        img.src = `../img/content/${this.params.back}.png`;
        img.classList.add('back-icon');

        this.container.classList.add('mod--back');
        this.container.appendChild(img);
    }

    renderDefaultValues() {
        const data = this.params.data;

        if (data.title) {
            const title = this.createTextNode(data.title, {
                classes: ['title']
            });

            this.container.querySelector('.region--position-header').appendChild(title);
        }
        if (data.cover) {
            const cover = document.createElement('div');
            const img = document.createElement('img');

            cover.classList.add('cover');
            img.src = `../img/content/${data.cover}.png`;

            cover.appendChild(img);
            this.container.querySelector('.region--position-cover').appendChild(cover);
        }
        if (data.category) {
            const category = this.createTextNode(data.category, {
                classes: ['category']
            });

            this.container.querySelector('.region--position-subheader').appendChild(category);
        }
        if (data.description) {
            data.description.forEach(item => {
                // const textWithoutOrphans = item.replace(/\s([^\s<]+)\s*$/u, '\u00A0$1');
                const description = this.createTextNode(item, {
                    classes: ['description']
                });

                this.container.querySelector('.region--position-content').appendChild(description);
            });
        }
        if (data.val) {
            this.pushIcon('footer', 'left-bottom', {
                icon: 'money',
                text: data.val
            });
        }
        if (data.size) {
            this.pushIcon('footer', 'left-bottom', {
                icon: 'item-size',
                scale: 0.9,
                text: data.size
            });
        }
        if (data.darkMagic) {
            this.pushIcon('footer', 'left-bottom', {
                icon: 'dark-magic',
                scale: 0.9,
                last: true
            });
        }
    }

    createTextNode(text, settings = {}) {
        const textNode = document.createElement('span');
        let textToDisplay = text;

        textNode.classList.add('text-node');
        if (settings.classes) {
            settings.classes.forEach(item => {
                textNode.classList.add(item);
            });
        }
        if (settings.wrapper) textToDisplay = `<${settings.wrapper}>${textToDisplay}</${settings.wrapper}>`;
        if (settings.prefix) textToDisplay = `${settings.prefix}${textToDisplay}`;
        textNode.innerHTML = this.replaceTextToIcon(textToDisplay);

        return textNode;
    }

    createTechniqueDiagram(schema) {
        const ul = document.createElement('ul');

        ul.classList.add('techniques');
        schema.forEach(item => {
            if (item) {
                const li = document.createElement('li');

                li.classList.add('techniques-die');
                if (['/', '→'].some(symbol => item.includes(symbol))) li.classList.add('techniques-die--borderless');
                if (item.match(/^(→|↺|✓|◻|\+)$/u)) li.classList.add('techniques-die--textless');
                if (item === '→') li.classList.add('techniques-die--result');
                else if (item === '↺') li.classList.add('techniques-die--reroll');
                else if (item === '✓') li.classList.add('techniques-die--check');
                else if (item === '+') li.classList.add('techniques-die--plus');
                li.innerText = item;

                ul.appendChild(li);
            }
        });

        return ul;
    }

    createProgressGrid(schema) {
        const grid = document.createElement('div');

        grid.classList.add('progress');
        schema.forEach(list => {
            list.forEach(item => {
                const point = document.createElement('div');

                point.classList.add('progress-point');
                if (item !== '•') point.innerText = item;
                if (!item.match(/^(•|1|2|3|4)$/u)) {
                    point.classList.add('progress-point--bg');
                    point.classList.add(`progress-point--${item.toLowerCase()}`);
                }

                grid.appendChild(point);
            });
        });

        return grid;
    }

    createIncomeTrack(schema) {
        const lists = [];

        for (const [k, v] of Object.entries(schema)) {
            if (k !== 'moneyMultiplier' && v > 0) {
                const ul = document.createElement('ul');

                ul.classList.add('income');
                for (let i = 0; i <= parseInt(v, 10); i++) {
                    const li = document.createElement('li');

                    li.classList.add('income-point');
                    if (k === 'money' && i === parseInt(v, 10)) li.innerText = `${schema.moneyMultiplier}₷`;
                    else if (i === parseInt(v, 10)) li.classList.add(k);

                    ul.appendChild(li);
                }

                lists.push(ul);
            }
        }

        return lists;
    }

    createAttributeMarker(icon, val) {
        const marker = document.createElement('div');
        const valWrapper = document.createElement('div');
        const iconWrapper = document.createElement('div');
        const iconImage = document.createElement('img');

        marker.classList.add('attribute-marker');
        valWrapper.classList.add('attribute-marker-val');
        valWrapper.innerText = val;
        iconWrapper.classList.add('attribute-marker-icon');
        iconImage.classList.add('attribute-marker-icon-image');
        iconImage.src = `../img/content/attribute-${icon}.png`;

        iconWrapper.appendChild(iconImage);
        marker.appendChild(iconWrapper);
        marker.appendChild(valWrapper);

        return marker;
    }

    replaceTextToIcon(text) {
        let replacedText = text;

        Object.keys(replacementsArray).forEach(k => {
            if (replacedText.includes(k)) {
                const textWithSpan = k.includes(' ') ? k.replace(' ', '</span> ') : `${k}</span>`;

                replacedText = replacedText.replace(
                    k,
                    `<span class="no-wrap"><img class="in-text-icon" src="../img/content/${replacementsArray[k]}.png" /> ${textWithSpan}`
                );
            }
        });

        return replacedText;
    }

    boldWordInText(text, word) {
        return text.replace(new RegExp(word, 'gu'), `<strong>${word}</strong>`);
    }

    pushIcon(region, corner, settings = {}) {
        const container = document.createElement('div');

        if (settings.icon) {
            const img = document.createElement('img');

            img.classList.add('icon-image');
            img.src = `../img/content/${settings.icon}.png`;
            if (settings.scale) img.style.transform = `scale(${settings.scale})`;
            container.appendChild(img);
        }
        if (settings.index) {
            const img = document.createElement('img');

            img.classList.add('icon-index');
            img.src = `../img/content/${settings.index}.png`;
            container.appendChild(img);
        }
        if (settings.text) {
            const text = document.createElement('span');

            text.classList.add('icon-text');
            text.innerHTML = settings.text;
            container.appendChild(text);
        }
        if (settings.addition) {
            const symbol = document.createElement('span');
            const img = document.createElement('img');

            symbol.classList.add('icon-addition-symbol');
            symbol.innerHTML = settings.addition[0];
            img.classList.add('icon-addition-image');
            img.src = `../img/content/${settings.addition[1]}.png`;
            container.appendChild(symbol);
            container.appendChild(img);
        }
        if (settings.last) {
            container.classList.add('icon--last');
        }

        container.classList.add('icon');
        this.container.querySelector(`.region--position-${region} .corner--position-${corner}`).appendChild(container);
    }

    pushColumns(n) {
        const columns = document.createElement('div');

        columns.classList.add('columns');
        this.container.querySelector('.region--position-content').classList.add('columns');
        for (let i = 0; i < n; i++) {
            const column = document.createElement('div');

            column.classList.add('column');
            column.classList.add(`column-${i + 1}`);
            columns.appendChild(column);
            this.container.querySelector('.region--position-content').appendChild(columns);
        }
    }

    renderCustomValues() {
        this.params.renderCustomValues(this);
    }

    resetTextInRegions() {
        Object.keys(this.internval).forEach(k => {
            clearInterval(this.internval[k]);
        });
        this.container.querySelectorAll('.region').forEach(item => {
            if (item.getAttribute('data-font-size')) {
                item.removeAttribute('data-font-size');
                item.removeAttribute('style');
            }
        });
    }

    fitTextInRegions() {
        this.internval = {};

        this.container.querySelectorAll('.region').forEach(item => {
            const id = item.className;

            this.internval[id] = setInterval(() => {
                if (item.scrollHeight > item.offsetHeight) {
                    let fontSize = item.getAttribute('data-font-size') || 1;

                    fontSize -= 0.01;

                    item.setAttribute('data-font-size', fontSize);
                    item.style.fontSize = `${fontSize}em`;
                } else clearInterval(this.internval[id]);
            }, 10);
        });
    }

    getNode() {
        return this.container;
    }
}
