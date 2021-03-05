export default class Resizer {
    constructor() {
        this.defaultFontSize = 10;
        this.customEvent = new CustomEvent('font-resized');

        this.renderDOM();
        this.attachEvents();
    }

    renderDOM() {
        if (localStorage.defaultFontSize) document.documentElement.style.fontSize = `${localStorage.defaultFontSize}px`;

        this.wrapper = document.createElement('div');
        this.plus = document.createElement('a');
        this.default = document.createElement('a');
        this.minus = document.createElement('a');

        this.wrapper.classList.add('resizer');
        this.plus.classList.add('resizer-icon');
        this.plus.classList.add('resizer-icon--plus');
        this.plus.innerText = '+';
        this.plus.href = '#';
        this.default.classList.add('resizer-icon');
        this.default.classList.add('resizer-icon--default');
        this.default.innerText = '↻';
        this.default.href = '#';
        this.minus.classList.add('resizer-icon');
        this.minus.classList.add('resizer-icon--minus');
        this.minus.innerText = '-';
        this.minus.href = '#';

        this.wrapper.appendChild(this.plus);
        this.wrapper.appendChild(this.default);
        this.wrapper.appendChild(this.minus);
        document.body.appendChild(this.wrapper);
    }

    attachEvents() {
        this.plus.addEventListener('click', e => {
            this.changeFontSize('up');

            e.preventDefault();
        });
        this.default.addEventListener('click', e => {
            this.resetFontSize();

            e.preventDefault();
        });
        this.minus.addEventListener('click', e => {
            this.changeFontSize('down');

            e.preventDefault();
        });
    }

    changeFontSize(direction) {
        let fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize, 10);

        if (direction === 'up') fontSize++;
        else if (direction === 'down') fontSize--;
        document.documentElement.style.fontSize = `${fontSize}px`;
        document.body.dispatchEvent(this.customEvent);
        localStorage.defaultFontSize = fontSize;
    }

    resetFontSize() {
        document.documentElement.style.fontSize = `${this.defaultFontSize}px`;
        document.body.dispatchEvent(this.customEvent);
        localStorage.defaultFontSize = this.defaultFontSize;
    }
}
