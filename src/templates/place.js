import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import filter from 'lodash/filter'

// import Img from "gatsby-image"

class Gallery extends React.Component {
  render() {
    const {photos} = this.props.photos
    return (
      <div>
      </div>
    )
  }
}

class PlaceTemplate extends React.Component {

  render() {
    const { previous, next } = this.props.pageContext
    const { info, placePhotos } = this.props.data
    const photos = filter(
      placePhotos.edges, (item) => item.node.childImageSharp)

    return (
      <Layout>
        <div>
          <h2>{info.name}</h2>
          {
          photos.map(({ node }) => {
            return (<div key={node.id}>
              <img src={node.childImageSharp.resize.src} />
            </div>)
          })
          }
          <span>
            {
              previous &&
              <Link to={previous.slug} rel="prev">
                ← {previous.name}
              </Link>
            }
          </span>

          <span>
            {
              next &&
              <Link to={next.slug} rel="next">
                {next.name} →
              </Link>
            }
          </span>

        </div>
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
    placePhotos: allFile(sort: {fields:[name]}, filter: {
        sourceInstanceName: {eq: "photos"},
        relativeDirectory: {eq: $slug}
    }) {
      edges {
        node {
          name
          childImageSharp {
            resize(
                width: 500,
                quality: 95,
                toFormat: WEBP
              ) {
              src
              height
              width
              aspectRatio
            }
            resolutions {
              base64
              tracedSVG
              aspectRatio
              width
              height
              src
              srcSet
              srcWebp
              srcSetWebp
              originalName
            }
          }
        }
      }
    }
  }
`
