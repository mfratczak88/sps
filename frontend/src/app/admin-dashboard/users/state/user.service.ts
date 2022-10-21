import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UserStore } from "./user.store";
import { Role } from "./user.model";
import { ToastService } from "../../../core/service/toast.service";
import { TranslateService } from "@ngx-translate/core";

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
