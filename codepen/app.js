import {hide, show} from "../lib/functions.js";
import {GLTFLoader} from "../lib/GLTFLoader.js";
import * as THREE from "../lib/three.module.js";
import {OrbitControls} from "../lib/OrbitControls.js";
import mindMap from "./mindmap.js";

const menBtn = document.getElementById('men');
const womenBtn = document.getElementById('women');
const lowKedBtn = document.getElementById('low-ked');
const highKedBtn = document.getElementById('high-ked');
const choiceEl = document.getElementById('choice');
const loadingPercentEl = document.getElementById('loadingPercent');
const loadNumber = document.getElementById('loadNumber');
const canvas = document.getElementById('c');
const ked = new THREE.Object3D();
const textureLoader = new THREE.TextureLoader();

let isMen;
let isLow;
// let textureUrls = [];
let currentMesh = true;
let savedEmissiveColor;
let isItemEventTarget = false;

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
            loadNumber.textContent = ` ${percentComplete} %`
        }
    })
}

function showModel(root) {
    console.log(root);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('lightgrey');

    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0,10,0);
        light.target.position.set(0, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }
    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 0, 0);
        light.target.position.set(0, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }
    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(-10, 0, 0);
        light.target.position.set(0, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }
    const ambientLight = new THREE.AmbientLight("#ffffff", .5);
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

    showItems(mindMap.components);

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

    const pickHelper = new PickHelper(ked, currentMesh);

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
        isItemEventTarget = false;
    }

    function clearPickPosition() {
        // в отличие от мыши, которая всегда имеет позицию
        // если пользователь перестает касаться экрана, который мы хотим
        // чтобы остановить выбор. Пока мы просто выбираем значение
        // вряд ли что-то выберу
        pickPosition.x = -100000;
        pickPosition.y = -100000;
    }

    canvas.addEventListener('click',
        setPickPosition);

    canvas.addEventListener('touchstart', (event) => {
        // предотвращаем прокрутку окна
        // event.preventDefault();
        setPickPosition(event.touches[0]);
    }, {passive: false});

    canvas.addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
    });

    render();
}

class PickHelper {
    constructor(scene) {

        this.scene = scene;
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
    }

    pick(normalizedPosition, scene, camera) {
        // восстановить цвет, если есть выбранный объект
        if (this.pickedObject) {
            this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
            this.pickedObject = undefined;
            hideMats();
            this.scene.children.map(o => {
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
            currentMesh = this.pickedObject;
            if (this.pickedObject.name === 'Cube.001_2') {
                this.pickedObject = this.scene.children.find(o => o.name === 'Cube.001_0');
            }
            if (this.pickedObject.name === 'Cube.001_0' || this.pickedObject.name === 'Cube.001_1') {
                currentMesh = [
                    this.scene.children.find(o => o.name === 'Cube.001_0'),
                    this.scene.children.find(o => o.name === 'Cube.001_1'),
                ];
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                lightUpComponent(['Cube.001_0', 'Cube.001_1']);
                console.log(mindMap.components.find(o => o.name === 'Подошва'));
                showItems(mindMap.components.find(o => o.name === 'Подошва').textures)
            } else {

                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();


                lightUpComponent(this.pickedObject.name);
                showItems(mindMap.components.find(o => o.mesh_name = currentMesh.name).textures);

            }

            console.log(this.pickedObject);

            currentMesh = this.pickedObject;

        } else {
            if (!isItemEventTarget) showItems(mindMap.components);
        }
    }
}


function hideMats() {
    document.getElementById('mats-wrapper').style.visibility = 'hidden';
}

function setTexture(item) {

    if (typeof item === 'string') {
        currentMesh.material.map = textureLoader.load(item);
        currentMesh.material.emissive.setHex(savedEmissiveColor);
        currentMesh.material.map.wrapS = 1000;
        currentMesh.material.map.wrapT = 1000;
    }
    if (typeof item === 'object' && !Array.isArray(item)) {
        for (const key in item) {
            const mesh = ked.children.find(o => o.name === key);
            mesh.material.map = textureLoader.load(item[key], () => {

                mesh.material.map.wrapS = 1000;
                mesh.material.map.wrapT = 1000;
                mesh.material.emissive.setHex(savedEmissiveColor);
            });
        }
    }

}

function showItems(items) {
    document.getElementById('mats').innerHTML = '';

    items.map((item) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <img src=${item.url} alt="">
            <p>${item.name}</p>        
        `;
        document.getElementById('mats').appendChild(div);
        div.addEventListener('click', () => {
            isItemEventTarget = true;
            item.textures ? showItems(item.textures) : console.warn('No Textures!');
            if (item.mesh_name) lightUpComponent(item.mesh_name);
            if (!item.textures && !item.mesh_name) {
                console.log(currentMesh);
                setTexture(item.urls ? item.urls : item.url)
            }
        })
    });

    document.getElementById('mats').style.visibility = 'visible';
}

function lightUpComponent(name) {
    if (Array.isArray(name)) {
        currentMesh = [];
        name.map(n => {
            const meshForLightUp = ked.children.find(o => o.name === n);
            savedEmissiveColor = meshForLightUp.material.emissive.getHex();
            meshForLightUp.material.emissive.setHex(0x00FF00);
            currentMesh.push(meshForLightUp);
        })
    } else {
        currentMesh = ked.children.find(o => o.name === name);
        console.log(currentMesh);
        savedEmissiveColor = currentMesh.material.emissive.getHex();
        currentMesh.material.emissive.setHex(0x00FF00);
    }
}