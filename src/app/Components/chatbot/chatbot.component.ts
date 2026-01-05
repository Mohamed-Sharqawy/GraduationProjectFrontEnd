```typescript
import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatbotService } from '../../Services/Chatbot-Service/chatbot.service';
import { ChatMessage } from '../../Models/Chatbot/chatbot.models';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  private chatbotService = inject(ChatbotService);
  private router = inject(Router);
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = false;
  isLoading = false;
  messages: ChatMessage[] = [];
  newMessage = '';
  hasLoadedWelcome = false;

  ngOnInit() {
    // Initial welcome message load will happen on first open
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && !this.hasLoadedWelcome) {
      this.loadWelcomeMessage();
    }
  }

  loadWelcomeMessage() {
    this.isLoading = true;
    this.chatbotService.getWelcomeMessage().subscribe({
      next: (response) => {
        this.messages.push({
          content: response.message,
          sender: 'bot',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.hasLoadedWelcome = true;
      },
      error: (err) => {
        console.error('Failed to load welcome message:', err);
        // Fallback message
        this.messages.push({
          content: 'Welcome to Homy! How can I help you today?',
          sender: 'bot',
          timestamp: new Date()
        });
        this.isLoading = false;
        this.hasLoadedWelcome = true;
      }
    });
  }

  onEnter(event: Event) {
    if ((event as KeyboardEvent).shiftKey) return;
    event.preventDefault();
    this.sendMessage();
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const userMsg = this.newMessage;
    this.newMessage = ''; // Clear input immediately

    // Add user message
    this.messages.push({
      content: userMsg,
      sender: 'user',
      timestamp: new Date()
    });

    this.isLoading = true;

    // Call API
    this.chatbotService.ask(userMsg).subscribe({
      next: (response) => {
        this.messages.push({
          content: response.message, // property is 'message' from backend
          sender: 'bot',
          timestamp: new Date()
        });
        this.isLoading = false;

        // ✨ AUTO-NAVIGATE: If backend wants to navigate to a property
        if (response.navigateToPropertyId) {
          setTimeout(() => {
            this.router.navigate(['/propertyview', response.navigateToPropertyId]);
          }, 800); // Small delay for user to see the message
        }
      },
      error: (err) => {
        console.error('Failed to send message:', err);
        this.messages.push({
          content: 'Sorry, I encountered an error. Please try again.',
          sender: 'bot',
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }
}
```
