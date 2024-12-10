import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function ArcadeMachine(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/pacman_arcade__animation.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play all available animations
    Object.values(actions).forEach((action) => {
      action.reset().play();
    });

    // Clean up on unmount
    return () => {
      Object.values(actions).forEach((action) => {
        action.stop();
      });
    };
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="ad72bb6817744cbea1b39b136ec1313cfbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="pac_man_machine" rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh
                    name="pac_man_machine_automat_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.pac_man_machine_automat_0.geometry}
                    material={materials.automat}
                  />
                </group>
                <group
                  name="pacman"
                  position={[7.345, 37.744, -1.735]}
                  rotation={[-0.815, 0, 0]}
                  scale={0.095}>
                  <group name="Object_7" position={[0, -0.317, 0]}>
                    <mesh
                      name="pacman_pac_&_ghost_0"
                      castShadow
                      receiveShadow
                      geometry={nodes["pacman_pac_&_ghost_0"].geometry}
                      material={materials.pac__ghost}
                    />
                  </group>
                  <group name="mouth_top">
                    <group name="Object_10" position={[0, -0.317, 0]}>
                      <mesh
                        name="mouth_top_pac_&_ghost_0"
                        castShadow
                        receiveShadow
                        geometry={nodes["mouth_top_pac_&_ghost_0"].geometry}
                        material={materials.pac__ghost}
                      />
                    </group>
                  </group>
                  <group name="mouth_bott">
                    <group name="Object_13" position={[0, -0.317, 0]}>
                      <mesh
                        name="mouth_bott_pac_&_ghost_0"
                        castShadow
                        receiveShadow
                        geometry={nodes["mouth_bott_pac_&_ghost_0"].geometry}
                        material={materials.pac__ghost}
                      />
                    </group>
                  </group>
                </group>
                <group
                  name="ghost1"
                  position={[-0.929, 37.654, -1.616]}
                  rotation={[-0.815, 0, 0]}
                  scale={0.095}>
                  <mesh
                    name="ghost1_pac_&_ghost_0"
                    castShadow
                    receiveShadow
                    geometry={nodes["ghost1_pac_&_ghost_0"].geometry}
                    material={materials.pac__ghost}
                  />
                </group>
                <group name="scheibe" rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh
                    name="scheibe_scheibe_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.scheibe_scheibe_0.geometry}
                    material={materials.scheibe}
                  />
                </group>
                <group
                  name="ghost2"
                  position={[6.745, 41.929, -6.15]}
                  rotation={[-0.815, 0, 0]}
                  scale={0.095}>
                  <mesh
                    name="ghost2_pac_&_ghost_0"
                    castShadow
                    receiveShadow
                    geometry={nodes["ghost2_pac_&_ghost_0"].geometry}
                    material={materials.pac__ghost}
                  />
                </group>
                <group
                  name="ghost3"
                  position={[0.917, 37.645, -1.606]}
                  rotation={[-0.815, 0, 0]}
                  scale={0.095}>
                  <mesh
                    name="ghost3_pac_&_ghost_0"
                    castShadow
                    receiveShadow
                    geometry={nodes["ghost3_pac_&_ghost_0"].geometry}
                    material={materials.pac__ghost}
                  />
                </group>
                <group
                  name="ghost4"
                  position={[-3.883, 37.687, -1.65]}
                  rotation={[-0.815, 0, 0]}
                  scale={0.095}>
                  <mesh
                    name="ghost4_pac_&_ghost_0"
                    castShadow
                    receiveShadow
                    geometry={nodes["ghost4_pac_&_ghost_0"].geometry}
                    material={materials.pac__ghost}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/pacman_arcade__animation.glb");
