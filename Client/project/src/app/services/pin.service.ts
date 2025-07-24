import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pin, PinHelper, Comment, CommentCreateDto } from '../models/pin.model';

@Injectable({
  providedIn: 'root'
})
export class PinService {
  getCommentsByPinId(pinId: number) {
    throw new Error('Method not implemented.');
  }
  private readonly API_URL = 'https://localhost:7072/api';

  constructor(private http: HttpClient) {}

  getAllPins(): Observable<Pin[]> {
    return this.http.get<Pin[]>(`${this.API_URL}/pin/get-all`);
  }

  getPinById(pinId: number): Observable<Pin> {
    return this.http.get<Pin>(`${this.API_URL}/pin/get-by-id?pinId=${pinId}`);
  }

  getUserPins(): Observable<Pin[]> {
    return this.http.get<Pin[]>(`${this.API_URL}/pin/get-by-user`);
  }

 addPin(pinData: PinHelper, imageFile: File): Observable<any> {
  const formData = new FormData();
  formData.append('Title', pinData.title);
  formData.append('Description', pinData.description);
  formData.append('img', imageFile); // 'img' nomi backenddagi IFormFile ga to‘g‘ri keladi

  return this.http.post(`${this.API_URL}/pin/add`, formData);
}

  deletePin(pinId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/pin/delete?pinId=${pinId}`);
  }

  likePin(pinId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/pinlike/like?pinId=${pinId}`, {});
  }

  unlikePin(pinId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/pinlike/unlike?pinId=${pinId}`);
  }

  hasUserLiked(pinId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/pinlike/has-user-liked?pinId=${pinId}`);
  }

  getComments(pinId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.API_URL}/comment/get-all-by-pin-id?pinId=${pinId}`);
  }

  addComment(comment: CommentCreateDto): Observable<any> {
    return this.http.post(`${this.API_URL}/comment/add`, comment);
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/comment/delete?commentId=${commentId}`);
  }
}