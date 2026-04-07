const loader = (function() {

    // --- YOUR PROCEDURAL BRAIN LOGIC ---
    function buildBrain(data) {
        const group = new THREE.Group();
        
        data.parts.forEach(info => {
            const geo = new THREE.SphereGeometry(1, 128, 128);
            
            // 1. Shape Global Anatomy
            shapeAnatomy(geo, info);
            // 2. Apply Folds
            applyFolds(geo, info);

            const mat = new THREE.MeshStandardMaterial({
                color: info.color,
                roughness: 0.55,
                metalness: 0.15,
                emissive: 0x3a000c,
                emissiveIntensity: 0.3
            });

            const mesh = new THREE.Mesh(geo, mat);
            mesh.scale.set(...info.scale);
            mesh.position.set(...info.pos);
            
            // Store Metadata for Interaction
            mesh.userData = {
                id: info.id,
                desc: info.desc,
                basePos: new THREE.Vector3(...info.pos),
                targetPos: new THREE.Vector3(...info.pos),
                popPos: new THREE.Vector3(...info.pop)
            };

            group.add(mesh);
        });

        return group;
    }

    // Helper: Vertex Shaping
    function shapeAnatomy(geometry, info) {
        const pos = geometry.attributes.position;
        const v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            let gx = (v.x * info.scale[0]) + info.pos[0];
            let gy = (v.y * info.scale[1]) + info.pos[1];
            let gz = (v.z * info.scale[2]) + info.pos[2];

            // Tapering logic from your snippet
            if (info.id.includes("Frontal") && gz > 0.3) {
                let taper = Math.max(0.4, 1.0 - (gz - 0.3) * 0.5);
                gx *= taper;
            }

            v.x = (gx - info.pos[0]) / info.scale[0];
            v.y = (gy - info.pos[1]) / info.scale[1];
            v.z = (gz - info.pos[2]) / info.scale[2];
            pos.setXYZ(i, v.x, v.y, v.z);
        }
        geometry.computeVertexNormals();
    }

    // Helper: Convolution Folds
    function applyFolds(geometry, info) {
        const pos = geometry.attributes.position;
        const v = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i);
            let n = v.clone().normalize();
            let freq = 8.5;
            let displacement = Math.abs(Math.sin(v.y * freq + Math.cos(v.z * freq))) * -0.04;
            v.addScaledVector(n, displacement);
            pos.setXYZ(i, v.x, v.y, v.z);
        }
        geometry.computeVertexNormals();
    }

    async function fetchOrgan(name) {
        const response = await fetch(`http://localhost:3000/api/${name}`);
        const data = await response.json();
        sceneManager.clearScene();
        
        let mesh;
        if (data.type === 'brain') mesh = buildBrain(data);
        // buildHeart placeholder...
        
        if (mesh) sceneManager.addMesh(mesh);
        return data;
    }

    return { fetchOrgan };
})();
