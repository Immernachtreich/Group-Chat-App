// URL
const URL = 'http://localhost:5000';

// Token
const token = localStorage.getItem('token');
if(!token) {location.href = '../views/login.html';}

const ul = document.getElementById('messages-ul');
const messageInput = document.getElementById('message-input');

const sendMsgBtn = document.getElementById('send-msg-btn');
sendMsgBtn.addEventListener('click', sendMessage);

window.addEventListener('DOMContentLoaded', () => {
    getMessages();
    setInterval(getMessages, 5000);
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
                { message: messageInput.value },
                { headers: { 'Authorization': token } }
            );

            console.log(response);
            
            const textString = response.data.username + ': ' + response.data.response.message;

            createMessage(textString);

            clearFields();

        } catch (err) {

            if(err.response.status === 404) {
                location.href('../views/login.html');
            }
        }
        
    }
}

async function getMessages() {

    try {

        ul.innerHTML = '';

        const response = await axios.get(URL + '/message/getMessages');

        console.log(response);
        
        response.data.messages.forEach((message) => {

            const textString = message.user.username + ': ' + message.message;
            createMessage(textString);
        });

    } catch (err) {
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
