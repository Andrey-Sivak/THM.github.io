class Calculator {
    constructor( options ) {
        this.wrap = document.querySelector(`#${options.wrapID}`);
        if( !this.wrap ) {
            return;
        }
        this.handle = document.querySelector(`.${options.handleClass}`);
        this.progressBar = document.querySelector(`.${options.progressClass}`);
        this.value = document.querySelector(`.${options.valueClass}`);
        this.input = document.querySelector(`.${options.inputClass}`);
        this.buttons = document.querySelector(`.${options.buttonsWrapClass}`);
        this.min = 10000;
        this.max = 2000000 + this.min;

        this.data = {
            handleLeft: this.handle.getBoundingClientRect().left,
            handleWidth: this.handle.getBoundingClientRect().width,
            wrapWidth: this.wrap.getBoundingClientRect().width - this.handle.getBoundingClientRect().width,
            valueWidth: this.value.getBoundingClientRect().width,
            mouseX: 0,
        };

        this.checkMouseCoords = this.checkMouseCoords.bind(this);
        this.changeInputValue = this.changeInputValue.bind(this);
    }

    checkMouseCoords(e) {
        let eventDoc = 0;
        let doc = 0;
        let body = 0;

        if (e.pageX == null && e.clientX != null) {
            eventDoc = (e.target && e.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            e.pageX = e.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
        }

        this.data.mouseX = e.pageX;

        let diff = this.data.mouseX - this.data.handleLeft - this.data.handleWidth;

        if(diff > this.data.wrapWidth) {
            diff = this.data.wrapWidth;
        }

        if(diff >= 0) {
            if( this.value.children[0] ) {
                this.value.removeChild(this.value.children[0]);
            }
            this.value.style.left = `${diff}px`;
            this.handle.style.left = `${diff}px`;
            this.progressBar.style.width = `${diff}px`;
            this.changeInputValue(diff);
            const buttons = [...this.buttons.children];
            buttons.forEach( function (button) {
                if( !button.classList.contains('active') ) {
                    button.classList.add('active');
                }
            })
        }
    }

    changeInputValue(num) {
        const step =  this.data.wrapWidth / ((this.max - this.min) / this.min);
        let steps = Math.ceil(Math.ceil(num) / step);
        let str = `$${steps * this.min}`;
        console.log(str.length);
        if(str.length < 8 && str.length >= 5) {
            str = `${str.slice(0, -3)}.000`;
        } else if(str.length >= 8 && str.length < 11) {
            str = `${str.slice(0, -6)}.${str.slice(-6, -3)}.000`;
        }
        this.value.innerHTML = str;
    }

    changeValue() {
        document.body.addEventListener('mousemove', this.checkMouseCoords);
    }

    build() {
        const self = this;
        this.handle.addEventListener('mousedown', function () {
            self.changeValue();
        });

        document.body.addEventListener('mouseup', function () {
            this.removeEventListener('mousemove', self.checkMouseCoords);
        })
    }
}

export { Calculator };