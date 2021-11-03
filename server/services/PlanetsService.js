import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class PlanetsService {
  async getAll(query = {}) {
    const planets = await dbContext.Planets.find(query).populate('creator', 'name picture')
    return planets
  }

  async getById(id) {
    const planet = await dbContext.Planets.findById(id).populate('creator', 'name picture')
    if (!planet) {
      throw new BadRequest('Invalid Id')
    }
    return planet
  }

  async create(newPlanet) {
    const planet = await dbContext.Planets.create(newPlanet)
    return planet
  }

  async edit(update) {
    // go get the student and the getById method will handle the check if its a valid id
    const planet = await this.getById(update.id)
    if (planet.creatorId.toString() !== update.creatorId) {
      throw new Forbidden('you do not have permission to make that change')
    }
    const updated = await dbContext.Planets.findByIdAndUpdate(update.id, update, { new: true })
    return updated
  }

  async remove(planetId, userId) {
    const planet = await this.getById(planetId)
    if (planet.creatorId.toString() !== userId) {
      throw new Forbidden('you do not have permission to make that change')
    }
    await dbContext.Planets.findByIdAndDelete(planetId)
  }
}

export const planetsService = new PlanetsService()
