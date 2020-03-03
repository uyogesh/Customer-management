import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, Dimensions, Text } from 'react-native';
import debounce from 'lodash/debounce';

import AlphabeticScrollBar from './components/AlphabeticScrollBar';
import AlphabeticScrollBarPointer from './components/AlphabeticScrollBarPointer';


export default class AlphaScrollFlatList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeLetterViewTop: 0,
            activeLetter: undefined,
            isPortrait: this.isPortrait()
        };
        this.createIndexArray = this.createIndexArray.bind(this)
        this.scrollToEnd = this.scrollToEnd.bind(this);
        this.scrollToIndex = this.scrollToIndex.bind(this);
        this.scrollToItem = this.scrollToItem.bind(this);
        this.scrollToOffset = this.scrollToOffset.bind(this);
        this.recordInteraction = this.recordInteraction.bind(this);
        this.flashScrollIndicators = this.flashScrollIndicators.bind(this);
    }


    createIndexArray() {
        let indexAlphabet = {
            '#':0,
            a:0,
            b:0,
            c:0,
            d:0,
            e:0,
            f:0,
            g:0,
            h:0,
            i:0,
            j:0,
            k:0,
            l:0,
            m:0,
            n:0,
            o:0,
            p:0,
            q:0,
            r:0,
            s:0,
            t:0,
            u:0,
            v:0,
            w:0,
            x:0,
            y:0,
            z:0,
        }
        var currentLetter = ''
        this.props.data.forEach((element, index) => {
            let firstAlpha
            element.first_name ?
                firstAlpha = element.first_name.split('')[0].toLowerCase() :
                firstAlpha = element.full_name.split('')[0].toLowerCase()
            if(firstAlpha!==currentLetter){
                indexAlphabet[firstAlpha]=index
            }
            currentLetter=firstAlpha
        });
        let currentBest = 0
        Object.keys(indexAlphabet).forEach((element, index)=>{
            if(indexAlphabet[element]!=0)
                currentBest= indexAlphabet[element]
            else{
                indexAlphabet[element]=currentBest
            }
        })
        this.setState({indexAlphabet})
    }

    //Forwarded flat list methods
    scrollToEnd (...params) {
        if (this.list)
            this.list.scrollToEnd(...params);
    }

    scrollToIndex (...params) {
        if (this.list)
            this.list.scrollToIndex(...params);
    }

    scrollToItem (...params) {
        if (this.list)
            this.list.scrollToItem(...params);
    }

    scrollToOffset (...params) {
        if (this.list)
            this.list.scrollToOffset(...params);
    }

    recordInteraction (...params) {
        if (this.list)
            this.list.recordInteraction(...params);
    }

    flashScrollIndicators (...params) {
        if (this.list)
            this.list.flashScrollIndicators(...params);
    }

    //Proper methods
    handleOnScroll (letter, activeLetterViewTop) {
        if (letter) {
            let index;

            if (this.state.activeLetter === undefined) {
                this.props.onScrollStarts();
            }

            this.setState({
                activeLetter: letter,
                activeLetterViewTop
            });

            // if (letter === '#') {
            //     //it's a number or a symbol, scroll to the top or to the bottom of the list
            //     const firstIndex = 0;
            //     const lastIndex = this.props.data.length - 1;

            //     index = this.props.reverse ? lastIndex : firstIndex;
            // } else {
            //     //Get index of item with that letter and scroll to the first result on the list
            //     index = this.props.data.findIndex(item => item[this.props.scrollKey].charAt(0).localeCompare(letter) === 0);
            // }

            // if (index !== -1)
                // this.list.scrollToOffset({ animated: false, offset: index * this.props.itemHeight });
                this.list.scrollToIndex({animated: false, index:this.state.indexAlphabet[letter.toLowerCase()]})
        }
    }

    handleOnScrollEnds () {
        this.setState({
            activeLetter: undefined,
            activeLetterViewTop: 0
        }, () => this.props.onScrollEnds());
    }

    getItemLayout (data, index) {
        const { itemHeight } = this.props;

        return {
            length: itemHeight,
            offset: itemHeight * index,
            index
        };
    }

    isPortrait () {
        const { width, height } = Dimensions.get('window');

        return width < height;
    }

    handleOnLayout () {
        const isPortrait = this.isPortrait();

        if (isPortrait !== this.state.isPortrait)
            this.setState({
                isPortrait
            });
    }

    componentDidMount(){
        this.createIndexArray()
    }

    render () {
        console.log("ScrollView State: ", this.state)
        return (
            <View onLayout={this.handleOnLayout.bind(this)}>
                <FlatList
                    {...this.props}
                    ref={elem => this.list = elem}
                />
                {this.props.hideSideBar ? null : (
                    <AlphabeticScrollBar
                        isPortrait={this.state.isPortrait}
                        reverse={this.props.reverse}
                        activeColor={this.props.activeColor}
                        fontColor={this.props.scrollBarColor}
                        scrollBarContainerStyle={this.props.scrollBarContainerStyle}
                        fontSizeMultiplier={this.props.scrollBarFontSizeMultiplier}
                        onScroll={debounce(this.handleOnScroll.bind(this))}
                        onScrollEnds={debounce(this.handleOnScrollEnds.bind(this))}
                    />
                )}
                {this.state.activeLetter && !this.props.hideSideBar
                    ? <AlphabeticScrollBarPointer
                        letter={this.state.activeLetter}
                        color={this.props.activeColor}
                        top={this.state.activeLetterViewTop}
                        style={this.props.scrollBarPointerContainerStyle}
                    />
                    : null
                }
            </View>
        );
    }
}

AlphaScrollFlatList.propTypes = {
    hideSideBar: PropTypes.bool,
    scrollKey: PropTypes.string,
    reverse: PropTypes.bool,
    itemHeight: PropTypes.number,
    data: PropTypes.array,
    activeColor: PropTypes.string,
    scrollBarColor: PropTypes.string,
    scrollBarFontSizeMultiplier: PropTypes.number,
    onScrollEnds: PropTypes.func,
    onScrollStarts: PropTypes.func,
    scrollBarContainerStyle: PropTypes.object
};

AlphaScrollFlatList.defaultProps = {
    hideSideBar: false,
    scrollKey: 'name',
    activeColor: '#52bad5',
    reverse: false,
    itemHeight: 20,
    scrollBarFontSizeMultiplier: 1,
    onScrollEnds: () => { },
    onScrollStarts: () => { },
    scrollBarContainerStyle: { }
};
