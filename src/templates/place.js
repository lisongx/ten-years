import React, { Component }  from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import filter from 'lodash/filter'

import StackGrid from "react-stack-grid"
// import Img from "gatsby-image"

class Gallery extends React.Component {

  render() {
    const {photos} = this.props

    return (
      <div>
          <StackGrid
            gridRef={grid => this.grid = grid}
            columnWidth={250}
            duration={0}
            gutterWidth={30}
            gutterHeight={20}
            appearDelay={10}
          >
            {
            photos.map(({ node }) => {
              const img = node.childImageSharp.preview

              return (<figure key={img.src} style={{
                display: "block",
                margin: 0}}>
                  <img
                    src={img.src}
                    alt={"img"}
                    style={{
                      width: img.width,
                      height: img.height,
                    }}
                    />
              </figure>)
            })
            }
          </StackGrid>
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
          <Gallery photos={photos} />
          <div>
            <p>
              {
                previous &&
                <Link to={previous.slug} rel="prev">
                  ← {previous.name}
                </Link>
              }
            </p>

            <p>
              {
                next &&
                <Link to={next.slug} rel="next">
                  {next.name} →
                </Link>
              }
            </p>
          </div>
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
          id
          name
          childImageSharp {
            preview: resolutions(width: 250, quality: 95) {
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
