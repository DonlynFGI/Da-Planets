import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class GalaxiesService {
  async getAll(query = {}) {
    const galaxies = await dbContext.Galaxies.find({}).populate('creator', 'name picture')
    return galaxies
  }

  async getById(id) {
    const found = await dbContext.Galaxies.findById(id).populate('creator', 'name picture')
    if (!found) {
      throw new BadRequest('Invalid Id')
    }
    return found
  }

  async create(body) {
    const newGalaxy = await dbContext.Galaxies.create(body)
    return await this.getById(newGalaxy.id)
  }

  async edit(body) {
    const found = await this.getById(body.id)
    if (found.creatorId.toString() !== body.creatorId) {
      throw new Forbidden('You do not have permission to make that change')
    }
    const updated = await dbContext.Galaxies.findByIdAndUpdate(body.id, body, { new: true })
    return updated
  }

  async remove(id, userId) {
    const found = await this.getById(id)
    if (found.creatorId.toString() !== userId) {
      throw new Forbidden('You do not have permission to make that change')
    }
    await dbContext.Galaxies.findByIdAndDelete(id)
  }
}

export const galaxiesService = new GalaxiesService()
