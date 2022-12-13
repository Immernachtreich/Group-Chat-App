// URL
const URL = 'http://13.200.0.23:5000';

// Token
const token = localStorage.getItem('token');
if(!token) {location.href = '../views/login.html';}

const ul = document.getElementById('messages-ul');
const groupsUl = document.getElementById('groups-ul');

const messageInput = document.getElementById('message-input');


// 
var activeGroup;

/*
* Event Listeners
*/

const sendMgBtn = document.getElementById('send-msg-btn');
sendMgBtn.addEventListener('click', sendMessage);

const newGroupButton = document.getElementById('new-group-btn');
newGroupButton.onclick = () => {
    const form = 
        `<form class="create-grp-form">
            <label for="groupName"> Group Name </label>
            <input type="text" name="groupName" id="group-name">
            <button onclick="createNewGroup(event)"> Create Group </button>
        </form>
        `

    popupNotification('Create Group', form);
}

const existingGroupBtn = document.getElementById('existing-group-btn');
existingGroupBtn.onclick = () => {
    const form = 
    `<form class="create-grp-form">
        <label for="groupName"> Group URL </label>
        <input type="text" name="groupUrl" id="group-url-input">
        <button onclick="joinGroup(event)"> Join Group </button>
    </form>
    `

    popupNotification('Join Group', form);
}

const sendMediaBtn = document.getElementById('send-files-btn');
sendMediaBtn.onclick = (e) => {

    e.preventDefault();
    const form = 
        `<form>
            <input type="file" id="myFile" name="filename">
            <button class="submit-files-btn" onclick="sendMedia(event)"> </button>
        </form>`

    popupNotification('Attach Files', form);
}

window.addEventListener('DOMContentLoaded', () => {
    
    // Scrolls to the bottom. NOTE: Doesnt work without setTimeout dont ask why
    setTimeout(() => {
        ul.scrollTop = ul.scrollHeight
    }, 0);

    getGroups();

    setInterval(getMessagesInterval, 2000);
});

/*
* Message Event Functions 
*/

async function sendMessage(e) {

    e.preventDefault();

    if(!(messageInput.value.trim() === '')) {

        try {
            const response = await axios.post(
                URL + '/message/sendMessage?groupId=' + activeGroup.groupId,
                {message: messageInput.value},
                { headers: { 'Authorization': token } }
            );
            
            getMessages(activeGroup.groupId, activeGroup.groupName);
            clearFields();

        } catch(err) {
            console.log(err);
        }
    }
}

