class WebSocketClient {
    constructor() {
        this.connect();
        this.setupEventListeners();
    }

    connect() {
        const serverUrl = `ws://${location.hostname}:8080`;
        this.ws = new WebSocket(serverUrl);
        
        this.ws.onopen = () => this.handleOpen();
        this.ws.onclose = () => this.handleClose();
        this.ws.onmessage = (event) => this.handleMessage(event);
        this.ws.onerror = (error) => this.handleError(error);
    }

    setupEventListeners() {
        document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    handleOpen() {
        this.updateStatus('Connected', 'green');
        this.logMessage('Connected to server', 'system');
    }

    handleClose() {
        this.updateStatus('Disconnected', 'red');
        this.logMessage('Disconnected from server', 'system');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connect(), 5000);
    }

    handleMessage(event) {
        this.logMessage(event.data, 'received');
    }

    handleError(error) {
        this.logMessage('Error: ' + error.message, 'error');
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (message && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
            this.logMessage(message, 'sent');
            input.value = '';
        }
    }

    updateStatus(status, color) {
        const statusElement = document.getElementById('status');
        statusElement.textContent = status;
        statusElement.style.color = color;
    }

    logMessage(message, type) {
        const messageLog = document.getElementById('messageLog');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = `${type === 'sent' ? '→' : '←'} ${message}`;
        messageLog.appendChild(messageElement);
        messageLog.scrollTop = messageLog.scrollHeight;
    }
}

// Initialize the WebSocket client when the page loads
window.addEventListener('load', () => {
    new WebSocketClient();
});