import React from 'react'
import Layout from '../components/layout'
import Map from '../components/map'
import { Link, graphql } from 'gatsby'
import { groupBy } from 'lodash'
import { filter, orderBy, uniq, sortBy } from 'lodash'

import moment from 'moment-timezone';

import Place, { Gallery } from '../components/place'

const cleanPhotos = (photos) => {
  const edges = photos.edges
  return groupBy(edges, (d) => d.node.slug)
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
            <Link to={`/${previous.slug}`} rel="prev">
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
            <Link to={`${next.slug}`} rel="next">
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


class PlaceApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.photos = cleanPhotos(props.data.allPlacePhotos)
  }

  render() {
    const data = this.props.data
    const index = this.state.index
    const allPlaces = data.allPlacesYaml.edges.map(d => d.node)
    const previous = index === 0? null: allPlaces[index - 1]
    const info = allPlaces[index]
    const next = index === allPlaces.length - 1 ? null: allPlaces[index + 1]
    const photos = this.photos[info.slug]
    const dates = sortBy(uniq(
      photos.filter(
        img => img.node.fields.exif.time
      ).map(
        img => img.node.fields.exif.time.substring(0, 10)
      )
    )).map( d => moment(d))

    return (<Layout>
      <div>
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

          <div style={{
          }}>
            <p>拍摄于以下日期：

            {
              dates.map((d, index) => {
                return <span style={{marginLeft: "10px"}} key={`date-${index}`}>{d.format('YYYY年MM月DD日')}</span>
              })
            }
            </p>
          </div>

          <Nav previous={previous} next={next} />

          <Gallery photos={photos} />
          {
            photos.length >= 10 ? <Nav previous={previous} next={next} /> : null
          }
        </div>
      </div>

      </Layout>
    );
  }
}


export default PlaceApp

// sort by field name actually
export const query = graphql`
{
  indexPhoto: file(sourceInstanceName: {eq: "photos"}, name: {eq: "index"}) {
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
    allPlacePhotos: allFile(sort: {fields:[dir]}, filter: {
      sourceInstanceName: {eq: "photos"},
    }) {
      edges {
        node {
          id
          name
          slug: relativeDirectory
          fields {
            exif {
              time
            }
          }
          childImageSharp {
            preview: fixed(width: 400, quality: 80){
              ...GatsbyImageSharpFixed_withWebp
            }
            large: resize(width: 1280, quality: 90, toFormat: WEBP) {
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
