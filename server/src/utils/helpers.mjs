import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class Helpers {
  constructor() {
    this.hashPassword = this.hashPassword.bind(this)
    this.getUserId = this.getUserId.bind(this)
    this.getBlockRep = this.getBlockRep.bind(this)
    this.generateToken = this.generateToken.bind(this)
  }

  static hashPassword(password) {
    if (password.length < 8) {
      throw new Error('Password must be 8 characters or longer.')
    }

    return bcrypt.hash(password, 10)
  }

  static getUserId(request, requireAuth = true, ctx) {
    if (!ctx) {
      throw new Error('ctx required')
    }

    // const header = request.request
    //   ? request.request.headers.authorization
    //   : request.connection.context.Authorization

    // if (header) {
    //   const token = header.replace('Bearer ', '')
    //   const decoded = jwt.verify(token, 'thisisasecret')
    //   return decoded.userId
    // }

    // if (requireAuth) {
    //   throw new Error('Authentication required')
    // }

    const { currentUser } = ctx

    const { id: currentUserId } = currentUser || {}

    if (!currentUserId && requireAuth) {
      throw new Error('Authentication required')
    }

    return currentUserId
  }

  static getBlockRep(worldId, x, y, z) {
    return `${worldId}:${x}:${y}:${z}`
  }

  static generateToken(userId) {
    return jwt.sign({ userId }, 'thisisasecret', { expiresIn: '7 days' })
  }
}

export default Helpers
