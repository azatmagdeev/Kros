import {canvas} from "./canvas.js";
import {cWrapper} from "./c-wrapper.js";



class App {
    constructor(root, search) {
        this.root = root;
        this.search = search;
        this.mindMapModel = {};
        this.init();
    }

    init() {
        this.root.appendChild(canvas.el);
        this.root.appendChild(cWrapper);

    }
}

new App(document.getElementById('root'));