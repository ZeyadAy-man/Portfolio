import { Html, useGLTF, useAnimations } from '@react-three/drei'
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
export default function CharacterLoader(props) {
  const group = useRef()
  const textRef = useRef()
  const { camera } = useThree()

  const { scene, animations } = useGLTF(props.path)
  const { actions } = useAnimations(animations, group)

  const messages = [
    "👋 Welcome to my portfolio",
    "👨‍💻 I'm Zeyad Ayman",
    "🚀 Explore my work!",
    "🧠 React, XR, 3D & More!",
    "🎯 Let’s build something awesome!"
  ]

  const [displayedText, setDisplayedText] = useState("")
  const [msgIndex, setMsgIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const typeInterval = setInterval(() => {
      const fullMessage = messages[msgIndex]
      setDisplayedText(fullMessage.slice(0, charIndex + 1))
      setCharIndex((prev) => prev + 1)

      if (charIndex >= fullMessage.length) {
        setTimeout(() => {
          setCharIndex(0)
          setMsgIndex((prev) => (prev + 1) % messages.length)
        }, 2000)
      }
    }, 70)

    return () => clearInterval(typeInterval)
  }, [charIndex, msgIndex])

  useEffect(() => {
    if (!actions || animations.length === 0) return
    const action = actions[animations[0].name]
    action?.reset().setLoop(THREE.LoopRepeat).play()
    return () => action?.stop()
  }, [actions, animations])

  useEffect(() => {
    const update = () => {
      if (textRef.current) {
        textRef.current.lookAt(camera.position)
      }
    }
    window.addEventListener('mousemove', update)
    return () => window.removeEventListener('mousemove', update)
  }, [camera])

  return (
    <group ref={group} {...props} onClick={() => {props.setVisible(true);}}>
      <primitive object={scene} />

      <group ref={textRef} position={[0, 2.2, 0]}>
        <Html transform center distanceFactor={10} zIndexRange={[100, 0]}>
          <div
            style={{
              background: 'rgba(0, 177, 212, 0.85)',
              padding: '2px 2px',
              borderRadius: '4px',
              border: '1px solid #0ff',
              fontSize: '3px',
              fontWeight: '500',
              color: '#111',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              transform: 'translateZ(0)',
            }}
          >
            {displayedText}
            <span style={{
              opacity: 0.6,
              color: '#0ff',
            }}>▌</span>
          </div>
          <style>{`
            @keyframes float {
              0% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
              100% { transform: translateY(0); }
            }
          `}</style>
        </Html>
      </group>
    </group>
  )
}
