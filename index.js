import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useApp, useFrame, useLoaders, usePhysics, useCleanup} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export default () => {
  const app = useApp();
  const physics = usePhysics();
  let blades = null;

  app.name = 'windmill';

  useFrame(() => {
    if(blades) {
      blades.rotateZ(THREE.MathUtils.degToRad(0.25));
      blades.updateMatrixWorld();
    }
  });

  let physicsIds = [];
  (async () => {
    const u = `${baseUrl}windmill.glb`;
    let o = await new Promise((accept, reject) => {
      const {gltfLoader} = useLoaders();
      gltfLoader.load(u, accept, function onprogress() {}, reject);
    });
    o = o.scene;

    blades = o.getObjectByName('spinning');
    app.add(o);
    
    const physicsId = physics.addGeometry(o);
    physicsIds.push(physicsId);
    app.updateMatrixWorld();
  })();
  
  useCleanup(() => {
    for (const physicsId of physicsIds) {
      physics.removeGeometry(physicsId);
    }
  });

  return app;
};
