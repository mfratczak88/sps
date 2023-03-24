import { HarnessLoader } from '@angular/cdk/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';

export const buttonHarnesses = async (
  loader: HarnessLoader,
  buttonIndex: number,
) => {
  const menuHarnesses = await loader.getAllHarnesses(MatMenuHarness);
  return await Promise.all(
    menuHarnesses.map(async menuHarness => {
      await menuHarness.open();
      return (await menuHarness.getItems())[buttonIndex];
    }),
  );
};
