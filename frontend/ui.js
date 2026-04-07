const ui = (function() {
    let isWireframe = false;

    function setupInteractions() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // W Key for Blueprint Mode
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'w') {
                isWireframe = !isWireframe;
                document.body.classList.toggle('stark-mode', isWireframe);
                toggleBlueprint(isWireframe);
            }
        });

        // Click to Inspect/Explode
        window.addEventListener('click', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, sceneManager.getCamera());
            const scene = sceneManager.getScene();
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                const selected = intersects[0].object;
                updateInfo(selected.userData.id, selected.userData.desc);
                
                // Explode Logic
                selected.parent.children.forEach(m => {
                    m.userData.targetPos.copy(m === selected ? m.userData.popPos : m.userData.basePos);
                });
            }
        });
    }

    function toggleBlueprint(active) {
        const scene = sceneManager.getScene();
        scene.traverse(obj => {
            if (obj.isMesh) {
                obj.material.wireframe = active;
                obj.material.color.setHex(active ? 0x00ffff : obj.userData.baseColor || 0xebb2bc);
            }
        });
    }

    function updateInfo(name, desc) {
        document.getElementById('part-name').innerText = name;
        document.getElementById('part-desc').innerText = desc;
        document.getElementById('ui-panel').classList.add('active');
    }

    return { setupInteractions, loadOrgan: (name) => loader.fetchOrgan(name) };
})();
