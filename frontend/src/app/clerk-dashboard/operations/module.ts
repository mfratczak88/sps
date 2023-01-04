import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { OperationsRoutingModule } from './routing';
import { ReactiveFormsModule } from '@angular/forms';
import { OperationsComponent } from './component';

@NgModule({
  declarations: [OperationsComponent],
  imports: [
    CommonModule,
    SharedModule,
    OperationsRoutingModule,
    ReactiveFormsModule,
  ],
})
export class OperationsModule {}
