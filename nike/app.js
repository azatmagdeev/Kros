import {hide, show} from "../lib/functions.js";
import {GLTFLoader} from "../lib/GLTFLoader.js";
import * as THREE from "../lib/three.module.js";
import {OrbitControls} from "../lib/OrbitControls.js";
import mindMap from "./mindmap.js";

console.log(window);
let isMobile = innerWidth < 500;

window.addEventListener('resize', () => {
    isMobile = innerWidth < 500
})

const loadingPercentEl = document.getElementById('loadingPercent');
const loadNumber = document.getElementById('loadNumber');
const canvas = document.getElementById('c');
const ked = new THREE.Object3D();
const textureLoader = new THREE.TextureLoader();

let currentMesh = false;
let currentComponent;
let currentTexture;
let savedEmissiveColor;
let isItemEventTarget = false;
let mindMapModel;
const defaultMaterials = {};
let savingKey = [];//сюда будем собирать код для сохранения-загрузки

//отсюда будем читать код для кастомизации модели
const search = window.location.search.replace('?', '');

if (window.location.search === '') {
    mindMapModel = mindMap[0];
    loadModel(mindMapModel.obj_url);
} else {
    mindMapModel = mindMap.find(o => o.id === search[0]);
    // console.log(mindMapModel);
    savingKey[0] = mindMapModel.id;
    // console.log({savingKey});
    loadModel(mindMapModel.obj_url);
}

function loadModel(modelUrl) {
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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('lightgrey');

    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.y = 10;
        light.target.position.set(0, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }
    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.x = 10;
        light.target.position.set(0, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }
    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.x = -10;
        light.target.position.set(0, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }
    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.y = -15;
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
    camera.position.set(-7, 0, 3.5);

    const controls = new OrbitControls(camera, canvas);
    controls.maxDistance = 20;
    controls.minDistance = 3;
    controls.update();

    root.rotation.x = -100;

    root.children.map(obj => {
        if (obj.isMesh) {
            ked.children.push(obj)
        } else {
            obj.children.map(o => {
                ked.children.push(o)
            })
        }
    });

    if (search.length > 1) loadSavedTextures();

    scene.add(root);

    ked.children.map(mesh => {
        mesh.material = new THREE.MeshStandardMaterial({...mesh.material});
        defaultMaterials[mesh.name] = new THREE.MeshStandardMaterial({...mesh.material});
        mesh.material.needsUpdate = true;
    });

    showComponents(mindMapModel.components);

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
        setPickPosition(event.touches[0]);
    }, {passive: false});

    // canvas.addEventListener('touchmove', (event) => {
    //     setPickPosition(event.touches[0]);
    // });

    render();
}

function loadSavedTextures() {
    const searchArray = [];
    for (let i = 0; i < search.length; i++) {
        searchArray[i] = search[i];
    }
    searchArray.map((el, index) => {
        try {
            const component = mindMapModel.components.find(comp => comp.id == index);
            component.textures.map(texture => {
                if (texture.id) {
                    // console.log(texture.id);
                    // if (texture.id === el) console.log('bingo!');
                } else {
                    texture.textures.map(texture => {
                        // console.log(texture.id);
                        if (texture.id === el) {
                            // console.log(texture.url);
                            // currentMesh = [];
                            component.mesh_name.map(name => {
                                // console.log(texture.url);
                                currentMesh = ked.children.find(o => o.name === name);
                                setTexture(texture.url)
                            })
                        }

                    })
                }
            })

        } catch (e) {
            console.warn(e.message);
        }

    })
}

