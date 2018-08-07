import React from 'react'
import { Link, graphql } from 'gatsby'
import Img from "gatsby-image"

import Layout from '../components/layout'

const Places = ({children, data}) => {
  const indexPhoto = data.indexPhoto.childImageSharp.image.src
  const allPlaces = data.allPlacesYaml.edges
  const firstPlace = allPlaces[0]
  return (
    <Layout>
      <div style={{
        margin: '0 auto',
        padding: '0',
        marginBottom: 0,
      }}>
       <Link to={'/places'}>
        <div style={{
          width: '100%',
          minHeight: 1024,
          background: `url(${indexPhoto}) no-repeat center center fixed`,
          backgroundSize: 'cover',
        }}>
        </div>
       </Link>
      </div>

    {/* {
      allPlaces.map(({ node }) => {
        return (<div key={node.slug} >
          <Link to={node.slug}>{node.name} </Link>
        </div>)
      })
    } */}
    </Layout>
  )
}


export default Places

// sort by field name actually
export const query = graphql`
{
  indexPhoto: file(
    sourceInstanceName: {eq: "photos"}, name: {eq: "index"},
    extension: {eq: "jpg"}
  ) {
    childImageSharp {
      image: resize(width: 1200, quality: 90) {
        aspectRatio
        width
        height
        src
      }
    }
  }
  allPlacesYaml(sort: {fields:[index]}) {
    edges{
      node{
        name
        index
        slug
        longitude
        latitude
      }
    }
  }
}
`
