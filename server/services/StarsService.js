import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class StarsService {
  async getAll(query = {}) {
    const stars = await dbContext.Stars.find(query).populate('creator', 'name picture')
    return stars
  }

  async getById(id) {
    const star = await dbContext.Stars.findById(id).populate('creator', 'name picture')
    if (!star) {
      throw new BadRequest('Invalid Id')
    }
    return star
  }

  async create(newStar) {
    const star = await dbContext.Stars.create(newStar)
    return star
  }

  async edit(update) {
    // go get the student and the getById method will handle the check if its a valid id
    const star = await this.getById(update.id)
    if (star.creatorId.toString() !== update.creatorId) {
      throw new Forbidden('you do not have permission to make that change')
    }
    const updated = await dbContext.Stars.findByIdAndUpdate(update.id, update, { new: true })
    return updated
  }

  async remove(starId, userId) {
    const star = await this.getById(starId)
    if (star.creatorId.toString() !== userId) {
      throw new Forbidden('you do not have permission to make that change')
    }
    await dbContext.Stars.findByIdAndDelete(starId)
  }
}

export const starsService = new StarsService()
