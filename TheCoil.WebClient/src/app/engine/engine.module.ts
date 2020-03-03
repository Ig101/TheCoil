import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineFacadeService } from './services/engine-facade.service';
import { SceneService } from './services/scene.service';
import { SharedModule } from '../shared/shared.module';
import { SynchronizationService } from './services/synchronization.service';
import { NativeService } from './services/native.service';
import { GeneratorService } from './services/generator.service';



@NgModule({
  declarations: [],
  imports: [
    SharedModule
  ],
  providers: [
    EngineFacadeService,
    SceneService,
    SynchronizationService,
    NativeService,
    GeneratorService
  ]
})
export class EngineModule { }
