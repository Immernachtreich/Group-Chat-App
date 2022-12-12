// URL
const URL = 'http://13.200.0.23:5000';

// Signup Inputs
const usernameInput = document.getElementById('username-input');
const emailInput = document.getElementById('email-input');
const phoneNumberInput = document.getElementById('phone-input');
const passwordInput = document.getElementById('password-input');

/*
* Event Listeners 
*/
const signUpButton = document.getElementById('signup-button');
signUpButton.addEventListener('click', signupUser);

/*
* Event Listeners Functions
*/
async function signupUser(e) {
    e.preventDefault();

    if(usernameInput.value.trim() === '' || 
        emailInput.value.trim() === '' ||
        phoneNumberInput.value.trim() === '' ||
        passwordInput.value.trim() === '' ) {

        popupNotification('Caution', 'Please Enter all the fields');
        
    } else {

        try {

            const userDetails = {
                username: usernameInput.value,
                email: emailInput.value,
                phoneNumber: phoneNumberInput.value,
                password: passwordInput.value
            }
    
            const response = await axios.post(URL + '/user/signup', userDetails);

            location.href = '../views/login.html';
    
        } catch(err) {

            console.log(err);
    
            if(err.response.status === 409) {
                popupNotification('Error', err.response.data.message);
            }
        }
    }
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