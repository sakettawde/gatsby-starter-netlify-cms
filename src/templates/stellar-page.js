import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'

const StellarPage = ({data}) => {  
  console.log(data.markdownRemark)
  const {hero_title, hero_subtitle, target_title} = data.markdownRemark.frontmatter

  return (
    <Layout>
      <div style={{height:"90vh", display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"center", backgroundColor:"#eee", padding:40}}>
      <span style={{fontSize:48}}>{hero_title}</span>
      <span  style={{fontSize:24}}>{hero_subtitle}</span>
      </div>
      <div style={{height:"90vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", backgroundColor:"#eee", padding:40}}>
      <span style={{fontSize:48}}>{target_title}</span>
      <span>{hero_subtitle}</span>
      </div>
    </Layout>
  )
}

export default StellarPage

export const stellarPageQuery = graphql`
  query StellarPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter{
        hero_title
        hero_subtitle
        target_title
        target_content{
          body
          heading
          subheading
          image-left{
            childImageSharp {
                fluid(maxWidth: 240, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
          }
          image-right{
            childImageSharp {
                fluid(maxWidth: 240, quality: 100) {
                  ...GatsbyImageSharpFluid
                }
              }
          }
        }
      }
    }
  }
`
