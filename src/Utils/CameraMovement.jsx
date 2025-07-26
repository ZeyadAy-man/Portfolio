import { useThree, useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useRef } from 'react';

const roomBounds = { minX: -20.05, maxX: 20.2, minZ: -20.8, maxZ: 20.8 }
const tables = []
const walls = [
  { minX: -5.1, maxX: 8.5, minZ: 0.6, maxZ: 0.715 },
  { minX: -5.1, maxX: 8.6, minZ: -0.8726, maxZ: -0.8 } //-5.1210 => 8.5894, -0.7959 => -0.79923
]
function isInsideBox(pos, box) {
  return (
    pos.x >= box.minX &&
    pos.x <= box.maxX &&
    pos.z >= box.minZ &&
    pos.z <= box.maxZ
  )
}

function isOnBlockedArcEdge(pos, center, radius, arcStart, arcEnd) {
  const dx = pos.x - center.x;
  const dz = pos.z - center.z;
  const dist = Math.sqrt(dx * dx + dz * dz);
  if (Math.abs(dist - radius) > 0.1) return false;

  const angle = Math.atan2(dz, dx);
  const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);
  const normalizedStart = (arcStart + Math.PI * 2) % (Math.PI * 2);
  const normalizedEnd = (arcEnd + Math.PI * 2) % (Math.PI * 2);

  if (normalizedStart < normalizedEnd) {
    return normalizedAngle >= normalizedStart && normalizedAngle <= normalizedEnd;
  } else {
    return normalizedAngle >= normalizedStart || normalizedAngle <= normalizedEnd;
  }
}

const circle1 = {
  center: { x: -8.6732, z: -0.0266 },
  radius: 3.6039,
  arcStart: Math.PI / 14 - 0.01,
  arcEnd: -Math.PI / 14 + 0.01
}

const circle2 = {
  center: { x: 12.2318, z: -0.1023 },
  radius: 3.6039,
  arcStart: (Math.PI / 14) + Math.PI - 0.05,
  arcEnd: (-Math.PI / 14) + Math.PI + 0.05
}

