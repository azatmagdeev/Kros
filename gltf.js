import * as THREE from "./lib/three.module.js";
import {OrbitControls} from "./lib/OrbitControls.js";
import {GLTFLoader} from "./lib/GLTFLoader.js";

const container = document.getElementById('c-wrapper');
if (window.innerHeight > window.innerWidth) {
    container["height"] = container.offsetWidth;
}
const loadingEl = document.getElementById('loadingPercent');
const canvas = document.getElementById('c');


const renderer = new THREE.WebGLRenderer({canvas, antialias: true, logarithmicDepthBuffer: true,});

const camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.1, 100000);
camera.position.set(-10, 0, 0);

const scene = new THREE.Scene();
scene.background = new THREE.Color('lightgrey');

const light = new THREE.DirectionalLight(0xffffff, 2);
scene.add(light);
const ambientLight = new THREE.AmbientLight("#ffffff");
scene.add(ambientLight);

const controls = new OrbitControls(camera, canvas);
controls.maxDistance = 20;
controls.minDistance = 3;
controls.update();


const textureLoader = new THREE.TextureLoader();
const ked = new THREE.Object3D();


const gltfLoader = new GLTFLoader();
gltfLoader.load('results/sneakers_lower_quality.gltf', gltf => {
    // console.log(gltf);
    const root = gltf.scene;
    scene.add(root);

    // ked.children = root.children;

    root.children.map(obj => {
        if (obj.isMesh) {
            ked.children.push(obj)
        } else {
            obj.children.map(o => {
                ked.children.push(o)
            })
        }
    })

    // ked.children.map(mesh => {
    //     mesh.material.color = new THREE.Color('red');
    // })
    // console.log(ked);

    loadingEl.style.display = 'none';
}, (xhr) => {
    if (xhr.lengthComputable) {
        const percentComplete = Math.round(xhr.loaded / xhr.total * 100);
        loadingEl.style.display = 'block';
        loadingEl.textContent = `Загрузка модели ${percentComplete} %`
    }
})

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

let currentMesh;

class PickHelper {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;
    }

    pick(normalizedPosition, scene, camera, time = 1000) {
        // восстановить цвет, если есть выбранный объект
        if (this.pickedObject) {
            this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
            currentMesh = this.pickedObject = undefined;
            hideMats();
        }


        // пролить луч через усеченный конус
        this.raycaster.setFromCamera(normalizedPosition, camera);
        // получаем список объектов, которые пересек луч
        const intersectedObjects = this.raycaster.intersectObjects(ked.children);
        // console.log(intersectedObjects.length);
        if (intersectedObjects.length) {
            // выбираем первый объект. Это самый близкий
            this.pickedObject = intersectedObjects[0].object;
            if (this.pickedObject.name === 'Cube.001_2') {
                this.pickedObject = ked.children.find(o => o.name === 'Cube.001_0');
            }
            console.log(this.pickedObject);
            this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
            // установить его излучающий цвет на мигающий красный / желтый
            this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0x00FF00 : 0x00FF00);
            // document.getElementById('mats').style.display = 'flex';
            showMats(this.pickedObject);
            currentMesh = this.pickedObject;
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
//
// window.addEventListener('touchend', clearPickPosition);

function render() {


    resizeRendererToDisplaySize(renderer);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();


// const details = [
//     'Язык',
//     'Подошва',
//     'Пятка',
//     'Шнурки',
//     'Основа',
// ];

// function showDetails() {
//     document.getElementById('details').style.visibility = 'visible';
//     details.map(item => {
//         const itemEl = document.createElement('div');
//         itemEl.className = 'item';
//         itemEl.textContent = item;
//         document.getElementById('details').appendChild(itemEl);
//         itemEl.addEventListener('click', () => {
//             showMats(item)
//         })
//     })
// }
//
function showMats(item) {
    // document.getElementById('details').style.visibility = 'hidden';
    document.getElementById('mats-wrapper').style.visibility = 'visible';
    // document.getElementById('mats').style.display = 'flex';
}

function hideMats() {
    // document.getElementById('details').style.visibility = 'hidden';
    document.getElementById('mats-wrapper').style.visibility = 'hidden';
    // document.getElementById('mats').style.display = 'flex';
}

const textureUrls = [
    'results/textures/leather-texutre.jpg',
    'results/textures/shoe_lace_texture.jpg',
    'results/textures/texture1.jpg',
    'results/textures/texture2.jpg',
    'results/textures/texture3.jpg',
    'results/textures/texture4.jpg',
]

textureUrls.map(url => {
    const item = document.createElement('div');
    item.className += 'item';
    item.style.backgroundImage = `url(${url})`;
    item.style.backgroundSize = `contain`;
    document.getElementById('mats').appendChild(item);
    item.addEventListener('click', () => {


        currentMesh.material.map = textureLoader.load(url);
        currentMesh.material.map.wrapS = 1000;
        currentMesh.material.map.wrapT = 1000;
        // console.log(currentMesh.material);


    });
    item.addEventListener('touchstart', () => {
        // console.log(currentMesh.material);
        currentMesh.material.map = textureLoader.load(url);
        currentMesh.material.map.wrapS = 1000;
        currentMesh.material.map.wrapT = 1000;
    })
})

