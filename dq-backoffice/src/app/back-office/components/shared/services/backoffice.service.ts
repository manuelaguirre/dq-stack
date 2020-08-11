import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { DqTheme } from '../../../../shared/models/dq-theme';
import { Observable } from 'rxjs';

@Injectable()
export class BackofficeService {
  constructor(
    private apiService: ApiService,
  ) { }

  createNewTheme(name: string, description: string): Observable<DqTheme> {
    return this.apiService.post<DqTheme>('themes', { name, description });
  }
  
}