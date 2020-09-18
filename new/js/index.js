
import {cWrapper} from "./c-wrapper.js";
import {canvas} from "./canvas.js";



class App {
    constructor(root, search) {
        this.root = root;
        this.search = search;
        this.mindMapModel = {};
        this.init();
    }

    init() {

        this.root.appendChild(cWrapper);
        this.root.appendChild(canvas.el);

    }
}

new App(document.getElementById('root'));