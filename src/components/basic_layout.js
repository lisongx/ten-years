import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from "gatsby"

import Footer from './footer'
import './layout.scss'

const BasicLayout = ({ children, data }) => (
  <StaticQuery
    query={graphql`
      query BrandSiteTitleQuery {
        site {
          siteMetadata {
            title
            desc
          }
        }
      }
    `}
    render={data => (
      <div className="Site">
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: data.site.siteMetadata.desc},
            { name: 'keywords', content: 'beijing 2008' },
          ]}
        />
        {children}
      </div>
    )}
  />
)

export default BasicLayout
