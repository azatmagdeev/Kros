import {OBJLoader2} from "./OBJLoader2.js";
import * as THREE from "./three.module.js";

export class Ked {
    constructor(url) {
        this.url = url;
        this.load()
        this.model = new THREE.Object3D();
    }

    load() {
        const objLoader = new OBJLoader2();
        objLoader.load(this.url,root=>{
            return root;

        },xhr=>{

        })
    }
}