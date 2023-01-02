import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserApi } from './user.api';
import { mockUsers } from '../../../../test/users.util';
import { Role } from '../model/auth.model';

describe('User api', () => {
  let httpTestingController: HttpTestingController;
  let api: UserApi;
  beforeEach(() => {
    const moduleRef = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserApi],
    });
    api = moduleRef.inject(UserApi);
    httpTestingController = moduleRef.inject(HttpTestingController);
  });
  it('Get all calls api with base url', async () => {
    api.getAll().subscribe();

    const req = httpTestingController.expectOne(api.BASE_URL);

    expect(req.request.method).toEqual('GET');

    req.flush([]);
    httpTestingController.verify();
  });
  it('Change roles sends patch request with csrf token', async () => {
    const newUserRole = Role.DRIVER;
    const userId = mockUsers[0].id;

    api.changeRole(userId, newUserRole).subscribe();

    const tokenReq = httpTestingController.expectOne(api.CSRF_TOKEN_URL);
    expect(tokenReq.request.method).toEqual('GET');
    tokenReq.flush({ csrfToken: '123443232' });

    const changeRoleReq = httpTestingController.expectOne(
      `${api.BASE_URL}/${userId}`,
    );
    expect(changeRoleReq.request.method).toEqual('PATCH');
    expect(changeRoleReq.request.body).toEqual({
      role: newUserRole,
    });

    changeRoleReq.flush({});
    httpTestingController.verify();
  });
});
