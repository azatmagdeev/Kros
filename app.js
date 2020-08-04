import * as THREE from "./lib/three.module.js";
import {OBJLoader2} from "./lib/OBJLoader2.js";
import {OrbitControls} from "./lib/OrbitControls.js";
import {MTLLoader} from "./lib/MTLLoader.js";
import {MtlObjBridge} from "./lib/MtlObjBridge.js";

const loadingEl = document.getElementById('loadingPercent');
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

//lines
// {
//     function makeLine(x, y, z) {
//         const geometry = new THREE.Geometry();
//         geometry.vertices.push(new THREE.Vector3(0, 0, 0));
//         geometry.vertices.push(new THREE.Vector3(x, y, z));
//         const material = new THREE.LineBasicMaterial({color: 0x0000ff});
//         const line = new THREE.Line(geometry, material);
//         scene.add(line);
//         return line;
//     }
//
//     makeLine(0, 0, 1000);
//     makeLine(0, 0, -1000);
//     makeLine(0, 1000, 0);
//     makeLine(0, -1000, 0);
//     makeLine(1000, 0, 0);
//     makeLine(-1000, 0, 0);
//     console.log('tut');
// }

const textureLoader = new THREE.TextureLoader();
const  soleTexture =  textureLoader.load('model-shoe/textures/tmb_6931_4916.jpg');
const ked = new THREE.Object3D();
{
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/1.mtl', (mtlParseResult) => {
        const objLoader = new OBJLoader2();
        const materials = MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult,);
        objLoader.addMaterials(materials);
        objLoader.load('model-shoe/Красовок.obj', (root) => {

            loadingEl.style.display = 'none';
            // root.children.find(mesh => mesh.name === 'Obj9').material[0].map = soleTexture;
            // root.children.find(mesh => mesh.name === 'Obj9').material[1].map = soleTexture;
            root.children.find(mesh => mesh.name === 'Obj9').material[0].side = 2;
            // console.log(root.children.find(mesh => mesh.name === 'Obj9').material[2]);
            root.children.find(mesh => mesh.name === 'Obj9').material.map(o=>{console.log(o.name);})
            // console.log(root.children.length);
            ked.children = root.children;
            scene.add(ked);
            showDetails();
        }, (xhr) => {
            if (xhr.lengthComputable) {
                const percentComplete = Math.round(xhr.loaded / xhr.total * 100);
                loadingEl.style.display = 'block';
                loadingEl.textContent = `Загрузка модели ${percentComplete} %`
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

    pick(normalizedPosition, scene, camera, time = 1000) {
        // восстановить цвет, если есть выбранный объект
        if (this.pickedObject) {
            if(this.pickedObject.material.length){
                this.pickedObject.material[0].emissive.setHex(this.pickedObjectSavedColor);
            }else{
                this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
            }
            this.pickedObject = undefined;
        }

        // пролить луч через усеченный конус
        this.raycaster.setFromCamera(normalizedPosition, camera);
        // получаем список объектов, которые пересек луч
        const intersectedObjects = this.raycaster.intersectObjects(ked.children);
        console.log(intersectedObjects.length);
        if (intersectedObjects.length) {
            // выбираем первый объект. Это самый близкий
            this.pickedObject = intersectedObjects[0].object;
            console.log(this.pickedObject);
            // сохранить его цвет
            if(this.pickedObject.material.length){
                this.pickedObjectSavedColor =  this.pickedObject.material[0].emissive.getHex()
                // установить его излучающий цвет на мигающий красный / желтый
                this.pickedObject.material[0].emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
            }else{
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                // установить его излучающий цвет на мигающий красный / желтый
                this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
            }




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
    pickHelper.pick(pickPosition, scene, camera,  100);
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


    resizeRendererToDisplaySize(renderer);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();


const details = [
    'Язык',
    'Подошва',
    'Пятка',
    'Шнурки',
    'Основа',
];

function showDetails(){
    document.getElementById('details').style.visibility = 'visible';

    // for (let i = 0; i < detailsCount; i++) {
    //     const item = document.createElement('div');
    //     item.className = 'item';
    //     document.getElementById('details').appendChild(item);
    //     item.addEventListener('click', ()=>{showMats(item)})
    // }
    details.map(item=>{
        const itemEl = document.createElement('div');
            itemEl.className = 'item';
            itemEl.textContent = item;
            document.getElementById('details').appendChild(itemEl);
            itemEl.addEventListener('click', ()=>{showMats(item)})
    })
}

function showMats(item){
    document.getElementById('details').style.visibility = 'hidden';
    document.getElementById('mats').style.visibility = 'visible';
}

