import {hide, show} from "../lib/functions.js";
import {GLTFLoader} from "../lib/GLTFLoader.js";
import * as THREE from "../lib/three.module.js";
import {OrbitControls} from "../lib/OrbitControls.js";
import mindMap from "./mindmap.js";

let isMobile = innerWidth < 500;

// window.addEventListener('resize', () => {
//     isMobile = innerWidth < 500
// });

const loadingPercentEl = document.getElementById('loadingPercent');
const loadNumber = document.getElementById('loadNumber');
const canvas = document.getElementById('c');
const ked = new THREE.Object3D();
const textureLoader = new THREE.TextureLoader();
const camera = new THREE.PerspectiveCamera(
    50,
    canvas.width / canvas.height,
    0.1,
    100000
);
const controls = new OrbitControls(camera, canvas);

let currentMesh = false;
let currentComponent;
let savedEmissiveColor = '0x000000';
let isItemEventTarget = false;
let mindMapModel;
const defaultTextures = {};
let savingKey = [];//сюда будем собирать код для сохранения-загрузки
let getImgData = false;
const resultImg = document.getElementById('result');
//отсюда будем читать код для кастомизации модели
const search = window.location.search.replace('?', '');

if (window.location.search === '') {
    mindMapModel = mindMap[0];
    loadModel(mindMapModel.obj_url);
} else {
    mindMapModel = mindMap.find(o => o.id === search[0]);
    savingKey[0] = mindMapModel.id;
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
    scene.background = new THREE.Color('ghostwhite');

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

    setCameraDefaultPosition();


    controls.maxDistance = 20;
    controls.minDistance = 3;

    controls.saveState();
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



    setTimeout(() => {
        for (const component of mindMapModel.components) {
            if (
                component.name === 'Подошва'
                || component.name === 'Лэйбл'
                || component.name === 'Шнурки'
            ) continue;
            if (component.name === 'Подкладка') {
                currentMesh = defineCurrentMesh(component.mesh_name);
                setTexture('../textures/default-grey.jpg');
                continue;
            }
            currentMesh = defineCurrentMesh(component.mesh_name);
            setTexture('../textures/light-texture.jpg');
        }

        ked.children.map(mesh => {
            defaultTextures[mesh.name] = mesh.material.map.image;
        })

        scene.add(root);
    }, 0);

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

        if (getImgData) {
            resultImg.src = renderer.domElement.toDataURL('image/png', 0.1);
            getImgData = false;
        }

        if (needToMove) {
            controls.reset();
            needToMove = false;
        }

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
                } else {
                    texture.textures.map(texture => {
                        if (texture.id === el) {
                            component.mesh_name.map(name => {
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

try {
    document.getElementById('again').addEventListener(
        'click', () => {
            setTimeout(() => {
                ked.children.map(mesh => {
                    currentMesh = mesh;
                    setTexture(defaultTextures[mesh.name].src)
                    // mesh.material.needsUpdate = true;
                })
            }, 100)

        }
    );
} catch (e) {
    console.warn(e)
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
            this.pickedObject.material.emissive.setHex(0x000000);
            this.pickedObject = undefined;
            hideMats();
            this.scene.children.map(o => {
                o.material.emissive.setHex(0x000000);
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
                currentComponent = mindMapModel.components.find(o => o.name === 'Подошва');
                lightUpComponent(currentComponent.mesh_name);
                isMobile ? showItems(currentComponent.textures) : showDesktopItems(currentComponent);
            } else if (this.pickedObject.name === 'Cube.003_0' || this.pickedObject.name === 'Cube.003_1') {
                currentMesh = [
                    this.scene.children.find(o => o.name === 'Cube.003_0'),
                    this.scene.children.find(o => o.name === 'Cube.003_1'),
                ];
                currentComponent = mindMapModel.components.find(o => o.name === 'Подошва');
                lightUpComponent(currentComponent.mesh_name);

            } else if (
                (this.pickedObject.name === '7' || this.pickedObject.name === '6,5')
            ) {
                if (this.scene.children.find(o => o.name === '6,5')) {
                    currentMesh = [
                        this.scene.children.find(o => o.name === '7'),
                        this.scene.children.find(o => o.name === '6,5'),
                    ];
                }

                currentComponent = mindMapModel.components.find(o => o.name === 'Основа');
                lightUpComponent(currentComponent.mesh_name);
                isMobile ? showItems(currentComponent.textures) : showDesktopItems(currentComponent);

            } else {
                lightUpComponent(this.pickedObject.name);
                currentComponent = mindMapModel.components.find(
                    o => o.mesh_name === currentMesh.name || (Array.isArray(o.mesh_name) ?
                        o.mesh_name.find(item => item === currentMesh.name) : false)
                )
                isMobile ? showItems(currentComponent.textures) : showDesktopItems(currentComponent);
                currentMesh = this.pickedObject;
            }

        } else {
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
 * @param item_name
 */
function setTexture(item, item_name) {
    console.log(
        currentComponent?currentComponent.name:'no currentComponent',
        item_name? item_name: ' no item_name'
    );

    if(currentComponent){currentComponent.choice = item_name}

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
    mesh.material.emissive.setHex('0x000000');
}

/**
 * Определяет currentMesh
 * @param mesh_name
 * @returns {[]|*}
 */
function defineCurrentMesh(mesh_name) {
    if (typeof (mesh_name) === "string") {
        return ked.children.find(o => o.name === mesh_name);
    } else {
        const result = [];
        mesh_name.map(n => {
            result.push(ked.children.find(o => o.name === n))
        });
        return result;
    }
}

function showComponents(items) {
    document.getElementById('mats').innerHTML = '';

    if (items) {
        items.map((item) => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <p>${item.name}</p>
                <img alt="" src="${item.url}">
                 `;
            div.innerHTML += ``;
            document.getElementById('mats').appendChild(div);
            div.addEventListener('click', () => {
                ked.children.map(mesh => unlight(mesh))
                // currentMesh = ked.children.find(o => o.name === item.mesh_name);
                currentMesh = defineCurrentMesh(item.mesh_name);
                console.log(item);
                if (isMobile) {
                    isItemEventTarget = true;
                    item.textures ? showItems(item.textures) : console.warn('No Textures!');
                    currentComponent = item;
                    if (item.mesh_name) lightUpComponent(item.mesh_name);
                    if (!item.textures && !item.mesh_name) {
                        savingKey[currentComponent.id] = item.id;
                        setTexture(item.urls ? item.urls : item.url, )
                    }
                } else {
                    showDesktopItems(item);
                }
            })
        });
    }
}

const desktopMats = document.getElementById('desktopMats');
const desktopMatsTitle = desktopMats.querySelector('.title');
const desktopMatsMats = desktopMats.querySelector('.mats');
const desktopMatsTextures = desktopMats.querySelector('.textures');

function showDesktopItems(item) {
    desktopMatsTitle.textContent = `${item.name}`;
    desktopMatsMats.innerHTML = '';
    desktopMatsTextures.innerHTML = '';
    item.textures.map((item, i) => {
        if (item.textures) {
            const desktopSpan = document.createElement('span');
            desktopSpan.textContent = `${item.name}`;
            i === 0 ? desktopSpan.className += ' underline' : null;
            desktopMatsMats.appendChild(desktopSpan);
            desktopSpan.addEventListener('click', () => {
                desktopMatsMats.querySelectorAll('.underline').forEach(el => {
                    el.classList.remove('underline')
                });
                desktopSpan.className += ' underline';
                desktopMatsTextures.innerHTML = '';
                item.textures.map(texture => {
                    const img = document.createElement('img');
                    img.src = texture.url;
                    img.className = 'desktopTextureImg';
                    desktopMatsTextures.appendChild(img);
                    img.addEventListener('click', () => {
                        setTexture(texture.url, texture.name)
                    })
                })
            });
            i === 0 ? desktopSpan.click() : null;
        } else {
            const img = document.createElement('img');
            img.src = item.url;
            img.className = 'desktopTextureImg';
            desktopMatsTextures.appendChild(img);
            img.addEventListener('click', () => {
                setTexture(item.url, item.name)
            })
        }
    })
}

function showItems(items) {
    document.getElementById('mats').innerHTML = '';
    if (items) {
        items.map((item) => {
            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <p>${item.name}</p>
                <img alt="" class="circle" src="${item.url}">
                 `;
            document.getElementById('mats').appendChild(div);
            div.addEventListener('click', () => {
                isItemEventTarget = true;
                item.textures ? showItems(item.textures) : console.warn('No Textures!');
                currentComponent = item;
                if (item.mesh_name) lightUpComponent(item.mesh_name);
                if (!item.textures && !item.mesh_name) {
                    savingKey[currentComponent.id] = item.id;
                    setTexture(item.urls ? item.urls : item.url)
                }
            })
        });
    }
}

function lightUpComponent(name) {
    if (currentMesh) {
        if (Array.isArray(currentMesh)) {
            currentMesh.map(mesh => unlight(mesh))
        } else unlight(currentMesh);
    }
    if (Array.isArray(name)) {
        currentMesh = [];
        name.map(n => {
            const meshForLightUp = ked.children.find(o => o.name === n);
            console.log(savedEmissiveColor);
            meshForLightUp.material.emissive.setHex(0x00FF00);
            currentMesh.push(meshForLightUp);
        })
    } else {
        currentMesh = ked.children.find(o => o.name === name);
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
try {
    document.getElementById('agree').addEventListener(
        'click', () => {
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
} catch (e) {
    console.warn(e)
}

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
});

const popupClose = document.querySelector('.popup-close');
const popup = document.querySelector('.popup');

popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
});

const buyBtn = document.querySelector('.top-button.buy');

buyBtn.addEventListener('click', () => {
    ked.children.map(mesh=>unlight(mesh));
    controls.reset();
    canvasToImage();
    document.querySelector('.popup-title').textContent = mindMapModel.name
    popup.style.display = 'block';
    mindMapModel.components.map(component=>{
        console.log(component.name, component.choice)
    })
});

function canvasToImage() {
    resultImg.width = (canvas.width / canvas.height) * resultImg.height;
    getImgData = true;
}

let needToMove = false;
const defaultX = -7;
const defaultY = 0;
const defaultZ = 3.5;

function setCameraDefaultPosition() {
    camera.position.set(
        defaultX,
        defaultY,
        defaultZ
    );
}

//todo: сохранять обЪект и загружать его вновь



