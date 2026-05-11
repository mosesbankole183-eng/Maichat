const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");
const hamburger = document.getElementById("hamburger");
const chatWindow = document.getElementById("chatWindow");

let currentConversationId = null;

function toggleSidebar() {
  sidebar.classList.toggle("active");
  backdrop.classList.toggle("active");
  hamburger.classList.toggle("active");
}

function closeSidebar() {
  sidebar.classList.remove("active");
  backdrop.classList.remove("active");
  hamburger.classList.remove("active");
}

function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 140) + "px";
}

function addMessage(text, type) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${type}-message`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  wrapper.appendChild(bubble);
  chatWindow.appendChild(wrapper);

  chatWindow.scrollTop = chatWindow.scrollHeight;

  return bubble;
}

async function startNewChat() {
  try {
    const convo = await newChat();

    currentConversationId = convo._id;

    chatWindow.innerHTML = "";

    addMessage(
      "Hi! How can I help you today?",
      "ai"
    );

  } catch {
    addMessage(
      "Could not create new chat.",
      "ai"
    );
  }
}

async function sendChat() {
  const input = document.getElementById("chatInput");

  const message = input.value.trim();

  if (!message) return;

  if (!currentConversationId) {
    await startNewChat();
  }

  addMessage(message, "user");

  input.value = "";
  input.style.height = "auto";

  const aiBubble = addMessage("", "ai");

  aiBubble.innerHTML = '<span class="typing-cursor"></span>';

  let started = false;

  try {
    await sendMessage(
      currentConversationId,
      message,
      (chunk) => {
        if (!started) {
          aiBubble.textContent = "";
          started = true;
        }

        aiBubble.textContent += chunk;

        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    );

  } catch {
    aiBubble.textContent =
      "Error connecting to Maichat.";
  }
}

function startVoice() {
  const recognition = new webkitSpeechRecognition();

  recognition.lang = "en-US";

  recognition.onresult = (e) => {
    document.getElementById("chatInput").value =
      e.results[0][0].transcript;
  };

  recognition.start();
}

async function openImageGenerator() {
  const prompt = prompt("Describe the image");

  if (!prompt) return;

  const bubble = addMessage(
    "Generating image...",
    "ai"
  );

  try {
    const res = await generateImage(prompt);

    bubble.innerHTML = `
      <p>Generated image:</p>
      <img class="generated-image" src="${res.imageUrl}" />
    `;

  } catch {
    bubble.textContent =
      "Image generation failed.";
  }
}

async function openVideoGenerator() {
  const prompt = prompt("Describe the video");

  if (!prompt) return;

  const bubble = addMessage(
    "Generating video...",
    "ai"
  );

  try {
    const res = await generateVideo(prompt);

    bubble.innerHTML = `
      <video controls width="100%">
        <source src="${res.videoUrl}" type="video/mp4">
      </video>
    `;

  } catch {
    bubble.textContent =
      "Video generation failed.";
  }
}

document
  .getElementById("imageUpload")
  .addEventListener("change", async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const bubble = addMessage(
      "Uploading image...",
      "ai"
    );

    try {
      const uploaded = await uploadImage(file);

      bubble.innerHTML = `
        <p>Image uploaded successfully.</p>
        <img class="generated-image" src="${uploaded.imageUrl}" />
      `;

      const analysis =
        await analyzeImage(uploaded.imageUrl);

      addMessage(
        analysis.analysis,
        "ai"
      );

    } catch {
      bubble.textContent =
        "Image upload failed.";
    }
  });

window.onload = async () => {
  await startNewChat();
};
