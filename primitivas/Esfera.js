import * as THREE from 'three';

class Esfera extends THREE.Object3D {

    constructor(gui, titlegui) {
        super();
        this.createGUI(gui, titlegui);
        this.material = new THREE.MeshNormalMaterial();

        this.esferaGeometry = this.createEsfera();
        this.esfera = new THREE.Mesh(this.esferaGeometry, this.material);

        this.esfera.position.y = 0.1;
        this.esfera.position.z = -0.4;
        
        this.add(this.esfera);
    }

    createEsfera() {
        return new THREE.SphereGeometry(
            this.guiControls.radio,
            this.guiControls.resolucion,
            this.guiControls.resolucionAltura,
            0,
            this.guiControls.phiLenght,
            0,
            this.guiControls.thetaLenght,
        );
    }


    createGUI(gui, titlegui) {
        this.guiControls = {
            radio: 0.1,
            resolucion: 30,
            resolucionAltura: 15,
            phiLenght: Math.PI * 2,
            thetaLenght: Math.PI * 2
        };

        var folder = gui.addFolder(titlegui);
        folder.add(this.guiControls, 'radio', 0.05, 1, 0.01).name('Radio: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls, 'resolucion', 2, 64, 1).name('Resolucion: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls, 'resolucionAltura', 3, 200, 4).name('Resolucion Altura: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls, 'phiLenght', 0.1, Math.PI * 2, 0.1).name('Phi Lenght: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls, 'thetaLenght', 0.1, Math.PI * 2, 0.1).name('Theta Lenght: ').onChange(() => this.updateGeometry());

    }

    updateGeometry() {
        this.remove(this.esfera);
        this.esferaGeometry = this.createEsfera();
        this.esfera = new THREE.Mesh(this.esferaGeometry, this.material);
        this.esfera.position.y = 0.1;
        this.esfera.position.z = -0.4;
        this.add(this.esfera);
    }



    update() {
        this.esfera.rotation.x += 0.01;
    }
}
export { Esfera };