const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const suggestionBox = document.getElementById('suggestionBox');
const themeToggle = document.getElementById('themeToggle');
const bgMusic = document.getElementById('bgMusic');

// Set background music volume and play
bgMusic.volume = 0.2;
bgMusic.play();

const maveliResponses = {
    greetings: [
        "Namaskaram! I am King Mahabali. What would you like to know about Onam or my reign?",
        "Welcome to the festivities! How can I enlighten you about the glory of Onam?",
        "Greetings, dear visitor! Are you here to learn about the golden age of Kerala?"
    ],
    onam: [
        "Onam celebrates the time when my people lived in harmony and prosperity. It's a reminder of the ideal society we once had.",
        "During Onam, I am allowed to visit Kerala and see my beloved people. The flowers, feasts, and festivities warm my heart.",
        "Onam is not just a harvest festival; it's a celebration of equality, unity, and the prosperity we achieved together."
    ],
    reign: [
        "In my time, Kerala knew no sorrow. Everyone was equal, honest, and happy. Oh, how I miss those golden days!",
        "During my reign, there was no deceit or corruption. Every child was educated, and every person had enough to eat.",
        "I ruled with compassion and justice. My greatest joy was seeing my people live in peace and harmony."
    ],
    vishnuVamana: [
        "Ah, Lord Vishnu in his Vamana avatar! He taught me humility and the importance of keeping one's word, even at great personal cost.",
        "The story of Vamana is a reminder that power and position are temporary, but dharma is eternal.",
        "When Vamana asked for three steps of land, little did I know those steps would encompass the entire universe!"
    ],
    kerala: [
        "Kerala, my beloved land! Its lush green forests, serene backwaters, and the aroma of spices make it God's Own Country.",
        "The people of Kerala have always been close to my heart. Their warmth, intellect, and cultural richness are unparalleled.",
        "From the highlands of Wayanad to the shores of Kanyakumari, Kerala's diversity is its true strength."
    ],
    patala: [
        "Patala, where I now reside, is not as gloomy as one might think. But it can never compare to the joy I feel during my annual visit to Kerala.",
        "In Patala, I reflect on my past and eagerly await my yearly journey back to Kerala during Onam.",
        "Lord Vishnu granted me the boon to visit Kerala once a year. This keeps my spirit alive even in the depths of Patala."
    ]
};

const suggestionQuestions = [
    "Tell me about Onam festival",
    "What was your reign like?",
    "Who is Vamana?",
    "Describe Kerala to me",
    "What is Patala like?",
    "How do you celebrate Onam?",
    "What lessons did you learn from Vamana?",
    "What makes Kerala special?",
    "How often do you visit Kerala?",
    "What's your favorite Onam memory?"
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateSuggestionBox() {
    suggestionBox.innerHTML = '';
    const shuffledQuestions = shuffleArray([...suggestionQuestions]).slice(0, 3);
    shuffledQuestions.forEach(question => {
        const button = document.createElement('button');
        button.textContent = question;
        button.classList.add('suggestion-button');
        button.addEventListener('click', () => {
            userInput.value = question;
            sendMessage();
        });
        suggestionBox.appendChild(button);
    });
}

function getRandomResponse(category) {
    const responses = maveliResponses[category] || maveliResponses.greetings;
    return responses[Math.floor(Math.random() * responses.length)];
}

function addMessage(content, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    if (isUser) {
        messageDiv.classList.add('user-message');
        messageDiv.textContent = content;
    } else {
        messageDiv.classList.add('maveli-message');
        const avatarImg = document.createElement('img');
        avatarImg.src = 'Images/mavelidp.png';
        avatarImg.alt = 'Maveli';
        messageDiv.appendChild(avatarImg);

        const textSpan = document.createElement('span');
        textSpan.textContent = content;
        messageDiv.appendChild(textSpan);

        speakWithMaleVoice(content); // Use male voice for bot responses
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function speakWithMaleVoice(text) {
    const speech = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    
    // Prioritize male voices
    const maleVoices = voices.filter(voice => voice.name.toLowerCase().includes('male'));

    // Choose the first male voice if available, otherwise fallback to any English voice
    speech.voice = maleVoices.length > 0 ? maleVoices[0] : voices.find(voice => voice.lang.startsWith('en'));

    speech.rate = 0.9;
    speech.pitch = 1;

    speechSynthesis.speak(speech);
}

function getMaveliResponse(userMessage) {
    userMessage = userMessage.toLowerCase();
    if (userMessage.includes('onam') || userMessage.includes('festival')) {
        return getRandomResponse('onam');
    } else if (userMessage.includes('reign') || userMessage.includes('rule')) {
        return getRandomResponse('reign');
    } else if (userMessage.includes('vishnu') || userMessage.includes('vamana')) {
        return getRandomResponse('vishnuVamana');
    } else if (userMessage.includes('kerala')) {
        return getRandomResponse('kerala');
    } else if (userMessage.includes('patala') || userMessage.includes('underworld')) {
        return getRandomResponse('patala');
    } else {
        return getRandomResponse('greetings');
    }
}

function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';

        // Show typing indicator for 1 second
        const typingIndicator = document.getElementById('typingIndicator');
        typingIndicator.style.display = 'block';

        setTimeout(() => {
            typingIndicator.style.display = 'none';
            const maveliResponse = getMaveliResponse(message);
            addMessage(maveliResponse, false);
            updateSuggestionBox();
        }, 1000); // Adjust the delay for realism
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

speechSynthesis.onvoiceschanged = () => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
        setTimeout(() => {
            addMessage(getRandomResponse('greetings'), false);
            updateSuggestionBox();
        }, 500);
    }
};

if (speechSynthesis.getVoices().length > 0) {
    setTimeout(() => {
        addMessage(getRandomResponse('greetings'), false);
        updateSuggestionBox();
    }, 500);
}

updateSuggestionBox();
