import { ME_QUERY } from '../../lib/graphql'

import React from 'react'
import { Query } from 'react-apollo'

// import { signout } from '../../lib/utils'

const withAuthGuard = WrappedComponent => () => (
  <Query
    query={ME_QUERY}
    onError={error => {
      if (!error.message.includes('Authentication'))
        console.error(error.message)
    }}
  >
    {({ data, loading, error }) => {
      if (loading) return <WrappedComponent loading />
      if (error || !data.me) return <WrappedComponent isAuth={false} />

      return <WrappedComponent isAuth username={data.me.username} />
    }}
  </Query>
)

export default withAuthGuard
