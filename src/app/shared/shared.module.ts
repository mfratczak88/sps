import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatMenuModule } from '@angular/material/menu';
import { LinkComponent } from './components/link/link.component';
import { HeadingComponent } from './components/heading/heading.component';
import { TextComponent } from './components/text/text.component';
import { ToastService } from '../core/service/toast.service';
import { MaterialToastService } from './service/material.toast.service';

@NgModule({
  declarations: [
    NavbarComponent,
    LinkComponent,
    HeadingComponent,
    TextComponent,
  ],
  imports: [CommonModule, MaterialModule, MatMenuModule],
  exports: [
    MaterialModule,
    NavbarComponent,
    LinkComponent,
    HeadingComponent,
    TextComponent,
  ],
  providers: [
    {
      provide: ToastService,
      useClass: MaterialToastService,
    },
  ],
})
export class SharedModule {}
