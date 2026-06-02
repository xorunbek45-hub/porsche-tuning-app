import { motion } from 'framer-motion'

const COLORS = [
  { name: 'Carmine Red', hex: '#d6001c' },
  { name: 'Guards Red', hex: '#c8102e' },
  { name: 'Ruby Star', hex: '#8a2551' },
  { name: 'Racing Yellow', hex: '#f6d525' },
  { name: 'Lava Orange', hex: '#e85511' },
  { name: 'Signal Orange', hex: '#d94b18' },
  { name: 'Shark Blue', hex: '#0061a0' },
  { name: 'Miami Blue', hex: '#007bb8' },
  { name: 'Gentian Blue', hex: '#1c325c' },
  { name: 'Aetna Blue', hex: '#4b8197' },
  { name: 'Python Green', hex: '#3b9141' },
  { name: 'Lizard Green', hex: '#77a233' },
  { name: 'Oak Green', hex: '#314235' },
  { name: 'Aventurine Green', hex: '#455245' },
  { name: 'Amethyst Metallic', hex: '#432b47' },
  { name: 'GT Silver', hex: '#8c9095' },
  { name: 'Ice Grey Metallic', hex: '#d1d1d1' },
  { name: 'Arctic Grey', hex: '#8d8d8d' },
  { name: 'Chalk', hex: '#dbdbd5' },
  { name: 'Carrara White', hex: '#f0f0ed' },
  { name: 'Jet Black Metallic', hex: '#232323' },
  { name: 'Black', hex: '#111111' },
]

const MODELS = [
  { id: 'free_1975_porsche_911_930_turbo', name: 'Porsche 911 930 Turbo (1975)' },
  { id: 'porsche_911', name: 'Porsche 911 Targa 4S (2021)' },
  { id: 'free_porsche_911_carrera_4s', name: 'Porsche 911 Carrera 4S' },
  { id: 'porsche_carrera_gt_2004', name: 'Porsche Carrera GT (2004)' },
  { id: 'porsche_cayman', name: 'Porsche Cayman S 981 (2014)' },
  { id: '2022_porsche_cayenne_turbo_gt', name: 'Porsche Cayenne Turbo GT' },
  { id: 'porsche_panamera_2017', name: 'Porsche Panamera (2017)' },
]

