import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { EMPTY, of } from 'rxjs';
import { DispatchSpy, newDispatchSpy } from '../../../../../test/spy.util';
import { setUsers } from '../../../../../test/store.util';
import { buttonCells } from '../../../../../test/test.util';
import { mockUsers } from '../../../../../test/users.util';
import { translateTestModule } from '../../../../test.utils';
import { Role } from '../../../core/model/auth.model';
import { AdminActions } from '../../../core/store/actions/admin.actions';
import { SharedModule } from '../../../shared/shared.module';
import { EditRoleDialogComponent } from '../edit-role-dialog/edit-role-dialog.component';
import { UsersState } from '../store/users.state';
import { UsersListComponent } from './list.component';
import SpyObj = jasmine.SpyObj;

describe('Users list component', () => {
  let fixture: ComponentFixture<UsersListComponent>;
  let loader: HarnessLoader;
  let dialogSpy: SpyObj<MatDialog>;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  // Just a spy
  let dialogRefSpy: SpyObj<MatDialogRef<any>>;
  const users = mockUsers;
  let store: Store;
  let dispatchSpy: DispatchSpy;
  const editButtons = async () =>
    Promise.all(
      (await buttonCells(loader, 'edit')).map(cellHarness =>
        cellHarness.getHarness(MatButtonHarness),
      ),
    );

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('DialogRef', ['afterClosed']);
    dialogSpy = jasmine.createSpyObj('Dialog', ['open']);
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        await translateTestModule(),
        BrowserAnimationsModule,
        HttpClientModule,
        RouterTestingModule,
        NgxsModule.forRoot([UsersState]),
        NgxsRouterPluginModule.forRoot(),
      ],
      declarations: [UsersListComponent],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
    });

    dialogSpy.open.and.returnValue(dialogRefSpy);
    fixture = TestBed.createComponent(UsersListComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    store = TestBed.inject(Store);
    dispatchSpy = newDispatchSpy(store);
    setUsers(store, users);
  });
  it('On edit button click, it opens change role dialog', async () => {
    const [editButton] = await editButtons();
    dialogRefSpy.afterClosed.and.returnValue(EMPTY);
    await editButton.click();

    expect(dialogSpy.open).toHaveBeenCalledWith(EditRoleDialogComponent, {
      data: users[0],
    });
  });
  it('When dialog is closed with falsy value it doesnt do anything', async () => {
    const [editButton] = await editButtons();
    dialogRefSpy.afterClosed.and.returnValue(of(undefined));
    dispatchSpy.calls.reset();
    await editButton.click();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
  it('When dialog is closed with new role to be set it calls service', async () => {
    const [editButton] = await editButtons();
    dialogRefSpy.afterClosed.and.returnValue(of(Role.DRIVER));
    dispatchSpy.and.returnValue(of({}));
    await editButton.click();

    expect(dispatchSpy).toHaveBeenCalledWith(
      new AdminActions.ChangeUserRole(users[0].id, Role.DRIVER),
    );
  });
});
