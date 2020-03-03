import React from 'react'
import {
    Route,
    Router,
    Redirect,
    Switch
} from '../Utils/Routing'
import { connect } from 'react-redux'
import Contacts from '../containers/contacts/index'
import Contact from '../containers/contacts/Contact/index'
import Login from '../containers/login/Login'
import VoiceMail from '../containers/voiceMail/index'
import Messages from '../containers/messages/index'
import Chat from '../containers/messages/messageThread'
import CustomMessage from '../containers/custom-messages/index'
import Settings from '../containers/settings/index'
import Privacy from '../containers/privacyPolicy'


const routes = [
    {
        path: '/',
        sidebar: () => { },
        exact: true,
        component: Login,
        main: () => { }
    },
    {
        path: '/contacts',
        sidebar: () => { },
        exact: true,
        component: Contacts,
        main: () => { }
    },
    {
        path: '/contact/:id',
        sidebar: () => { },
        exact: true,
        component: Contact,
        main: () => { }
    },
    {
        path: '/message',
        sidebar: () => { },
        exact: true,
        component: Messages,
        main: () => { }
    },
    {
        path: '/chat',
        sidebar: () => { },
        exact: true,
        component: Chat,
        main: () => { }
    },
    {
        path: '/custom-message',
        sidebar: () => { },
        exact: true,
        component: CustomMessage,
        main: () => { }
    },
    {
        path: '/voice-mails',
        sidebar: () => { },
        exact: true,
        component: VoiceMail,
        main: () => { }
    },
    {
        path: '/settings',
        sidebar: () => { },
        exact: true,
        component: Settings,
        main: () => { }
    }

]

class RouterWeb extends React.Component {
    render() {
        const { token } = this.props
        return (
            <Router>
                <Switch>
                    <Route path="/privacy-policy" component={Privacy}/>
                    {token?
                        routes.map((route) => {
                            return <Route
                                path={route.path}
                                exact={route.exact}
                                component={route.component}
                            />

                        }):
                        <Route
                            path='/'
                            exact
                            component={Login}
                            />
                    }
                    <Redirect to="/" />
                </Switch>
            </Router>
        )
    }
}

const mapStateToProps = (state) => ({
    token: state.auth.token
})

export default connect(mapStateToProps, null)(RouterWeb)