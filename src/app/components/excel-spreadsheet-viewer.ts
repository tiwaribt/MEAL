import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ExcelExportService } from '../services/excel-export.service';

@Component({
  selector: 'app-excel-spreadsheet-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="bg-white border border-slate-300 rounded-2xl shadow-xl overflow-hidden flex flex-col font-sans transition-all"
         [class.fixed]="isFullscreen()"
         [class.inset-2]="isFullscreen()"
         [class.z-50]="isFullscreen()"
         [class.h-auto]="!isFullscreen()">

      <!-- Top Excel Title Bar -->
      <div class="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <span class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <mat-icon class="text-sm">table_view</mat-icon>
          </span>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-white tracking-wide uppercase">MEAL Suite Excel Engine</span>
              <span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                PRO TEMPLATE (.XLSX)
              </span>
            </div>
            <h3 class="text-sm font-semibold text-slate-200 truncate max-w-md">
              {{ currentWorkbook().title }}
            </h3>
          </div>
        </div>

        <!-- Workbook Switcher Quick Dropdown -->
        <div class="flex items-center gap-2">
          <label class="text-[11px] text-slate-400 font-medium hidden sm:inline">Workbook:</label>
          <div class="relative">
            <select
              [value]="selectedWorkbookId()"
              (change)="onWorkbookChange($event)"
              class="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer pr-7">
              @for (wb of availableWorkbooks(); track wb.id) {
                <option [value]="wb.id">
                  {{ wb.title }} ({{ wb.totalSheets }} sheets)
                </option>
              }
            </select>
            <mat-icon class="absolute right-1.5 top-1.5 text-xs text-slate-400 pointer-events-none">expand_more</mat-icon>
          </div>

          <!-- Fullscreen Toggle -->
          <button
            type="button"
            (click)="toggleFullscreen()"
            class="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            [title]="isFullscreen() ? 'Exit Fullscreen' : 'Expand Fullscreen'">
            <mat-icon class="text-sm">{{ isFullscreen() ? 'fullscreen_exit' : 'fullscreen' }}</mat-icon>
          </button>

          @if (canClose()) {
            <button
              type="button"
              (click)="closeViewer.emit()"
              class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Close Preview">
              <mat-icon class="text-sm">close</mat-icon>
            </button>
          }
        </div>
      </div>

      <!-- Action Ribbon & Tool Bar -->
      <div class="bg-slate-100 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <!-- Left: Search in sheet & Zoom -->
        <div class="flex items-center gap-3">
          <!-- Live Search Input -->
          <div class="relative">
            <mat-icon class="absolute left-2.5 top-2 text-xs text-slate-400">search</mat-icon>
            <input
              type="text"
              [value]="searchQuery()"
              (input)="searchQuery.set($any($event.target).value)"
              placeholder="Search in active sheet..."
              class="pl-7 pr-3 py-1 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 w-44 sm:w-60 shadow-2xs" />
            @if (searchQuery()) {
              <button
                type="button"
                (click)="searchQuery.set('')"
                class="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600">
                <mat-icon class="text-[10px]">close</mat-icon>
              </button>
            }
          </div>

          <!-- Zoom Selector -->
          <div class="hidden md:flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              (click)="zoomLevel.set(85)"
              [class]="zoomLevel() === 85 ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-50'"
              class="px-2 py-0.5 rounded transition-colors">
              85%
            </button>
            <button
              type="button"
              (click)="zoomLevel.set(100)"
              [class]="zoomLevel() === 100 ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-50'"
              class="px-2 py-0.5 rounded transition-colors">
              100%
            </button>
            <button
              type="button"
              (click)="zoomLevel.set(115)"
              [class]="zoomLevel() === 115 ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-50'"
              class="px-2 py-0.5 rounded transition-colors">
              115%
            </button>
          </div>
        </div>

        <!-- Right: Primary Export Buttons -->
        <div class="flex items-center gap-2">
          <!-- Copy to Clipboard -->
          <button
            type="button"
            (click)="copySheetToClipboard()"
            class="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs transition-colors">
            <mat-icon class="text-xs">{{ copyFeedback() ? 'check' : 'content_copy' }}</mat-icon>
            <span>{{ copyFeedback() ? 'Copied!' : 'Copy TSV' }}</span>
          </button>

          <!-- Export CSV -->
          <button
            type="button"
            (click)="exportCurrentSheetCsv()"
            class="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs transition-colors">
            <mat-icon class="text-xs">description</mat-icon>
            <span>Export CSV</span>
          </button>

          <!-- Download Active Sheet .xlsx -->
          <button
            type="button"
            (click)="downloadActiveSheetXlsx()"
            class="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs transition-colors">
            <mat-icon class="text-xs">sim_card_download</mat-icon>
            <span>Download Sheet (.xlsx)</span>
          </button>

          <!-- Download Entire Workbook .xlsx -->
          <button
            type="button"
            (click)="downloadEntireWorkbookXlsx()"
            class="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors">
            <mat-icon class="text-xs">download</mat-icon>
            <span>Download Workbook (.xlsx)</span>
          </button>
        </div>
      </div>

      <!-- Formula Bar & Active Cell Coordinate -->
      <div class="bg-white border-b border-slate-200 px-4 py-1.5 flex items-center gap-2 text-xs">
        <div class="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-700 text-center min-w-[54px] select-none">
          {{ selectedCellCoordinate() }}
        </div>
        <div class="text-slate-300 select-none">|</div>
        <div class="text-emerald-700 font-mono font-bold select-none text-[11px]">fx</div>
        <div class="flex-1 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 font-mono text-slate-800 truncate select-all">
          {{ selectedCellValue() }}
        </div>
        <div class="text-[11px] text-slate-400 font-mono hidden sm:inline">
          Showing {{ filteredRows().length }} / {{ currentSheet()?.totalRows || 0 }} rows
        </div>
      </div>

      <!-- Main Spreadsheet Grid Container -->
      <div class="flex-1 overflow-auto max-h-[580px] bg-slate-200/60 p-2"
           [style.zoom]="zoomLevel() + '%'">
        <div class="bg-white rounded-lg border border-slate-300 shadow-xs overflow-hidden inline-block min-w-full">
          <table class="w-full text-left border-collapse select-none">
            <!-- 1. Column Letter Header Row (Excel Style A, B, C, D...) -->
            <thead class="bg-slate-100 text-slate-500 font-mono text-[11px] border-b border-slate-300 sticky top-0 z-20">
              <tr>
                <th class="w-12 px-2 py-1.5 bg-slate-200 text-center border-r border-slate-300 font-semibold select-none">
                  #
                </th>
                @for (h of currentSheet()?.headers || []; track $index) {
                  <th class="px-3 py-1.5 border-r border-slate-300 font-semibold text-center uppercase tracking-wider bg-slate-100">
                    {{ getColumnLetter($index) }}
                  </th>
                }
              </tr>
            </thead>

            <tbody>
              <!-- Row 1: Institutional Header Block Banner -->
              <tr class="bg-teal-900 text-white font-sans text-xs">
                <td class="px-2 py-2 text-center bg-teal-950/80 font-mono text-[10px] text-teal-300 border-r border-teal-800">1</td>
                <td [attr.colspan]="(currentSheet()?.headers?.length || 1)" class="px-4 py-2 font-bold tracking-wide">
                  MEAL SUITE — ENTERPRISE M&E & ACCOUNTABILITY PLATFORM
                </td>
              </tr>

              <!-- Row 2: Sheet Title & Subtitle -->
              <tr class="bg-teal-800 text-teal-50 font-sans text-xs">
                <td class="px-2 py-1.5 text-center bg-teal-900 font-mono text-[10px] text-teal-200 border-r border-teal-700">2</td>
                <td [attr.colspan]="(currentSheet()?.headers?.length || 1)" class="px-4 py-1.5">
                  <strong>{{ currentSheet()?.sheetTitle }}</strong>
                  <span class="text-teal-200 text-[11px] ml-2">({{ currentSheet()?.sheetSubtitle }})</span>
                </td>
              </tr>

              <!-- Row 3: Metadata Stamp -->
              <tr class="bg-slate-100 text-slate-600 font-mono text-[11px]">
                <td class="px-2 py-1 text-center bg-slate-200 font-mono text-[10px] text-slate-500 border-r border-slate-300">3</td>
                <td [attr.colspan]="(currentSheet()?.headers?.length || 1)" class="px-4 py-1">
                  Compliance: USAID ADS 201 · FCDO Smart Rules · Sphere Quality Standards · Verified 2026
                </td>
              </tr>

              <!-- Row 4: Spacer -->
              <tr class="bg-slate-50 h-3">
                <td class="px-2 py-0.5 text-center bg-slate-200 font-mono text-[10px] text-slate-400 border-r border-slate-300">4</td>
                <td [attr.colspan]="(currentSheet()?.headers?.length || 1)" class="bg-slate-100/50"></td>
              </tr>

              <!-- Row 5: Column Headers (Real Data Column Names) -->
              <tr class="bg-slate-800 text-white font-semibold text-xs border-y-2 border-slate-700 sticky top-7 z-10">
                <td class="px-2 py-2 text-center bg-slate-900 font-mono text-[11px] text-slate-400 border-r border-slate-700">5</td>
                @for (header of currentSheet()?.headers || []; track $index) {
                  <th class="px-3 py-2 border-r border-slate-700 whitespace-nowrap text-xs font-bold text-white bg-slate-800">
                    {{ header }}
                  </th>
                }
              </tr>

              <!-- Row 6+: Filtered Data Rows -->
              @for (row of filteredRows(); track $index) {
                @let rowIndex = $index + 6;
                <tr class="hover:bg-teal-50/40 transition-colors border-b border-slate-200"
                    [class.bg-slate-50]="rowIndex % 2 === 0"
                    [class.bg-white]="rowIndex % 2 !== 0">
                  <!-- Row Number Cell -->
                  <td class="px-2 py-2 text-center bg-slate-100 font-mono text-[11px] text-slate-500 border-r border-slate-300 font-medium select-none">
                    {{ rowIndex }}
                  </td>

                  <!-- Data Cells -->
                  @for (cell of row; track $index) {
                    @let colLetter = getColumnLetter($index);
                    @let cellAddress = colLetter + rowIndex;
                    @let isSelected = selectedCellCoordinate() === cellAddress;

                    <td
                      (click)="selectCell(cellAddress, cell)"
                      [class.ring-2]="isSelected"
                      [class.ring-emerald-600]="isSelected"
                      [class.bg-emerald-50]="isSelected"
                      class="px-3 py-2 border-r border-slate-200 text-xs font-sans text-slate-800 whitespace-nowrap cursor-cell transition-all">
                      @if (isStatusValue(cell)) {
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                              [class]="getStatusBadgeClass(cell)">
                          {{ cell }}
                        </span>
                      } @else if (isFormula(cell)) {
                        <span class="font-mono text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 font-semibold text-[11px]">
                          {{ cell }}
                        </span>
                      } @else if (isNumber(cell)) {
                        <span class="font-mono tabular-nums text-slate-900 font-medium">
                          {{ cell }}
                        </span>
                      } @else {
                        <span>{{ cell !== null && cell !== undefined ? cell : '' }}</span>
                      }
                    </td>
                  }
                </tr>
              } @empty {
                <tr>
                  <td [attr.colspan]="(currentSheet()?.headers?.length || 1) + 1" class="p-8 text-center text-slate-400 text-xs">
                    <mat-icon class="text-2xl text-slate-300 block mb-1">search_off</mat-icon>
                    No matching records found for query "{{ searchQuery() }}"
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bottom Sheet Tabs Bar (Just like real Microsoft Excel) -->
      <div class="bg-slate-100 border-t border-slate-300 px-2 py-1 flex items-center justify-between gap-3 text-xs select-none">
        <div class="flex items-center gap-1 overflow-x-auto py-0.5 max-w-4xl scrollbar-none">
          @for (sheet of currentWorkbook().sheets; track sheet.sheetName) {
            <button
              type="button"
              (click)="selectedSheetName.set(sheet.sheetName)"
              [class]="selectedSheetName() === sheet.sheetName ? 'bg-white text-emerald-950 font-bold border-t-2 border-emerald-600 shadow-2xs' : 'bg-slate-200/80 text-slate-600 hover:bg-white font-medium border-t-2 border-transparent'"
              class="px-3 py-1.5 rounded-t-md text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer">
              <mat-icon class="text-xs" [class.text-emerald-700]="selectedSheetName() === sheet.sheetName">description</mat-icon>
              <span>{{ sheet.sheetName }}</span>
              <span class="text-[9px] px-1 rounded bg-slate-100 text-slate-500 font-mono font-bold">
                {{ sheet.totalRows }}
              </span>
            </button>
          }
        </div>

        <!-- Sheet Footer Stats -->
        <div class="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 font-mono shrink-0 pr-2">
          <span>{{ currentSheet()?.totalRows || 0 }} rows</span>
          <span>·</span>
          <span>{{ currentSheet()?.totalCols || 0 }} cols</span>
          <span>·</span>
          <span class="text-emerald-700 font-bold">100% Formatted</span>
        </div>
      </div>
    </div>
  `
})
export class ExcelSpreadsheetViewer {
  private readonly excelService = inject(ExcelExportService);

  readonly initialWorkbookId = input<string>('master-database');
  readonly canClose = input<boolean>(false);
  readonly closeViewer = output<void>();

  readonly availableWorkbooks = computed(() => this.excelService.getAvailableWorkbooks());
  readonly selectedWorkbookId = signal<string>('master-database');
  readonly selectedSheetName = signal<string>('');
  readonly isFullscreen = signal<boolean>(false);
  readonly searchQuery = signal<string>('');
  readonly zoomLevel = signal<number>(100);
  readonly copyFeedback = signal<boolean>(false);

  readonly selectedCellCoordinate = signal<string>('A6');
  readonly selectedCellValue = signal<string>('');

  readonly currentWorkbook = computed(() => {
    const list = this.availableWorkbooks();
    const id = this.selectedWorkbookId();
    return list.find(wb => wb.id === id) || list[0];
  });

  readonly currentSheet = computed(() => {
    const wb = this.currentWorkbook();
    if (!wb || wb.sheets.length === 0) return null;
    const sName = this.selectedSheetName();
    return wb.sheets.find(s => s.sheetName === sName) || wb.sheets[0];
  });

  readonly filteredRows = computed(() => {
    const sheet = this.currentSheet();
    if (!sheet) return [];
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return sheet.rows;

    return sheet.rows.filter(row => {
      return row.some(cell => {
        if (cell === null || cell === undefined) return false;
        return String(cell).toLowerCase().includes(query);
      });
    });
  });

  constructor() {
    // Initialize sheet name when workbook loads
    const initial = this.initialWorkbookId();
    if (initial) {
      this.selectedWorkbookId.set(initial);
    }
    const wb = this.currentWorkbook();
    if (wb && wb.sheets.length > 0) {
      this.selectedSheetName.set(wb.sheets[0].sheetName);
      if (wb.sheets[0].rows.length > 0 && wb.sheets[0].rows[0].length > 0) {
        this.selectedCellCoordinate.set('B6');
        this.selectedCellValue.set(String(wb.sheets[0].rows[0][0] || ''));
      }
    }
  }

  onWorkbookSelect(wbId: string) {
    this.selectedWorkbookId.set(wbId);
    const wb = this.currentWorkbook();
    if (wb && wb.sheets.length > 0) {
      this.selectedSheetName.set(wb.sheets[0].sheetName);
      this.searchQuery.set('');
      if (wb.sheets[0].rows.length > 0) {
        this.selectedCellCoordinate.set('B6');
        this.selectedCellValue.set(String(wb.sheets[0].rows[0][0] || ''));
      }
    }
  }

  loadWorkbook(wbId: string) {
    this.onWorkbookSelect(wbId);
  }

  onWorkbookChange(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    if (target?.value) {
      this.onWorkbookSelect(target.value);
    }
  }

  toggleFullscreen() {
    this.isFullscreen.update(val => !val);
  }

  selectCell(address: string, value: unknown) {
    this.selectedCellCoordinate.set(address);
    this.selectedCellValue.set(value !== null && value !== undefined ? String(value) : '');
  }

  getColumnLetter(colIndex: number): string {
    let letter = '';
    let temp = colIndex;
    while (temp >= 0) {
      letter = String.fromCharCode((temp % 26) + 65) + letter;
      temp = Math.floor(temp / 26) - 1;
    }
    return letter;
  }

  isStatusValue(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    const v = value.trim();
    return [
      'Verified', 'Pending', 'Flagged for Follow-up', 'Rejected',
      'In Progress', 'Completed', 'Delayed', 'Planned',
      'PASSED', 'NON-COMPLIANT', 'Active', 'Resolved', 'Investigating'
    ].includes(v);
  }

  getStatusBadgeClass(value: unknown): string {
    const v = String(value).trim();
    switch (v) {
      case 'Verified':
      case 'Completed':
      case 'PASSED':
      case 'Resolved':
      case 'Active':
        return 'bg-emerald-100 text-emerald-900 border border-emerald-300';
      case 'In Progress':
      case 'Planned':
      case 'Investigating':
        return 'bg-blue-100 text-blue-900 border border-blue-300';
      case 'Pending':
      case 'Flagged for Follow-up':
        return 'bg-amber-100 text-amber-900 border border-amber-300';
      case 'Rejected':
      case 'NON-COMPLIANT':
      case 'Delayed':
        return 'bg-rose-100 text-rose-900 border border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  }

  isFormula(value: unknown): boolean {
    return typeof value === 'string' && value.startsWith('=');
  }

  isNumber(value: unknown): boolean {
    return typeof value === 'number';
  }

  downloadActiveSheetXlsx() {
    const sheet = this.currentSheet();
    if (!sheet) return;
    this.excelService.exportSingleSheet(sheet);
  }

  downloadEntireWorkbookXlsx() {
    const wb = this.currentWorkbook();
    if (!wb) return;
    this.excelService.exportWorkbookData(wb);
  }

  exportCurrentSheetCsv() {
    const sheet = this.currentSheet();
    if (!sheet) return;
    this.excelService.exportSheetAsCsv(sheet);
  }

  copySheetToClipboard() {
    const sheet = this.currentSheet();
    if (!sheet) return;

    const tsvLines = [
      sheet.headers.join('\t'),
      ...sheet.rows.map(row => row.map(c => c === null || c === undefined ? '' : String(c)).join('\t'))
    ].join('\n');

    navigator.clipboard.writeText(tsvLines).then(() => {
      this.copyFeedback.set(true);
      setTimeout(() => this.copyFeedback.set(false), 2000);
    });
  }
}
