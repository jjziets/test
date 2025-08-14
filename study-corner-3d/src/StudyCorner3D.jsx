import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Grid } from "@react-three/drei";

function FurnitureBox({ size = [1, 1, 1], position = [0, 0.5, 0], color = "#C9D1D9", label }) {
  const [w, h, d] = size;
  const pos = [position[0], position[1], position[2]];
  return (
    <group>
      <mesh position={pos} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {label && (
        <Html center position={[pos[0], pos[1] + h / 2 + 0.02, pos[2]]}>
          <div className="px-2 py-1 text-xs bg-white/90 rounded shadow">{label}</div>
        </Html>
      )}
    </group>
  );
}

function Wall({ position, rotation = [0, 0, 0], size = [3, 2.4], color = "#f3f4f6" }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} side={2} />
    </mesh>
  );
}

function Window({ position = [0, 1.2, -1.19], size = [2.4, 1.2] }) {
  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#a7d3ff" transparent opacity={0.35} />
    </mesh>
  );
}

function Dimensions() {
  return (
    <>
      {/* X (width) */}
      <mesh position={[0, 0.001, 1.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 0.02]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
      <mesh position={[1.5, 0.001, 1.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, 0.1]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
      <mesh position={[-1.5, 0.001, 1.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, 0.1]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
      <Html position={[0, 0.01, 1.26]} center>
        <div className="text-xs bg-white/90 rounded px-1.5 py-0.5 shadow">3.0 m (width)</div>
      </Html>

      {/* Z (depth) */}
      <mesh position={[1.55, 0.001, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[2.4, 0.02]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
      <mesh position={[1.55, 0.001, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, 0.1]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
      <mesh position={[1.55, 0.001, -1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.02, 0.1]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
      <Html position={[1.56, 0.01, 0]} center>
        <div className="text-xs bg-white/90 rounded px-1.5 py-0.5 shadow">2.4 m (depth)</div>
      </Html>
    </>
  );
}

export default function StudyCorner3D() {
  // Room measurements
  const room = { width: 3, depth: 2.4, height: 2.4 };

  // Furniture sizes (w, h, d) in meters
  const desk = { size: [1.4, 0.75, 0.7] };
  const chair = { size: [0.9, 0.9, 0.9] };
  const underWindowShelf = { size: [2.6, 0.45, 0.35] };
  const wallShelf = { size: [1.2, 0.05, 0.25] };
  const tallCabinet = { size: [0.8, 2.1, 0.5] };

  // Positions (centered on object)
  const rightWallX = room.width / 2 - desk.size[2] / 2 - 0.05; // keep 5cm gap from wall
  const leftWallXForChair = -room.width / 2 + chair.size[2] / 2 + 0.05;
  const leftWallXForCabinet = -room.width / 2 + tallCabinet.size[2] / 2 + 0.05;

  return (
    <div style={{ width: "100%", height: "80vh", background: "#ffffff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", padding: 12 }}>
      <div style={{ height: "100%", width: "100%", borderRadius: 12, overflow: "hidden" }}>
        <Canvas shadows camera={{ position: [3.6, 2.2, 3.2], fov: 55 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 4]} castShadow intensity={0.9} />

          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[room.width, room.depth]} />
            <meshStandardMaterial color="#d9c3a3" />
          </mesh>

          {/* Walls: left, right, and back (front omitted for viewing) */}
          <Wall position={[0, room.height / 2, -room.depth / 2]} size={[room.width, room.height]} />
          <Wall position={[-room.width / 2, room.height / 2, 0]} rotation={[0, Math.PI / 2, 0]} size={[room.depth, room.height]} />
          <Wall position={[room.width / 2, room.height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} size={[room.depth, room.height]} />

          {/* Window on back wall */}
          <Window position={[0, 1.2, -room.depth / 2 + 0.01]} size={[2.4, 1.2]} />

          {/* Under-window shelf */}
          <FurnitureBox
            size={underWindowShelf.size}
            position={[0, underWindowShelf.size[1] / 2, -room.depth / 2 + underWindowShelf.size[2] / 2 + 0.02]}
            color="#f5deb3"
            label="Under-window shelf"
          />

          {/* Desk on the right wall */}
          <FurnitureBox
            size={desk.size}
            position={[rightWallX, desk.size[1] / 2, -0.25]}
            color="#e5e7eb"
            label="Desk"
          />

          {/* Reading chair on the left */}
          <FurnitureBox
            size={chair.size}
            position={[leftWallXForChair, chair.size[1] / 2, -0.6]}
            color="#d1d5db"
            label="Reading chair"
          />

          {/* Tall cabinet on the left next to the chair */}
          <FurnitureBox
            size={tallCabinet.size}
            position={[leftWallXForCabinet, tallCabinet.size[1] / 2, 0.45]}
            color="#deb887"
            label="Tall cabinet"
          />

          {/* Wall-mounted shelves (left & right) */}
          <FurnitureBox
            size={wallShelf.size}
            position={[-room.width / 2 + wallShelf.size[2] / 2 + 0.03, 1.45, 0]}
            color="#fafafa"
            label="Wall shelf (left)"
          />
          <FurnitureBox
            size={wallShelf.size}
            position={[room.width / 2 - wallShelf.size[2] / 2 - 0.03, 1.45, 0]}
            color="#fafafa"
            label="Wall shelf (right)"
          />

          {/* Helper grid & dimensions */}
          <Grid args={[10, 10]} sectionColor={"#9ca3af"} infiniteGrid={false} position={[0, 0.001, 0]} cellSize={0.5} />
          <Dimensions />

          <OrbitControls makeDefault />
        </Canvas>
      </div>
      <div style={{ fontSize: 14, marginTop: 8, color: "#4b5563" }}>
        Drag to orbit, scroll to zoom. Objects are roughly to scale (meters). Let me know what you’d like to move or resize.
      </div>
    </div>
  );
}