document.getElementById('again').addEventListener(
    'click', () => {
        ked.children.map(mesh => {
            // console.log(defaultMaterials[mesh.name]);
            mesh.material = new THREE.MeshStandardMaterial({...defaultMaterials[mesh.name]});
            mesh.material.needsUpdate = true;
        })
    }
);

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
            if (matsWrapper.getAttribute('data-id') === 'close') arrow.click();
            // выбираем первый объект. Это самый близкий
            this.pickedObject = intersectedObjects[0].object;
            // console.log(this.pickedObject);
            if (!checkAvailability(this.pickedObject)) return false;
            currentMesh = this.pickedObject;
            if (this.pickedObject.name === 'Cube.001_2') {
                this.pickedObject = this.scene.children.find(o => o.name === 'Cube.001_0');
            }
            if (this.pickedObject.name === 'Cube.003_2') {
                this.pickedObject = this.scene.children.find(o => o.name === 'Cube.003_0');
            }
            if (this.pickedObject.name === 'Cube.001_0' || this.pickedObject.name === 'Cube.001_1' || this.pickedObject.name === 'Cube.001_3') {
                currentMesh = [
                    this.scene.children.find(o => o.name === 'Cube.001_0'),
                    this.scene.children.find(o => o.name === 'Cube.001_1'),
                    this.scene.children.find(o => o.name === 'Cube.001_3'),

                ];
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                currentComponent = mindMapModel.components.find(o => o.name === 'Подошва');
                lightUpComponent(currentComponent.mesh_name);
                // console.log(currentComponent);
                showItems(currentComponent.textures)
            } else if (this.pickedObject.name === 'Cube.003_0' || this.pickedObject.name === 'Cube.003_1') {
                currentMesh = [
                    this.scene.children.find(o => o.name === 'Cube.003_0'),
                    this.scene.children.find(o => o.name === 'Cube.003_1'),
                ];
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                currentComponent = mindMapModel.components.find(o => o.name === 'Подошва');
                lightUpComponent(currentComponent.mesh_name);
                // console.log(currentComponent);
                showItems(currentComponent.textures)
            } else if (
                (this.pickedObject.name === '7' || this.pickedObject.name === '6,5')
            ) {
                if (this.scene.children.find(o => o.name === '6,5')) {
                    currentMesh = [
                        this.scene.children.find(o => o.name === '7'),
                        this.scene.children.find(o => o.name === '6,5'),
                    ];
                }


                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                currentComponent = mindMapModel.components.find(o => o.name === 'Основа');
                // console.log(currentComponent);
                lightUpComponent(currentComponent.mesh_name);
                // console.log(currentComponent);
                showItems(currentComponent.textures)

            } else {

                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();

                lightUpComponent(this.pickedObject.name);
                currentComponent = mindMapModel.components.find(
                    o => o.mesh_name === currentMesh.name || (Array.isArray(o.mesh_name) ?
                        o.mesh_name.find(item => item === currentMesh.name) : false)
                )
                // console.log(currentComponent);
                showItems(currentComponent.textures);

                currentMesh = this.pickedObject;
            }

        } else {
            // matsWrapper.setAttribute('data-id','open');
            // arrow.click();
            if (!isItemEventTarget) showComponents(mindMapModel.components);
        }
    }
}

const matsWrapper = document.getElementById('mats-wrapper');

function hideMats() {
    arrow.click();
}

/**
 * функция устанавливает текстуру на текущий меш(меши)
 * @param item string - url of new texture picture
 *          or object - mesh names : urls
 */
function setTexture(item) {
    // console.log(currentComponent);
    //если урл строка - текущему мешу загружаем текстуру
    if (typeof item === 'string') {
        //если текущий меш-массив мешей, каждому загружаем текстуру
        if (Array.isArray(currentMesh)) {
            currentMesh.map(mesh => {
                mesh.material.map = textureLoader.load(item);
                unlight(mesh);
                mesh.material.map.wrapS = 1000;
                mesh.material.map.wrapT = 1000;
            })
        } else {
            currentMesh.material.map = textureLoader.load(item);
            unlight(currentMesh);
            currentMesh.material.map.wrapS = 1000;
            currentMesh.material.map.wrapT = 1000;
        }
    }
    //если урлы в виде объекта вида "имя меша":"урл картинки"
    if (typeof item === 'object' && !Array.isArray(item)) {
        for (const key in item) {
            const mesh = ked.children.find(o => o.name === key);
            mesh.material.map = textureLoader.load(item[key], () => {
                mesh.material.map.wrapS = 1000;
                mesh.material.map.wrapT = 1000;
                //для низа подошвы своё специальное положение
                if (mesh.name === 'Cube.001_2') {
                    mesh.material.map.repeat.y = -1;
                }
                unlight(mesh);
            });
        }
    }
}

function unlight(mesh) {
    mesh.material.emissive.setHex(savedEmissiveColor);
}

