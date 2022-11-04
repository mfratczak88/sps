import {
  MatCellHarness,
  MatTableHarness,
} from '@angular/material/table/testing';
import { HarnessLoader } from '@angular/cdk/testing';

export const buttonCells = async (
  loader: HarnessLoader,
  columnName: string,
): Promise<MatCellHarness[]> => {
  const table = await loader.getHarness(MatTableHarness);
  const cells = await Promise.all(
    (await table.getRows()).map(row =>
      row.getCells({
        columnName,
      }),
    ),
  );
  return cells.flatMap(c => [...c]);
};
