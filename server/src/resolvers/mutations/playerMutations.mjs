import Helpers from '../../utils/helpers'

const PlayerMutations = {
  async createPlayer(
    parent,
    {
      data: { worldId, gamemode }
    },
    ctx
  ) {
    const { db, request } = ctx

    const id = Helpers.getUserId(request, true, ctx)

    // const userExists = await db.exists.User({ id })
    // if (!userExists) throw new Error('User not found')

    const players = await db.query.players({
      first: 1,
      where: {
        user: {
          id
        },
        world: {
          id: worldId
        }
      }
    })

    let player

    // Player creation
    if (players && players[0]) {
      player = players[0]
    } else {
      player = await db.mutation.createPlayer({
        data: {
          isAdmin: true,
          gamemode,
          user: {
            connect: {
              id
            }
          },
          world: {
            connect: {
              id: worldId
            }
          },
          x: 0,
          y: Number.MIN_SAFE_INTEGER,
          z: 0,
          dirx: 0,
          diry: 0,
          inventory: {
            create: {
              cursor: 0,
              data:
                'ARMOR:0;0;0;0;|BACKPACK:0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;|HOTBAR:0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;0,0;'
            }
          }
        }
      })
    }

    return player
  },
  async updatePlayer(parent, args, { db }, info) {
    let { where } = args

    const { id, cursor, data, ...otherData } = args.data || {}

    if (!where && id) {
      where = {
        id
      }
    }

    // const playerId = args.data.id
    // delete args.data.id

    // const { cursor } = args.data
    // delete args.data.cursor

    // const { data } = args.data
    // delete args.data.data

    const inventoryUpdate = { inventory: { update: { cursor, data } } }
    if (!cursor) delete inventoryUpdate.cursor
    if (!data) delete inventoryUpdate.data

    return db.mutation.updatePlayer(
      {
        where,
        data: {
          ...otherData,
          ...inventoryUpdate
        }
      },
      info
    )
  }
}

export default PlayerMutations
