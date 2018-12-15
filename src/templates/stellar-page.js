import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'

const StellarPage = ({data}) => {  
  console.log(data)

  return (
    <Layout>
      <span>Hello Stellar</span>
    </Layout>
  )
}

export default StellarPage

export const stellarPageQuery = graphql`
  query StellarPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        hero-title
      }
    }
  }
`
