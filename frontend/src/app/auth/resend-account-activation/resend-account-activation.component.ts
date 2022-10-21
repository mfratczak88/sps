import { Component, OnInit } from '@angular/core';
import { RouterQuery } from '../../core/state/router/router.query';
import { AuthService } from '../../core/state/auth/auth.service';
import { RouterService } from '../../core/state/router/router.service';
import { first } from 'rxjs';
import { AuthTranslationKeys } from '../../core/translation-keys';

@Component({
  selector: 'sps-resend-account-activation',
  templateUrl: './resend-account-activation.component.html',
  styleUrls: ['./resend-account-activation.component.scss'],
})
export class ResendAccountActivationComponent implements OnInit {
  private previousActivationGuid = '';

  readonly translations = AuthTranslationKeys;

  constructor(
    private readonly routerQuery: RouterQuery,
    private readonly authService: AuthService,
    private readonly routerService: RouterService,
  ) {}

  ngOnInit(): void {
    this.previousActivationGuid = this.routerQuery.previousActivationGuid;
    if (!this.previousActivationGuid) {
      this.routerService.to404();
    }
  }

  resendActivationLink() {
    this.authService
      .resendActivationLink(this.previousActivationGuid)
      .pipe(first())
      .subscribe(() => this.routerService.toSignIn());
  }
}
