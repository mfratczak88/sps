import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatNativeDateModule,
  MatOptionModule,
  MatRippleModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

const modules = [
  MatFormFieldModule,
  MatChipsModule,
  MatInputModule,
  MatToolbarModule,
  MatExpansionModule,
  MatButtonModule,
  MatIconModule,
  MatSnackBarModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatOptionModule,
  MatRippleModule,
  MatDialogModule,
  MatBadgeModule,
  MatListModule,
  MatStepperModule,
  MatMenuModule,
  MatSidenavModule,
  MatCardModule,
  MatTableModule,
  MatSortModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatCheckboxModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatTooltipModule,
];
@NgModule({
  imports: [...modules],
  exports: [...modules],
})
export class MaterialModule {}
