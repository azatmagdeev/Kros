import * as THREE from "./lib/three.module.js";
import {OBJLoader2} from "./lib/OBJLoader2.js";
import {OrbitControls} from "./lib/OrbitControls.js";
import {MTLLoader} from "./lib/MTLLoader.js";
import {MtlObjBridge} from "./lib/MtlObjBridge.js";

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true, logarithmicDepthBuffer: true,});
const camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.1, 2000);
camera.position.set(1000, 200, 600);
const scene = new THREE.Scene();
scene.background = new THREE.Color('grey');

const light = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light);
const ambientLight = new THREE.AmbientLight("#ffffff");
scene.add(ambientLight);

const controls = new OrbitControls(camera, canvas);
controls.target.set(350, 100, 750);
controls.maxDistance = 1000;
controls.minDistance = 400;
controls.update();

{
    function makeLine(x, y, z) {
        const geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(x, y, z));
        const material = new THREE.LineBasicMaterial({color: 0x0000ff});
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        return line;
    }

    makeLine(0, 0, 1000);
    makeLine(0, 0, -1000);
    makeLine(0, 1000, 0);
    makeLine(0, -1000, 0);
    makeLine(1000, 0, 0);
    makeLine(-1000, 0, 0);
    console.log('tut');
}


// const objLoader = new OBJLoader2();
// objLoader.load('model-shoe/Красовок.obj', (root) => {
//     console.log(root);
//     scene.add(root);
// }, (xhr) => {
//     if (xhr.lengthComputable) {
//         const percentComplete = xhr.loaded / xhr.total * 100;
//         console.log(Math.round(percentComplete) + '% model downloaded');
//     }
// })
const ked = new THREE.Object3D();
{
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/1.mtl', (mtlParseResult) => {
        const objLoader = new OBJLoader2();
        const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
        objLoader.addMaterials(materials);
        objLoader.load('model-shoe/Красовок.obj', (root) => {
            console.log(root);
            ked.children = root.children;
            scene.add(ked);
        }, (xhr) => {
            if (xhr.lengthComputable) {
                const percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete) + '% model downloaded');
            }
        })
    });
}

function resizeRendererToDisplaySize(renderer) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    return needResize;
}

class PickHelper {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;
    }

    pick(normalizedPosition, scene, camera, time = 100) {
        // восстановить цвет, если есть выбранный объект
        if (this.pickedObject) {
            this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
            this.pickedObject = undefined;
        }

        // пролить луч через усеченный конус
        this.raycaster.setFromCamera(normalizedPosition, camera);
        // получаем список объектов, которые пересек луч
        const intersectedObjects = this.raycaster.intersectObjects(ked.children);
        if (intersectedObjects.length) {
            // выбираем первый объект. Это самый близкий
            this.pickedObject = intersectedObjects[0].object;
            console.log(this.pickedObject);
            // сохранить его цвет
            this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
            // установить его излучающий цвет на мигающий красный / желтый
            this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
        }
    }
}

const pickHelper = new PickHelper();


const pickPosition = {x: 0, y: 0};
clearPickPosition();

function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * canvas.width / rect.width,
        y: (event.clientY - rect.top) * canvas.height / rect.height,
    };
}

function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width) * 2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // обратите внимание, мы переворачиваем Y
}

function clearPickPosition() {
    // в отличие от мыши, которая всегда имеет позицию
    // если пользователь перестает касаться экрана, который мы хотим
    // чтобы остановить выбор. Пока мы просто выбираем значение
    // вряд ли что-то выберу
    pickPosition.x = -100000;
    pickPosition.y = -100000;
}

window.addEventListener('click', setPickPosition);
// window.addEventListener('click', clearPickPosition);
// window.addEventListener('mouseleave', clearPickPosition);

// window.addEventListener('touchstart', (event) => {
//     // предотвращаем прокрутку окна
//     event.preventDefault();
//     setPickPosition(event.touches[0]);
// }, {passive: false});
//
// window.addEventListener('touchmove', (event) => {
//     setPickPosition(event.touches[0]);
// });
//
// window.addEventListener('touchend', clearPickPosition);

function render() {

    pickHelper.pick(pickPosition, scene, camera,  100);
    resizeRendererToDisplaySize(renderer);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();