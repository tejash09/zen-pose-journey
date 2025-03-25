
/**
 * Service for WebSocket communication with the Python pose detection API
 */

type WebSocketMessage = {
  command?: string;
  image?: string;
};

type WebSocketCallback = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private messageQueue: WebSocketMessage[] = [];
  private callbacks: Record<string, WebSocketCallback[]> = {
    message: [],
    open: [],
    close: [],
    error: [],
  };
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimeout: number | null = null;

  constructor(private url: string) {}

  connect(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.isConnected) {
        resolve(true);
        return;
      }

      try {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
          console.log("WebSocket connection established");
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // Process any queued messages
          while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message) this.sendMessage(message);
          }
          
          // Notify open callbacks
          this.callbacks.open.forEach(callback => callback(null));
          resolve(true);
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.callbacks.message.forEach(callback => callback(data));
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        this.socket.onclose = () => {
          console.log("WebSocket connection closed");
          this.isConnected = false;
          this.socket = null;
          
          // Notify close callbacks
          this.callbacks.close.forEach(callback => callback(null));
          
          // Try to reconnect
          this.tryReconnect();
          resolve(false);
        };

        this.socket.onerror = (error) => {
          console.error("WebSocket error:", error);
          // Notify error callbacks
          this.callbacks.error.forEach(callback => callback(error));
        };
      } catch (error) {
        console.error("Error creating WebSocket:", error);
        resolve(false);
        this.tryReconnect();
      }
    });
  }

  private tryReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnect attempts reached");
      return;
    }

    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, delay);
  }

  sendMessage(message: WebSocketMessage): boolean {
    if (!this.isConnected || !this.socket) {
      // Queue the message for when we connect
      this.messageQueue.push(message);
      this.connect();
      return false;
    }

    try {
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
      return false;
    }
  }

  on(event: 'message' | 'open' | 'close' | 'error', callback: WebSocketCallback) {
    this.callbacks[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
    }
    
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}

// Export a singleton instance
export const websocketService = new WebSocketService("ws://localhost:8000/ws");

