import React from 'react'
import {
    createDrawerNavigator,
    createAppContainer
} from 'react-navigation'
import stackNavigator from './StackNavigation'

export default  createAppContainer(createDrawerNavigator({
    stackNavigator: stackNavigator
}))