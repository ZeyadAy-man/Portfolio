import { Html } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AboutMeTab(props) {
  const meshRef = useRef()
  const glowRef = useRef()
  const imageRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [page, setPage] = useState(0)
  
  const pages = [
    {
      title: "🧑‍🚀 Who Am I?",
      content: (
        <>
          <div
            ref={imageRef}
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              margin: '0 auto 12px',
              overflow: 'hidden',
              boxShadow: '0 0 20px #0ff',
              border: '2px solid #0ff',
              animation: 'glow 4s ease-in-out infinite',
            }}
          >
            <img
              src={props.image}
              alt="Zeyad Ayman"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
          </div>
          <h2 style={{
            textAlign: 'center',
            fontSize: '18px',
            color: '#0ff',
            margin: '0 0 8px',
            textShadow: '0 0 6px #0ffb'
          }}>
            Zeyad Ayman
          </h2>
          <p style={{
            fontSize: '13px',
            lineHeight: '1.6em',
            marginBottom: 12,
            textAlign: 'center'
          }}>
            Frontend Developer using React JS, React three fiber, & React Native + XR engineer with a passion for immersive web experiences. Let's build something epic!
          </p>
        </>
      )
    },
    {
      title: "🛠️ Skills",
      content: (
        <ul style={{ fontSize: '13px', paddingLeft: '20px', lineHeight: '1.6em' }}>
          <li>⚛️ React JS / React Native</li>
          <li>🧠 Three.js / R3F</li>
          <li>🎮 WebXR, VR</li>
          <li>☕ Desktop Application (Java)</li>      
          <li>🧠 Problem Solving</li>
          <li>💪 Working under pressure</li>
          <li>💬 Communication Skills</li>
        </ul>
      )
    },
    {
      title: "📩 Contact",
      content: (
        <div style={{ fontSize: '13px', textAlign: 'center' }}>
          <p>Email: <a href="mailto:zeyad4wonly@gmail.com" style={{ color: '#0ff' }}>zeyad4wonly@gmail.com</a></p>
          <a href="#projects" style={{
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
              e.currentTarget.style.transform = 'scale(1.06)';
              e.currentTarget.style.boxShadow = '0 0 16px #0ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1.0)';
              e.currentTarget.style.boxShadow = '0 0 8px #0ff9';
            }}
             //11.689, 1.571, -2.635
            onClick={() => {props.setVisibilityOfProjectsShowcase(true); props.setLookAtProjects(true);}}
          >
            🚀 View Projects
          </a>
        </div>
      )
    }
  ]

  useEffect(() => {
    setTimeout(() => setMounted(true), 200)
  }, [])

  useFrame(() => {
    if (meshRef.current) meshRef.current.lookAt(0, 1.5, 0)
    if (glowRef.current) {
      const color = hovered ? '#0ff' : '#09f'
      glowRef.current.material.color.lerp(new THREE.Color(color), 0.1)
    }
    if (imageRef.current) {
      imageRef.current.style.transform = `translateY(${Math.sin(Date.now() * 0.002) * 4}px)`
    }
  })

  return (
    <group position={props.position} ref={meshRef}>
      {/* 🔵 Glow Ring */}
      <mesh ref={glowRef} position={[0, 0, -0.01]} rotation={props.rotation}>
        <ringGeometry args={[1.3, 1.45, 64]} />
        <meshBasicMaterial color="#09f" transparent opacity={0.4} />
      </mesh>

      {/* 🧊 Panel Content */}
      <Html center transform distanceFactor={1.2} zIndexRange={[100, 0]}  rotation={props.rotation}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            props.setVisible(false);
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
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            width: '360px',
            padding: '24px',
            background: 'rgba(20, 20, 30, 0.85)',
            borderRadius: '22px',
            border: '2px solid rgba(0,255,255,0.2)',
            backdropFilter: 'blur(14px)',
            color: '#fff',
            fontFamily: 'Segoe UI, Roboto, sans-serif',
            boxShadow: hovered
              ? '0 0 36px rgba(0,255,255,0.4)'
              : '0 0 20px rgba(0,255,255,0.15)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.6s ease-out',
            position: 'relative',
            overflow: 'hidden',
            animation: hovered ? 'pulse 3s ease-in-out infinite' : 'none',
          }}
        >
          <h3 style={{
            marginBottom: '12px',
            fontSize: '16px',
            color: '#0ff',
            textAlign: 'center',
            textShadow: '0 0 6px #0ff8'
          }}>
            {pages[page].title}
          </h3>

          <div key={page} style={{ animation: 'fadeIn 0.4s ease-in-out' }}>
            {pages[page].content}
          </div>

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '16px',
            gap: '12px'
          }}>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              style={{
                ...btnStyle,
                opacity: page === 0 ? 0.4 : 1,
                cursor: page === 0 ? 'default' : 'pointer'
              }}
            >‹ Prev</button>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, pages.length - 1))}
              disabled={page === pages.length - 1}
              style={{
                ...btnStyle,
                opacity: page === pages.length - 1 ? 0.4 : 1,
                cursor: page === pages.length - 1 ? 'default' : 'pointer'
              }}
            >Next ›</button>
          </div>

          {/* Glow layer behind content */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, #00f0ff33 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            zIndex: 0
          }} />

          {/* Animations */}
        <style>{`
            @keyframes pulse {
                0%, 100% { box-shadow: 0 0 36px rgba(0,255,255,0.25); }
                50% { box-shadow: 0 0 48px rgba(0,255,255,0.6); }
            }
            @keyframes glow {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes fadeIn {
                0% { opacity: 0; transform: scale(0.95); }
                100% { opacity: 1; transform: scale(1); }
            }

            button:hover:enabled {
                background: rgba(0,255,255,0.12);
                transform: scale(1.05);
                box-shadow: 0 0 12px #0ff;
                color: #00faff;
            }
        `}</style>

        </div>
      </Html>
    </group>
  )
}

const btnStyle = {
  flex: 1,
  padding: '8px 12px',
  background: 'transparent',
  border: '1px solid #0ff',
  borderRadius: '8px',
  color: '#0ff',
  fontSize: '12px',
  fontWeight: '600',
  textShadow: '0 0 3px #0ff',
  boxShadow: '0 0 8px #0ff6',
  transition: 'all 0.2s ease',
  backdropFilter: 'blur(6px)'
}