export default function CameraMovement(props) {
  const { camera, gl, scene } = useThree()
  const targetPosition = useRef(new THREE.Vector3(11.6548, 1.571, -1)) // 🎯 Match position of your HolographicShowcase
  const lookAtPoint = useRef(new THREE.Vector3(11.6307, 1.5679, -1.77))   // 👀 Where camera should look
  const [keys, setKeys] = useState({})
  const hasInitialized = useRef(false);
  //11.6548, 1.571, -1
  //11.6307, 1.5679, -1.77
  // camera.lookAt(8.874, 1.6, -0.161)


  useFrame(() => {
    if (props.lookAtProjects) {
      camera.position.lerp(targetPosition.current, 0.05)

      const targetDir = lookAtPoint.current.clone().sub(camera.position).normalize()
      const currentDir = new THREE.Vector3()
      camera.getWorldDirection(currentDir)

      const smoothedDir = currentDir.lerp(targetDir, 0.05).normalize()
      const targetLook = camera.position.clone().add(smoothedDir)
      camera.lookAt(targetLook)

      if (camera.position.distanceTo(targetPosition.current) < 0.0001) {
        props.setLookAtProjects(false)

          // ✅ Get final look direction
        const lookDirection = lookAtPoint.current.clone().sub(camera.position).normalize()

          // ✅ Convert to yaw and pitch (rotation around Y and X axis)
        const newYaw = Math.atan2(-lookDirection.x, -lookDirection.z)
        const newPitch = Math.asin(lookDirection.y)


          // ✅ Update control state
        yaw.current = newYaw
        pitch.current = newPitch
        targetYaw.current = newYaw
        targetPitch.current = newPitch
      }
    }

  })

  if(props.isFinished){
    camera.rotateX(0);
    camera.rotateY(0);
    camera.rotateZ(0);
  }
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const direction = useRef(new THREE.Vector3(0, 0, 0))
  const yaw = useRef(0)
  const pitch = useRef(0)

  const targetYaw = useRef(0)
  const targetPitch = useRef(0)

  const currentSpeed = useRef(0)
  const maxSpeed = 1
  const acceleration = 15 
  const deceleration = 20 

  const bobbingAmplitude = 0.025
  const bobbingFrequency = 8
  const bobbingTime = useRef(0)

  const isDragging = useRef(false)
  const prevMousePos = useRef({ x: 0, y: 0 })

  const stepSoundBuffer = useLoader(THREE.AudioLoader, '/footstep.mp3')
  const stepAudio = useRef(null)
  const timeSinceLastStep = useRef(0)

  useEffect(() => {
    function onKeyDown(e) {
      setKeys((k) => ({ ...k, [e.code]: true }))
    }
    function onKeyUp(e) {
      setKeys((k) => ({ ...k, [e.code]: false }))
    }
    function onMouseDown(e) {
      isDragging.current = true
      prevMousePos.current = { x: e.clientX, y: e.clientY }
    }
    function onMouseUp() {
      isDragging.current = false
    }
    function onMouseMove(e) {
      if (!isDragging.current) return
      const movementX = e.clientX - prevMousePos.current.x
      const movementY = e.clientY - prevMousePos.current.y
      prevMousePos.current = { x: e.clientX, y: e.clientY }

      const sensitivity = 0.003 

      targetYaw.current -= movementX * sensitivity
      targetPitch.current -= movementY * sensitivity

      const maxPitch = Math.PI / 2 * 0.99
      if (targetPitch.current > maxPitch) targetPitch.current = maxPitch
      if (targetPitch.current < -maxPitch) targetPitch.current = -maxPitch
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    gl.domElement.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      gl.domElement.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [gl.domElement])

  useEffect(() => {
    if (!stepAudio.current) {
      const listener = new THREE.AudioListener()
      camera.add(listener)
      stepAudio.current = new THREE.PositionalAudio(listener)
      camera.add(stepAudio.current)
      stepAudio.current.setBuffer(stepSoundBuffer)
      stepAudio.current.setRefDistance(1)
      stepAudio.current.setVolume(0.3)
    }
  }, [camera, stepSoundBuffer])

  useEffect(() => {
    const createConstraintMesh = (circle, color) => {
      const material = new THREE.LineBasicMaterial({ color });
      const points = []
      const steps = 100
      const arcStart = circle.arcEnd;
      const arcEnd = circle.arcStart + Math.PI * 2;
      for (let i = 0; i <= steps; i++) {
        const angle = arcStart + ((arcEnd - arcStart) * i) / steps;
        const x = circle.center.x + Math.cos(angle) * circle.radius;
        const z = circle.center.z + Math.sin(angle) * circle.radius;
        points.push(new THREE.Vector3(x, 1.3, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    }
    // createConstraintMesh(circle1, 'red')
    // createConstraintMesh(circle2, 'blue')

    // walls.forEach((wall) => {
      // const geometry = new THREE.BoxGeometry(
      //   wall.maxX - wall.minX,
      //   2,
      //   wall.maxZ - wall.minZ
      // )
      // const material = new THREE.MeshBasicMaterial({ color: 'green', wireframe: true })
      // const mesh = new THREE.Mesh(geometry, material)
      // mesh.position.set(
      //   (wall.minX + wall.maxX) / 2,
      //   1,
      //   (wall.minZ + wall.maxZ) / 2
      // )
      // scene.add(mesh)
    // })
  }, [scene])

  console.log('CameraMovement initialized' , camera.position)

  useFrame((_, delta) => {
    if (!hasInitialized.current) {
      camera.position.set(15.23, 1.55, -0.205);
      yaw.current = 6 * 0.265;
      pitch.current = 0;

      targetYaw.current = yaw.current;
      targetPitch.current = pitch.current;

      camera.rotation.order = 'YXZ';
      camera.rotation.y = yaw.current;
      camera.rotation.x = pitch.current;
      hasInitialized.current = true;
    }

    const lerpFactor = 10 * delta


    if(!props.lookAtProjects) {
      yaw.current += (targetYaw.current - yaw.current) * lerpFactor
      pitch.current += (targetPitch.current - pitch.current) * lerpFactor
      
      direction.current.set(0, 0, 0)
      if (keys['KeyW']) direction.current.z -= 1
      if (keys['KeyS']) direction.current.z += 1
      if (keys['KeyA']) direction.current.x -= 1
      if (keys['KeyD']) direction.current.x += 1
      
      if (direction.current.length() > 1) {
        direction.current.normalize()
      }

      if (direction.current.length() > 0) {
        currentSpeed.current += acceleration * delta
      if (currentSpeed.current > maxSpeed) currentSpeed.current = maxSpeed
    } else {
      currentSpeed.current -= deceleration * delta
      if (currentSpeed.current < 0) currentSpeed.current = 0
    }
    
      velocity.current
        .copy(direction.current)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current)
        .multiplyScalar(currentSpeed.current * delta)
      
      const nextPos = camera.position.clone().add(velocity.current)
      
      nextPos.x = Math.max(roomBounds.minX, Math.min(roomBounds.maxX, nextPos.x))
      nextPos.z = Math.max(roomBounds.minZ, Math.min(roomBounds.maxZ, nextPos.z))
      
      const onBlockedArc1 = isOnBlockedArcEdge(nextPos, circle1.center, circle1.radius, circle1.arcStart, circle1.arcEnd);
      const onBlockedArc2 = isOnBlockedArcEdge(nextPos, circle2.center, circle2.radius, circle2.arcStart, circle2.arcEnd);
      
      const wallCollision = walls.some((wall) => isInsideBox(nextPos, wall))
      const tableCollision = tables.some((table) => isInsideBox(nextPos, table))
      
      if (!tableCollision && !wallCollision && !onBlockedArc1 && !onBlockedArc2) {
        camera.position.copy(nextPos)
      }
    
      if (currentSpeed.current > 0.1) {
        bobbingTime.current += delta * bobbingFrequency
        camera.position.y = 1.55 + Math.sin(bobbingTime.current) * bobbingAmplitude
        
        timeSinceLastStep.current += delta
        if (timeSinceLastStep.current > 0.7) {
          if (stepAudio.current && stepAudio.current.buffer) {
            const newStep = new THREE.PositionalAudio(stepAudio.current.listener);
            newStep.setBuffer(stepAudio.current.buffer);
            newStep.setRefDistance(1);
            newStep.setVolume(0.3);
            newStep.setPlaybackRate(0.9 + Math.random() * 0.2);
            camera.add(newStep);
            newStep.play();
            
            setTimeout(() => {
              camera.remove(newStep);
            }, 1000);
          }
          timeSinceLastStep.current = 0;
        }
      } else {
        bobbingTime.current = 0
        camera.rotation.x = 0
        camera.rotation.y = 0
        camera.rotation.z = 0
        timeSinceLastStep.current = 0
        if (stepAudio.current && stepAudio.current.isPlaying) {
          stepAudio.current.stop()
        }
      }
      
      camera.rotation.order = 'YXZ'
      camera.rotation.y = yaw.current
      camera.rotation.x = pitch.current
    }
  })

  return null
}
