import { Injectable } from '@angular/core';
import { WebCommunicationService } from 'src/app/shared/services/web-communication.service';
import { RoomTypeEnum } from '../models/enums/room-type.enum';
import { Observable, of } from 'rxjs';
import { SceneInitialization } from '../models/scene/scene-initialization.model';
import { RandomService } from 'src/app/shared/services/random.service';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  constructor(
    private randomService: RandomService
  ) { }

  generateScene(roomType: RoomTypeEnum, seed?: number): Observable<SceneInitialization> {
    const ini = {
      global: false,
      scale: 1,
      tiles: [],
      width: 21,
      height: 11
    } as SceneInitialization;
    return of(ini);
  }
}