async function getMessages(groupId, groupName) {

    ul.innerHTML = '';
    const groupTitle = document.getElementById('group-title');
    groupTitle.innerHTML = groupName;

    activeGroup = {
        groupId: groupId,
        groupName: groupName
    };


    const oldMessages = JSON.parse(localStorage.getItem(activeGroup.groupId));

    if(oldMessages === null || oldMessages.length < 10) {
        //If messages dont exist OR they exists but are less than 10
        try {

            const response = await axios.get(URL + '/message/getMessages/?groupId=' + groupId);
            let messages = response.data.messages;

            //Response from backend can contain more than 10 messages
            // If less than 10 then dont slice otherwise slice
            if(messages.length > 10) {
                messages = messages.slice(messages.length - 10, messages.length);
            }

            localStorage.setItem(groupId, JSON.stringify(messages));

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

        console.log(activeGroup);
        const oldMessages = JSON.parse(localStorage.getItem(activeGroup.groupId));
        const lastMessageId = oldMessages[oldMessages.length - 1].id;
        
        const response = await axios.get(
            URL + 
            '/message/getMessages/?lastMessageId=' + lastMessageId + '&groupId=' + activeGroup.groupId
        );

        if(response.data.messages.length > 0) {

            const concatedArray = oldMessages.concat(response.data.messages);
            const finalArray = concatedArray.slice(concatedArray.length - 10, concatedArray.length);

            localStorage.setItem(activeGroup.groupId, JSON.stringify(finalArray));

            getMessages(activeGroup.groupId, activeGroup.groupName);
        } 
        

    } catch(err) {
        console.log(err);
    }
}

async function sendMedia() {
    
    const myFiles = document.getElementById('myFile').files;

    const formData = new FormData();

    console.log(myFiles);
} 

/*
* Group Event Functions 
*/

async function createNewGroup(e) {

    e.preventDefault();

    const groupName = document.getElementById('group-name').value;

    if(groupName.trim() !== '') {

        closePopup();
        try {
            const response = await axios.post(
                URL + '/group/createGroup',
                {groupName: groupName},
                { headers: { 'Authorization': token } }
            );
            
            console.log(response);
            createGroup(response.data.group);
        } catch (err) {
            console.log(err);
        }
    }
}

async function getGroups() {
    try {

        const response = await axios.get(
            URL + '/group/getGroups',
            { headers: { 'Authorization': token } }
        );
        
        activeGroup = {
            groupId: response.data.groupDetails[0].id,
            groupName: response.data.groupDetails[0].name
        }

        getMessages(activeGroup.groupId, activeGroup.groupName);

        response.data.groupDetails.forEach((group) => {
            createGroup(group);
        });
        
    } catch(err) {
        console.log(err);
    }
}

async function joinGroup(e) {
    e.preventDefault();

    const groupUrl = document.getElementById('group-url-input').value;

    try {

        closePopup();

        const response = await axios.post(
            URL + '/group/joinGroup',
            {groupUrl: groupUrl},
            { headers: { 'Authorization': token } }
        );
        
        createGroup(response.data.group);   

    } catch(err) {
        console.log(err);

        if(err.response.status === 404) {
            popupNotification('Error', '', 'Invalid Url');

        } else if(err.response.status === 409) {
            popupNotification('Error', '', 'You are already part of the group');
        }   
    }
}

async function groupSettings() {

    
    const response = await axios.get(
        URL + '/group/getGroupMembers/?groupId=' + activeGroup.groupId,
        { headers: { 'Authorization': token } }
    );
    
    let userList = `<ul class="grp-settings-ul">`;
    
    const isCurrentUserAdmin = response.data.currentUserGroup.isAdmin;
    

    for(let i = 0; i < response.data.users.length; i++) {

        const user = response.data.users[i];
        const isAdmin = response.data.userGroups[i].isAdmin;

        console.log(response.data.users, response.data.userGroups);

        let adminBtn = ``;
        let deleteBtn = ``;

        if(isCurrentUserAdmin && !isAdmin) {

            adminBtn = `<button class="admin-btn" onclick="makeAdmin(event, ${user.id}, ${activeGroup.groupId})"> Make Admin </button>`;
            deleteBtn = `<button class="remove-btn" onclick="removeUserFromGroup(event, ${user.id}, ${activeGroup.groupId})"> Remove </button>`
        }

        let userListLi = `<li>${user.username}</li>`;

        userListLi += deleteBtn;
        userListLi += adminBtn;

        userList += userListLi;
    }

    userList += `</ul>`;
    
    popupNotification('Group Details', userList);
}

async function makeAdmin(e, userId, groupId) {
    try {

        const response = await axios.put(
            URL + '/group/makeAdmin',
            { userId: userId, groupId: groupId }
        );

        e.target.previousElementSibling.remove();
        e.target.remove();
        
    } catch (err) {
        console.log(err);
    }
} 

async function removeUserFromGroup(e, userId, groupId) {
    try {

        const response = await axios.post(
            URL + '/group/removeUserFromGroup',
            { userId: userId, groupId: groupId }
        );

        console.log(e.target.previousElementSibling);
        e.target.previousElementSibling.remove();
        e.target.nextElementSibling.remove();
        
        e.target.remove();

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

function createGroup(groupDetails) {

    groupsUl.innerHTML += 
    `<li onclick="getMessages('${groupDetails.id}', '${groupDetails.name}')">
        <div class="group-text-div"> ${groupDetails.name} </div> 
        <div class="invite-button-div">
            <button class="grp-setting-btn" onclick="setActiveGroup('${groupDetails.id}', '${groupDetails.name}');groupSettings()">?</button>
            <button class="invite-button" id="invite-button" onclick="popupNotification('Invite Users','${groupDetails.groupUrl}')">+</button>
        </div>
    </li>`
} 

function clearFields() {
    messageInput.value = '';
}

function logout() {
    localStorage.removeItem('token');
    location.href = '../views/login.html';
}

function setActiveGroup(groupId, groupName) {
    activeGroup = {
        groupId: groupId,
        groupName: groupName
    };
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

function popupNotification(title, htmlElement, text) {

    popupContainer.classList.add('active');

    const headingH1 = document.createElement('h1');
    headingH1.append(document.createTextNode(title));

    const innerMessage = document.createElement('div');

    if(htmlElement) {
        innerMessage.innerHTML = htmlElement;
    } else {
        innerMessage.append(document.createTextNode(text));
    }

    popupInnerDiv.appendChild(headingH1);
    popupInnerDiv.appendChild(innerMessage);

}
