import { Canvas } from "@react-three/fiber"
import Loader from "./Utils/Loader"
import { OrbitControls } from "@react-three/drei"
import CameraMovement from "./Utils/CameraMovement"
import ProjectTab from "./ProjectPanel/ProjectsPanel"
import ProjectShowcase from "./ProjectShowCase/ProjectShowCase"
import HolographicShowcase from "./ProjectShowCase/ProjectShowCase"
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import CharacterLoader from "./CharacterLoader/CharacterLoader"
import AboutMeTab from "./AboutMe/AboutMe"
import { useState } from "react"
import MenuLoader from "./CharacterLoader/MenuLoader"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Outline } from "@react-three/postprocessing"
function App() {
  const [ visible, setVisible ] = useState(false);
  const [ visibilityOfProjectsShowcase, setVisibilityOfProjectsShowcase ] = useState(false);
  const [lookAtProjects, setLookAtProjects] = useState(false); // 🔵 NEW

  return (
    <>
      <Canvas style={{ height: '100vh', width: '100vw' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={1} />
        <spotLight position={[0, 10, 0]} angle={0.15} penumbra={1} intensity={2} />
        <Loader path={'/edited.glb'}/>  
        <CameraMovement lookAtProjects={lookAtProjects} setLookAtProjects={setLookAtProjects}/>
        {/* <OrbitControls/> */}
        <ProjectTab
          offset={[0, 0, -1]}
          videoUrl="/portfolio.mp4"
          title="VR Shoe Shop"
          description="An immersive XR experience using R3F, Rapier & WebXR."
          link="https://yourproject.com"
        />
        <MenuLoader path={'/menu.glb'} position={[11.7, 0.5, -3.08]} scale={[0.25, 0.3, 0.25]} rotation={[0, 1 * Math.PI / 2, 0]} setVisible={setVisibilityOfProjectsShowcase}/>
        {visibilityOfProjectsShowcase && <HolographicShowcase setVisible={setVisibilityOfProjectsShowcase} position={[5.85, 0.7, -1.3]}/>}
        <CharacterLoader path={'/Character.glb'} position={[9.8210, 0, 2.03842]} setVisible={setVisible} rotation={[0, 1.6 * Math.PI / 2, 0]}/>
        {visible && <AboutMeTab setLookAtProjects={setLookAtProjects} position={[9.8210, 1.6, 2.03842]} setVisible={setVisible} image={'/me1.jpeg'} rotation={[0, Math.PI * 1.2, 0]} setVisibilityOfProjectsShowcase={setVisibilityOfProjectsShowcase}/>}
        <SkyDome />
        {/* <EffectComposer>
          <Bloom
            intensity={5}              // Strength of the glow
            radius={0.6}                 // Spread of the glow
            luminanceThreshold={0.7}     // Only glow areas brighter than this
            luminanceSmoothing={0.7}     // Smooth edges of bloom
          />
        </EffectComposer> */}
        {/* <EffectComposer>
          <Outline
            // blur
            // visibleEdgeColor="#00ffff"
            // hiddenEdgeColor="#00ffff"
            // edgeStrength={5}
            // width={400}
          />
        </EffectComposer> */}
      </Canvas>
    </>
  )
}



export default App

function SkyDome() {

  const texture = useTexture('/p2.jpg') 

  texture.mapping = THREE.EquirectangularReflectionMapping

  return (
    <mesh scale={[3, 3, 3]} position={[0,20,0]}>
      <sphereGeometry args={[40, 50, 50]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  )
}
