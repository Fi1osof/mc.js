import Helpers from '../../utils/helpers'

import bcrypt from 'bcryptjs'

const UserMutations = {
  async createUser(parent, args, { db }) {
    const password = await Helpers.hashPassword(args.data.password)
    const user = await db.mutation.createUser({
      data: {
        ...args.data,
        password,
        settings: {
          create: {
            renderDistance: 2
          }
        }
      }
    })

    return {
      user,
      token: Helpers.generateToken(user.id)
    }
  },
  async login(parent, args, { db }) {
    const user = await db.query.user({
      where: {
        email: args.data.email
      }
    })

    if (!user) {
      throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) {
      throw new Error('Unable to login')
    }

    return {
      user,
      token: Helpers.generateToken(user.id)
    }
  },
  async deleteUser(parent, args, { db, request }, info) {
    const userId = Helpers.getUserId(request)

    return db.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      },
      info
    )
  },
  async updateUser(parent, args, { db, request }, info) {
    const userId = Helpers.getUserId(request)

    if (typeof args.data.password === 'string') {
      args.data.password = await Helpers.hashPassword(args.data.password)
    }

    return db.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    )
  },
  updateSettings(
    parent,
    {
      data: { id, ...data },
      where
    },
    { db },
    info
  ) {
    return db.mutation.updateSettings(
      {
        data,
        where
      },
      info
    )
  }
}

export default UserMutations
