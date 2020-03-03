import React from 'react'
import {
    Animated,
    BackHandler,
} from 'react-native'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { withStyles, withTheme } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import { fade } from '@material-ui/core/styles/colorManipulator'
import color from '../../styles/color';

const styles = theme => ({

    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    
});

const theme = createMuiTheme({
    palette: {
        primary: {
            main: color.base
        },
        secondary: {
            main: color.secondary
        }
    }
})

class SearchBar extends React.Component {
    constructor(props) {
        super(props)
        BackHandler.addEventListener("hardwareBackPress", () => {
            Animated.timing(this.state.searchBarAnim, {
                toValue: 0,
                duration: 1000
            }).start()
        })
    }
    state = {
        text: '',
        searchBarAnim: new Animated.Value(0),
        display: 'none',
        searchText:''
    }

    render() {
        const {classes} = this.props
        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        placeholder="Search…"
                        onKeyDown={(event) => {
                            if (event.keyCode === 13) {
                                this.props.handleSearch(event.target.value)
                            }
                        }}
                        onChange={event => {
                            this.setState({ searchText: event.target.value })
                        }}
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                    />
                </div>
            </MuiThemeProvider>
        )
    }
}


export default withStyles(styles)(SearchBar)