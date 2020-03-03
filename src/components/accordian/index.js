import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'
import Accordion from 'react-native-collapsible/Accordion';

const SECTIONS = [
  {
    title: 'Mobile',
    content: '9089999',
  },
  {
    title: 'Notes',
    content: 'Lorem ipsum...',
  },
  {
    title: 'Tags',
    content: 'Lorem ipsum...',
  },
  {
    title: 'Send Message',
    content: 'Lorem ipsum...',
  }
];

class AccordionView extends Component {
  state = {
    activeSections: [],
  };

  _renderSectionTitle = section => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };

  _renderHeader = section => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  };

  _renderContent = (section,_, isActive) => {
    return (
      <View style={styles.content}>
        <Text>{section.content}</Text>
      </View>
    );
  };

  _updateSections = activeSections => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <Accordion
        sections={SECTIONS}
        activeSections={this.state.activeSections}
        renderSectionTitle={this._renderSectionTitle}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
      />
    );
  }
}

const styles = StyleSheet.create({
    header:{
        flex: 1
    } ,
    headerText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    content: {
        flex:1
    }
})

export default AccordionView