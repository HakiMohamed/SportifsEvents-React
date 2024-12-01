// src/services/eventsApi.ts
import { HttpClient } from './httpClient';

export interface Event {
  _id?: string;
  name: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  participants?: Participant[];
}

export interface Participant {
  fullName: string;
  email: string;
  phone?: string;
  registrationDate?: Date;
}

export interface CreateEventDto {
  name: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
}

export interface AddParticipantDto {
  fullName: string;
  email: string;
  phone?: string;
}

class EventsApi {
  private httpClient = new HttpClient(`${import.meta.env.VITE_API_URL}/events`);

  // Create event
  async createEvent(eventData: CreateEventDto) {
    return this.httpClient.post('/create', eventData);
  }

  // Get all events
  async getAllEvents() {
    return this.httpClient.get<Event[]>('/');
  }

  // Get single event by ID
  async getEventById(eventId: string) {
    return this.httpClient.get<Event>(`/${eventId}`);
  }

  // Update event
  async updateEvent(eventId: string, eventData: Partial<CreateEventDto>) {
    return this.httpClient.put<Event>(`/${eventId}`, eventData);
  }

  // Delete event
  async deleteEvent(eventId: string) {
    return this.httpClient.delete<Event>(`/${eventId}`);
  }

  // Add participant
  async addParticipant(eventId: string, participantData: AddParticipantDto) {
    return this.httpClient.post<Participant>(`/${eventId}/participants`, participantData);
  }

  // Remove participant
  async removeParticipant(eventId: string, participantEmail: string) {
    return this.httpClient.delete<Participant>(`/${eventId}/participants/${participantEmail}`);
  }

  // Download participant report
  async downloadParticipantReport(eventId: string) {
    const response = await this.httpClient.get<Blob>(`/${eventId}/participants/report`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });

    // Create blob URL
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    // Open PDF in new tab for modern viewer experience
    window.open(url, '_blank');

    // Optional: Also trigger download
    const link = document.createElement('a');
    const fileName = `participants-report-${new Date().toISOString().split('T')[0]}.pdf`;
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      link.remove();
    }, 100);
  }
}

export default new EventsApi();
