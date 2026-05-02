const imageModules = import.meta.glob('./*.png', { eager: true, import: 'default' })

const imageByFileName = Object.fromEntries(
  Object.entries(imageModules).map(([path, image]) => [path.split('/').pop(), image])
)

function getImage(fileName) {
  const image = imageByFileName[fileName]

  if (!image) {
    throw new Error(`Background slide asset not found: ${fileName}`)
  }

  return image
}

const slideDefinitions = [
  { id: 'redlines', label: 'Pre-construction redlines that prevent costly mistakes', fileName: 'redlines.png' },
  { id: 'electrical-only', label: 'We do electrical only - full focus', fileName: 'electrical-only.png' },
  { id: 'electrical', label: 'Electrical systems engineered for execution', fileName: 'electrical.png' },
  { id: 'commercial', label: 'Commercial projects delivered with precision', fileName: 'commercial.png' },
  { id: 'bim', label: 'BIM modeling and coordination without clashes', fileName: 'modeling.png' },
  { id: 'constructability', label: 'Constructability thinking built into every model', fileName: 'constructability.png' },
  { id: 'telecom', label: 'Telecom and low-voltage systems integrated', fileName: 'telecom.png' },
  { id: 'industrial', label: 'Industrial environments demand accuracy', fileName: 'industrial.png' },
  { id: 'prefab', label: 'Prefab and shop drawings ready for the field', fileName: 'prefab_and_shopdrawings.png' },
  { id: 'revit-addins', label: 'Custom Revit add-ins for faster workflows', fileName: 'plugins-development.png' },
  { id: 'fire-alarm', label: 'Fire alarm systems designed to code', fileName: 'fire-alarm.png' },
  { id: 'mission-critical', label: 'Mission-critical facilities require zero compromise', fileName: 'mission-critical.png' },
  { id: 'design-assist', label: 'Design-assistance with real field awareness', fileName: 'design.png' },
  { id: 'nfpa', label: 'NFPA code compliance in every detail', fileName: 'nfpa-code-compliance.png' },
  { id: 'bms', label: 'BMS systems modeled with precision', fileName: 'bms.png' },
  { id: 'healthcare', label: 'Healthcare projects where reliability matters', fileName: 'health-care.png' },
  { id: 'coordination', label: 'Coordination that keeps trades aligned', fileName: 'instrumentation_and_control.png' },
  { id: 'precision', label: 'Precision in every drawing and model', fileName: 'education.png' },
  { id: 'security-av', label: 'Security and AV systems coordinated seamlessly', fileName: 'security_and_av.png' },
  { id: 'residential', label: 'High-rise residential projects at scale', fileName: 'high-rise_residential.png' }
]

export const backgroundSlides = slideDefinitions.map((slide) => ({
  ...slide,
  image: getImage(slide.fileName)
}))

export default backgroundSlides
