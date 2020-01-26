import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EngineFacadeService } from './services/engine-facade.service';
import { MetaService } from './services/meta.service';
import { SceneService } from './services/scene.service';
import { SharedModule } from '../shared/shared.module';
import { SynchronizationService } from './services/synchronization.service';
import { NativeService } from './services/native.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [

  ],
  providers: [
    EngineFacadeService,
    MetaService,
    SceneService,
    SynchronizationService,
    NativeService
  ]
})
export class EngineModule { }