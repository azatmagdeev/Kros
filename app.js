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
{
    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/1.mtl', (mtlParseResult) => {
        const objLoader = new OBJLoader2();
        const materials =  MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult);
        objLoader.addMaterials(materials);
        objLoader.load('model-shoe/Красовок.obj', (root) => {
            console.log(root);
            scene.add(root);
        });
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

function render() {
    resizeRendererToDisplaySize(renderer);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();