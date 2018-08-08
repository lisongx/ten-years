import React from 'react'
import Layout from '../components/layout'

const EndPage = () => (
  <Layout>
    <div style={{
        margin: '0 auto',
        maxWidth: 1024,
        padding: '0px 0 1.2rem',
        paddingTop: "1rem",
      }}>
      <h1>结语</h1>
       <p>感谢你的收看，下一个十年再见！</p>

       <ul>
         <li>摄影：冯秋实/李松/billy</li>
         <li>录音：李松</li>
         <li><a style={{textDecoration: "underline"}} href="mailto:iseansay+2008@gmail.com">联系我们</a></li>
       </ul>
    </div>

  </Layout>
)

export default EndPage

