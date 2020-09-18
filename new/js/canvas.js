import * as THREE from "../../lib/three.module.js";
import {OrbitControls} from "../../lib/OrbitControls.js";
import {Model} from "./model.js";


class Canvas {
    constructor() {
        this.el = document.createElement('canvas');
        this.el.id = `c`;
        this.scene = new THREE.Scene();
        this.prepareScene();
        this.render();
    }

    prepareScene() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.el,
            antialias: true,
            logarithmicDepthBuffer: true,
        });

        this.camera = new THREE.PerspectiveCamera(
            50,
            this.el.width / this.el.height,
            0.1,
            100000
        );

        this.scene.background = new THREE.Color('white');
        this.addLights();
        this.camera.position.set(-7, 0, 3.5);

        const controls = new OrbitControls(this.camera, this.el);
        controls.maxDistance = 20;
        controls.minDistance = 2;
        controls.update();

        this.model = new Model(this.scene);
    }

    addLights() {
        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.y = 10;
            light.target.position.set(0, 0, 0);
            this.scene.add(light);
            this.scene.add(light.target);
        }
        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.x = 10;
            light.target.position.set(0, 0, 0);
            this.scene.add(light);
            this.scene.add(light.target);
        }
        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.x = -10;
            light.target.position.set(0, 0, 0);
            this.scene.add(light);
            this.scene.add(light.target);
        }
        {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.y = -15;
            light.target.position.set(0, 0, 0);
            this.scene.add(light);
            this.scene.add(light.target);
        }
        const ambientLight = new THREE.AmbientLight("#ffffff", .5);
        this.scene.add(ambientLight);
    }

    render() {
        this.resizeRendererToDisplaySize();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            this.render()
        });
    }


    resizeRendererToDisplaySize() {
        const width = this.el.clientWidth;
        const height = this.el.clientHeight;
        const needResize = (this.el.width !== width || this.el.height !== height);
        if (needResize) {
            this.renderer.setSize(width, height, false);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
        return needResize;
    }

    showModel(root) {
        this.scene.add(root);

    }
}

export const canvas = new Canvas();
console.log(canvas);


