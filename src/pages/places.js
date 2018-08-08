import React from 'react'
import Layout from '../components/layout'
import Map from '../components/map'
import { graphql, StaticQuery } from 'gatsby'
import { groupBy } from 'lodash'
import { filter, uniq, sortBy, sample} from 'lodash'
import player from '../components/player'

import moment from 'moment-timezone';

import AudioControl from '../components/audio-control'
import { Gallery, Nav, getImgTime } from '../components/place'

const cleanPhotos = (photos) => {
  const edges = photos.edges
  return groupBy(edges, (d) => d.node.slug)
}

const cleanAudio = (audio) => {
  const edges = audio.edges
  return groupBy(edges, (d) => d.node.slug)
}

class PlaceApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: this.props.index || 0,
    };
    this.photos = cleanPhotos(props.data.allPlacePhotos)
    this.audios = cleanAudio(props.data.allPlaceAudio)
    this.allPlaces = props.data.allPlacesYaml.edges.map(d => d.node)
    this.players = {}
  }

  getAudioByIndex(index) {
    const slug = this.allPlaces[index].slug
    const audioFile = this.audios[slug]
    const url = audioFile? sample(audioFile).node.url : null;
    return { slug, url }
  }

  updateIndex(index) {
    const oldInfo = this.getAudioByIndex(this.state.index)
    const newInfo = this.getAudioByIndex(index)

    this.setState({index: index})
    window.scrollTo(0, 0);

    if (!newInfo.url) {
      return
    }

    player.fadeIn(newInfo)

    if (oldInfo.url) {
      player.fadeOut(oldInfo)
    }
  }

  componentDidMount() {
    const info = this.getAudioByIndex(this.state.index)
    player.fadeIn(info)
  }

  componentWillUnmount() {
  }

  render() {
    const index = this.state.index
    const previous = index === 0? null: this.allPlaces[index - 1]
    const info = this.allPlaces[index]
    const next = index === this.allPlaces.length - 1 ?  null: this.allPlaces[index + 1]
    let photos = this.photos[info.slug]

    photos = filter(
      photos, (item) => item.node.childImageSharp)

    const dates = sortBy(uniq(
      photos.filter(
        img => getImgTime(img)
      ).map(
        img => getImgTime(img).substring(0, 10)
      )
    )).map(d => moment(d))

    const nav = <Nav previous={previous} next={next}
      onClickNext={()=> {
        this.updateIndex(index + 1)
      }}
      onClickPrevious={() => {
        this.updateIndex(index - 1)
      }}
    />

    return (<Layout>
      <div>
        <AudioControl></AudioControl>

        {
          info.longitude ? <Map {...info}/> : null
        }

        <div style={{
            margin: '0 auto',
            maxWidth: 1024,
            padding: '0px 0 1.2rem',
            paddingTop: "1rem",
          }}>

          <h2 style={{textAlign: "center"}} className="place-title">{info.name}</h2>

          {
            dates.length > 0 ?
            <div className={"shoot-info"}>
              <p>拍摄于以下日期:</p>
              <p>
              {
                dates.map((d, index) => {
                  return <span className={"shoot-date"} key={`date-${index}`}>{d.format('YYYY年MM月DD日')}</span>
                })
              }
              </p>
            </div> : null
          }

            {nav}

          <Gallery photos={photos} />
          {
            photos.length >= 10 ? nav: null
          }
        </div>
      </div>

      </Layout>
    );
  }
}


// export default PlaceApp

// // sort by field name actually
// export const query = graphql`
// {
//   indexPhoto: file(
//       sourceInstanceName: {eq: "photos"},
//       name: {eq: "index"},
//       extension: {eq: "jpg"}
//     ) {
//     childImageSharp {
//       image: resize(width: 1200, quality: 90) {
//         aspectRatio
//         width
//         height
//         src
//       }
//     }
//   }
//   indexAudio: file(
//     sourceInstanceName: {eq: "photos"},
//     name: {eq: "index"},
//     extension: {eq: "mp3"}
//   ) {
//     url: publicURL
//   }
//   allPlacesYaml(sort: {fields:[index]}) {
//     edges{
//       node{
//         name
//         index
//         slug
//         longitude
//         latitude
//       }
//     }
//   }
//   allPlacePhotos: allFile(sort: {fields:[dir]}, filter: {
//     sourceInstanceName: {eq: "photos"},
//     extension: {eq:"jpg"}
//   }) {
//     edges {
//       node {
//         id
//         name
//         birthTime
//         slug: relativeDirectory
//         fields {
//           exif {
//             phoneModel
//             phoneMaker
//             time
//           }
//         }
//         childImageSharp {
//           preview: fixed(width: 400, quality: 80){
//             ...GatsbyImageSharpFixed_withWebp
//           }
//           large: resize(width: 1280, quality: 90, toFormat: WEBP) {
//             aspectRatio
//             width
//             height
//             src
//           }
//         }
//       }
//     }
//   }
//   allPlaceAudio: allFile(sort: {fields:[dir]}, filter: {
//     sourceInstanceName: {eq: "photos"},
//     extension: {eq:"mp3"}
//   }) {
//     edges {
//       node {
//         id
//         name
//         birthTime
//         slug: relativeDirectory
//         url: publicURL
//       }
//     }
//   }
// }
// `


// export default Places
export default props => (
  <StaticQuery
    query={graphql`
    {
      indexPhoto: file(
          sourceInstanceName: {eq: "photos"},
          name: {eq: "index"},
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
      indexAudio: file(
        sourceInstanceName: {eq: "photos"},
        name: {eq: "index"},
        extension: {eq: "mp3"}
      ) {
        url: publicURL
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
        extension: {eq:"jpg"}
      }) {
        edges {
          node {
            id
            name
            birthTime
            slug: relativeDirectory
            fields {
              exif {
                phoneModel
                phoneMaker
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
      allPlaceAudio: allFile(sort: {fields:[dir]}, filter: {
        sourceInstanceName: {eq: "photos"},
        extension: {eq:"mp3"}
      }) {
        edges {
          node {
            id
            name
            birthTime
            slug: relativeDirectory
            url: publicURL
          }
        }
      }
    }
    `}
    render={data => <PlaceApp data={data} {...props} />}
  />
)
