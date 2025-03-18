document.addEventListener("DOMContentLoaded", () => {
  const domainInput = document.getElementById("domainInput");
  const startButton = document.getElementById("startprocess");
  const clearButton = document.getElementById("clearList");

  startButton.addEventListener("click", () => {
    const domain = domainInput.value.trim();
    if (!domain) return;

    startButton.disabled = true;
    startButton.textContent = "Loading...";
    console.log(domain);
    sendingDataToServer(domain)
      .then((data) => {
        updateUI(data.subdomains);
      })
      .catch((err) => {
        console.error("Error sending data to server:", err.message);
      })
      .finally(() => {
        startButton.disabled = false;
        startButton.textContent = "Attack";
      });
  });

  clearButton.addEventListener("click", () => {
    const subdomainList = document.getElementById("subdomainList");
    const subdomainCount = document.getElementById("subdomainCount");

    subdomainList.innerHTML = "";
    subdomainCount.textContent = 0;
  });
});

async function sendingDataToServer(domain) {
  try {
    const response = await fetch("/domainrequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userinput: domain }),
    });
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const jsondata = await response.json();
    return jsondata;
  } catch (err) {
    throw err;
  }
}

function updateUI(subdomains) {
  const subdomainList = document.getElementById("subdomainList");
  const subdomainCount = document.getElementById("subdomainCount");

  subdomainList.innerHTML = "";
  subdomainCount.textContent = 0;
  subdomains.forEach((subdomain) => {
    const li = document.createElement("li");
    li.textContent = subdomain;
    subdomainList.appendChild(li);
  });

  subdomainCount.textContent = subdomains.length;
}
