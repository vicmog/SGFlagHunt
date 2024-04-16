import * as THREE from 'three';

class Cono extends THREE.Object3D {
    constructor(gui, tituloGui) {
        super();
        this.createGUI(gui, tituloGui);
        this.material = new THREE.MeshNormalMaterial();

        this.conoGeometry = this.createCono();
        this.cono = new THREE.Mesh(this.conoGeometry, this.material);

        this.cono.position.y = 0.1;
        this.cono.position.x = -0.2;

        this.add(this.cono);
    }

    createCono() {
        return new THREE.ConeGeometry(
            this.guiControls.radio,
            this.guiControls.altura,
            this.guiControls.resolucion,
            1,
            this.guiControls.openEnded,
            0,
            this.guiControls.thetaStart
        );
    }

    createGUI(gui, titleGui) {
        this.guiControls = {
            radio: 0.1,
            altura: 0.2,
            resolucion: 50,
            openEnded: false,
            thetaStart: Math.PI * 2
        };

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'radio', 0.1, 0.5, 0.001).name('Radio: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls, 'altura', 0.2, 1, 0.001).name('Altura: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls, 'resolucion', 3, 100, 1).name('Resolucion: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls, 'openEnded').name('Open Ended: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls, 'thetaStart', 0, Math.PI * 2, 0.1).name('Theta Start: ').onChange(() => this.updateGeometry());
    }

    updateGeometry() {
        this.remove(this.cono);
        this.conoGeometry = this.createCono();
        this.cono = new THREE.Mesh(this.conoGeometry, this.material);
        this.cono.position.y = 0.1;
        this.cono.position.x = -0.2;
        this.add(this.cono);
    }

    update() {  
        this.cono.rotation.x += 0.01;
    }
}

export { Cono };
