// URL
const URL = 'http://localhost:5000';

// Token
const token = localStorage.getItem('token');
if(!token) {location.href = '../views/login.html';}

const ul = document.getElementById('messages-ul');
const messageInput = document.getElementById('message-input');

/*
* Event Listeners
*/

const sendMgBtn = document.getElementById('send-msg-btn');
sendMgBtn.addEventListener('click', sendMessage);

window.addEventListener('DOMContentLoaded', () => {
    getMessages();
    setInterval(getMessagesInterval, 2000);
});

/*
* Event Functions 
*/

async function sendMessage(e) {

    e.preventDefault();

    if(!(messageInput.value.trim() === '')) {

        try {
            const response = await axios.post(
                URL + '/message/sendMessage',
                {message: messageInput.value},
                { headers: { 'Authorization': token } }
            );
            
            getMessages();
            clearFields();

        } catch(err) {
            console.log(err);
        }
    }
}

async function getMessages() {

    ul.innerHTML = '';

    const oldMessages = JSON.parse(localStorage.getItem('messages'));

    if(oldMessages === null || oldMessages.length < 10) {
        //If messages dont exist OR they exists but are less than 10
        try {

            const response = await axios.get(URL + '/message/getMessages');
            let messages = response.data.messages;

            //Response from backend can contain more than 10 messages
            // If less than 10 then dont slice otherwise slice
            if(messages.length > 10) {
                messages = messages.slice(messages.length - 10, messages.length);
            }

            localStorage.setItem('messages', JSON.stringify(messages));

            messages.forEach((message) => {
                createMessage(message.user.username + ': ' + message.message);
            });

        } catch(err) {
            console.log(err);
        }
    } else {

        // Old messages are in local storage and are greater than 10
        oldMessages.forEach((message) => {
            createMessage(message.user.username + ': ' + message.message);
        });
    }
}

async function getMessagesInterval() {
    try {

        const oldMessages = JSON.parse(localStorage.getItem('messages'));
        const lastMessageId = oldMessages[oldMessages.length - 1].id;
        
        const response = await axios.get(URL + '/message/getMessages/?lastMessageId=' + lastMessageId);

        if(response.data.messages.length > 0) {

            const concatedArray = oldMessages.concat(response.data.messages);
            const finalArray = concatedArray.slice(concatedArray.length - 10, concatedArray.length);

            localStorage.setItem('messages', JSON.stringify(finalArray));

            getMessages();
        } 
        

    } catch(err) {
        console.log(err);
    }
}


/*
* DOM Functions
*/

function createMessage(message) {

    ul.innerHTML += `<li>${message}</li>`;
}

function clearFields() {
    messageInput.value = '';
}

function logout() {
    localStorage.removeItem('token');
    location.href = '../views/login.html';
}
/*
* Popup Notification 
*/

const close = document.getElementById('close');
const popupContainer = document.getElementById('popup-container');
const popupInnerDiv = document.getElementById('popup-inner-div');

close.addEventListener('click', closePopup);

function closePopup() {

    popupContainer.classList.remove('active');

    const childNodes = popupInnerDiv.children;

    popupInnerDiv.removeChild(childNodes[1]);
    popupInnerDiv.removeChild(childNodes[1]);
}

function popupNotification(title, message) {

    popupContainer.classList.add('active');

    const headingH1 = document.createElement('h1');
    headingH1.append(document.createTextNode(title));

    const innerMessage = document.createElement('p');
    innerMessage.append(document.createTextNode(message));

    // <h1>Success</h1>
    // <p>${message}</p>

    popupInnerDiv.appendChild(headingH1);
    popupInnerDiv.appendChild(innerMessage);

}
