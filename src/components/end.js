import React from 'react'
import Layout from './layout'
import { Link } from "react-router-dom"

const EndPage = () => (
  <Layout>
    <div style={{
        margin: '0 auto',
        maxWidth: 1024,
        padding: '0px 20px 1.2rem',
        paddingTop: "1rem",
      }}>
      <h1>结语</h1>
       <p>感谢你的收看。</p>
       <p>不要留恋梦，会醒不过来的。</p>

       <ul>
         <li>摄影：冯秋实/李松/billy</li>
         <li>录音：李松</li>
         <li>感谢：马莎/drunkdoggy</li>
         <li><a style={{textDecoration: "underline"}} href="mailto:iseansay+2008@gmail.com">联系我们</a></li>
       </ul>

      <Link to={"/"}>回到首页</Link>
    </div>

  </Layout>
)

export default EndPage

