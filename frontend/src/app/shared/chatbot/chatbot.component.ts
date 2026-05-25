import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  isOpen = false;
  messages: { sender: 'user' | 'bot'; text: string }[] = [];
  currentMessage = '';
  isLoading = false;

  constructor(private chatbotService: ChatbotService) {
    // Add welcome message
    this.messages.push({
      sender: 'bot',
      text: 'Hi! I\'m your personal shopping assistant. How can I help you find the perfect outfit today?'
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading) {
      return;
    }

    const userMessage = this.currentMessage.trim();
    this.messages.push({ sender: 'user', text: userMessage });
    this.currentMessage = '';
    this.isLoading = true;

    this.chatbotService.sendMessage(userMessage).subscribe({
      next: (response) => {
        this.messages.push({ sender: 'bot', text: response.response });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.messages.push({
          sender: 'bot',
          text: 'Sorry, I encountered an error. Please try again.'
        });
        this.isLoading = false;
      }
    });
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
