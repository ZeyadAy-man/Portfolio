import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useAnimations } from "@react-three/drei";
import * as THREE from "three";

export default function Loader(props) {
  const group = useRef()
  const { scene, animations } = useGLTF(props.path)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (!actions || animations.length === 0) return

    const animationName = animations[0].name 
    const action = actions[animationName]

    if (action) {
      action
        .reset()
        .setLoop(THREE.LoopRepeat)
        .play()
    } else {
      console.warn('Animation not found:', animationName)
    }

    return () => {
      if (action) action.stop()
    }
  }, [actions, animations])

  return <group><primitive ref={group} object={scene} onClick={console.log("Lol")} {...props}/></group>
}