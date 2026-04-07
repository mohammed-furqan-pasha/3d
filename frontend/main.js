// Entry Point
window.addEventListener('DOMContentLoaded', () => {
    console.log("[Main] Initializing Application...");
    
    // 1. Setup the 3D World
    sceneManager.initScene();

    // 2. Setup UI Click handling for 3D objects
    ui.setupInteractions();

    console.log("[Main] Ready.");
});
