import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ToastService } from '../core/service/toast.service';
import { MaterialToastService } from './service/material.toast.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, MaterialModule, MatMenuModule],
  exports: [MaterialModule, NavbarComponent],
  providers: [
    {
      provide: ToastService,
      useClass: MaterialToastService,
    },
  ],
})
export class SharedModule {}
