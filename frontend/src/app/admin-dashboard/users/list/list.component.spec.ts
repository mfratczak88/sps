import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './list.component';
import { SharedModule } from '../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { translateTestModule } from '../../../../test.utils';
import { UserQuery } from '../state/user.query';
import { UserService } from '../state/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { mockUsers } from '../../../../../test/users.util';
import { buttonCells } from '../../../../../test/test.util';
import { HarnessLoader } from '@angular/cdk/testing';
import { of } from 'rxjs';
import { MatButtonHarness } from '@angular/material/button/testing';
import { EditRoleDialogComponent } from '../edit-role-dialog/edit-role-dialog.component';
import { Role } from '../state/user.model';
import SpyObj = jasmine.SpyObj;
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('Users list component', () => {
  let fixture: ComponentFixture<UsersListComponent>;
  let loader: HarnessLoader;
  let usersQuerySpy: SpyObj<UserQuery>;
  let usersServiceSpy: SpyObj<UserService>;
  let dialogSpy: SpyObj<MatDialog>;
  let dialogRefSpy: SpyObj<MatDialogRef<any>>;
  const users = mockUsers;
  const editButtons = async () =>
    Promise.all(
      (await buttonCells(loader, 'edit')).map(cellHarness =>
        cellHarness.getHarness(MatButtonHarness),
      ),
    );

  beforeEach(async () => {
    usersQuerySpy = jasmine.createSpyObj('UsersQuery', [
      'selectLoading',
      'selectAll',
    ]);
    usersServiceSpy = jasmine.createSpyObj('UserService', ['changeRoleFor']);
    dialogRefSpy = jasmine.createSpyObj('DialogRef', ['afterClosed']);
    dialogSpy = jasmine.createSpyObj('Dialog', ['open']);
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        await translateTestModule(),
        BrowserAnimationsModule,
      ],
      declarations: [UsersListComponent],
      providers: [
        { provide: UserService, useValue: usersServiceSpy },
        { provide: UserQuery, useValue: usersQuerySpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    });

    dialogSpy.open.and.returnValue(dialogRefSpy);
    usersQuerySpy.selectLoading.and.returnValue(of(false));
    usersQuerySpy.selectAll.and.returnValue(of(users));
    fixture = TestBed.createComponent(UsersListComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });
  it('On edit button click, it opens change role dialog', async () => {
    const [editButton] = await editButtons();
    dialogRefSpy.afterClosed.and.returnValue(of(undefined));
    await editButton.click();

    expect(dialogSpy.open).toHaveBeenCalledWith(EditRoleDialogComponent, {
      data: users[0],
    });
  });
  it('When dialog is closed with falsy value it doesnt do anything', async () => {
    const [editButton] = await editButtons();
    dialogRefSpy.afterClosed.and.returnValue(of(undefined));

    await editButton.click();

    expect(usersServiceSpy.changeRoleFor).not.toHaveBeenCalled();
  });
  it('When dialog is closed with new role to be set it calls service', async () => {
    const [editButton] = await editButtons();
    dialogRefSpy.afterClosed.and.returnValue(of(Role.DRIVER));

    await editButton.click();

    expect(usersServiceSpy.changeRoleFor).toHaveBeenCalledWith(
      users[0].id,
      Role.DRIVER,
    );
  });
});
