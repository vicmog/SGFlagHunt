
import * as THREE from 'three';


class MuroBasico extends THREE.Object3D{
    constructor() {
        super();
        var textureLoader = new THREE.TextureLoader();
        var texturaColor = textureLoader.load('../imgs/ladrillo-difuso.png');
        var textureBump = textureLoader.load('../imgs/ladrillo-bump.png');
        var texturaNormal = textureLoader.load('../imgs/ladrillo-normal.png');
        // Ajustar la textura para los lados finos del muro
        texturaColor.wrapS = texturaColor.wrapT = THREE.RepeatWrapping;
        texturaColor.repeat.set(4, 2); // Ajusta la repetición según sea necesario
        const material = new THREE.MeshStandardMaterial({
            map: texturaColor,
            bumpMap: textureBump,
            normalMap: texturaNormal
        });

        var geometriaMuro = new THREE.BoxGeometry(10, 5, 0.5);
        this.muro = new THREE.Mesh(geometriaMuro, material);
        this.add(this.muro);
    }

    update(){

    }
}

export { MuroBasico };