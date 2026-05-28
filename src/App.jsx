import { useState } from 'react'
import { motion } from 'framer-motion'
import { Scene } from './components/Scene'
import { TuningMenu } from './components/TuningMenu'

function App() {
  const [tuningConfig, setTuningConfig] = useState({
    model: 'free_1975_porsche_911_930_turbo',
    color: '#d6001c',
    paintFinish: 'gloss',
    rims: 'silver',
    spoiler: 'body',
    trim: 'carbon',
    carbon: 'visible',
    aero: 'carbon',
    decals: 'factory',
    badges: 'chrome',
    mirrors: 'body',
    metal: 'chrome',
    tires: 'factory',
    caliper: 'red',
    glass: 'clear',
    lights: 'clear',
    interior: 'black',
    exhaust: 'chrome',
    suspension: 'stock',
  })

  return (
    <div className="app-container">
      {/* 3D Scene Layer */}
      <div className="scene-layer">
        <Scene tuningConfig={tuningConfig} activeModel={tuningConfig.model} />
      </div>

      {/* UI Layer */}
      <div className="ui-layer">
        <motion.div 
          className="ui-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="brand-wordmark">PORSCHE</h1>
          <p>Tuning Configurator & 3D Studio</p>
        </motion.div>

        <TuningMenu config={tuningConfig} setConfig={setTuningConfig} />
      </div>
    </div>
  )
}

export default App
