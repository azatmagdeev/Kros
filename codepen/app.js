import {hide, show} from "../lib/functions.js";
import {GLTFLoader} from "../lib/GLTFLoader.js";
import * as THREE from "../lib/three.module.js";
import {OrbitControls} from "../lib/OrbitControls.js";

const menBtn = document.getElementById('men');
const womenBtn = document.getElementById('women');
const lowKedBtn = document.getElementById('low-ked');
const highKedBtn = document.getElementById('high-ked');
const choiceEl = document.getElementById('choice');
const loadingPercentEl = document.getElementById('loadingPercent');
const loadNumber = document.getElementById('loadNumber');
const canvas = document.getElementById('c');
const ked = new THREE.Object3D();

let isMen;
let isLow;
let textureUrls = [];

menBtn.addEventListener('click', () => {
    isMen = true;
    showType();
});

womenBtn.addEventListener('click', () => {
    isMen = false;
    showType();
});

function showType() {
    hide(menBtn, womenBtn);
    show(lowKedBtn, highKedBtn);
}

lowKedBtn.addEventListener('click', () => {
    isLow = true;
    defineChoice(isMen, isLow);
    hide(document.getElementById('c-center'));
    loadmodel('../results/sneakers_lower_quality.gltf');
});

function defineChoice(m, l) {
    choiceEl.textContent = l ? 'низкий кед' : 'высокий кед';
    choiceEl.textContent += m ? ' для мужчин' : ' для женщин';
}

function loadmodel(modelUrl) {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(modelUrl, gltf => {
        const root = gltf.scene;
        showModel(root)
    }, xhr => {
        if (xhr.lengthComputable) {
            const percentComplete = Math.round(xhr.loaded / xhr.total * 100);
            loadingPercentEl.style.display = 'block';
            loadNumber.textContent =` ${percentComplete} %`
        }
    })
}


function showModel(root) {
    console.log(root);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('lightgrey');
    const light = new THREE.DirectionalLight(0xffffff, 2);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight("#ffffff", 1.5);
    scene.add(ambientLight);
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        logarithmicDepthBuffer: true,
    });
    const camera = new THREE.PerspectiveCamera(
        50,
        canvas.width / canvas.height,
        0.1,
        100000
    );
    camera.position.set(-10, 0, 0);

    const controls = new OrbitControls(camera, canvas);
    controls.maxDistance = 20;
    controls.minDistance = 3;
    controls.update();

    scene.add(root);
    root.children.map(obj => {
        if (obj.isMesh) {
            ked.children.push(obj)
        } else {
            obj.children.map(o => {
                ked.children.push(o)
            })
        }
    });





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


    function render() {
        resizeRendererToDisplaySize(renderer);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }



    hide(loadingPercentEl);
    let currentMesh;
    const pickHelper = new PickHelper(scene,currentMesh);

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
        pickHelper.pick(pickPosition, scene, camera, 100);
    }

    function clearPickPosition() {
        // в отличие от мыши, которая всегда имеет позицию
        // если пользователь перестает касаться экрана, который мы хотим
        // чтобы остановить выбор. Пока мы просто выбираем значение
        // вряд ли что-то выберу
        pickPosition.x = -100000;
        pickPosition.y = -100000;
    }

    window.addEventListener('click',
        setPickPosition);
// window.addEventListener('click', clearPickPosition);
// window.addEventListener('mouseleave', clearPickPosition);

    window.addEventListener('touchstart', (event) => {
        // предотвращаем прокрутку окна
        event.preventDefault();
        setPickPosition(event.touches[0]);
    }, {passive: false});

    window.addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
    });

    render();
}

class PickHelper {
    constructor(scene,currentMesh) {
        this.currentMesh = currentMesh;
        this.scene = scene;
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;
    }

    pick(normalizedPosition, scene, camera) {
        // восстановить цвет, если есть выбранный объект
        if (this.pickedObject) {
            this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
            this.currentMesh = this.pickedObject = undefined;
            hideMats();
            this.scene.children.map(o=>{
                o.material.emissive.setHex(this.pickedObjectSavedColor);
            })
        }

        // пролить луч через усеченный конус
        this.raycaster.setFromCamera(normalizedPosition, camera);
        // получаем список объектов, которые пересек луч
        const intersectedObjects = this.raycaster.intersectObjects(this.scene.children);
        if (intersectedObjects.length) {
            // выбираем первый объект. Это самый близкий
            this.pickedObject = intersectedObjects[0].object;
            if (this.pickedObject.name === 'Cube.001_2') {
                this.pickedObject = ked.children.find(o => o.name === 'Cube.001_0');
            }
            if (this.pickedObject.name === 'Cube.001_0' || this.pickedObject.name === 'Cube.001_1') {
                textureUrls = [
                    'results/textures/texture4.jpg',
                    'results/textures/white_rubber.png'
                ];
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                ked.children.find(o => o.name === 'Cube.001_0').material.emissive.setHex(0x00FFFF);
                ked.children.find(o => o.name === 'Cube.001_1').material.emissive.setHex(0x00FFFF);
                ked.children.find(o => o.name === 'Cube.001_2').material.emissive.setHex(0x00FFFF);

            }else{
                textureUrls = [
                    'results/textures/leather-texutre.jpg',
                    'results/textures/shoe_lace_texture.jpg',
                    'results/textures/texture1.jpg',
                    'results/textures/texture2.jpg',
                    'results/textures/texture3.jpg',
                    'results/textures/texture4.jpg',
                ];
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                this.pickedObject.material.emissive.setHex(0x00FFFF);
            }

            console.log(this.pickedObject);
            // установить его излучающий цвет на мигающий красный / желтый
            this.currentMesh = this.pickedObject;
            showMats(textureUrls)
        }
    }
}