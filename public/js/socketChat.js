var userId = document.getElementById('adminId');
userId = userId.value;

socket = io();

socket.emit('connect_user', { userId: userId });

socket.on('online_listner', (data) => {
  try {

    let userListContainer = document.getElementById('userChatList');
    userListContainer.innerHTML = '';

    data.users.forEach(user => {
      const listItem = document.createElement('div');
      if (user) {
        listItem.innerHTML = `
            
                <li onclick='showChat(${user.id}, "${user.name}", "${user.image}")'>
                    <span class="avatar"><img src="/uploads/${user.image}" height="42" width="42"
                        alt="Generic placeholder image" />
                    </span>
                    <div class="chat-info flex-grow-1">
                        <h5 class="mb-0" style="margin-top: inherit">${user.name}</h5>
                        
                    </div>
                    <div class="chat-meta text-nowrap" id="countDiv_${user.id}">
                        ${user.msgCount !== 0 ? `<span id="msgCount_${user.id}" class="badge bg-danger rounded-pill float-end" style="margin-left: 15px !important;">${user.msgCount}</span>` : ''}
                    </div>
                </li>
                `
      } else {
        listItem.innerHTML = `

                <li class="no-results">
                  <h6 class="mb-0">No Chats Found</h6>
               </li>
                
                `
      }
      userListContainer.appendChild(listItem);
    });

  } catch (error) {
    console.log('socket error', error.message);
  }
})

const showChat = (senderId, userName, userImg) => {
  let chatArea = document.getElementById('startChatArea');
  let activeChat = document.getElementById('activeChat');
  chatArea.classList.add('d-none');
  activeChat.classList.remove('d-none');

  let userNameHeader = document.getElementById(`userNameHeader`);
  userNameHeader.innerText = userName;

  let userImageHeader = document.getElementById(`userImageHeader`);
  userImageHeader.src = `/uploads/${userImg}`;

  let otherUserId = document.getElementById(`receiverId`);
  otherUserId.value = senderId;

  socket.emit('read_msg', {
    senderId: senderId,
    reciverId: Number(userId) // Admin Id
  });

  socket.emit('get_chat', {
    senderId: senderId,
    reciverId: Number(userId) // admin Id
  });

  const msgCountSpan = document.getElementById(`msgCount_${senderId}`);

  if (msgCountSpan) {
    msgCountSpan.remove();
  }

}

socket.on('get_messages', (msgData) => {

  var chatDiv = document.getElementById('chats');
  chatDiv.innerHTML = '';

  if (msgData.hasOwnProperty('message') && Array.isArray(msgData.message) && msgData.message.length > 0) {

    msgData.message.forEach((msg) => {

      var chatMsgDiv = document.createElement('div');

      if (msg.sender_id == userId) {

        chatMsgDiv.innerHTML = `
  
                      <div class="chat">
                        <div class="chat-avatar">
                          <span class="avatar box-shadow-1 cursor-pointer">
                            <img src="/uploads/${msg.sender.image}" alt="avatar" height="36" width="36" />
                          </span>
                        </div>
                        <div class="chat-body">
                          <div class="chat-content">
                            <p>${msg.message}</p>
                            <span class="chat-time">${formatTimestamp(msg.createdAt)}</span>
                          </div>
                        </div>
                      </div>
              
              `
      } else {
        chatMsgDiv.innerHTML = `
  
                      <div class="chat chat-left">
                        <div class="chat-avatar">
                          <span class="avatar box-shadow-1 cursor-pointer">
                            <img src="/uploads/${msg.sender.image}" alt="avatar" height="36" width="36" />
                          </span>
                        </div>
                        <div class="chat-body">
                          <div class="chat-content">
                            <p>${msg.message}</p>
                            <span class="chat-time">${formatTimestamp(msg.createdAt)}</span>
                          </div>
                        </div>
                      </div>
              
              `
      }
      chatDiv.appendChild(chatMsgDiv);
    });

  } else {
    var chatMsgDiv = document.createElement('div');
    chatMsgDiv.innerHTML = `<div class="chatDiv" id="chatMsg"><h4 class="chat-capsule">No chats available yet</h4></div>`
    chatDiv.appendChild(chatMsgDiv);
  }

  $('.user-chats').scrollTop($('.user-chats > .chats').height());
});

const enterChats = () => {
  let msg = document.getElementById('txtMsg').value.trim();
  let reciverId = document.getElementById(`receiverId`).value;

  if (msg != "") {

    socket.emit('send_msg', {
      senderId: userId,
      reciverId: reciverId,
      messages: msg
    });

  }

  msg = document.getElementById('txtMsg').value = '';

  let noChat = document.getElementById('chatMsg');
  noChat.style.display = "none";

  $('.user-chats').scrollTop($('.user-chats > .chats').height());
};

socket.on('send_msg_listener', (data) => {

  let reciverId = document.getElementById(`receiverId`).value;
  

  let userImageHeader = document.getElementById(`userImageHeader`);
  userImageHeader = userImageHeader.src;

  if(data.saveMessage.unReadCnt > 0){

    const id = Number(data.saveMessage.sender_id)
    let liId = document.getElementById(`countDiv_${id}`);
    liId.innerHTML = '';
    liId.innerHTML = `
    <span id="msgCount_${id}" class="badge bg-danger rounded-pill float-end" style="margin-left: 15px !important;">${data.saveMessage.unReadCnt}</span>
    `
  }
  
  let chatDiv = document.getElementById('chats');

  var chatMsgDiv = document.createElement('div');
  if (data.saveMessage.sender_id != userId) {

    if(data.saveMessage.sender_id == reciverId){

      chatMsgDiv.innerHTML = `

                    <div class="chat chat-left">
                      <div class="chat-avatar">
                        <span class="avatar box-shadow-1 cursor-pointer">
                          <img src="${userImageHeader}" alt="avatar" height="36" width="36" />
                        </span>
                      </div>
                      <div class="chat-body">
                        <div class="chat-content">
                          <p>${data.saveMessage.message}</p>
                          <span class="chat-time">${formatTimestamp(data.saveMessage.createdAt)}</span>
                        </div>
                      </div>
                    </div>
            
            `
    }

  } else {
    chatMsgDiv.innerHTML = `

        <div class="chat">
          <div class="chat-avatar">
            <span class="avatar box-shadow-1 cursor-pointer">
              <img src="/uploads/${data.saveMessage.admin.image}" alt="avatar" height="36" width="36" />
            </span>
          </div>
          <div class="chat-body">
            <div class="chat-content">
              <p>${data.saveMessage.message}</p>
              <span class="chat-time">${formatTimestamp(new Date())}</span>
            </div>
          </div>
        </div>

        `
  }

  chatDiv.appendChild(chatMsgDiv);
  $('.user-chats').scrollTop($('.user-chats > .chats').height());
})


function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
}


