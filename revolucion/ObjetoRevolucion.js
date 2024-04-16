import * as THREE from 'three';

class ObjetoRevolucion extends THREE.Object3D {
    constructor(gui,guiTitle,shape) {
        super();
        this.points = shape.extractPoints().shape;
        this.material = new THREE.MeshNormalMaterial();

        this.createGui(gui,guiTitle);
        this.objetoRevolucionGeometria = this.createObjetoRevolucion(this.points);
        this.objetoRevolucion = new THREE.Mesh(this.objetoRevolucionGeometria, this.material);

        this.add(this.objetoRevolucion);

    }

    createObjetoRevolucion(points) {
        return new THREE.LatheGeometry(
            points,
            this.guiControls.segmentos,
            this.guiControls.phiStart,
            this.guiControls.phiLenght
        );
    }

    createGui(gui,guiTitle) {
        this.guiControls={
            segmentos: 3,
            phiStart: 0,
            phiLenght: Math.PI * 2
        };

        this.gui = gui.addFolder(guiTitle);
        this.gui.add(this.guiControls,'segmentos',3,30,1).name('Segmentos: ').onChange(() => this.updateGeometry());
        this.gui.add(this.guiControls,'phiStart',0,Math.PI * 2,0.1).name('Phi Start: ').onChange(() => this.updateGeometry());
        this.gui.add(this.guiControls,'phiLenght',0,Math.PI * 2,0.1).name('Phi Lenght: ').onChange(() => this.updateGeometry());
    }

    updateGeometry() {
        this.remove(this.objetoRevolucion);
        this.objetoRevolucionGeometria = this.createObjetoRevolucion(this.points);
        this.objetoRevolucion = new THREE.Mesh(this.objetoRevolucionGeometria, this.material);
        this.add(this.objetoRevolucion);
    }

    update() {
    }

}

export { ObjetoRevolucion };