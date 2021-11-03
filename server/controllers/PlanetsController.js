import { Auth0Provider } from '@bcwdev/auth0provider'
import { galaxiesService } from '../services/GalaxiesService'
import { starsService } from '../services/StarsService'
import { planetsService } from '../services/PlanetsService'
import BaseController from '../utils/BaseController'

export class PlanetsController extends BaseController {
  constructor() {
    super('api/galaxies/stars/planets')
    this.router
      .get('', this.getAll)
      .get('/:id', this.getById)
      .get('/:id/planets', this.getPlanets)
      // NOTE: Beyond this point all routes require Authorization tokens (the user must be logged in)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.remove)
  }

  async getAll(req, res, next) {
    try {
      const query = req.query
      const planets = await planetsService.getAll(query)
      return res.send(planets)
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const planet = await planetsService.getById(req.params.id)
      return res.send(planet)
    } catch (error) {
      next(error)
    }
  }

  async getPlanets(req, res, next) {
    try {
      const planets = await planetsService.getById(req.params.id)
      return res.send(planets)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      // NEver trust the client
      req.body.creatorId = req.userInfo.id
      const planet = await planetsService.create(req.body)
      // custom status code
      return res.status(201).send(planet)
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      // NEver trust
      req.body.creatorId = req.userInfo.id
      req.body.id = req.params.id
      const planet = await planetsService.edit(req.body)
      return res.send(planet)
    } catch (error) {
      next(error)
    }
  }

  async remove(req, res, next) {
    try {
      const userId = req.userInfo.id
      const planetId = req.params.id
      await planetsService.remove(planetId, userId)
      return res.send('Poof, gone')
    } catch (error) {
      next(error)
    }
  }
}
