const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");
const chatWindow = document.getElementById("chatWindow");

function toggleSidebar() {
  sidebar.classList.toggle("active");
  backdrop.classList.toggle("active");
}

function closeSidebar() {
  sidebar.classList.remove("active");
  backdrop.classList.remove("active");
}

function startNewChat() {
  chatWindow.innerHTML = "";
  addMessage("Hi! How can I assist you today?", "ai");
}

function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 140) + "px";
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msg;
}

async function sendChat() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";
  input.style.height = "auto";

  const aiMsg = document.createElement("div");
  aiMsg.className = "message ai";
  aiMsg.innerHTML = `<span class="typing-cursor"></span>`;
  chatWindow.appendChild(aiMsg);

  try {
    const res = await fetch("/api/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    aiMsg.textContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      aiMsg.textContent += decoder.decode(value);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }

  } catch (err) {
    aiMsg.textContent = "Error streaming response.";
  }
}

function startVoice() {
  const recognition = new webkitSpeechRecognition();

  recognition.lang = "en-US";

  recognition.onresult = e => {
    document.getElementById("chatInput").value =
      e.results[0][0].transcript;
  };

  recognition.start();
}

async function generateImage() {
  addMessage("Generating image...", "ai");
}

async function generateVideo() {
  addMessage("Generating video...", "ai");
}
