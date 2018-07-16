import React from 'react'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import Place from '../templates/place'

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

export const query = graphql`
{
  allPlacesYaml {
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
