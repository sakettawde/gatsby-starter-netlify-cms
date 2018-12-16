import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import PreviewCompatibleImage from '../components/PreviewCompatibleImage'

const StellarPage = ({data}) => {  
  console.log(data.markdownRemark)
  const {hero_title, hero_subtitle, target_title, target_content} = data.markdownRemark.frontmatter
  const imageStyle = { borderRadius: '5px' }
  return (
    <Layout>
      <div style={{height:"90vh", display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"center", backgroundColor:"#eee", padding:40}}>
      <span style={{fontSize:48}}>{hero_title}</span>
      <span  style={{fontSize:24}}>{hero_subtitle}</span>
      </div>
      <div style={{height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
      <span style={{fontSize:48, marginBottom:120}}>{target_title}</span>
      {target_content.map(item=>{
        return <div key={item.heading} style={{display:"flex", marginTop:12}}>
          <img style={imageStyle} src={item.image_right} alt="Stellar Grid Image" />
          <div style={{display:"flex", flexDirection:"column", paddingRight:28, paddingLeft:28, paddingTop:16}}>
          <span style={{fontSize:24}}>{item.heading}</span>
          <span style={{fontSize:18}}>{item.subheading}</span>
          <span>{item.body}</span>
          </div>
          <img style={imageStyle} src={item.image_left} alt="Stellar Grid Image" />
          </div>
      })}
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
          image_right
          image_left
        }
      }
    }
  }
`
