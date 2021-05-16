import { generateThreeTorus } from './threetorus'

export const generateThreeSphere = (radius, piResolution = 8) =>
  generateThreeTorus(radius, radius, radius, piResolution)

export default generateThreeSphere(1)
