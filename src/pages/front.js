import React from 'react'
import { graphql } from 'gatsby'
import { Link } from 'react-router-dom'
import { StaticQuery } from "gatsby"
import BasicLayout from '../components/basic_layout'

const Article = () => {
  return (<article className="front-article">
    <p>这件事情最早源于小松17年夏天在新源南路的小区墙画上拍到“祝申奥成功”的字样，当时并没有别的想法，只觉得意外又感慨。几个月后，小松又在呼家楼拍到了烟囱上的京印和吉祥物，而我也在每天上班必经的海淀黄庄站里的电视屏幕上，发现了年代已久的申奥口号，同时还想起景山后面的京城第一健身园，有一块斑驳的倒计时牌。</p>
    <p>几个偶然加在一起，就突然想把它做成一件事情了。我们坚信这个城市还有许多像这样沉淀了十年甚至更久的角落。一拍即合，我们决定搜寻、收集这些角落，趁着北京奥运十周年的时机，把它们集合起来，重新展示在大家面前。</p>
    <p>在接下来大半年的时间里，我们或是偶遇、或是靠着身边朋友提供的线索，陆续收集了十余个地点的奥运痕迹，中间甚至偶遇过亚运会的痕迹。</p>
    <p>十年前，这些鲜红的标志，可爱的吉祥物，是最大的主角。十年后，褪掉的也许不仅是颜色和轮廓。时间在它们身上留下的印记，甚至已经足以将它们自身磨灭，而十年的时间，也仿佛一场梦一样，一晃而过。</p>
    <p style={{float: 'right'}}>2018年8月7日 <i>FQS</i></p>
  </article>)
}

const Enter = () => {
  return (<div className="enter">
      <Link to={"/places"} id="enter-button">点击继续</Link>
  </div>)
}

const Desktop = ({children, data}) => {
  const indexPhoto = data.indexPhoto.childImageSharp.image.src
  return (
    <BasicLayout>
      <section className="front-container">
          <div style={{
              width: "0px",
              height: "0px",
          }}>
            <img src={indexPhoto} />
          </div>

        <div className="left-half" style={{
          backgroundImage: `url(${indexPhoto})`,
          backgroundSize: 'cover',
        }}>
        </div>

        <div className="right-half">
          <Article/>
          <Enter/>
        </div>
      </section>
    </BasicLayout>
  )
}

const Mobile = ({children, data}) => {
  const indexPhoto = data.indexPhoto.childImageSharp.image.src
  return (
    <BasicLayout>
      <section className="mobile-front-container" style={{
        cursor: 'pointer',
      }}>
        <div style={{
          minHeight: 700,
          paddingTop: "20px",
          paddingLeft: "20px",
          paddingRight: "20px",
          backgroundImage: "500px",
          background: `url(${indexPhoto}) no-repeat center center fixed`,
          backgroundSize: 'cover',
        }}>
          <div style={{
            // margin: "40px 50px",
            padding: "20px 10px 40px",
            background: "rgba(255, 255, 255, 0.5)",
          }}>
            <Article/>
            <Enter/>
          </div>
        </div>
      </section>
    </BasicLayout>
  )
}


class Front extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
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
    })
  }

  render() {
    if (this.state.width > 700) {
      return <Desktop data={this.props.data} {...this.props} />
    } else {
      return <Mobile data={this.props.data} {...this.props} />
    }
  }
}



// export default Places
export default props => (
  <StaticQuery
    query={graphql`
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
    `}
    render={data => <Front data={data} {...props} />}
  />
)
