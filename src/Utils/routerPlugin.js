export const push = (props) => {
    const {platform} = props
    if(platform=='web'){
        const {history, destination, params} = props
        history.push(destination, {params})
    }
    else{
        const {navigate, destination, params} = props
        navigate(destination, {params})
    }
}
export const goBack =(props) => {
    const {platform} = props
    if(platform=='web'){
        const {history, params} = props
        history.goBack()
    }
    else{
        const {navigation, params} = props
        navigation.goBack( {params})
    }
}
export const goTo =(props) => {}