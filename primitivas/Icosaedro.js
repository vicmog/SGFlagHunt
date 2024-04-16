import * as THREE from 'three';

class Icosaedro extends THREE.Object3D {

    constructor(gui, titlegui) {
        super();
        this.createGUI(gui, titlegui);
        this.material = new THREE.MeshNormalMaterial();

        this.icosaedroGeometry = this.createIcosaedro();
        this.icosaedro = new THREE.Mesh(this.icosaedroGeometry, this.material);
        this.icosaedro.position.y = 0.3;
        this.add(this.icosaedro);
    }

    createIcosaedro() {
        return new THREE.IcosahedronGeometry(
            this.guiControls.radio,
            this.guiControls.subdivision
        );
    }

    createGUI(gui, titlegui) {
        this.guiControls = {
            radio: 0.1,
            subdivision: 0
        };

        var folder = gui.addFolder(titlegui);
        folder.add(this.guiControls, 'radio', 0.05, 1, 0.01).name('Radio: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls, 'subdivision', 0, 5, 1).name('Subdivision: ').onChange(() => this.updateGeometry());
    }

    updateGeometry() {
        this.remove(this.icosaedro);
        this.icosaedroGeometry = this.createIcosaedro();
        this.icosaedro = new THREE.Mesh(this.icosaedroGeometry, this.material);
        this.icosaedro.position.y = 0.3;

        this.add(this.icosaedro);
    }

    update() {
        this.icosaedro.rotation.x += 0.01;
    }


}
export { Icosaedro };   