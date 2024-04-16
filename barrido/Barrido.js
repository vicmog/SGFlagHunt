import * as THREE from 'three';

class Barrido extends THREE.Object3D {
    constructor(gui, guiTitle,shape,path) {
        super();
        this.shape = shape;
        this.path = path;
        this.createGui(gui,guiTitle);

        var shapeGeometry = new THREE.ShapeGeometry(this.shape);


        this.material = new THREE.MeshNormalMaterial();
        
        var geometriaLinea = new THREE.BufferGeometry();
        geometriaLinea.setFromPoints(this.path.getPoints(100));
        var materialLinea = new THREE.LineBasicMaterial( { color : 0xff0000, linewidth : 5 } );
        this.recorrido = new THREE.Line( geometriaLinea, materialLinea );


        this.barridoGeometria = this.createBarrido(this.shape);
        this.barrido = new THREE.Mesh(this.barridoGeometria, this.material);

        this.barrido.position.x = 0.025;
        this.barrido.position.z = 0.025;


        this.shapeObject = new THREE.Mesh(shapeGeometry, this.material);
        
        this.add(this.barrido);
        this.add(this.recorrido);
        this.add(this.shapeObject);
    }

    createBarrido(shape) {

        return new THREE.ExtrudeGeometry(
            shape,
            {
                steps: this.guiControls.steps,
                depth: this.guiControls.depth,
                bevelEnabled: this.guiControls.bevelEnabled,
                extrudePath: this.path
            }
        );
    }


    createGui(gui,guiTitle) {
        this.guiControls={
            steps: 10,
            depth: 0.01,
            bevelEnabled: false
        };

        this.gui = gui.addFolder(guiTitle);
        this.gui.add(this.guiControls,'steps',1,10,1).name('Steps: ').onChange(() => this.updateGeometry());
        this.gui.add(this.guiControls,'depth',0.01,2,0.01).name('Depth: ').onChange(() => this.updateGeometry());
        this.gui.add(this.guiControls,'bevelEnabled').name('Bevel Enabled: ').onChange(() => this.updateGeometry());

    }

    updateGeometry() {
        this.remove(this.barrido);
        this.barridoGeometria = this.createBarrido(this.shape);
        this.barrido = new THREE.Mesh(this.barridoGeometria, this.material);
        this.add(this.barrido);
    }

    update() {
    }
}    
export { Barrido };