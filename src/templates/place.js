import React, { Component }  from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import Map from '../components/map'
import { filter, orderBy } from 'lodash'

import moment from 'moment-timezone';
import locale_zh from "moment/locale/zh-cn";
import StackGrid from 'react-stack-grid'
import Lightbox from 'react-image-lightbox';

import 'react-image-lightbox/style.css';


moment.locale('zh-cn', locale_zh)

const formatDesc = (img) => {
  const time = img.node.childImageSharp.fields.exif.time
  const timeDisplay = moment.tz(time, 'Asia/Shanghai').format('YYYY年MMMMDD日')
  return `拍摄于${timeDisplay}`
}

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
    let photos = this.props.photos
    const { width, photoIndex, isOpen } = this.state

        // sort all photos
    photos = orderBy(photos, [(img) => img.node.childImageSharp.fields.exif.time])

    const orgImages = photos.map(img => img.node.childImageSharp.large.src)
    const preImages = photos.map(img => img.node.childImageSharp.preview.src)
    const dates = photos.map(img => img.node.childImageSharp.fields.exif.time)

    let columnWidth = 300
    let lightboxPadding = 50
    let gutterWidth = 40
    let gutterHeight = 30

    if (width < 700) {
      lightboxPadding = 10
      gutterHeight = 15
      columnWidth = width
    }

    return (
      <div style={{}}>
        {isOpen && (
          <Lightbox
            imagePadding={lightboxPadding}
            enableZoom={false}
            imageCaption={formatDesc(photos[photoIndex])}
            mainSrc={orgImages[photoIndex]}
            nextSrc={orgImages[(photoIndex + 1) % orgImages.length]}
            prevSrc={orgImages[(photoIndex + orgImages.length - 1) % orgImages.length]}
            mainSrcThumbnail={preImages[photoIndex]}
            nextSrcThumbnail={preImages[(photoIndex + 1) % orgImages.length]}
            prevSrcThumbnail={preImages[(photoIndex + orgImages.length - 1) % orgImages.length]}
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
          gutterWidth={gutterWidth}
          gutterHeight={gutterHeight}
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
                  src={img.src}
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


class Nav extends React.Component {

  render() {
    const { previous, next } = this.props

    return (
      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        margin: "10px",
      }}>
        <div>
          {
            previous?
            <Link to={previous.slug} rel="prev">
              ← {previous.name}
            </Link>:
            <Link to='/' rel="prev">
              ← 首页
            </Link>
          }
        </div>
        <div>
          {
            next?
            <Link to={next.slug} rel="next">
              {next.name} →
            </Link>:
            <Link to='/end' rel="next">
            结语 →
            </Link>
          }
        </div>
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
          {/* empty locaition data */}
          {
            info.longitude ?  <Map {...info}/> : null
          }

        <div style={{
            margin: '0 auto',
            maxWidth: 1024,
            padding: '0px 0 1.2rem',
            paddingTop: "1rem",
          }}>

          <h2 style={{textAlign: "center"}} className="place-title">{info.name}</h2>
          <Nav previous={previous} next={next} />

          <Gallery photos={photos} />
          {
            photos.length >= 10 ? <Nav previous={previous} next={next} /> : null
          }
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
            fields {
              exif {
                time
              }
            }
            large: resize(width: 1280, quality: 97) {
              aspectRatio
              width
              height
              src
            }
            preview: resize(width: 500, quality: 90) {
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
