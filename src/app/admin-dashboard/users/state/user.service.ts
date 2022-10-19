import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserStore } from './user.store';
import { concatMap, finalize, first, map, tap } from 'rxjs';
import { API_URL, Role, RoleToTranslationKey, User } from './user.model';
import { ToastService } from '../../../core/service/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastKeys } from '../../../core/translation-keys';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly store: UserStore,
    private readonly httpClient: HttpClient,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
  ) {
    this.load().subscribe();
  }

  private load() {
    return this.httpClient.get<UserApiResponse>(API_URL).pipe(
      tap(() => this.store.setLoading(true)),
      map(x => x.users),
      map(users =>
        users.map(user => ({
          ...user,
          roleTranslation: this.translateService.instant(
            RoleToTranslationKey[user.role],
          ),
        })),
      ),
      first(),
      tap(users => {
        this.store.set(users);
      }),
      finalize(() => this.store.setLoading(false)),
    );
  }

  changeRoleTo(user: User, role: string) {
    return this.httpClient
      .patch<void>(API_URL + '/' + user.uid, {
        ...user,
        role,
      })
      .pipe(
        tap(() => this.store.setLoading(true)),
        concatMap(() => this.load()),
        tap(() =>
          this.toastService.show(
            this.translateService.instant(ToastKeys.ROLE_CHANGED),
          ),
        ),
        finalize(() => this.store.setLoading(false)),
      );
  }
}
interface UserApiResponse {
  users: {
    uid: string;
    email: string;
    displayName: string;
    role: Role;
    lastSignInTime: string;
    creationTime: string;
  }[];
}
