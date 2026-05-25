import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'https://shopping-platform.us-east-2.elasticbeanstalk.com/api/chatbot';

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(this.apiUrl, { message });
  }
}
