// HolographicShowcase.jsx
import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const projects = [
  {
    title: 'Shoe Shop XR',
    video: '/portfolio.mp4',
    description: 'An immersive VR shoe shopping experience using R3F + WebXR.',
    link: 'https://example.com/shoe-shop',
  },
  {
    title: 'Portfolio MetaUI',
    video: '/portfolio.mp4',
    description: 'A floating desktop-style portfolio interface inspired by Meta Quest 3.',
    link: 'https://example.com/portfolio-meta',
  },
  {
    title: 'AR Dashboard',
    video: '/portfolio.mp4',
    description: 'Real-time data dashboard in AR using React Three Fiber + WebXR.',
    link: 'https://example.com/ar-dashboard',
  },
  {
    title: 'AI 3D Assistant',
    video: '/portfolio.mp4',
    description: 'A 3D assistant avatar with AI integration for immersive UX.',
    link: 'https://example.com/ai-3d',
  },
  {
    title: 'Space Simulator',
    video: '/portfolio.mp4',
    description: 'A realistic solar system simulator using physics and particles.',
    link: 'https://example.com/space-sim',
  },
]

export default function HolographicShowcase(props) {
    const [index, setIndex] = useState(0)
    const meshRef = useRef()
    const videoRefs = useRef([])
    const [hovered, setHovered] = useState(false)
    const currentProject = projects[index]
    const circleGlow = useRef()
    const [mounted, setMounted] = useState(false)

    const [transitioning, setTransitioning] = useState(false)

    const advance = (dir) => {
        setTransitioning(true)
        setTimeout(() => {
            setIndex((prev) => (prev + dir + projects.length) % projects.length)
            setTransitioning(false)
        }, 300) // match CSS transition duration
    }


  

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
    }
    if (circleGlow.current) {
      const color = hovered ? '#0ff' : '#09f'
      circleGlow.current.material.color.lerp(new THREE.Color(color), 0.1)
    }
  })

  useEffect(() => {
    setTimeout(() => setMounted(true), 200)
  }, [])

  return (
    <group position={props.position} rotation={props.rotation}>
      {/* Holographic Panel */}
      {/* <mesh ref={meshRef}>
        <circleGeometry args={[1.1, 64]} />
        <meshBasicMaterial color="#222" transparent opacity={0.4} />
      </mesh> */}

      {/* Glow Ring */}
      <mesh ref={circleGlow} position={props.position} rotation={props.rotation}>
        <ringGeometry args={[1.3, 1.45, 64]} />
        <meshBasicMaterial color="#09f" transparent opacity={0.5} />
      </mesh>

      {/* UI Content */}
      <Html center transform distanceFactor={1.6} zIndexRange={[100, 0]} position={props.position} rotation={props.rotation}>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '10px', 
          width: '100%',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'scale(1)' : 'scale(0.95)',}}
        >
            <h2 style={{
                // margin: '0 0 12px',
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: '#0ff',
                textShadow: '0 0 8px #0ff6',
                borderBottom: '1px solid #0ff3',
                paddingBottom: '6px',
                backgroundColor: 'rgba(0,0,0,0.9)',
                alignSelf: 'center',
                // margin: '10px',
                borderRadius: '8px',
                padding: '10px 20px',
                marginTop: '-10px'
            }}>
                ✨ Projects Showcase
            </h2>
        </div>


        <div
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={{
        width: '300px',
        padding: '20px',
        borderRadius: '20px',
        background: 'rgba(10,10,20,0.85)',
        border: '1.5px solid rgba(0,255,255,0.35)',
        boxShadow: hovered
            ? '0 0 20px rgba(0,255,255,0.4), inset 0 0 12px rgba(0,255,255,0.1)'
            : '0 0 16px rgba(0,255,255,0.15)',
        color: 'white',
        textAlign: 'center',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease',
        pointerEvents: transitioning ? 'none' : 'auto',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'scale(1)' : 'scale(0.95)',        
        }}>

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

          <h3>{currentProject.title}</h3>
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={currentProject.video}
            autoPlay
            muted
            loop
            playsInline
            style={{
                width: '100%',
                borderRadius: '12px',
                marginBottom: '12px',
                border: '1px solid rgba(0,255,255,0.25)',
                boxShadow: '0 0 12px rgba(0,255,255,0.15)',
                objectFit: 'cover',
            }}
          />
          <p>{currentProject.description}</p>
          <a
            href={currentProject.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                background: 'rgba(0,255,255,0.08)',
                padding: '6px 14px',
                color: '#0ff',
                fontWeight: '600',
                cursor: 'pointer',
                margin: '0 6px',
                boxShadow: '0 0 0px rgba(0,255,255,0.2)',
                transition: 'all 0.2s ease-in-out',
                textDecoration: 'underline'
                }}
                onMouseEnter={(e) => {

                    e.target.style.color = '#6ff';
                }}
                onMouseLeave={(e) => {

                    e.target.style.color = '#0ff';
                }}
          >
            Visit Project →
          </a>
          <div style={{ marginTop: '12px' }}>
            <button
                onClick={() => advance(-1)}
                style={{
                background: 'rgba(0,255,255,0.08)',
                border: '1px solid #0ff',
                borderRadius: '8px',
                padding: '6px 14px',
                color: '#0ff',
                fontWeight: '600',
                cursor: 'pointer',
                margin: '0 6px',
                boxShadow: '0 0 4px rgba(0,255,255,0.2)',
                transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0,255,255,0.15)';
                e.target.style.boxShadow = '0 0 8px #0ff';
                e.target.style.color = '#6ff';
                }}
                onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,255,255,0.08)';
                e.target.style.boxShadow = '0 0 4px rgba(0,255,255,0.2)';
                e.target.style.color = '#0ff';
                }}
            >
              ‹ Prev
            </button>
            <button
                onClick={() => advance(1)}
                style={{
                background: 'rgba(0,255,255,0.08)',
                border: '1px solid #0ff',
                borderRadius: '8px',
                padding: '6px 14px',
                color: '#0ff',
                fontWeight: '600',
                cursor: 'pointer',
                margin: '0 6px',
                boxShadow: '0 0 4px rgba(0,255,255,0.2)',
                transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0,255,255,0.15)';
                e.target.style.boxShadow = '0 0 8px #0ff';
                e.target.style.color = '#6ff';
                }}
                onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0,255,255,0.08)';
                e.target.style.boxShadow = '0 0 4px rgba(0,255,255,0.2)';
                e.target.style.color = '#0ff';
                }}
            >
              Next ›
            </button>
          </div>
        </div>
      </Html>
    </group>
  )
}

