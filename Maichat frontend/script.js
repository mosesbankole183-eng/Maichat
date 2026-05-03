const chatWindow = document.getElementById("chatWindow");

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("backdrop").classList.toggle("active");
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;

  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendChat() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const thinking = document.createElement("div");
  thinking.className = "message ai";
  thinking.innerText = "Maichat is thinking...";
  chatWindow.appendChild(thinking);

  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    thinking.remove();
    addMessage(data.reply, "ai");

  } catch (err) {
    thinking.remove();
    addMessage("Error connecting to Maichat.", "ai");
  }
}

function startVoice() {
  const recognition = new webkitSpeechRecognition();

  recognition.lang = "en-US";

  recognition.onresult = function(event) {
    document.getElementById("chatInput").value =
      event.results[0][0].transcript;
  };

  recognition.start();
}

async function uploadImage() {
  const file = document.getElementById("imageUpload").files[0];

  if (!file) {
    addMessage("Please select an image first.", "ai");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/api/image/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  addMessage(`Image uploaded: ${data.file}`, "ai");
}

async function generateImage() {
  addMessage("Generating image...", "ai");

  const res = await fetch("/api/image/generate", {
    method: "POST"
  });

  const data = await res.json();

  const msg = document.createElement("div");
  msg.className = "message ai";
  msg.innerHTML = `<img src="${data.imageUrl}" alt="Generated Image">`;

  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function generateVideo() {
  addMessage("Generating video...", "ai");

  const res = await fetch("/api/video/generate", {
    method: "POST"
  });

  const data = await res.json();

  const msg = document.createElement("div");
  msg.className = "message ai";
  msg.innerHTML = `
    <video controls>
      <source src="${data.videoUrl}">
    </video>
  `;

  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
    }
