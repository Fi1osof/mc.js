/* eslint-disable camelcase */
const defaultArray = []

const WorldSubscriptions = {
  message: {
    subscribe(parent, { worldId }, { db }, info) {
      return db.subscription.message(
        {
          where: {
            node: {
              world: {
                id: worldId
              }
            }
          }
        },
        info
      )
    }
  },
  world: {
    subscribe(
      parent,
      { worldId, mutation_in, updatedFields_contains_some },
      { db },
      info
    ) {
      return db.subscription.world(
        {
          where: {
            updatedFields_contains_some:
              updatedFields_contains_some || defaultArray,
            mutation_in: mutation_in || defaultArray,
            node: {
              id: worldId
            }
          }
        },
        info
      )
    }
  }
}

export default WorldSubscriptions
