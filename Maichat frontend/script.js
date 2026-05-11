// =========================
// ELEMENTS
// =========================

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


// =========================
// SIDEBAR
// =========================

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


// =========================
// AUTO RESIZE TEXTAREA
// =========================

chatInput.addEventListener(
  "input",
  () => {

    chatInput.style.height = "auto";

    chatInput.style.height =
      chatInput.scrollHeight + "px";

  }
);


// =========================
// CREATE MESSAGE
// =========================

function createMessage(
  content,
  type
){

  const message =
    document.createElement("div");

  message.className =
    `message ${type}-message`;

  const bubble =
    document.createElement("div");

  bubble.className = "bubble";

  bubble.innerHTML = content;

  message.appendChild(bubble);

  chatWindow.appendChild(message);

  chatWindow.scrollTop =
    chatWindow.scrollHeight;

  return bubble;

}


// =========================
// STREAMING RESPONSE
// =========================

async function streamAIResponse(
  text
){

  const bubble =
    createMessage("", "ai");

  let index = 0;

  const typingCursor =
    `<span class="typing-cursor"></span>`;

  while(index < text.length){

    bubble.innerHTML =
      text.slice(0, index + 1) +
      typingCursor;

    index++;

    chatWindow.scrollTop =
      chatWindow.scrollHeight;

    await new Promise(resolve =>
      setTimeout(resolve, 14)
    );

  }

  bubble.innerHTML = text;

}


// =========================
// SEND MESSAGE
// =========================

async function sendMessage(){

  const text =
    chatInput.value.trim();

  if(!text) return;

  createMessage(text, "user");

  chatInput.value = "";

  chatInput.style.height = "auto";

  closeSidebarMenu();

  const loadingBubble =
    createMessage(
      "Thinking...",
      "ai"
    );

  try{

    // REMOVE THINKING

    loadingBubble.parentElement.remove();

    // DEMO STREAM

    await streamAIResponse(
      "✨ Hello, I am Maichat — your premium multimodal AI assistant. Your upgraded mobile UI, streaming responses, sidebar animations, and modern composer are now working successfully."
    );

  }catch(error){

    loadingBubble.innerHTML =
      "Something went wrong.";

    console.error(error);

  }

}


// =========================
// SEND BUTTON
// =========================

sendBtn.addEventListener(
  "click",
  sendMessage
);


// =========================
// ENTER TO SEND
// =========================

chatInput.addEventListener(
  "keydown",
  (e) => {

    if(
      e.key === "Enter" &&
      !e.shiftKey
    ){

      e.preventDefault();

      sendMessage();

    }

  }
);


// =========================
// NEW CHAT
// =========================

newChatBtn.addEventListener(
  "click",
  () => {

    chatWindow.innerHTML = `

      <div class="message ai-message">

        <div class="bubble">

          👋 New chat started with Maichat.

        </div>

      </div>

    `;

    closeSidebarMenu();

  }
);


// =========================
// FAKE VOICE BUTTON
// =========================

document.querySelector(
  ".voice-btn"
).addEventListener(
  "click",
  () => {

    createMessage(
      "🎤 Voice mode coming soon in MAICHAT.",
      "ai"
    );

  }
);
