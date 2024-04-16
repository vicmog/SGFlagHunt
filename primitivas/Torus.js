import * as THREE from 'three';

class Torus extends THREE.Object3D {
    constructor(gui, titlegui) {
        super();
        this.createGUI(gui, titlegui);
        this.material = new THREE.MeshNormalMaterial();

        this.torusGeometry = this.createTorus();
        this.torus = new THREE.Mesh(this.torusGeometry, this.material);
        this.torus.position.y = 0.08;
        this.rotationspeed = 0.01;
        this.add(this.torus);
    }

    createTorus() {
        var geometria =  new THREE.TorusGeometry(
            this.guiControls.radio,
            this.guiControls.tubo,
            this.guiControls.resolucion,
            this.guiControls.resolucionTubo,
            this.guiControls.arc
        );
        return geometria;
    }

    createGUI(gui, titlegui) {
        this.guiControls = {
            radio: 0.05,
            tubo: 0.02,
            resolucion: 15,
            resolucionTubo: 100,
            arc: Math.PI * 2
        };

        var folder = gui.addFolder(titlegui);
        folder.add(this.guiControls, 'radio', 0.05, 1, 0.01).name('Radio: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls, 'tubo', 0.02, 1, 0.01).name('Tubo: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls, 'resolucion', 2, 30, 1).name('Resolucion: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls, 'resolucionTubo', 3, 200, 4).name('Resolucion Tubo: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls, 'arc', 0.1, Math.PI*2, 0.1).name('Arc: ').onChange(() => this.updateGeometry());
    }

    updateGeometry() {
        this.remove(this.torus);
        this.torusGeometry = this.createTorus();
        this.torus = new THREE.Mesh(this.torusGeometry, this.material);
        this.torus.position.y = 0.08;
        this.add(this.torus);
    }

    update(){
        this.torus.rotation.x += this.rotationspeed;
    }
}

export { Torus };
