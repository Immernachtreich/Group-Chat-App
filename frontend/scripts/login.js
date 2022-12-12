// URL
const URL = 'http://13.200.0.23:5000';

// Signup Inputs
const emailInput = document.getElementById('email-input')
const passwordInput = document.getElementById('password-input');

/*
* Event Listeners 
*/
const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', loginUser);

/*
* Event Listeners Functions
*/
async function loginUser(e) {

    e.preventDefault();

    if(emailInput.value.trim() === '' || passwordInput.value.trim() === '' ) {

        popupNotification('Caution', 'Please Enter all the fields');

    } else {

        try {

            const userDetails = {
                email: emailInput.value,
                password: passwordInput.value
            }

            const response = await axios.post(URL + '/user/login', userDetails);

            localStorage.setItem('token', response.data.token);

            location.href = '../views/index.html';

        } catch(err) {

            console.log(err);
    
            if(err.response.status === 401) {

                popupNotification('Error', err.response.data.message);

            } else if(err.response.status === 404) {

                popupNotification('Error', err.response.data.message);
            }
        }
    }
}

/*
* Other Functions 
*/

function clearFields() {
    usernameInput.value = '';
    emailInput.value = '';
    phoneNumberInput.value = '';
    passwordInput.value = '';
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