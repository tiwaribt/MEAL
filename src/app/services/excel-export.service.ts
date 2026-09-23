import { Injectable, inject } from '@angular/core';
import { Workbook, Worksheet } from 'exceljs';
import JSZip from 'jszip';
import { MealDataService } from './meal-data.service';
import { NepalGeoService } from './nepal-geo.service';
import { ExcelSheetData, ExcelWorkbookData } from '../models/excel-preview.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {
  private readonly mealService = inject(MealDataService);
  private readonly geoService = inject(NepalGeoService);

  // Helper to trigger file download in browser using Blob and Object URL
  private downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // Reliable workbook binary downloader using ExcelJS
  private async downloadExcelJsWorkbook(wb: Workbook, filename: string): Promise<void> {
    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    this.downloadBlob(blob, filename);
  }

  // Tab color mapper by programmatic domain
  private getTabColorForCategory(category?: string, sheetName?: string): string {
    if (category === 'Planning' || sheetName?.includes('Gantt')) return 'FF0284C7'; // Sky Blue
    if (category === 'Monitoring' || sheetName?.includes('Logframe')) return 'FF2563EB'; // Royal Blue
    if (category === 'Quality Assurance' || sheetName?.includes('Visits') || sheetName?.includes('Checkpoints')) return 'FF0D9488'; // Teal
    if (category === 'Verification' || sheetName?.includes('Beneficiar') || sheetName?.includes('DQA')) return 'FF059669'; // Emerald
    if (category === 'Accountability' || sheetName?.includes('CFRM')) return 'FFD97706'; // Amber
    if (category === 'Learning' || sheetName?.includes('Lesson') || sheetName?.includes('Case')) return 'FFE11D48'; // Rose
    if (category === 'Reference' || sheetName?.includes('Geo')) return 'FF7C3AED'; // Purple
    if (category === 'Admin' || sheetName?.includes('Config') || sheetName?.includes('Admin')) return 'FF475569'; // Slate
    if (sheetName?.includes('Overview')) return 'FF134E4A'; // Deep Teal
    return 'FF0D9488'; // Default Teal
  }

  // Build a world-class institutional worksheet matching exactly the in-app preview styling
  private applySheetDataToWorksheet(
    ws: Worksheet,
    sheetData: ExcelSheetData,
    tabColorArgb = 'FF0D9488'
  ): void {
    const headers = sheetData.headers;
    const rows = sheetData.rows;
    const colCount = Math.max(headers.length, 1);
    const org = this.mealService.orgProfile();

    // Set Sheet Tab Color
    ws.properties.tabColor = { argb: tabColorArgb };

    // --- ROW 1: Institutional Header Banner (Teal 900) ---
    const row1 = ws.getRow(1);
    row1.height = 32;
    for (let c = 1; c <= colCount; c++) {
      const cell = row1.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF134E4A' } }; // Deep Teal 900
    }
    const cell1 = row1.getCell(1);
    cell1.value = 'MEAL SUITE — ENTERPRISE M&E & ACCOUNTABILITY PLATFORM';
    cell1.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
    cell1.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    ws.mergeCells(1, 1, 1, colCount);

    // --- ROW 2: Sheet Title & Subtitle (Teal 800) ---
    const row2 = ws.getRow(2);
    row2.height = 25;
    for (let c = 1; c <= colCount; c++) {
      const cell = row2.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF115E59' } }; // Teal 800
    }
    const cell2 = row2.getCell(1);
    cell2.value = `${sheetData.sheetTitle.toUpperCase()}  |  ${sheetData.sheetSubtitle}`;
    cell2.font = { name: 'Segoe UI', size: 10.5, bold: true, color: { argb: 'FFF0FDFA' } }; // Mint text
    cell2.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    ws.mergeCells(2, 1, 2, colCount);

    // --- ROW 3: Compliance & Metadata Stamp (Slate 100) ---
    const row3 = ws.getRow(3);
    row3.height = 19;
    for (let c = 1; c <= colCount; c++) {
      const cell = row3.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } }; // Slate 100
      cell.border = { bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } } };
    }
    const cell3 = row3.getCell(1);
    cell3.value = `Compliance: USAID ADS 201 · FCDO Smart Rules · Sphere Quality Standards  |  Country: ${org.countryOffice}  |  Audit Timestamp: ${this.getDateString()}`;
    cell3.font = { name: 'Segoe UI', size: 8.5, italic: true, color: { argb: 'FF475569' } }; // Slate 600
    cell3.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
    ws.mergeCells(3, 1, 3, colCount);

    // --- ROW 4: Spacer Row ---
    const row4 = ws.getRow(4);
    row4.height = 8;
    for (let c = 1; c <= colCount; c++) {
      row4.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    }

    // --- ROW 5: Table Column Headers (Slate 800) ---
    const row5 = ws.getRow(5);
    row5.height = 28;
    headers.forEach((h, idx) => {
      const colNumber = idx + 1;
      const cell = row5.getCell(colNumber);
      cell.value = h;
      cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }; // Dark Slate 800
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF334155' } },
        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
        left: { style: 'thin', color: { argb: 'FF334155' } },
        right: { style: 'thin', color: { argb: 'FF334155' } }
      };
    });

    // Freeze panes at header row (Row 5 stays pinned)
    ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 5, activeCell: 'A6' }];

    // Auto-Filter on Row 5
    ws.autoFilter = {
      from: { row: 5, column: 1 },
      to: { row: 5, column: colCount }
    };

    // --- ROW 6+: Data Rows (Alternating Zebra Striping & Status Highlighting) ---
    const colMaxLengths = headers.map(h => String(h).length);

    rows.forEach((rowValues, rIdx) => {
      const rowNumber = rIdx + 6;
      const row = ws.getRow(rowNumber);
      row.height = 21;
      const isEven = rowNumber % 2 === 0;
      const defaultBgArgb = isEven ? 'FFF8FAFC' : 'FFFFFFFF'; // Exact preview alternating colors: slate-50 & white

      headers.forEach((_, cIdx) => {
        const colNumber = cIdx + 1;
        const cell = row.getCell(colNumber);
        const val = rowValues[cIdx];
        const strVal = val !== null && val !== undefined ? String(val) : '';

        // Track max string length for column auto-width
        if (strVal.length > (colMaxLengths[cIdx] || 0)) {
          colMaxLengths[cIdx] = Math.min(strVal.length, 52);
        }

        // 1. Live Excel Formulas (Evaluated formula cells)
        if (typeof val === 'string' && val.startsWith('=')) {
          cell.value = { formula: val.substring(1) };
          cell.font = { name: 'Consolas', size: 9.5, bold: true, color: { argb: 'FF065F46' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } }; // Pale Mint fill
          cell.alignment = { vertical: 'middle', horizontal: 'right' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFA7F3D0' } },
            bottom: { style: 'thin', color: { argb: 'FFA7F3D0' } },
            left: { style: 'thin', color: { argb: 'FFA7F3D0' } },
            right: { style: 'thin', color: { argb: 'FFA7F3D0' } }
          };
          return;
        }

        // Set primitive cell value
        cell.value = val !== null && val !== undefined ? val : '';

        // Default cell borders
        const cellBorder = {
          top: { style: 'thin' as const, color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin' as const, color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin' as const, color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin' as const, color: { argb: 'FFE2E8F0' } }
        };

        // 2. Status Badge Value Styling (Identical to preview pills)
        const upperStr = strVal.trim().toUpperCase();

        const greenStatuses = [
          'VERIFIED', 'COMPLETED', 'PASSED', 'RESOLVED', 'ACTIVE', 'YES',
          'ON_TRACK', 'GREEN', 'LOW', 'LOW RISK', 'MET'
        ];
        const amberStatuses = [
          'ONGOING', 'IN PROGRESS', 'IN_PROGRESS', 'PENDING', 'INVESTIGATING',
          'UNDER_INVESTIGATION', 'PLANNED', 'FLAGGED FOR FOLLOW-UP',
          'FLAGGED FOR FOLLOW UP', 'AMBER', 'YELLOW', 'MEDIUM', 'MODERATE'
        ];
        const redStatuses = [
          'DELAYED', 'FAILED', 'HIGH', 'CRITICAL', 'URGENT', 'RED',
          'NON-COMPLIANT', 'NON_COMPLIANT', 'REJECTED', 'NO'
        ];
        const blueStatuses = [
          'OUTPUT', 'OUTCOME', 'GOAL', 'IMPACT', 'INFO', 'SUBMITTED'
        ];

        if (greenStatuses.includes(upperStr)) {
          // Soft Emerald Badge
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF166534' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF86EFAC' } },
            bottom: { style: 'thin', color: { argb: 'FF86EFAC' } },
            left: { style: 'thin', color: { argb: 'FF86EFAC' } },
            right: { style: 'thin', color: { argb: 'FF86EFAC' } }
          };
        } else if (amberStatuses.includes(upperStr)) {
          // Soft Amber Badge
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF92400E' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFFDE68A' } },
            bottom: { style: 'thin', color: { argb: 'FFFDE68A' } },
            left: { style: 'thin', color: { argb: 'FFFDE68A' } },
            right: { style: 'thin', color: { argb: 'FFFDE68A' } }
          };
        } else if (redStatuses.includes(upperStr)) {
          // Soft Rose Badge
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF991B1B' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFFCA5A5' } },
            bottom: { style: 'thin', color: { argb: 'FFFCA5A5' } },
            left: { style: 'thin', color: { argb: 'FFFCA5A5' } },
            right: { style: 'thin', color: { argb: 'FFFCA5A5' } }
          };
        } else if (blueStatuses.includes(upperStr)) {
          // Soft Indigo Badge
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF3730A3' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEF2FF' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFC7D2FE' } },
            bottom: { style: 'thin', color: { argb: 'FFC7D2FE' } },
            left: { style: 'thin', color: { argb: 'FFC7D2FE' } },
            right: { style: 'thin', color: { argb: 'FFC7D2FE' } }
          };
        } else if (typeof val === 'number') {
          // Numeric formatting
          cell.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF0F172A' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: defaultBgArgb } };
          cell.alignment = { vertical: 'middle', horizontal: 'right' };
          cell.border = cellBorder;
          if (Number.isInteger(val)) {
            cell.numFmt = '#,##0';
          } else {
            cell.numFmt = '#,##0.0';
          }
        } else if (strVal.endsWith('%')) {
          // Percentage formatting
          cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: defaultBgArgb } };
          cell.alignment = { vertical: 'middle', horizontal: 'right' };
          cell.border = cellBorder;
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(strVal) || /^(BEN|ACT|IND|PRJ|CFRM|LESSON|CS)-\d+/.test(strVal) || /^\d{2}-\d{2}-\d{2}-\d+/.test(strVal)) {
          // Dates, IDs, and Codes centered
          cell.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF1E293B' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: defaultBgArgb } };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = cellBorder;
        } else {
          // Standard text
          cell.font = { name: 'Segoe UI', size: 9.5, color: { argb: 'FF1E293B' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: defaultBgArgb } };
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: strVal.length > 35 };
          cell.border = cellBorder;
        }
      });
    });

    // Set dynamic column widths with generous margins
    headers.forEach((_, cIdx) => {
      const colNumber = cIdx + 1;
      const calculatedWidth = Math.min(Math.max((colMaxLengths[cIdx] || 10) + 4, 14), 52);
      ws.getColumn(colNumber).width = calculatedWidth;
    });
  }

  // Create styled ExcelJS Workbook from an array of ExcelSheetData objects
  private async createStyledExcelJsWorkbook(sheets: ExcelSheetData[]): Promise<Workbook> {
    const wb = new Workbook();
    wb.creator = 'MEAL Suite Enterprise';
    wb.lastModifiedBy = 'MEAL Lead / M&E Officer';
    wb.created = new Date();
    wb.modified = new Date();

    for (const sheet of sheets) {
      const safeSheetName = sheet.sheetName.replace(/[:\\/?*[\]]/g, '_').substring(0, 31);
      const ws = wb.addWorksheet(safeSheetName);
      const tabColor = this.getTabColorForCategory(sheet.category, sheet.sheetName);
      this.applySheetDataToWorksheet(ws, sheet, tabColor);
    }

    return wb;
  }

  // 1. Export Logframe & PIRS Tracker to Excel
  async exportLogframeToExcel(): Promise<void> {
    const sheets = [this.buildLogframeSheet(), this.buildProjectsSheet()];
    const wb = await this.createStyledExcelJsWorkbook(sheets);
    await this.downloadExcelJsWorkbook(wb, `MEAL_Logframe_PIRS_Tracker_${this.getDateString()}.xlsx`);
  }

  // 2. Export Field Visits & Quality Audits to Excel (3 Sheets)
  async exportFieldVisitsToExcel(): Promise<void> {
    const sheets = [
      this.buildFieldVisitsSummarySheet(),
      this.buildQualityCheckpointsSheet(),
      this.buildActionPointsSheet()
    ];
    const wb = await this.createStyledExcelJsWorkbook(sheets);
    await this.downloadExcelJsWorkbook(wb, `MEAL_Field_Monitoring_QA_Audits_${this.getDateString()}.xlsx`);
  }

  // 3. Export Beneficiary Registry (DQA) to Excel
  async exportBeneficiariesToExcel(): Promise<void> {
    const sheets = [this.buildBeneficiariesSheet(), this.buildNepalGeoHierarchySheet()];
    const wb = await this.createStyledExcelJsWorkbook(sheets);
    await this.downloadExcelJsWorkbook(wb, `MEAL_Beneficiary_Registry_DQA_${this.getDateString()}.xlsx`);
  }

  // 4. Export CFRM Complaints & Feedback to Excel
  async exportCfrmToExcel(): Promise<void> {
    const sheets = [this.buildCfrmSheet()];
    const wb = await this.createStyledExcelJsWorkbook(sheets);
    await this.downloadExcelJsWorkbook(wb, `MEAL_CFRM_Safeguarding_Log_${this.getDateString()}.xlsx`);
  }

  // 5. Export Learning & Case Studies to Excel
  async exportLearningToExcel(): Promise<void> {
    const sheets = [this.buildLessonsSheet(), this.buildCaseStudiesSheet()];
    const wb = await this.createStyledExcelJsWorkbook(sheets);
    await this.downloadExcelJsWorkbook(wb, `MEAL_Learning_Repository_${this.getDateString()}.xlsx`);
  }

  // 6. Export Gantt Activity Workplan to Excel
  async exportGanttToExcel(): Promise<void> {
    const sheets = [this.buildGanttSheet(), this.buildProjectsSheet()];
    const wb = await this.createStyledExcelJsWorkbook(sheets);
    await this.downloadExcelJsWorkbook(wb, `MEAL_Gantt_Workplan_Schedule_${this.getDateString()}.xlsx`);
  }

  // 7. Complete System Database as an Excel Workbook
  async exportCompleteSystemDatabaseExcel(): Promise<Uint8Array> {
    const sheets = this.getMasterDatabaseSheets();
    const wb = await this.createStyledExcelJsWorkbook(sheets);
    const buffer = await wb.xlsx.writeBuffer();
    return new Uint8Array(buffer);
  }

  // Download complete system database directly
  async downloadFullDatabaseExcel(): Promise<void> {
    const sheets = this.getMasterDatabaseSheets();
    const wb = await this.createStyledExcelJsWorkbook(sheets);
    await this.downloadExcelJsWorkbook(wb, `MEAL_Suite_Complete_System_Database_${this.getDateString()}.xlsx`);
  }

  // 8. Generate and download Offline System Template with working formulas and VBA guide
  async generateMacroEnabledTemplate(): Promise<Uint8Array> {
    const sheets = this.getOfflineTemplateSheets();
    const wb = await this.createStyledExcelJsWorkbook(sheets);
    const buffer = await wb.xlsx.writeBuffer();
    return new Uint8Array(buffer);
  }

  // Download Offline Template with guaranteed compatibility across all spreadsheet programs
  async downloadMacroEnabledTemplate(asXlsm = false): Promise<void> {
    const bytes = await this.generateMacroEnabledTemplate();
    const ext = asXlsm ? 'xlsm' : 'xlsx';
    const mime = asXlsm
      ? 'application/vnd.ms-excel.sheet.macroEnabled.main+xml'
      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mime });
    this.downloadBlob(blob, `MEAL_Suite_Offline_System_Template_${this.getDateString()}.${ext}`);
  }

  // 9. Download Complete System Backup ZIP
  async downloadCompleteSystemZip(): Promise<void> {
    const zip = new JSZip();

    // 1. Complete Database Workbook (14 Master Sheets)
    const dbBytes = await this.exportCompleteSystemDatabaseExcel();
    zip.file('01_MEAL_Suite_Complete_System_Database.xlsx', dbBytes);

    // 2. Offline System Template
    const templateBytes = await this.generateMacroEnabledTemplate();
    zip.file('02_MEAL_Suite_Offline_System_Template.xlsx', templateBytes);

    // 3. Gantt Activity Workplan
    const wbGantt = await this.createStyledExcelJsWorkbook([this.buildGanttSheet(), this.buildProjectsSheet()]);
    zip.file('03_MEAL_Gantt_Workplan_2026.xlsx', await wbGantt.xlsx.writeBuffer());

    // 4. Logframe & PIRS Tracker
    const wbLogframe = await this.createStyledExcelJsWorkbook([this.buildLogframeSheet(), this.buildProjectsSheet()]);
    zip.file('04_MEAL_Logframe_PIRS_Tracker.xlsx', await wbLogframe.xlsx.writeBuffer());

    // 5. Beneficiary DQA Registry
    const wbBen = await this.createStyledExcelJsWorkbook([this.buildBeneficiariesSheet(), this.buildNepalGeoHierarchySheet()]);
    zip.file('05_MEAL_Beneficiary_DQA_Registry.xlsx', await wbBen.xlsx.writeBuffer());

    // 6. CFRM Safeguarding Log
    const wbCfrm = await this.createStyledExcelJsWorkbook([this.buildCfrmSheet()]);
    zip.file('06_MEAL_CFRM_Safeguarding_Log.xlsx', await wbCfrm.xlsx.writeBuffer());

    // 7. System Manual
    const org = this.mealService.orgProfile();
    const readmeContent = `================================================================================
MEAL SUITE — ENTERPRISE M&E, ACCOUNTABILITY & FIELD DATA TOOLKIT
================================================================================
Extraction Date: ${new Date().toUTCString()}
Organization: ${org.name} (${org.acronym})
Country Office: ${org.countryOffice}
Compliance Frameworks: ${org.complianceFrameworks.join(', ')}

SYSTEM BACKUP CONTENTS:
1. 01_MEAL_Suite_Complete_System_Database.xlsx
   - Consolidated 14-sheet master workbook (Projects, Logframe, Gantt, Field Visits,
     DQA Beneficiaries, CFRM, Lessons, Nepal Geo, MoV Evidence, Admin Configuration).
2. 02_MEAL_Suite_Offline_System_Template.xlsx
   - Standalone field enumerator template with live Excel formulas and full VBA code guide.
3. 03_MEAL_Gantt_Workplan_2026.xlsx
   - Detailed activity workplan, quarterly milestones, and budget allocation.
4. 04_MEAL_Logframe_PIRS_Tracker.xlsx
   - Performance indicators with disaggregations (gender, caste, disability, youth).
5. 05_MEAL_Beneficiary_DQA_Registry.xlsx
   - Verified beneficiary database with national citizenship numbers.
6. 06_MEAL_CFRM_Safeguarding_Log.xlsx
   - Community complaints, feedback response mechanism, and safeguarding actions.

Technical Contact: ${org.focalEmail} | ${org.focalPhone}
Website: https://mealsuite.org
================================================================================`;
    zip.file('README_MEAL_Suite_System_Manual.txt', readmeContent);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    this.downloadBlob(zipBlob, `MEAL_Suite_Complete_System_Export_${this.getDateString()}.zip`);
  }

  // Export a single ExcelSheetData object as .xlsx
  async exportSingleSheet(sheetData: ExcelSheetData, customFilename?: string): Promise<void> {
    const wb = await this.createStyledExcelJsWorkbook([sheetData]);
    const fn = customFilename || `${sheetData.sheetName}_${this.getDateString()}.xlsx`;
    await this.downloadExcelJsWorkbook(wb, fn);
  }

  // Export full ExcelWorkbookData as .xlsx
  async exportWorkbookData(wbData: ExcelWorkbookData): Promise<void> {
    const wb = await this.createStyledExcelJsWorkbook(wbData.sheets);
    await this.downloadExcelJsWorkbook(wb, wbData.filename);
  }

  // Export sheet data as CSV
  exportSheetAsCsv(sheetData: ExcelSheetData) {
    const headers = sheetData.headers;
    const rows = sheetData.rows;
    const csvLines: string[] = [];

    // Header line
    csvLines.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','));

    // Data lines
    for (const row of rows) {
      const line = row.map(cell => {
        if (cell === null || cell === undefined) return '""';
        return `"${String(cell).replace(/"/g, '""')}"`;
      }).join(',');
      csvLines.push(line);
    }

    const csvContent = '\uFEFF' + csvLines.join('\r\n'); // Add BOM for Excel UTF-8 support
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, `${sheetData.sheetName}_${this.getDateString()}.csv`);
  }

  // ---------------------------------------------------------------------------
  // WORKBOOK MASTER DATA RETRIEVAL
  // ---------------------------------------------------------------------------

  getMasterDatabaseSheets(): ExcelSheetData[] {
    return [
      this.buildSystemOverviewSheet(),
      this.buildProjectsSheet(),
      this.buildLogframeSheet(),
      this.buildGanttSheet(),
      this.buildFieldVisitsSummarySheet(),
      this.buildQualityCheckpointsSheet(),
      this.buildActionPointsSheet(),
      this.buildBeneficiariesSheet(),
      this.buildCfrmSheet(),
      this.buildLessonsSheet(),
      this.buildCaseStudiesSheet(),
      this.buildNepalGeoHierarchySheet(),
      this.buildEvidenceArchiveSheet(),
      this.buildAdminConfigSheet()
    ];
  }

  getOfflineTemplateSheets(): ExcelSheetData[] {
    return [
      this.buildFieldGuideSheet(),
      this.buildFieldCollectionFormSheet(),
      this.buildLiveKpiDashboardSheet(),
      this.buildNepalGeoHierarchySheet()
    ];
  }

  // ---------------------------------------------------------------------------
  // SHEET BUILDERS (Returns clean ExcelSheetData for both export & in-app preview)
  // ---------------------------------------------------------------------------

  buildSystemOverviewSheet(): ExcelSheetData {
    const stats = this.mealService.summaryStats();
    const org = this.mealService.orgProfile();
    const headers = ['Portfolio Metric / Parameter', 'Current Value / Status', 'Verification Standard'];
    const rows: (string | number)[][] = [
      ['System Name', 'MEAL Suite Enterprise Platform', 'Central Repository'],
      ['Organization Name', org.name, 'Registered Entity'],
      ['Acronym', org.acronym, 'Short Code'],
      ['Country Office', org.countryOffice, 'Administrative Hub'],
      ['Compliance Frameworks', org.complianceFrameworks.join('; '), 'Mandatory Compliance'],
      ['Total Active Projects', this.mealService.projects().length, 'Multi-Donor Portfolio'],
      ['Total Direct Beneficiaries Reached', stats.totalBeneficiaries, 'DQA Verified Registry'],
      ['Average Quality Benchmark Compliance', `${stats.avgQualityScore}%`, 'Minimum Target >= 85%'],
      ['Total CFRM Complaints Logged', stats.totalComplaints, 'Community Feedback Loop'],
      ['CFRM Resolution Rate', `${stats.resolutionRate}%`, 'Target >= 95%'],
      ['Export Date & Timestamp', new Date().toISOString(), 'Audit Stamp']
    ];

    return {
      sheetName: '00_System_Overview',
      sheetTitle: 'Institutional System Overview & Portfolio Metrics',
      sheetSubtitle: 'High-level executive indicators, donor compliance baseline, and audit timestamps',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Overview'
    };
  }

  buildProjectsSheet(): ExcelSheetData {
    const headers = [
      'Project Code', 'Project Name', 'Donor Agency', 'Total Budget',
      'Start Date', 'End Date', 'Districts Covered', 'Focus Areas',
      'Target Beneficiaries', 'Reached Beneficiaries', 'Project Manager', 'Overall Status'
    ];
    const rows = this.mealService.projects().map(p => [
      p.code,
      p.name,
      p.donor,
      p.budget,
      p.startDate,
      p.endDate,
      p.districts.join(', '),
      p.focusAreas.join(', '),
      p.targetBeneficiaries,
      p.reachedBeneficiaries,
      p.manager,
      p.status
    ]);

    return {
      sheetName: '01_Projects_Portfolio',
      sheetTitle: 'Multi-Project Portfolio Master Registry',
      sheetSubtitle: 'Approved development projects, donor agencies, budgets, and district coverage',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Projects'
    };
  }

  buildLogframeSheet(): ExcelSheetData {
    const indicators = this.mealService.filteredIndicators();
    const headers = [
      'Indicator Code', 'Indicator Title', 'LogFrame Level', 'Unit of Measure',
      'Baseline', 'Target Annual', 'Target LOP', 'Actual Q3', 'Actual Total (Cum.)',
      'Achievement %', 'Reporting Freq.', 'Means of Verification (MoV)', 'Data Source',
      'Responsible MEAL Lead', 'Status', 'Female', 'Male', 'PWD', 'Marginalized', 'Youth'
    ];

    const rows = indicators.map(ind => [
      ind.code,
      ind.title,
      ind.level,
      ind.unit,
      ind.baseline,
      ind.targetAnnual,
      ind.targetLOP,
      ind.actualQuarter,
      ind.actualTotal,
      `${ind.progressPercent}%`,
      ind.frequency,
      ind.meansOfVerification,
      ind.dataSource,
      ind.responsibleOfficer,
      ind.status.toUpperCase(),
      ind.disaggregation.female,
      ind.disaggregation.male,
      ind.disaggregation.pwd,
      ind.disaggregation.marginalized,
      ind.disaggregation.youth
    ]);

    return {
      sheetName: '02_Logframe_PIRS',
      sheetTitle: 'Logframe & Performance Indicator Reference Matrix (PIRS)',
      sheetSubtitle: 'USAID/FCDO standard PIRS indicators, targets, actual progress, and demographic disaggregations',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Logframe'
    };
  }

  buildGanttSheet(): ExcelSheetData {
    const activities = this.mealService.ganttActivities();
    const headers = [
      'Activity Code', 'Activity Name', 'Project Component', 'Start Date',
      'End Date', 'Progress %', 'Status', 'Lead Assignee', 'Budget Allocated (USD)',
      'Key Milestone', 'Deliverable Target', 'Dependencies'
    ];

    const rows = activities.map(act => [
      act.code,
      act.name,
      act.component,
      act.startDate,
      act.endDate,
      `${act.progressPercent}%`,
      act.status,
      act.assignee,
      act.budgetAllocated,
      act.isMilestone ? 'YES' : 'NO',
      act.deliverableTarget || 'N/A',
      act.dependencies ? act.dependencies.join(', ') : 'None'
    ]);

    return {
      sheetName: '03_Gantt_Workplan',
      sheetTitle: 'Annual Operational Workplan & Milestone Schedule',
      sheetSubtitle: 'Detailed quarterly timeline, activity milestones, progress %, budget, and assignees',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Workplan'
    };
  }

  buildFieldVisitsSummarySheet(): ExcelSheetData {
    const visits = this.mealService.filteredFieldVisits();
    const headers = [
      'Visit Code', 'Project ID', 'Visit Date', 'Province', 'District',
      'Municipality', 'Ward', 'MEAL Monitor', 'Role / Designation',
      'Quality Compliance %', 'Status', 'Objectives', 'Total Checkpoints',
      'Checkpoints Passed', 'Open Action Points'
    ];

    const rows = visits.map(v => [
      v.visitCode,
      v.projectId,
      v.visitDate,
      v.location.province,
      v.location.district,
      v.location.municipality,
      v.location.ward,
      v.monitorName,
      v.role,
      `${v.qualityScorePercent}%`,
      v.status,
      v.objectives,
      v.checklists.length,
      v.checklists.filter(c => c.passed).length,
      v.actionPoints.filter(a => a.status !== 'Resolved').length
    ]);

    return {
      sheetName: '04_Field_Visits_Summary',
      sheetTitle: 'Field Monitoring Missions & Quality Benchmark Audits',
      sheetSubtitle: 'On-site technical audits, quality scores, compliance ratings, and geographic coordinates',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Monitoring'
    };
  }

  buildQualityCheckpointsSheet(): ExcelSheetData {
    const visits = this.mealService.filteredFieldVisits();
    const headers = ['Visit Code', 'District', 'Municipality', 'Category', 'Quality Checkpoint', 'Audit Result', 'Field Observation'];
    const rows: (string | number)[][] = [];

    for (const v of visits) {
      for (const c of v.checklists) {
        rows.push([
          v.visitCode,
          v.location.district,
          v.location.municipality,
          c.category,
          c.title,
          c.passed ? 'PASSED' : 'NON-COMPLIANT',
          c.observation
        ]);
      }
    }

    return {
      sheetName: '04b_Quality_Checkpoints',
      sheetTitle: 'Field Technical Quality Checkpoint Audits',
      sheetSubtitle: 'Detailed engineering, safety, and inclusion checklist results',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Monitoring'
    };
  }

  buildActionPointsSheet(): ExcelSheetData {
    const visits = this.mealService.filteredFieldVisits();
    const headers = ['Visit Code', 'District', 'Action Item / Corrective Measure', 'Focal Assignee', 'Deadline', 'Status'];
    const rows: string[][] = [];

    for (const v of visits) {
      for (const a of v.actionPoints) {
        rows.push([
          v.visitCode,
          v.location.district,
          a.action,
          a.assignee,
          a.deadline,
          a.status
        ]);
      }
    }

    return {
      sheetName: '04c_Action_Points_Tracker',
      sheetTitle: 'Monitoring Corrective Action Points & Escalation Log',
      sheetSubtitle: 'Time-bound corrective actions assigned during on-site inspections',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Monitoring'
    };
  }

  buildBeneficiariesSheet(): ExcelSheetData {
    const beneficiaries = this.mealService.filteredBeneficiaries();
    const headers = [
      'Beneficiary Code', 'Full Name', 'Gender', 'Age', 'Vulnerabilities',
      'National Citizenship ID', 'Contact Phone', 'District', 'Municipality / Palika',
      'Ward', 'Intervention / Activity', 'DQA Status', 'Verified Date', 'Verified By', 'Audit Notes'
    ];

    const rows = beneficiaries.map(b => [
      b.beneficiaryCode,
      b.fullName,
      b.gender,
      b.age,
      b.vulnerabilities.join(', '),
      b.citizenshipNumber,
      b.phoneNumber,
      b.district,
      b.municipality,
      b.ward,
      b.intervention,
      b.verificationStatus,
      b.verifiedDate || 'Pending',
      b.verifiedBy || 'Pending',
      b.dqaNotes || ''
    ]);

    return {
      sheetName: '05_Beneficiaries_DQA',
      sheetTitle: 'Beneficiary Verification & Data Quality Assessment (DQA) Registry',
      sheetSubtitle: 'Deduplicated participant registry with national ID verification, gender, and social inclusion tags',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Beneficiaries'
    };
  }

  buildCfrmSheet(): ExcelSheetData {
    const tickets = this.mealService.filteredComplaints();
    const headers = [
      'Ticket Code', 'Project ID', 'Date Received', 'Intake Channel',
      'Complainant Name', 'Contact Info', 'District', 'Municipality', 'Ward',
      'Category', 'Urgency Level', 'Investigation Status', 'Complaint Summary',
      'Investigation Findings', 'Resolution Summary', 'Complainant Notified'
    ];

    const rows = tickets.map(t => [
      t.ticketNumber,
      t.projectId,
      t.submissionDate,
      t.channel,
      t.complainantName || (t.isAnonymous ? 'Anonymous' : 'Confidential'),
      t.contactNumber || 'N/A',
      t.district,
      t.municipality,
      t.ward,
      t.category,
      t.urgency,
      t.status,
      t.description,
      t.investigationNotes || 'Pending',
      t.resolutionSummary || 'Unresolved',
      t.feedbackGivenToComplainant ? 'YES' : 'NO'
    ]);

    return {
      sheetName: '06_CFRM_Safeguarding',
      sheetTitle: 'Accountability, CFRM & Safeguarding Incident Register',
      sheetSubtitle: 'Core Humanitarian Standard (CHS) complaint handling and survivor-centered response tracking',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Accountability'
    };
  }

  buildLessonsSheet(): ExcelSheetData {
    const lessons = this.mealService.lessonsLearned();
    const headers = [
      'Lesson Code', 'Title', 'Thematic Area', 'Context & Background',
      'Challenge Faced', 'Lesson Discovered', 'Actionable Recommendation', 'Author / Focal Person', 'Date Logged'
    ];

    const rows = lessons.map(l => [
      l.id,
      l.title,
      l.thematicArea,
      l.context,
      l.challengeFaced,
      l.lessonDiscovered,
      l.actionableRecommendation,
      l.author,
      l.dateLogged
    ]);

    return {
      sheetName: '07_Lessons_Learned',
      sheetTitle: 'Adaptive Management & Lessons Learned Repository',
      sheetSubtitle: 'Systematic qualitative lessons, institutional challenges, and programmatic adaptations',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Learning'
    };
  }

  buildCaseStudiesSheet(): ExcelSheetData {
    const caseStudies = this.mealService.caseStudies();
    const headers = [
      'Case Study Title', 'Beneficiary / Community', 'Location', 'Baseline Problem',
      'Intervention Approach', 'Measurable Impact', 'Direct Quote', 'Quote Author', 'Published Date', 'Author'
    ];

    const rows = caseStudies.map(cs => [
      cs.title,
      cs.beneficiaryName,
      cs.location,
      cs.theChallenge,
      cs.theIntervention,
      cs.measurableImpact,
      cs.directQuote,
      cs.quoteAuthor,
      cs.publishedDate,
      cs.author
    ]);

    return {
      sheetName: '07b_Case_Studies',
      sheetTitle: 'Human Interest Case Studies & Impact Narratives',
      sheetSubtitle: 'Qualitative donor evidence and frontline human stories of resilience',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Learning'
    };
  }

  buildNepalGeoHierarchySheet(): ExcelSheetData {
    const headers = ['Province ID', 'Province Name', 'Capital', 'District ID', 'District Name', 'District Headquarter', 'Sample Palika'];
    const rows = this.geoService.districts().map(d => {
      const p = this.geoService.provinces().find(prov => prov.id === d.provinceId);
      return [
        d.provinceId,
        p ? p.name : '',
        p ? p.capital : '',
        d.id,
        d.name,
        d.headquarter,
        `${d.headquarter} Municipality`
      ];
    });

    return {
      sheetName: '08_Nepal_Geo_Coverage',
      sheetTitle: 'Nepal Administrative Geographic Hierarchy (All 77 Districts)',
      sheetSubtitle: 'National administrative baseline mapping across 7 Provinces and local municipalities',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Geography'
    };
  }

  buildEvidenceArchiveSheet(): ExcelSheetData {
    const indicators = this.mealService.indicators();
    const headers = ['Indicator Code', 'Indicator Title', 'LogFrame Level', 'Means of Verification (MoV)', 'Data Source', 'Responsible Officer', 'Reporting Frequency', 'Audit Status'];
    const rows = indicators.map(ind => [
      ind.code,
      ind.title,
      ind.level,
      ind.meansOfVerification,
      ind.dataSource,
      ind.responsibleOfficer,
      ind.frequency,
      ind.actualTotal >= ind.targetAnnual ? 'VERIFIED' : 'ONGOING'
    ]);

    return {
      sheetName: '09_Evidence_Archive_MoV',
      sheetTitle: 'Means of Verification (MoV) Evidence & Data Source Matrix',
      sheetSubtitle: 'Audit trail of verification sources and reporting focal leads',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Evidence'
    };
  }

  buildAdminConfigSheet(): ExcelSheetData {
    const customFields = this.mealService.customFields();
    const headers = ['Field ID', 'Target Module', 'Field Label', 'Data Type', 'Required', 'Options List', 'Disaggregation Dimension'];
    const rows = customFields.map(cf => [
      cf.id,
      cf.targetModule,
      cf.label,
      cf.fieldType,
      cf.required ? 'YES' : 'NO',
      cf.options ? cf.options.join(', ') : 'N/A',
      cf.disaggregationDimension || 'N/A'
    ]);

    return {
      sheetName: '10_Admin_Schema_Config',
      sheetTitle: 'Custom Dynamic Field Architecture & Schema Extensions',
      sheetSubtitle: 'Configured custom attributes and indicators defined via the Admin Panel',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Admin'
    };
  }

  buildFieldGuideSheet(): ExcelSheetData {
    return {
      sheetName: '00_Field_Guide_&_VBA',
      sheetTitle: 'Field Enumerator Guide & VBA Automation Script',
      sheetSubtitle: 'Detailed offline procedures, data validation standards, and macro codes',
      headers: ['Section / Parameter', 'Instruction Details / VBA Snippet'],
      rows: [
        ['Purpose', 'Offline collection template with live Excel formulas for field enumerators.'],
        ['Supported Apps', 'Microsoft Excel, Google Sheets, LibreOffice Calc, Apple Numbers'],
        ['Data Entry Rules', 'Enter data in "Field_Data_Entry". Do not change header names.'],
        ['National ID Rule', 'Citizenship IDs must match format (e.g. 27-01-72-XXXXX).'],
        ['Live Formulas', 'The "Live_KPI_Dashboard" tab computes real-time gender and caste percentages.'],
        ['VBA Macro', 'Sub ValidateAndCleanBeneficiaries() cleans and capitalizes names automatically.']
      ],
      totalRows: 6,
      totalCols: 2,
      category: 'Guide'
    };
  }

  buildFieldCollectionFormSheet(): ExcelSheetData {
    const headers = [
      'Beneficiary_Code', 'Full_Name', 'Gender', 'Age', 'Vulnerabilities',
      'Citizenship_ID', 'Contact_Phone', 'Province', 'District', 'Palika_Municipality',
      'Ward', 'Activity_Code', 'Completion_Date', 'DQA_Status', 'Enumerator_Signature'
    ];
    const rows = [
      ['BEN-2026-001', 'Sunita Thapa', 'Female', 34, 'Marginalized Janajati', '27-01-70-01923', '9841234567', 'Bagmati Province', 'Sindhupalchok', 'Chautara Sangachokgadhi', 4, 'ACT-MASON-RETR', '2026-09-18', 'Verified', 'Anil Maharjan'],
      ['BEN-2026-002', 'Bikram BK', 'Male', 29, 'Dalit Community', '27-01-72-04812', '9841987654', 'Bagmati Province', 'Sindhupalchok', 'Chautara Sangachokgadhi', 4, 'ACT-MASON-RETR', '2026-09-18', 'Verified', 'Anil Maharjan'],
      ['BEN-2026-003', 'Deepak Adhikari', 'Male', 42, 'Displaced by Hazard', '36-01-68-00431', '9811223344', 'Gandaki Province', 'Gorkha', 'Gorkha Municipality', 6, 'ACT-MASON-RETR', '2026-09-19', 'Verified', 'Sujata Shrestha'],
      ['BEN-2026-004', 'D.B. Gurung', 'Male', 51, 'Person with Disability (PWD)', '28-01-65-11029', '9851000000', 'Bagmati Province', 'Kathmandu', 'Kathmandu Metropolitan City', 16, 'ACT-SCHOOL-DRILL', '2026-09-14', 'Verified', 'Maya Tamang'],
      ['BEN-2026-005', 'Kamala Pariyar', 'Female', 28, 'Female-Headed Household', '27-01-74-05519', '9841112233', 'Bagmati Province', 'Sindhupalchok', 'Melamchi Municipality', 3, 'ACT-WASH-HYGIENE', '2026-09-20', 'Verified', 'Ramesh Dahal'],
      ['BEN-2026-006', 'Pemba Sherpa', 'Male', 37, 'Remote Mountain Community', '29-01-71-00281', '9801234567', 'Koshi Province', 'Solukhumbu', 'Solududhkunda Municipality', 2, 'ACT-RETRO-CLINIC', '2026-09-21', 'Verified', 'Tshering Lama']
    ];
    return {
      sheetName: 'Field_Data_Entry',
      sheetTitle: 'Field Beneficiary Collection Register',
      sheetSubtitle: 'Pre-formatted columns with Nepal administrative hierarchy and sample rows',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Data Entry'
    };
  }

  buildLiveKpiDashboardSheet(): ExcelSheetData {
    const headers = ['Metric Description', 'Formula Calculation / Value', 'Target Benchmark'];
    const rows = [
      ['Total Beneficiaries Logged', '=COUNTA(Field_Data_Entry!A6:A100)', 'Project Target: 1,500'],
      ['Total Female Beneficiaries', '=COUNTIF(Field_Data_Entry!C6:C100, "Female")', 'Target: >= 40%'],
      ['Total Male Beneficiaries', '=COUNTIF(Field_Data_Entry!C6:C100, "Male")', 'Inclusive Participation'],
      ['Total Other / Non-Binary', '=COUNTIF(Field_Data_Entry!C6:C100, "Other")', 'Zero Exclusion'],
      ['Female Participation Rate %', '=(COUNTIF(Field_Data_Entry!C6:C100, "Female")/COUNTA(Field_Data_Entry!A6:A100))*100', 'Minimum 40.0%'],
      ['DQA Verified Count', '=COUNTIF(Field_Data_Entry!N6:N100, "Verified")', 'DQA Audit Status'],
      ['DQA Flagged for Follow-up', '=COUNTIF(Field_Data_Entry!N6:N100, "Flagged for Follow-up")', 'Action Required']
    ];
    return {
      sheetName: 'Live_KPI_Dashboard',
      sheetTitle: 'Automated Offline KPI & Disaggregation Formulas',
      sheetSubtitle: 'Real working Excel formulas calculating metrics without an internet connection',
      headers,
      rows,
      totalRows: rows.length,
      totalCols: headers.length,
      category: 'Dashboard'
    };
  }

  // ---------------------------------------------------------------------------
  // WORKBOOK PREVIEW RETRIEVAL (For the In-App Excel Viewer)
  // ---------------------------------------------------------------------------

  getAvailableWorkbooks(): ExcelWorkbookData[] {
    const masterDbSheets = this.getMasterDatabaseSheets();

    const logframeSheets = [
      this.buildLogframeSheet(),
      this.buildProjectsSheet()
    ];

    const ganttSheets = [
      this.buildGanttSheet(),
      this.buildProjectsSheet()
    ];

    const fieldVisitsSheets = [
      this.buildFieldVisitsSummarySheet(),
      this.buildQualityCheckpointsSheet(),
      this.buildActionPointsSheet()
    ];

    const beneficiarySheets = [
      this.buildBeneficiariesSheet(),
      this.buildNepalGeoHierarchySheet()
    ];

    const cfrmSheets = [
      this.buildCfrmSheet()
    ];

    const learningSheets = [
      this.buildLessonsSheet(),
      this.buildCaseStudiesSheet()
    ];

    const offlineTemplateSheets = this.getOfflineTemplateSheets();

    return [
      {
        id: 'master-database',
        title: 'Master System Database',
        filename: `MEAL_Suite_Master_Database_${this.getDateString()}.xlsx`,
        category: 'System Core',
        description: 'Complete relational database containing all 14 programmatic modules across 14 sheets.',
        totalSheets: masterDbSheets.length,
        sheets: masterDbSheets
      },
      {
        id: 'offline-template',
        title: 'Offline Field Collection Template (with Live Excel Formulas & VBA Guide)',
        filename: `MEAL_Suite_Offline_System_Template_${this.getDateString()}.xlsx`,
        category: 'Templates',
        description: 'Pre-formatted spreadsheet with live Excel disaggregation formulas, Nepal data validation lookups, and sample rows.',
        totalSheets: offlineTemplateSheets.length,
        sheets: offlineTemplateSheets
      },
      {
        id: 'gantt-workplan',
        title: 'Gantt Activity Workplan Schedule',
        filename: `MEAL_Gantt_Workplan_${this.getDateString()}.xlsx`,
        category: 'Planning',
        description: 'Operational schedule with start/end dates, progress %, milestones, and budgets.',
        totalSheets: ganttSheets.length,
        sheets: ganttSheets
      },
      {
        id: 'logframe-pirs',
        title: 'Logframe & PIRS Indicator Tracker',
        filename: `MEAL_Logframe_PIRS_Tracker_${this.getDateString()}.xlsx`,
        category: 'Monitoring',
        description: 'Full PIRS indicator registry with USAID/FCDO demographic disaggregations.',
        totalSheets: logframeSheets.length,
        sheets: logframeSheets
      },
      {
        id: 'field-visits',
        title: 'Field Monitoring & Quality Audits',
        filename: `MEAL_Field_Monitoring_QA_Audits_${this.getDateString()}.xlsx`,
        category: 'Quality Assurance',
        description: 'On-site technical audits, quality checklists, and corrective action items.',
        totalSheets: fieldVisitsSheets.length,
        sheets: fieldVisitsSheets
      },
      {
        id: 'beneficiaries-dqa',
        title: 'Beneficiary Registry & DQA Verification',
        filename: `MEAL_Beneficiary_Registry_DQA_${this.getDateString()}.xlsx`,
        category: 'Verification',
        description: 'Deduplicated participant database with citizenship numbers and audit verification tags.',
        totalSheets: beneficiarySheets.length,
        sheets: beneficiarySheets
      },
      {
        id: 'cfrm-safeguarding',
        title: 'CFRM & Safeguarding Incident Log',
        filename: `MEAL_CFRM_Safeguarding_Log_${this.getDateString()}.xlsx`,
        category: 'Accountability',
        description: 'Core Humanitarian Standard (CHS) compliant accountability and incident response register.',
        totalSheets: cfrmSheets.length,
        sheets: cfrmSheets
      },
      {
        id: 'learning-repository',
        title: 'Lessons Learned & Case Studies',
        filename: `MEAL_Learning_Repository_${this.getDateString()}.xlsx`,
        category: 'Learning',
        description: 'Thematic lessons, institutional challenges, and human-interest impact stories.',
        totalSheets: learningSheets.length,
        sheets: learningSheets
      }
    ];
  }

  getWorkbookById(id: string): ExcelWorkbookData | undefined {
    return this.getAvailableWorkbooks().find(wb => wb.id === id);
  }

  private getDateString(): string {
    return new Date().toISOString().split('T')[0];
  }
}
