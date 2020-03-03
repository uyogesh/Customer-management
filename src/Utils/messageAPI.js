import { BASE_URL } from "./urls";

export default (id, phone_no, callback) => {
    var es = new EventSource(`${BASE_URL.substring(0,BASE_URL.length-1)}:3000/hub?topic=` + encodeURIComponent(
        `${BASE_URL}broadcasting/message/${id}/${phone_no}`
    ));
    es.addEventListener('message', (messageEvent) => {
        var eventData = JSON.parse(messageEvent.data);
        callback(eventData)
    });
    console.log(es)
}
