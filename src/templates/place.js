import React, { Component }  from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import {filter} from 'lodash'

import StackGrid from 'react-stack-grid'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

class Gallery extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      photoIndex: 0,
      isOpen: false,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  toggleImage(index) {
    this.setState({
      photoIndex: index,
      isOpen: true,
    })
  }

  render() {
    const { photos } = this.props
    const { width, photoIndex, isOpen } = this.state
    const orgImages = photos.map(img => img.node.childImageSharp.large.src)
    // const preImages = photos.map(img => img.node.childImageSharp.preview.srcWebp)

    let columnWidth = 300
    let lightboxPadding = 50

    if (width < 700) {
      lightboxPadding = 5
      columnWidth = width - 100
    }

    return (
      <div>
        {isOpen && (
          <Lightbox
            imagePadding={lightboxPadding}
            enableZoom={false}
            mainSrc={orgImages[photoIndex]}
            nextSrc={orgImages[(photoIndex + 1) % orgImages.length]}
            prevSrc={orgImages[(photoIndex + orgImages.length - 1) % orgImages.length]}
            // mainSrcThumbnail={preImages[photoIndex]}
            // nextSrcThumbnail={preImages[(photoIndex + 1) % orgImages.length]}
            // prevSrcThumbnail={preImages[(photoIndex + orgImages.length - 1) % orgImages.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + orgImages.length - 1) % orgImages.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % orgImages.length,
              })
            }
          />
        )}

        <StackGrid
          gridRef={grid => this.grid = grid}
          columnWidth={columnWidth}
          duration={100}
          gutterWidth={30}
          gutterHeight={20}
          appearDelay={50}
        >
          {
          photos.map(({ node }, index) => {
            const img = node.childImageSharp.preview
            return (<figure
              key={img.src}
              style={{
                display: "block",
                margin: 0}}
              onClick={() => this.toggleImage(index)}>
                <img
                  src={img.srcWebp}
                  alt={"Click to fullscreen"}
                  style={{
                    width: columnWidth,
                    height: columnWidth / img.aspectRatio,
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
            original {
              src
              width
              height
            }
            large: resolutions(width: 1280, quality: 97) {
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
            preview: resolutions(width: 500, quality: 90) {
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
