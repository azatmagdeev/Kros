import mindMap from "../mindmap.js";
import {GLTFLoader} from "../../lib/GLTFLoader.js";
// import {loadingPercent} from "../js/loadingPercent.js"

export class Model {
    constructor(
        // success
        scene
    ) {
        // this.success = success;
        this.scene = scene;
        this.search = window.location.search.replace('?', '');
        this.mindMapModel = this.search === '' ?
            mindMap[0] : mindMap.find(o => o.id === this.search[0]);
        this.loadModel(this.mindMapModel.obj_url)
    }
    loadModel(obj_url){
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(obj_url, gltf => {
            const root = gltf.scene;
            // this.success(root);
            this.showModel(root);
        }, xhr => {
            if (xhr.lengthComputable) {
                const percentComplete = Math.round(xhr.loaded / xhr.total * 100);
                console.log(percentComplete);
                // console.log(loadingPercent);
                // loadingPercentEl.style.display = 'block';
                // loadNumber.textContent = ` ${percentComplete} %`
            }
        })
    }

    showModel(root) {
        console.log(root);
        this.scene.add(root);
        root.rotation.x = -100;
    }
}