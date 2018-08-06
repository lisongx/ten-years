import React, { Component }  from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Place from '../components/place'

class PlaceTemplate extends React.Component {

  render() {
    const { previous, next } = this.props.pageContext
    const { info, placePhotos } = this.props.data

    return (
      <Layout>
        <Place previous={previous} next={next} info={info} photos={placePhotos.edges} />
      </Layout>
    )
  }
}

export default PlaceTemplate

export const pageQuery = graphql`
query photosByPlace($slug: String!) {
    info: placesYaml(slug: {eq: $slug}) {
      name
      slug
      latitude
      longitude
    }
    placePhotos: allFile(sort: {fields:[dir]}, filter: {
        sourceInstanceName: {eq: "photos"},
        relativeDirectory: {eq: $slug}
    }) {
      edges {
        node {
          id
          name
          fields {
            exif {
              time
            }
          }
          childImageSharp {
            preview: fixed(width: 400, quality: 80){
              ...GatsbyImageSharpFixed_withWebp
            }
            large: resize(width: 1280, quality: 90) {
              aspectRatio
              width
              height
              src
            }
          }
        }
      }
    }
  }
`
