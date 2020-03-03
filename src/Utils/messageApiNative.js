import RNEventSource from 'react-native-event-source'
import { BASE_URL } from './urls';


export const registerEventSource = (id, phone_number, fetchChat) => {

    var eventSource = new RNEventSource(`${BASE_URL.substring(0,BASE_URL.length-1)}:3000/hub?topic=` + encodeURIComponent(
        `${BASE_URL}broadcasting/message/${id}/${phone_number}`
        ))
    eventSource.addEventListener('message', (eventMessage)=>{
        let data = JSON.parse(eventMessage.data)
        fetchChat(data)
    })
}

export const registerVoiceMailES = (id, phone_no, callback) => {
    var es = new RNEventSource(`${BASE_URL.substring(0,BASE_URL.length-1)}:3000/hub?topic=` + encodeURIComponent(
        `${BASE_URL}broadcasting/voicemail/${id}/${phone_no}`
    ));
    es.addEventListener('message', (messageEvent) => {
        var eventData = JSON.parse(messageEvent.data);
        callback(eventData)
    });
}
