import { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export default function ProjectTab({ offset = [0, 0, -3], title = "My Project", description, link }) {
  const meshRef = useRef();
  const { camera } = useThree();
  const [visible, setVisible] = useState(true);
  
  const [panelSize, setPanelSize] = useState({ width: 1, height: 1 }); // 3D panel size
  const [uiSize, setUiSize] = useState({ width: 220, height: 250 }); // HTML content size
  const isResizing = useRef(false);

  const [hovered, setHovered] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef(new THREE.Vector3(...offset)); // relative offset from camera
  const targetWorldPos = useRef(new THREE.Vector3());
  const visiblePos = useRef(new THREE.Vector3());

  useFrame(() => {
    const cameraMatrix = new THREE.Matrix4().extractRotation(camera.matrixWorld);
    const offsetWorld = dragOffset.current.clone().applyMatrix4(cameraMatrix);
    targetWorldPos.current.copy(camera.position).add(offsetWorld);

    // Smooth movement
    visiblePos.current.lerp(targetWorldPos.current, 0.15);

    if (meshRef.current) {
      meshRef.current.position.copy(visiblePos.current);
      meshRef.current.lookAt(camera.position);
    }
  });

  const onPointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    document.body.style.cursor = 'grabbing';
  };

  const onPointerMove = () => {
    if (!isDragging) return;

    // You can update `dragOffset.current` based on mouse if needed,
    // or let it stay fixed to camera
  };

  const onPointerUp = () => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
  };

  useEffect(() => {
    function onMouseMove(e) {
      if (!isResizing.current) return;

      setUiSize((prev) => {
        const newWidth = Math.max(160, prev.width + e.movementX);
        const newHeight = Math.max(140, prev.height + e.movementY);
        return { width: newWidth, height: newHeight };
      });

      setPanelSize((prev) => {
        const scaleX = Math.max(0.6, prev.width + e.movementX * 0.005);
        const scaleY = Math.max(0.4, prev.height + e.movementY * 0.005);
        return { width: scaleX, height: scaleY };
      });
    }

    function onMouseUp() {
      isResizing.current = false;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);


  return (
    visible ? <group>
      <mesh
        ref={meshRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        
        <planeGeometry args={[panelSize.width, panelSize.height]} />
        <meshStandardMaterial
          transparent
          opacity={0.4}
          color={isDragging ? 'skyblue' : 'gray'}
        />

<Html center transform distanceFactor={1.2}>
  <div 

    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}

    style={{
      width: `${uiSize.width}px`,
      height: `${uiSize.height}px`,
      background: 'rgba(15, 15, 25, 0.75)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(12px)',
      padding: '18px',
      color: '#fff',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      pointerEvents: 'auto',
      transition: 'border 0.2s ease, box-shadow 0.3s ease',
      boxShadow: hovered ? '0 0 30px #0ff4' : '0 0 16px rgba(0,0,0,0.5)',
    }}>
      {/* Animated Border Glow */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'conic-gradient(from 0deg, #0ff, #00f, #0ff)',
        animation: 'spin 4s linear infinite',
        zIndex: 0,
        filter: 'blur(30px)',
        opacity: 0.15,
    }} />

    {/* Close Button */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        setVisible(false);
      }}
      style={{
        position: 'absolute',
        top: 8,
        right: 10,
        background: 'rgba(255,255,255,0.15)',
        border: 'none',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 'bold',
        borderRadius: '50%',
        width: '28px',
        height: '28px',
        cursor: 'pointer',
        zIndex: 10, // 🟢 Make sure it's on top of everything
        backdropFilter: 'blur(6px)',
        boxShadow: '0 0 6px rgba(0,255,255,0.4)',
        transition: 'background 0.2s ease, transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1.0)';
      }}
    >
      ×
    </button>

    {/* Video Preview Area */}
    <div style={{
      width: '100%',
      height: '55%',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 0 16px rgba(0,255,255,0.25)',
      marginBottom: '12px',
      position: 'relative',
      zIndex: 1
    }}>
      <video
        src={'/portfolio.mp4'} // Replace with your video URL
        controls
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          background: '#000',
          borderRadius: '12px',
        }}
      />
    </div>

    {/* Title & Description */}
    <div style={{ zIndex: 1 }}>
      <h3 style={{
        margin: '0 0 4px',
        fontSize: '15px',
        fontWeight: 600,
        color: '#0ff',
        textShadow: '0 0 5px #0ffb'
      }}>{title}</h3>

      <p style={{
        margin: 0,
        fontSize: '12px',
        color: '#ddd',
        lineHeight: '1.4em'
      }}>{description}</p>

      <a href={link} target="_blank" rel="noopener noreferrer" style={{
        marginTop: '10px',
        display: 'inline-block',
        background: 'linear-gradient(90deg, #00f0ff, #00bfff)',
        padding: '7px 14px',
        borderRadius: '10px',
        color: '#000',
        fontWeight: 'bold',
        fontSize: '12px',
        textDecoration: 'none',
        boxShadow: '0 0 8px #0ff9',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.06)'
          e.currentTarget.style.boxShadow = '0 0 16px #0ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1.0)'
          e.currentTarget.style.boxShadow = '0 0 8px #0ff9';
        }}
      >
        🚀 Visit Project
      </a>
    </div>

    {/* Resize Handle */}
    <div
      onMouseDown={(e) => {
        isResizing.current = true;
        e.stopPropagation();
      }}
      style={{
        position: 'absolute',
        bottom: 6,
        right: 6,
        width: 16,
        height: 16,
        cursor: 'nwse-resize',
        background: '#0ff',
        borderRadius: 4,
        boxShadow: '0 0 6px #0ffb',
        zIndex: 2
      }}
    />

    {/* CSS Keyframes */}
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
</Html>

      </mesh>
    </group> : null
  );
}