const OPTION_GROUPS = [
  {
    title: 'Paint Finish',
    key: 'paintFinish',
    options: [
      { value: 'gloss', label: 'Gloss' },
      { value: 'satin', label: 'Satin' },
      { value: 'matte', label: 'Matte' },
      { value: 'pearl', label: 'Pearl' },
      { value: 'chrome', label: 'Chrome' },
    ],
  },
  {
    title: 'Alloy Wheels',
    key: 'rims',
    options: [
      { value: 'silver', label: 'Silver' },
      { value: 'dark', label: 'Dark Satin' },
      { value: 'gold', label: 'Neodyme' },
      { value: 'bronze', label: 'Bronze' },
      { value: 'white', label: 'White' },
      { value: 'blackChrome', label: 'Black Chrome' },
    ],
  },
  {
    title: 'Rear Spoiler',
    key: 'spoiler',
    options: [
      { value: 'body', label: 'Body Color' },
      { value: 'carbon', label: 'Carbon' },
      { value: 'none', label: 'Delete' },
    ],
  },
  {
    title: 'Carbon Package',
    key: 'carbon',
    options: [
      { value: 'visible', label: 'Visible Carbon' },
      { value: 'body', label: 'Body Color' },
      { value: 'factory', label: 'Factory' },
    ],
  },
  {
    title: 'Exterior Trim',
    key: 'trim',
    options: [
      { value: 'carbon', label: 'Carbon Look' },
      { value: 'black', label: 'Gloss Black' },
      { value: 'body', label: 'Body Color' },
    ],
  },
  {
    title: 'Aero Kit',
    key: 'aero',
    options: [
      { value: 'carbon', label: 'Carbon Aero' },
      { value: 'black', label: 'Gloss Black' },
      { value: 'body', label: 'Body Color' },
      { value: 'factory', label: 'Factory' },
    ],
  },
  {
    title: 'Decals',
    key: 'decals',
    options: [
      { value: 'factory', label: 'Factory' },
      { value: 'black', label: 'Black Script' },
      { value: 'white', label: 'White Script' },
      { value: 'red', label: 'Red Script' },
      { value: 'delete', label: 'Delete' },
    ],
  },
  {
    title: 'Badges',
    key: 'badges',
    options: [
      { value: 'chrome', label: 'Chrome' },
      { value: 'black', label: 'Black' },
      { value: 'gold', label: 'Gold' },
    ],
  },
  {
    title: 'Mirror Caps',
    key: 'mirrors',
    options: [
      { value: 'body', label: 'Body Color' },
      { value: 'black', label: 'Gloss Black' },
      { value: 'carbon', label: 'Carbon' },
    ],
  },
  {
    title: 'Metal Accents',
    key: 'metal',
    options: [
      { value: 'chrome', label: 'Chrome' },
      { value: 'black', label: 'Black' },
      { value: 'bronze', label: 'Bronze' },
      { value: 'titanium', label: 'Titanium' },
    ],
  },
  {
    title: 'Brake Calipers',
    key: 'caliper',
    options: [
      { value: 'red', label: 'Guards Red' },
      { value: 'yellow', label: 'PCCB Yellow' },
      { value: 'black', label: 'Black' },
      { value: 'blue', label: 'Shark Blue' },
      { value: 'acid', label: 'Acid Green' },
    ],
  },
  {
    title: 'Tires',
    key: 'tires',
    options: [
      { value: 'factory', label: 'Factory' },
      { value: 'deepBlack', label: 'Deep Black' },
      { value: 'track', label: 'Track Rubber' },
      { value: 'whiteLetter', label: 'White Letter' },
    ],
  },
  {
    title: 'Interior',
    key: 'interior',
    options: [
      { value: 'black', label: 'Black' },
      { value: 'red', label: 'Bordeaux Red' },
      { value: 'tan', label: 'Cognac' },
      { value: 'chalk', label: 'Chalk' },
    ],
  },
  {
    title: 'Exhaust Tips',
    key: 'exhaust',
    options: [
      { value: 'chrome', label: 'Chrome' },
      { value: 'black', label: 'Black' },
      { value: 'titanium', label: 'Titanium' },
    ],
  },
  {
    title: 'Suspension',
    key: 'suspension',
    options: [
      { value: 'stock', label: 'Stock' },
      { value: 'sport', label: 'Sport' },
      { value: 'track', label: 'Track Low' },
    ],
  },
]

export function TuningMenu({ config, setConfig }) {
  const updateConfig = (key, value) => setConfig({ ...config, [key]: value })

  return (
    <motion.div
      className="glass-panel tuning-menu"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="tuning-section">
        <h3>Car Model</h3>
        <select
          className="model-select"
          value={config.model}
          onChange={(e) => updateConfig('model', e.target.value)}
        >
          {MODELS.map((model) => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </select>
      </div>

      <div className="tuning-section">
        <h3>Paint Color</h3>
        <div className="color-picker">
          {COLORS.map((color) => (
            <button
              key={color.hex}
              className={`color-btn ${config.color === color.hex ? 'active' : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => updateConfig('color', color.hex)}
              title={color.name}
              aria-label={color.name}
            />
          ))}
        </div>
      </div>

      {OPTION_GROUPS.map((group) => (
        <div className="tuning-section" key={group.key}>
          <h3>{group.title}</h3>
          <div className="parts-grid">
            {group.options.map((option) => (
              <button
                key={option.value}
                className={`part-btn ${config[group.key] === option.value ? 'active' : ''}`}
                onClick={() => updateConfig(group.key, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  )
}
