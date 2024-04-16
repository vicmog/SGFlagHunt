import * as THREE from 'three';

class Cilindro extends THREE.Object3D {
    constructor(gui,guititle){
        super();
        this.createGUI(gui,guititle);
        this.material = new THREE.MeshNormalMaterial();
        this.cilindroGeometry = this.createCilindro();
        this.cilindro = new THREE.Mesh(this.cilindroGeometry,this.material);
        this.cilindro.position.y = 0.1;
        this.cilindro.position.z = 0.4;
        this.add(this.cilindro);
    }
    createGUI(gui,guititle){
        this.guiControls = {
            radioTop: 0.1,
            radioBottom: 0.1,
            altura: 0.2,
            resolucion: 50,
            openEnded: false,
            thetaLenght: Math.PI * 2
        };

        var folder = gui.addFolder(guititle);
        folder.add(this.guiControls,'radioTop',0.1,0.5,0.001).name('Radio: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls,'radioBottom',0.1,0.5,0.001).name('Radio: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls,'altura',0.2,1,0.001).name('Altura: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls,'resolucion',3,100,1).name('Resolucion: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls,'openEnded').name('Open Ended: ').onChange(() => this.updateGeometry());
        folder.add(this.guiControls,'thetaLenght',0,Math.PI * 2,0.1).name('Theta Lenght: ').onChange(() => this.updateGeometry());
    }
    updateGeometry(){
        this.remove(this.cilindro);
        this.cilindroGeometry = this.createCilindro();
        this.cilindro = new THREE.Mesh(this.cilindroGeometry,this.material);
        this.cilindro.position.y = 0.1;
        this.cilindro.position.z = 0.4;
        this.add(this.cilindro);
    }

    createCilindro(){
        return new THREE.CylinderGeometry(
            this.guiControls.radioTop,
            this.guiControls.radioBottom,
            this.guiControls.altura,
            this.guiControls.resolucion,
            1,
            this.guiControls.openEnded,
            0,
            this.guiControls.thetaLenght
        );
    }

    update(){
        this.cilindro.rotation.x += 0.01;
    }
}

export { Cilindro };