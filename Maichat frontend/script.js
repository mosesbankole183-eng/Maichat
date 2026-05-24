const API_URL =
  "https://maichat-backend-3-gm8f.onrender.com";

/* ELEMENTS */

const menuBtn =
  document.getElementById("menuBtn");

const sidebar =
  document.getElementById("sidebar");

const backdrop =
  document.getElementById("backdrop");

const closeSidebar =
  document.getElementById("closeSidebar");

const sendBtn =
  document.getElementById("sendBtn");

const chatInput =
  document.getElementById("chatInput");

const chatWindow =
  document.getElementById("chatWindow");

const newChatBtn =
  document.getElementById("newChatBtn");

/* SIDEBAR */

function openSidebar(){

  sidebar.classList.add("active");

  backdrop.classList.add("active");

  menuBtn.classList.add("active");

}

function closeSidebarMenu(){

  sidebar.classList.remove("active");

  backdrop.classList.remove("active");

  menuBtn.classList.remove("active");

}

menuBtn.addEventListener(
  "click",
  () => {

    if(
      sidebar.classList.contains("active")
    ){

      closeSidebarMenu();

    }else{

      openSidebar();

    }

  }
);

backdrop.addEventListener(
  "click",
  closeSidebarMenu
);

closeSidebar.addEventListener(
  "click",
  closeSidebarMenu
);

/* AUTO RESIZE */

chatInput.addEventListener(
  "input",
  () => {

    chatInput.style.height =
      "auto";

    chatInput.style.height =
      chatInput.scrollHeight + "px";

  }
);

/* CREATE MESSAGE */

function addMessage(
  text,
  sender
){

  const message =
    document.createElement("div");

  message.className =
    `message ${sender}-message`;

  message.innerHTML = `
    <div class="bubble">
      ${text}
    </div>
  `;

  chatWindow.appendChild(message);

  chatWindow.scrollTop =
    chatWindow.scrollHeight;

  return message;
}

/* SEND MESSAGE */

async function sendMessage(){

  const text =
    chatInput.value.trim();

  if(!text) return;

  addMessage(text, "user");

  chatInput.value = "";

  chatInput.style.height = "auto";

  const thinking =
    addMessage(
      "Thinking...",
      "ai"
    );

  try{

    const response =
      await fetch(
        `${API_URL}/chat`,
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json"
          },

          body:JSON.stringify({
            message:text
          })
        }
      );

    const data =
      await response.json();

    thinking.querySelector(
      ".bubble"
    ).innerText =
      data.reply;

catch(error){

  console.log(error);

  thinking.querySelector(
    ".bubble"
  ).innerText =
    error;

}

}

/* SEND BUTTON */

sendBtn.addEventListener(
  "click",
  sendMessage
);

/* ENTER KEY */

chatInput.addEventListener(
  "keydown",
  (e)=>{

    if(
      e.key === "Enter" &&
      !e.shiftKey
    ){

      e.preventDefault();

      sendMessage();

    }

  }
);

/* NEW CHAT */

newChatBtn.addEventListener(
  "click",
  ()=>{

    chatWindow.innerHTML = `
      <div class="message ai-message">
        <div class="bubble">
          👋 New chat started.
        </div>
      </div>
    `;

  }
);
