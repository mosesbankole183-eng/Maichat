const BASE_URL = "https://maichat-backend-3-gm8f.onrender.com";

let token = localStorage.getItem("maichat_token");

function setToken(t) {
  token = t;
  localStorage.setItem("maichat_token", t);
}

async function register(username, email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      email,
      password
    })
  });

  const data = await res.json();

  if (data.token) {
    setToken(data.token);
  }

  return data;
}

async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await res.json();

  if (data.token) {
    setToken(data.token);
  }

  return data;
}

async function newChat() {
  const res = await fetch(`${BASE_URL}/api/chat/new`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return await res.json();
}

async function sendMessage(conversationId, message, onChunk) {
  const res = await fetch(
    `${BASE_URL}/api/chat/stream/${conversationId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    }
  );

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value);

    onChunk(chunk);
  }
}

async function uploadImage(file) {
  const form = new FormData();

  form.append("image", file);

  const res = await fetch(
    `${BASE_URL}/api/media/upload-image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    }
  );

  return await res.json();
}

async function analyzeImage(imageUrl) {
  const res = await fetch(
    `${BASE_URL}/api/media/analyze-image`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ imageUrl })
    }
  );

  return await res.json();
}

async function generateImage(prompt) {
  const res = await fetch(
    `${BASE_URL}/api/media/generate-image`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ prompt })
    }
  );

  return await res.json();
}

async function generateVideo(prompt) {
  const res = await fetch(
    `${BASE_URL}/api/voice/generate-video`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ prompt })
    }
  );

  return await res.json();
        }
