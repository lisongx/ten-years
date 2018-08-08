import React from 'react'
// import { Link } from 'gatsby'
import { Link } from "@reach/router"
import Map from './map'
import { filter, orderBy, uniq, sortBy } from 'lodash'
import Img from "gatsby-image"

import moment from 'moment-timezone';
import locale_zh from "moment/locale/zh-cn";
import StackGrid from 'react-stack-grid'
import Lightbox from 'react-image-lightbox';

import 'react-image-lightbox/style.css';

moment.locale('zh-cn', locale_zh)

const getImgTime = (img) => {
   const fields = img.node.field
   if (fields) {
     return fields.exif.time
   } else {
    return img.node.birthTime
   }
}

const formatDesc = (img) => {
  const model = img.node.fields.exif.phoneModel
  const time = getImgTime(img)
  const timeDisplay = moment.tz(time, 'Asia/Shanghai').format('YYYY年MM月DD日')
  const useDevice = model? <span>使用<u>{model}</u></span>: ''
  return (<span>
    {timeDisplay}{useDevice}拍摄
  </span>)
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
    photos = orderBy(photos, [(img) => img.node.name])
    const orgImages = photos.map(img => img.node.childImageSharp.large.src)
    const preImages = photos.map(img => img.node.childImageSharp.preview.src)

    let oneCol = false
    let columnWidth = 480
    let lightboxPadding = 50
    let gutterWidth = 40
    let gutterHeight = 30

    if (width < 700) {
      oneCol = true
      lightboxPadding = 0
      gutterHeight = 15
      columnWidth = width
    }

    return (
      <div style={{minHeight: 400}}>
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
          appearDelay={10}
          monitorImagesLoaded={false}
        >
          {
          photos.map(({ node }, index) => {
            const img = node.childImageSharp.preview
            const aspect = img.height / img.width
            return (<figure
              key={img.src}
              style={{
                display: "block",
                margin: 0}}
              onClick={() => this.toggleImage(index)}>

                <Img fixed={img} imgStyle={{
                    width: columnWidth,
                    height: columnWidth * aspect,
                }} style={{
                  // marginBottom: oneCol ? 0 : random(0, 50),
                  width: columnWidth,
                  height: columnWidth * aspect,
                }}
                   alt={"Click to fullscreen"}
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
  prevBtn() {
    const previous = this.props.previous
    if (previous) {
      return this.props.onClickPrevious ?
      <a onClick={() => this.props.onClickPrevious()}> ← {previous.name}</a>:
      <Link to={`/${previous.slug}`} rel="prev"> ← {previous.name}</Link>
    } else {
      return <Link to='/' rel="prev">← 首页</Link>
    }
  }

  nextBtn() {
    const next = this.props.next
    if (next) {
      return this.props.onClickNext ?
      <a onClick={() => this.props.onClickNext()}>{next.name} →</a>:
      <Link to={`/${next.slug}`} rel="prev">{next.name}  →</Link>
    } else {
      return <Link to='/end' rel="next">结语  →</Link>
    }
  }

  render() {
    return (
      <div className="nav" style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        margin: "10px",
      }}>
        <div>

          {
            this.prevBtn()
          }
        </div>
        <div>
          {
            this.nextBtn()
          }
        </div>
      </div>
    )
  }
}

class Place extends React.Component {

  render() {
    const { previous, next, info } = this.props

    let photos = this.props.photos

    photos = filter(
      photos, (item) => item.node.childImageSharp)

    const dates = sortBy(uniq(
      photos.filter(
        img => img.node.fields.exif.time
      ).map(
        img => img.node.fields.exif.time.substring(0, 10)
      )
    )).map( d => moment(d))

    return (
      <div>
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

          <div style={{
          }} className={"shoot-info"}>
            <p>拍摄于以下日期：
            {
              dates.map((d, index) => {
                return <span className={"shoot-date"} key={`date-${index}`}>{d.format('YYYY年MM月DD日')}</span>
              })
            }
            </p>
          </div>

          <Nav previous={previous} next={next} />

          <Gallery photos={photos} />
          {
            photos.length > 1 ? <Nav previous={previous} next={next} /> : null
          }
        </div>
      </div>
    )
  }
}

export default Place

export {Gallery, Nav, getImgTime}
