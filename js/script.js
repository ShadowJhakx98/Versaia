

// Chatbot functionality
const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const imageDisplay = document.getElementById('image-display');
const audioPlayer = document.getElementById('audio-player');
const recordButton = document.getElementById('record-button');
let mediaRecorder;
let audioChunks = [];

// Speech Recording (wit.ai)
recordButton.addEventListener('click', toggleRecording);

function toggleRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        recordButton.textContent = "Record Speech";
    } else {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunks.push(event.data);
                });
                mediaRecorder.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    sendAudioToServer(audioBlob);
                    audioChunks = [];
                });
                recordButton.textContent = "Stop Recording";
            });
    }
}

function sendAudioToServer(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob, "speech.wav");

    fetch('/speech_recognition', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        audioPlayer.src = data.audio_url;
        audioPlayer.style.display = 'block';
        audioPlayer.play();
        appendMessage('You', data.text);
    })
    .catch(error => console.error('Error:', error));
}

// Chat messaging
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        appendMessage('You', message);
        userInput.value = '';

        let responseData;

        fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message }),
        })
        .then(response => response.json())
        .then(data => {
            responseData = data;
            appendMessage('AI', responseData.response);
            if (responseData.image_url) {
                imageDisplay.src = responseData.image_url;
                imageDisplay.style.display = 'block';
            }
            if (responseData.audio_url) {
                audioPlayer.src = responseData.audio_url;
                audioPlayer.style.display = 'block';
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function appendMessage(sender, message) {
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}
// Slideshow functionality
const slides = document.querySelector('.slides');
const slideImages = document.querySelectorAll('.slides img');
const totalSlides = slideImages.length;
let slideIndex = 0;

function showSlide(index) {
    const offset = -index * 100; // Calculate the offset as a percentage
    slides.style.transform = `translateX(${offset}%)`; // Proper string interpolation
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % totalSlides; // Loop back to the first slide
    showSlide(slideIndex);
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + totalSlides) % totalSlides; // Loop to the last slide if necessary
    showSlide(slideIndex);
}

setInterval(nextSlide, 5000); // Change slide every 5 seconds


// Weather functionality
async function fetchWeather() {
    const apiKey = '03c0e16b1429800ac660ddde54706c28'; // Replace with your API key
    const city = 'Saluda,SC,US';  // Replace with your preferred city
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial');
    const resposeData = await response.json();
    const weatherInfo = '${data.weather[0].description}, ${data.main.temp}°F';
    document.getElementById('weather-info').textContent = weatherInfo;
}

fetchWeather();

// Reminders functionality
document.getElementById('add-reminder').addEventListener('click', () => {
    const input = document.getElementById('reminder-input');
    const reminderText = input.value.trim();
    if (reminderText) {
        const li = document.createElement('li');
        li.textContent = reminderText;
        document.getElementById('reminder-list').appendChild(li);
        input.value = '';
    }
});

// Calendar functionality
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new calendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        editable: true,
        selectable: true,
        events: [
            // Add event objects here
        ]
    });
    calendar.render();
});