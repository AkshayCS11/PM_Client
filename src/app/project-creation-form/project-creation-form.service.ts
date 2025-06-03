import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // ✅ Ensure this exists
})
export class ProjectCreationFormService {
//   constructor(private http: HttpClient) {}

  createProject(data: any) {
    // return this.http.post('/api/projects', data);
  }
}
