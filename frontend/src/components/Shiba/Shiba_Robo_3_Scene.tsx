/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 scene.gltf -t
Author: Grigorii Ischenko (https://sketchfab.com/grigoriyarx)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/robo-shiba-b4215f3c452c4e7cbe845b56251d2877
Title: Robo Shiba
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useThree } from "@react-three/fiber";

function Controls() {
  const {
    camera,
    gl: { domElement },
  } = useThree();

  return <OrbitControls args={[camera, domElement]} />;
}

type GLTFResult = GLTF & {
  nodes: {
    Shiba_Shiba_0: THREE.Mesh;
  };
  materials: {
    Shiba: THREE.MeshStandardMaterial;
  };
};

export function Shiba_Robo_3(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/ec2/model/Shiba_Robo_3/scene.gltf"
  ) as GLTFResult;
  return (
    <group {...props} dispose={null} scale={0.001}>
      <mesh
        geometry={nodes.Shiba_Shiba_0.geometry}
        material={materials.Shiba}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Controls />
    </group>
  );
}

useGLTF.preload("/ec2/model/Shiba_Robo_3/scene.gltf");