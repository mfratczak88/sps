import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/auth.service';
import { User } from '../../../core/model/auth.model';
import { Observable, share } from 'rxjs';
import { NavigationService } from '../../../core/service/navigation.service';

@Component({
  selector: 'sps-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(
    readonly authService: AuthService,
    readonly navigationService: NavigationService,
  ) {}

  ngOnInit(): void {
    this.user$ = this.authService.user$.pipe(share());
  }

  onSignOut() {
    this.authService.signOut().then(() => this.navigationService.toRoot());
  }
}
