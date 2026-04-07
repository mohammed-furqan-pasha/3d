const sceneManager = (function() {
    let scene, camera, renderer, controls, brainGroup;

    function initScene() {
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0b0c10, 0.06);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(3.5, 2, 5.5);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x0b0c10);
        document.getElementById('canvas-container').appendChild(renderer.domElement);

        // Lighting from Stark Edition
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(5, 5, 3);
        scene.add(mainLight);
        scene.add(new THREE.AmbientLight(0xfff0f5, 0.4));

        // Controls
        // Note: Ensure OrbitControls.js is loaded in index.html
        if (THREE.OrbitControls) {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
        }

        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;

        if (controls) controls.update();

        // Breathing Effect
        if (brainGroup) {
            const s = 1.0 + Math.sin(time * 1.5) * 0.005;
            brainGroup.scale.set(s, s, s);
            
            // Lerp positions for the "Exploded View"
            brainGroup.children.forEach(mesh => {
                mesh.position.lerp(mesh.userData.targetPos, 0.08);
            });
        }

        renderer.render(scene, camera);
    }

    function addMesh(group) {
        brainGroup = group;
        scene.add(brainGroup);
    }

    function clearScene() {
        if (brainGroup) scene.remove(brainGroup);
        brainGroup = null;
    }

    return { initScene, addMesh, clearScene, getScene: () => scene, getCamera: () => camera };
})();