function showComponents(items) {
    document.getElementById('mats').innerHTML = '';

    if (items) {
        items.map((item) => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <p>${item.name}</p>
                <img src="${item.url}">
                 `;
            div.innerHTML += ``;
            document.getElementById('mats').appendChild(div);
            div.addEventListener('click', () => {
                if (isMobile) {
                    isItemEventTarget = true;
                    item.textures ? showItems(item.textures) : console.warn('No Textures!');
                    currentComponent = item;
                    if (item.mesh_name) lightUpComponent(item.mesh_name);
                    if (!item.textures && !item.mesh_name) {
                        savingKey[currentComponent.id] = item.id;
                        setTexture(item.urls ? item.urls : item.url)
                    }
                } else {
                    showDesktopItems(item);
                }
            })
        });
    }
}

const desktopMats = document.getElementById('desktopMats');

function showDesktopItems(item) {
    // console.log(item);
    desktopMats.innerHTML = `<h3>${item.name}</h3>`;
    item.textures.map((item, i) => {
        // console.log(item);
        const desktopSpan = document.createElement('span');
        desktopSpan.textContent = `${item.name}`;
        desktopMats.appendChild(desktopSpan);
        desktopSpan.addEventListener('click', () => {
            const imagesContainer = document.createElement('div');
            desktopMats.appendChild(imagesContainer);
            // imagesContainer.innerHTML = '';
            console.log(item.textures);
            item.textures.map(texture => {
                const img = document.createElement('img');
                img.src = texture.url;
                img.className = 'desktopTextureImg'
                imagesContainer.appendChild(img);
            })

        });
    })
}


function showItems(items) {
    document.getElementById('mats').innerHTML = '';
    // console.log(items);
    if (items) {
        items.map((item) => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <p>${item.name}</p>
                <img class="circle" src="${item.url}">
                 `;

            document.getElementById('mats').appendChild(div);
            div.addEventListener('click', () => {
                isItemEventTarget = true;
                item.textures ? showItems(item.textures) : console.warn('No Textures!');
                currentComponent = item;
                if (item.mesh_name) lightUpComponent(item.mesh_name);
                if (!item.textures && !item.mesh_name) {
                    // console.log(currentMesh);
                    // console.log(item);
                    savingKey[currentComponent.id] = item.id;
                    setTexture(item.urls ? item.urls : item.url)
                }
            })
        });
    }

    document.getElementById('mats').style.visibility = 'visible';
}

function lightUpComponent(name) {
    // console.log({name});
    if (currentMesh) {
        if (Array.isArray(currentMesh)) {
            // console.log(currentMesh);
            currentMesh.map(mesh => unlight(mesh))
        } else unlight(currentMesh);
    }
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
        // console.log(currentMesh);
        savedEmissiveColor = currentMesh.material.emissive.getHex();
        currentMesh.material.emissive.setHex(0x00FF00);
    }
}

function checkAvailability(mesh) {
    return mindMapModel.components.find(
        o => o.mesh_name === mesh.name || (Array.isArray(o.mesh_name) ?
            o.mesh_name.find(item => item === mesh.name) : false)
    );
}

/**
 * сохраняем конфигурацию текстур-компонентов для дальнейшего воспроизводства
 */
document.getElementById('agree').addEventListener(
    'click', () => {

        // console.log(savingKey);
        let savingString = '';
        savingKey.map(s => {
            savingString += s ? s : '0';
        })

        const link = window.location.host +
            window.location.pathname + '?' +
            savingString;

        loadingPercentEl.innerHTML =
            `<a href="http://${link}" target="_blank">${link}</a>`;
        show(loadingPercentEl);
    }
);


/**
 * открываем - закрываем меню текстур
 */
const arrow = document.querySelector('.arrow');
arrow.addEventListener('click', () => {
    console.log('click!!!!');
    console.log(isMobile);
    if (isMobile) {
        if (matsWrapper.getAttribute('data-id') === 'close') {
            arrow.style.transform = 'rotate(180deg)';
            matsWrapper.style.bottom = '0';
            matsWrapper.setAttribute('data-id', 'open')
        } else {
            arrow.style.transform = 'rotate(0)';
            matsWrapper.style.bottom = '-100px';
            matsWrapper.setAttribute('data-id', 'close')
        }
    } else {
        if (matsWrapper.getAttribute('data-id') === 'close') {
            arrow.style.transform = 'rotate(270deg)';
            matsWrapper.style.left = '0';
            matsWrapper.setAttribute('data-id', 'open')
        } else {
            arrow.style.transform = 'rotate(90deg)';
            matsWrapper.style.left = '-100px';
            matsWrapper.setAttribute('data-id', 'close')
        }
    }
})


//todo: сохранять обЪект и загружать его вновь



