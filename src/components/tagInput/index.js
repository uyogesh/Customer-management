import React from 'react'
import TagsInput from 'react-tagsinput'
import { connect } from 'react-redux'
import {addTags,removeTag} from '../../actions/tagsAction'
import {isEmpty, difference, length, reverse, contains, filter} from 'ramda'
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.

class Tags extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: []
    }
  }

  handleChange(tags) {
    // this.setState({ tags })
    // this.props.addTag(tags[tags.length - 1])
    // console.log("IIIIII", this.props.tags.data, tags)
    if(length(this.props.tags.data)<length(tags)){
      //Means tag added
      // let tag = difference(this.props.tags.data.map((value => {
      //   return value.tag
      // })), tags)
      let a =[]
      this.props.tags.data.forEach((value => {
        a.push(value.tag)
      }))
      let instance = filter((value)=> value.tag === tags[tags.length-1] , this.props.tags.data)
      console.log("Filtered: ",instance)
      if(contains(tags[tags.length-1].trim(), a))
        return alert(`Cannot add "${tags[tags.length-1]}" in tags as it already exists!`)
      this.props.addTags(tags[tags.length-1].trim())
      
    } else {
      // Means tag removed

      let a =[]
      this.props.tags.data.forEach((value => {
        a.push(value.tag)
      }))
      console.log("Tags rn is: ", tags, a )
      let tag = difference(a, tags)
      console.log("Deleted Tag is: ",tag)
      let tagId = this.props.tags.data.filter((value)=>{
        return value.tag === tag[0]
      })
      console.log("TAG ID is: ",tagId)
      this.props.removeTag(tagId[0].id)

    }
  }

  render() {
    let tags
    if(!isEmpty(this.props.tags)){
      tags = this.props.tags.data.map((value => {
        return value.tag
      }))

      console.log(tags)
    }
    return <TagsInput value={reverse(tags)} onChange={this.handleChange.bind(this)} disabled={this.props.disable} />
  }
}

const mapStateToProps = (state) => ({
  tags: state.tags.tags,
  loading: state.tags.loading,

})

export default connect(mapStateToProps, {addTags, removeTag})(Tags)