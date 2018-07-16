import React from "react"
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'

// class Gallery extends React.Component {
//   render() {
//     const {photos} = this.props.photos
//     return (
//       <div>
//       </div>
//     )
//   }
// }

class PlaceTemplate extends React.Component {

  render() {
    const { previous, next } = this.props.pageContext
    const { info, photos } = this.props.data

    return (
      <Layout>
        <div>
          <h2>{info.name}</h2>
          <p>{info.latitude}, {info.longitude}</p>

          <li>
            {
              previous &&
              <Link to={previous.slug} rel="prev">
                ← {previous.name}
              </Link>
            }
          </li>

          <li>
            {
              next &&
              <Link to={next.slug} rel="next">
                {next.name} →
              </Link>
            }
          </li>

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
    photos: allFile(filter: {
        sourceInstanceName: {eq: "photos"},
        relativeDirectory: {eq: $slug}
    }) {
      edges {
        node {
          relativeDirectory
          name
          childImageSharp {
            resize(width: 200, quality: 60) {
              src
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
