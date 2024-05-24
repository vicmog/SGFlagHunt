import * as THREE from 'three';
import { OBJLoader } from '../libs/OBJLoader.js';

class Luna extends THREE.Object3D {
    constructor() {
        super();
        
        // Cargador de texturas
        let textureLoader = new THREE.TextureLoader();
        let texture = textureLoader.load('../imgs/textluna.jpg');
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.wrapS = THREE.MirroredRepeatWrapping;
        // Crear un material básico con la textura
        let material = new THREE.MeshBasicMaterial({ map: texture });
        
        // Cargador de objetos
        let objectLoader = new OBJLoader();

        // Cargar el objeto
        objectLoader.load('../models/moon/moon.obj', (object) => {
            // Aplicar el nuevo material a todas las mallas del objeto
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = material;
                    child.material.needsUpdate = true;  // Asegurarse de que el material se actualice
                }
            });

            // Añadir el objeto a la escena
            this.add(object);
        });
    }

    update() {
        // Lógica de actualización si es necesaria
    }
}

export { Luna };
