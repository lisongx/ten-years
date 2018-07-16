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

        return (<div>
          <Place data={node}></Place>
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
