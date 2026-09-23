export interface ExcelCellCoordinate {
  row: number;
  col: number;
  colLetter: string;
  address: string;
  value: string | number | boolean | null;
}

export interface ExcelSheetData {
  sheetName: string;
  sheetTitle: string;
  sheetSubtitle: string;
  headers: string[];
  rows: (string | number | boolean | null)[][];
  totalRows: number;
  totalCols: number;
  category?: string;
  description?: string;
}

export interface ExcelWorkbookData {
  id: string;
  title: string;
  filename: string;
  category: string;
  description: string;
  totalSheets: number;
  sheets: ExcelSheetData[];
}
