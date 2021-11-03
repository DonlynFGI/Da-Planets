import mongoose from 'mongoose'
import { AccountSchema, ProfileSchema } from '../models/Account'
import { GalaxySchema } from '../models/Galaxy'
import { PlanetSchema } from '../models/Planet'
import { StarSchema } from '../models/Star'
import { ValueSchema } from '../models/Value'

class DbContext {
  Values = mongoose.model('Value', ValueSchema);
  Account = mongoose.model('Account', AccountSchema);
  Profiles = mongoose.model('Profile', ProfileSchema, 'accounts');
  Galaxies = mongoose.model('galaxy', GalaxySchema);
  Stars = mongoose.model('star', StarSchema)
  Planets = mongoose.model('Planet', PlanetSchema)
}

export const dbContext = new DbContext()
