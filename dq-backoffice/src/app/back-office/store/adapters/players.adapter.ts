import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DqPlayer } from '../../../shared/models/dq-player';
import { ApiService } from '../../../shared/services/api.service';

@Injectable()
export class DqPlayerAdapter {
  constructor(
    private apiService: ApiService,
  ) { }

  getPlayers(): Observable<DqPlayer[]> {
    return this.apiService.get<DqPlayer[]>('players');
  }

  getPlayer(id: string): Observable<DqPlayer> {
    return this.apiService.get<DqPlayer>(`players/${id}`);
  }

  editPlayer(playerId: string, player: Partial<DqPlayer>): Observable<DqPlayer> {
    return this.apiService.put<DqPlayer>(`players/${playerId}`, player);
  }

  createPlayer(player: Partial<DqPlayer>): Observable<DqPlayer> {
    return this.apiService.post<DqPlayer>('players', player as DqPlayer);
  }

  deletePlayer(id: string): Observable<DqPlayer> {
    return this.apiService.delete<DqPlayer>(`players/${id}`);
  }
}
