import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from "gatsby"

import Footer from './footer'
import './layout.scss'

const Layout = ({ children, data }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <div className="Site">
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: '..' },
            { name: 'keywords', content: 'beijing 2008' },
          ]}
        />
        {/* <Header siteTitle={data.site.siteMetadata.title} /> */}
        <section
          className="Site-content"
          style={{
          }}
        >
          <div>
            {children}
          </div>
        </section>
        <Footer siteTitle={data.site.siteMetadata.title} />
      </div>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
