// URL
const URL = 'http://localhost:5000';

// Token
const token = localStorage.getItem('token');
if(!token) {location.href = '../views/login.html';}

const messageInput = document.getElementById('message-input');
const sendMsgBtn = document.getElementById('send-msg-btn');
sendMsgBtn.addEventListener('click', sendMessage);


async function sendMessage() {

    if(!(messageInput.value.trim() === '')) {

        try {

            const response = await axios.post(
                URL + '/message/sendMessage',
                { message: messageInput.value },
                { headers: { 'Authorization': token } }
            );

            console.log(response);

            createMessage(response.data.response.message);

            clearFields();

        } catch (err) {

            if(err.response.status === 404) {
                location.href('../views/login.html');
            }
        }
        
    }
}


/*
* DOM Functions
*/

function createMessage(message) {
    const ul = document.getElementById('messages-ul');

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
