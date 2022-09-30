import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth.routing.module';

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule, CoreModule, SharedModule, AuthRoutingModule],
})
export class AuthModule {}
