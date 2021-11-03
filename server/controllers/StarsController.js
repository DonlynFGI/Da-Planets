import { Auth0Provider } from '@bcwdev/auth0provider'
import { galaxiesService } from '../services/GalaxiesService'
import { starsService } from '../services/StarsService'
import { planetsService } from '../services/PlanetsService'
import BaseController from '../utils/BaseController'

export class StarsController extends BaseController {
  constructor() {
    super('api/galaxies/stars')
    this.router
      .get('', this.getAll)
      .get('/:id', this.getById)
      .get('/:id/planets', this.getAllPlanets)
      // NOTE: Beyond this point all routes require Authorization tokens (the user must be logged in)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.remove)
  }

  async getAll(req, res, next) {
    try {
      const query = req.query
      const stars = await starsService.getAll(query)
      return res.send(stars)
    } catch (error) {
      next(error)
    }
  }

  async getAllPlanets(req, res, next) {
    try {
      // using the same find method I can pass a query to determine what comes back
      const planets = await planetsService.getAll({ classId: req.params.id })
      return res.send(planets)
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const star = await starsService.getById(req.params.id)
      return res.send(star)
    } catch (error) {
      next(error)
    }
  }

  async getStars(req, res, next) {
    try {
      const stars = await starsService.getById(req.params.id)
      return res.send(stars)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      // NEver trust the client
      req.body.creatorId = req.userInfo.id
      const star = await starsService.create(req.body)
      // custom status code
      return res.status(201).send(star)
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      // NEver trust
      req.body.creatorId = req.userInfo.id
      req.body.id = req.params.id
      const star = await starsService.edit(req.body)
      return res.send(star)
    } catch (error) {
      next(error)
    }
  }

  async remove(req, res, next) {
    try {
      const userId = req.userInfo.id
      const starId = req.params.id
      await starsService.remove(starId, userId)
      return res.send('Poof, gone')
    } catch (error) {
      next(error)
    }
  }
}
