import Helpers from '../../utils/helpers'

const WorldQueries = {
  myWorlds(parent, args, { db, request }, info) {
    const userId = Helpers.getUserId(request)
    return db.query.user({ where: { id: userId } }, info)
  },
  async world(parent, args, { db }, info) {
    let { data, where } = args

    await db.mutation.updateWorld({
      data: {
        ...data,
        lastPlayed: new Date().toISOString()
      },
      where
    })
    return db.query.world({ where }, info)
  }
}

export default WorldQueries
