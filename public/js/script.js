let messageCount = 0;
let selectedFile = null; // Variable to store the selected file

// Utility function to scroll the chat container to the bottom


// Function to append a message to the chat container
function appendMessage(sender, message, id = null) {
    const messageHtml = `
      <div class="message ${sender}">
        <div class="msg-header">${capitalizeFirstLetter(sender)}</div>
        <div class="msg-body" ${id ? `id="${id}"` : ""}>${message}</div>
      </div>
    `;
    document.getElementById("chatContainer").insertAdjacentHTML('beforeend', messageHtml);
    scrollToBottom();
}

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function updateUserDisplay() {
    const userCookie = getCookie('userData');
    console.log("User cookie:", userCookie); // Assume 'userData' stores JSON string with user info
    if (userCookie) {
        try {
            const user = JSON.parse(decodeURIComponent(userCookie));

            if (user && user.name) {
                document.getElementById("user-name").innerText = `Welcome, ${user.name}`;
                document.getElementById("auth-action").href = "/auth/logout";
                document.getElementById("auth-action").innerHTML = `
                    <span>Logout</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M21,11H11.41l2.3-2.29a1,1,0,1,0-1.42-1.42l-4,4a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l4,4a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L11.41,13H21a1,1,0,0,0,0-2Z"/>
                    </svg>
                `;
                document.getElementById("profile-link").innerHTML = `
                <a href="/user/profile" id="profile-icon">
                <i class="fa-solid fa-user-circle fa-2x"></i>
                </a>
                `;
            }
        } catch (error) {
            console.error("Error parsing user cookie:", error);
        }
    }
}

async function fetchWithAuth(url, options = {}) {
    let response = await fetch(url, { ...options, credentials: 'include' });

    if (response.status === 401) {
        console.warn("Access token expired, attempting to refresh...");

        const refreshResponse = await fetch('/auth/refresh-token', { method: 'POST', credentials: 'include' });

        if (refreshResponse.ok) {
            console.log("Access token refreshed successfully.");
            return fetch(url, { ...options, credentials: 'include' }); // Retry the original request
        } else {
            console.error("Failed to refresh token.");
            window.location.href = '/auth/sign-in'; // Redirect to login page
        }
    }

    return response;
}
function refreshAccessToken() {
    fetch('/auth/refresh-token', { method: 'POST', credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (data.accessToken) {
                document.cookie = `accessToken=${data.accessToken}; path=/; secure; SameSite=Strict`;
                console.log("Access token refreshed and updated in cookies.");
            }
        })
        .catch(error => console.error("Error refreshing token:", error));
}

setInterval(refreshAccessToken, 14 * 60 * 1000); // Call every 14 minutes

setInterval(refreshAccessToken, 14 * 60 * 1000);

updateUserDisplay();

// Initialize the chat application when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", attachEventListeners);