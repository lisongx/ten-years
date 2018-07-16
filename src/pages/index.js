import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'

const Places = ({children, data}) => {
  const allPlaces = data.allPlacesYaml.edges
  return (
    <Layout>
    {
      allPlaces.map(({ node }) => {
        return (<div key={node.slug} >
          <Link to={node.slug}>{node.name} </Link>
        </div>)
      })
    }
    </Layout>
  )
}


export default Places

// sort by field name actually
export const query = graphql`
{
  allPlacesYaml(sort: {fields:[id]}) {
    edges{
      node{
        name
        slug
        longitude
        latitude
      }
    }
  }
}
`
