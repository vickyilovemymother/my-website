// Add to SceneManager class
focusCamera(part) {
    const targets = {
        'top': { y: 1.4, distance: 1.5 },
        'bottom': { y: 0.6, distance: 1.8 },
        'jacket': { y: 1.2, distance: 2.2 },
        'comboset': { y: 1.0, distance: 2.5 },
        'default': { y: 1.0, distance: 3.0 }
    };

    const target = targets[part] || targets['default'];

    // Using GSAP for a smooth "Principal R&D" transition
    gsap.to(this.controls.target, {
        y: target.y,
        duration: 1.2,
        ease: "power2.inOut"
    });

    gsap.to(this.camera.position, {
        z: target.distance,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => this.controls.update()
    });
}
