import { Canvas } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sphere,
} from "@react-three/drei";

export default function FloatingSphere() {
  return (
    <div className="absolute top-[-120px] right-[-120px] w-[700px] h-[700px] opacity-100">

      <Canvas camera={{ position: [0, 0, 4] }}>

        {/* LIGHTS */}
        <ambientLight intensity={2} />

        <directionalLight
          position={[3, 2, 1]}
          intensity={3}
        />

        <pointLight
          position={[-10, -10, -10]}
          intensity={2}
        />

        {/* FLOATING OBJECT */}
        <Float
          speed={2}
          rotationIntensity={2}
          floatIntensity={3}
        >
          <Sphere args={[1, 128, 128]} scale={2.2}>

            <MeshDistortMaterial
              color="#fbbf24"
              distort={0.5}
              speed={2}
              roughness={0}
              metalness={1}
            />

          </Sphere>
        </Float>

      </Canvas>
    </div>
  );
}