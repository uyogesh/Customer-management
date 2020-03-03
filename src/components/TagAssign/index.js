import React from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'
import PropTypes from 'prop-types'
import AutoSuggest from 'react-native-autosuggest'
// import {} from '../../actions/tagsAction'
import { connect } from 'react-redux'
import { editContact } from '../../actions/contactsActions'
import { ejectTag } from '../../actions/tagsAction'
import Tag from '../Tag'


class TagAssign extends React.Component {

    state = {
        tags: [],
        tag: ''
    }

    handleClose(id){
        this.props.ejectTag(this.props.contact.id, id )
    }

    render() {
        const { tags, suggestedTags, submitTags, deleteTags, contact } = this.props
        const assignedTags = contact.tags
        return (
            <View style={styles.tagView}>
                <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                    Tags
                </Text>
                <View style={{ flexWrap: 'wrap', flex: -1, flexDirection: 'row' }}>
                    {assignedTags.map(tag => <Tag tag={tag} handleClose={this.handleClose.bind(this)}/>)}
                </View>
                <View style={{ padding: 20 }} >
                    <AutoSuggest terms={suggestedTags.map(tag => tag.tag)} onChangeText={(text) => {
                        this.setState({ tag: text })
                    }}
                    containerStyles={{marginRight: 50, marginLeft: 50}}
                        onItemPress={(item) => {
                            let tagsId = suggestedTags.filter(value => value.tag === item)[0]
                            this.props.editContact({ id: contact.id, tags: tagsId.id, phone_no: contact.phone_no })
                            this.setState({ tag: item })
                        }}
                    />
                </View>
            </View>
        )
    }
}

TagAssign.propTypes = {
    tags: PropTypes.array,
    suggestedTags: PropTypes.array
}

TagAssign.defaultProps = {
    tags: [
        {
            id: 1,
            tag: 'Hair Dresser'
        },
        {
            id: 2,
            tag: 'Barber'
        }
    ],
    suggestedTags: [
        {
            id: 1,
            tag: 'Hair Dresser'
        },
        {
            id: 2,
            tag: 'Barber'
        },
        {
            id: 11,
            tag: 'Hair Dresser'
        },
        {
            id: 12,
            tag: 'Barber'
        }
    ]
}

const styles = StyleSheet.create({
    tagView: {
        flex: 1,
        justifyContent: 'flex-start'
    },
})

const mapStateToProps = (state) => ({
    suggestedTags: state.tags.tags.data,

})

export default connect(mapStateToProps, { editContact, ejectTag })(TagAssign)