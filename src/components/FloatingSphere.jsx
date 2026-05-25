import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";

export default function FloatingSphere() {
  return (
    <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-60">
      <Canvas>
        <ambientLight intensity={1.5} />
        
        <Float speed={2} rotationIntensity={2}>
          <Sphere args={[1, 100, 200]} scale={2.5}>
            <MeshDistortMaterial
              color="#fbbf24"
              distort={0.4}
              speed={2}
              roughness={0}
            />
          </Sphere>
        </Float>
      </Canvas>
    </div>
  );
}