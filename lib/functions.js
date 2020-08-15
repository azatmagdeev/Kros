export function resizeRendererToDisplaySize(renderer,camera,canvas) {
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

export function render(renderer,camera,canvas,scene) {
    // resizeRendererToDisplaySize(renderer,camera,canvas);
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
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

export function hide(...els) {
    els.forEach(el => {
        el.style.display = 'none';
    })
}

export function show(...els) {
    els.forEach(el => {
        el.style.display = 'flex';
    })
}