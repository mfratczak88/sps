import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error.component';
import { SharedModule } from '../shared/shared.module';
import { ErrorRoutingModule } from './error.routing.module';
import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    NotFoundComponent,
    ErrorComponent,
    InternalServerErrorComponent,
  ],
  imports: [CommonModule, ErrorRoutingModule, CoreModule, SharedModule],
})
export class ErrorModule {}
