import React from 'react'
import { Link } from 'gatsby'

const Footer = ({ siteTitle }) => (
  <div
    className="footer"
    style={{
      background: '#840808',
      marginTop: '0rem',
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '1rem 0.6rem',
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
  </div>
)

export default Footer
