import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ExcelExportService } from '../services/excel-export.service';
import { MealDataService } from '../services/meal-data.service';
import { ExcelSpreadsheetViewer } from './excel-spreadsheet-viewer';

@Component({
  selector: 'app-system-export-hub-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, ExcelSpreadsheetViewer],
  template: `
    <div class="space-y-6">
      <!-- Hero Banner -->
      <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-700/60 text-teal-200 text-xs font-semibold mb-3">
              <mat-icon class="text-xs">cloud_download</mat-icon>
              <span>Enterprise Data Export & In-App Spreadsheet Viewer</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
              System Export Hub & Excel Templates
            </h1>
            <p class="text-xs sm:text-sm text-teal-100/90 mt-2 leading-relaxed">
              Preview and audit all spreadsheets directly inside the application before downloading. Generate 100% formatted, world-class Excel workbooks (.xlsx) with institutional header banners, auto-fitted columns, frozen headers, and live disaggregation formulas.
            </p>
          </div>

          <!-- Quick System Metrics & Actions -->
          <div class="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-4 shrink-0 flex flex-col gap-2 min-w-[240px]">
            <span class="text-[11px] font-semibold text-teal-200 uppercase tracking-wider">Live System Database</span>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-black text-white">{{ mealService.summaryStats().totalBeneficiaries }}</span>
              <span class="text-xs text-teal-200">Registered Beneficiaries</span>
            </div>
            <div class="text-[11px] text-teal-100 flex items-center justify-between pt-2 border-t border-white/15">
              <span>{{ mealService.projects().length }} Active Projects</span>
              <span>·</span>
              <span>11 Data Sheets</span>
            </div>
            <button
              type="button"
              (click)="openPreview('master-database')"
              class="mt-1 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs">
              <mat-icon class="text-xs">visibility</mat-icon>
              <span>Preview Master Database</span>
            </button>
          </div>
        </div>
      </div>

      <!-- IN-APP INTERACTIVE EXCEL SPREADSHEET PREVIEWER -->
      @if (isPreviewOpen()) {
        <div #previewSection class="scroll-mt-6">
          <div class="flex items-center justify-between gap-4 mb-2">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <mat-icon class="text-sm">table_view</mat-icon>
              </span>
              <div>
                <h3 class="text-sm font-bold text-slate-800">
                  Live Excel Spreadsheet Preview
                </h3>
                <p class="text-[11px] text-slate-500">
                  Inspect sheets, audit formulas, and test column formatting before downloading.
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="isPreviewOpen.set(false)"
                class="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center gap-1 transition-colors">
                <mat-icon class="text-xs">close</mat-icon>
                <span>Hide Preview</span>
              </button>
            </div>
          </div>

          <app-excel-spreadsheet-viewer
            [initialWorkbookId]="activePreviewId()"
            [canClose]="true"
            (closeViewer)="isPreviewOpen.set(false)" />
        </div>
      }

      <!-- Master Full System Actions (Highlight Section) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 1. Master Excel DB (11 Sheets) -->
        <div class="bg-white border-2 border-teal-800/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="w-10 h-10 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center font-bold">
                <mat-icon class="text-lg">dataset</mat-icon>
              </span>
              <span class="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold">
                MASTER WORKBOOK
              </span>
            </div>
            <h3 class="text-base font-bold text-slate-900 tracking-tight">
              Complete System Database (.xlsx)
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Consolidated 11-sheet master workbook containing Overview, Projects, Logframe, Gantt, Field Visits, Beneficiaries, CFRM, Lessons, Nepal Geo, MoV Evidence, and Admin Schema.
            </p>
          </div>

          <div class="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              (click)="openPreview('master-database')"
              class="flex-1 py-2 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-900 font-semibold text-xs rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-1.5">
              <mat-icon class="text-xs">visibility</mat-icon>
              <span>Preview</span>
            </button>
            <button
              type="button"
              (click)="exportFullDatabase()"
              class="flex-1 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5">
              <mat-icon class="text-xs">download</mat-icon>
              <span>Download (.xlsx)</span>
            </button>
          </div>
        </div>

        <!-- 2. Offline Field Collection Template -->
        <div class="bg-white border-2 border-emerald-800/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                <mat-icon class="text-lg">integration_instructions</mat-icon>
              </span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                FORMULAS & TEMPLATES
              </span>
            </div>
            <h3 class="text-base font-bold text-slate-900 tracking-tight">
              Offline Field Collection Template
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              World-class formatted template with live Excel formulas, Nepal administrative validation lookups, sample rows, and ready-to-use VBA macro script for offline enumerators.
            </p>
          </div>

          <div class="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              (click)="openPreview('offline-template')"
              class="flex-1 py-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-semibold text-xs rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-1.5">
              <mat-icon class="text-xs">visibility</mat-icon>
              <span>Preview</span>
            </button>
            <button
              type="button"
              (click)="downloadOfflineTemplateXlsx()"
              class="flex-1 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5">
              <mat-icon class="text-xs">download</mat-icon>
              <span>Download (.xlsx)</span>
            </button>
          </div>
        </div>

        <!-- 3. Complete System ZIP Archive -->
        <div class="bg-white border-2 border-indigo-800/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold">
                <mat-icon class="text-lg">folder_zip</mat-icon>
              </span>
              <span class="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-bold">
                FULL BUNDLE (.ZIP)
              </span>
            </div>
            <h3 class="text-base font-bold text-slate-900 tracking-tight">
              Complete System Backup Archive (.zip)
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Bundles all individual module workbooks, the Master Database, the Field Template, system schemas, and the Field Deployment Manual in one compressed download.
            </p>
          </div>

          <div class="mt-5 pt-4 border-t border-slate-100">
            <button
              type="button"
              (click)="downloadSystemZip()"
              class="w-full py-2 bg-indigo-800 hover:bg-indigo-900 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2">
              <mat-icon class="text-xs">archive</mat-icon>
              <span>Download Full Package (.zip)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Individual Module Exports Section with Live Preview & Download -->
      <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div class="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 class="text-lg font-bold text-slate-900 tracking-tight">
              Individual Module Spreadsheets
            </h2>
            <p class="text-xs text-slate-500">
              Preview before downloading isolated, donor-formatted spreadsheets with institutional header blocks and frozen panes.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Module 1: Gantt Workplan -->
          <div class="border border-slate-200 rounded-xl p-4 hover:border-teal-700 transition-colors flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
                  <mat-icon class="text-sm">view_timeline</mat-icon>
                </span>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">Gantt Workplan Schedule</h4>
                  <span class="text-[10px] text-slate-400">{{ mealService.ganttActivities().length }} scheduled activities</span>
                </div>
              </div>
              <p class="text-[11px] text-slate-500">
                Quarterly timeline, milestones, progress %, deliverable targets, and budget breakdowns.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                (click)="openPreview('gantt-workplan')"
                class="flex-1 py-1.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-900 font-semibold text-xs rounded-lg transition-colors border border-slate-200 flex items-center justify-center gap-1">
                <mat-icon class="text-xs">visibility</mat-icon>
                <span>Preview</span>
              </button>
              <button
                type="button"
                (click)="excelService.exportGanttToExcel()"
                class="flex-1 py-1.5 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1">
                <mat-icon class="text-xs">file_download</mat-icon>
                <span>Export (.xlsx)</span>
              </button>
            </div>
          </div>

          <!-- Module 2: Logframe & Indicators -->
          <div class="border border-slate-200 rounded-xl p-4 hover:border-teal-700 transition-colors flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                  <mat-icon class="text-sm">account_tree</mat-icon>
                </span>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">Logframe & PIRS Tracker</h4>
                  <span class="text-[10px] text-slate-400">{{ mealService.indicators().length }} indicators</span>
                </div>
              </div>
              <p class="text-[11px] text-slate-500">
                PIRS sheets with disaggregation (gender, caste, disability), baselines, and cumulative targets.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                (click)="openPreview('logframe-pirs')"
                class="flex-1 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 font-semibold text-xs rounded-lg transition-colors border border-slate-200 flex items-center justify-center gap-1">
                <mat-icon class="text-xs">visibility</mat-icon>
                <span>Preview</span>
              </button>
              <button
                type="button"
                (click)="excelService.exportLogframeToExcel()"
                class="flex-1 py-1.5 bg-blue-800 hover:bg-blue-900 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1">
                <mat-icon class="text-xs">file_download</mat-icon>
                <span>Export (.xlsx)</span>
              </button>
            </div>
          </div>

          <!-- Module 3: Field Monitoring & QA -->
          <div class="border border-slate-200 rounded-xl p-4 hover:border-teal-700 transition-colors flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  <mat-icon class="text-sm">fact_check</mat-icon>
                </span>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">Field Monitoring QA Audits</h4>
                  <span class="text-[10px] text-slate-400">{{ mealService.fieldVisits().length }} audit missions</span>
                </div>
              </div>
              <p class="text-[11px] text-slate-500">
                Multi-sheet workbook with site visits summary, quality checkpoints, and open action points.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                (click)="openPreview('field-visits')"
                class="flex-1 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-semibold text-xs rounded-lg transition-colors border border-slate-200 flex items-center justify-center gap-1">
                <mat-icon class="text-xs">visibility</mat-icon>
                <span>Preview</span>
              </button>
              <button
                type="button"
                (click)="excelService.exportFieldVisitsToExcel()"
                class="flex-1 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1">
                <mat-icon class="text-xs">file_download</mat-icon>
                <span>Export (.xlsx)</span>
              </button>
            </div>
          </div>

          <!-- Module 4: Beneficiary Registry DQA -->
          <div class="border border-slate-200 rounded-xl p-4 hover:border-teal-700 transition-colors flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="w-8 h-8 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
                  <mat-icon class="text-sm">people</mat-icon>
                </span>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">Beneficiary Registry (DQA)</h4>
                  <span class="text-[10px] text-slate-400">{{ mealService.beneficiaries().length }} registered participants</span>
                </div>
              </div>
              <p class="text-[11px] text-slate-500">
                Deduplicated participant registry with national IDs, vulnerable group flags, and DQA audit tags.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                (click)="openPreview('beneficiaries-dqa')"
                class="flex-1 py-1.5 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-900 font-semibold text-xs rounded-lg transition-colors border border-slate-200 flex items-center justify-center gap-1">
                <mat-icon class="text-xs">visibility</mat-icon>
                <span>Preview</span>
              </button>
              <button
                type="button"
                (click)="excelService.exportBeneficiariesToExcel()"
                class="flex-1 py-1.5 bg-purple-800 hover:bg-purple-900 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1">
                <mat-icon class="text-xs">file_download</mat-icon>
                <span>Export (.xlsx)</span>
              </button>
            </div>
          </div>

          <!-- Module 5: CFRM & Safeguarding -->
          <div class="border border-slate-200 rounded-xl p-4 hover:border-teal-700 transition-colors flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                  <mat-icon class="text-sm">support_agent</mat-icon>
                </span>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">CFRM Safeguarding Log</h4>
                  <span class="text-[10px] text-slate-400">{{ mealService.complaints().length }} accountability tickets</span>
                </div>
              </div>
              <p class="text-[11px] text-slate-500">
                CHS complaint handling log with investigation notes, urgency triage, and resolution status.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                (click)="openPreview('cfrm-safeguarding')"
                class="flex-1 py-1.5 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 font-semibold text-xs rounded-lg transition-colors border border-slate-200 flex items-center justify-center gap-1">
                <mat-icon class="text-xs">visibility</mat-icon>
                <span>Preview</span>
              </button>
              <button
                type="button"
                (click)="excelService.exportCfrmToExcel()"
                class="flex-1 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1">
                <mat-icon class="text-xs">file_download</mat-icon>
                <span>Export (.xlsx)</span>
              </button>
            </div>
          </div>

          <!-- Module 6: Learning & Case Studies -->
          <div class="border border-slate-200 rounded-xl p-4 hover:border-teal-700 transition-colors flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center font-bold">
                  <mat-icon class="text-sm">lightbulb</mat-icon>
                </span>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">Learning Repository</h4>
                  <span class="text-[10px] text-slate-400">{{ mealService.lessonsLearned().length }} lessons, {{ mealService.caseStudies().length }} case studies</span>
                </div>
              </div>
              <p class="text-[11px] text-slate-500">
                Lessons learned and qualitative human impact case studies formatted for donor reporting.
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                (click)="openPreview('learning-repository')"
                class="flex-1 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-900 font-semibold text-xs rounded-lg transition-colors border border-slate-200 flex items-center justify-center gap-1">
                <mat-icon class="text-xs">visibility</mat-icon>
                <span>Preview</span>
              </button>
              <button
                type="button"
                (click)="excelService.exportLearningToExcel()"
                class="flex-1 py-1.5 bg-rose-800 hover:bg-rose-900 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1">
                <mat-icon class="text-xs">file_download</mat-icon>
                <span>Export (.xlsx)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Macro & VBA Script Integration Guide Card -->
      <div class="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div class="flex items-center justify-between gap-4 mb-4">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
              <mat-icon class="text-base">terminal</mat-icon>
            </span>
            <div>
              <h3 class="text-base font-bold text-white tracking-tight">
                VBA Automation Engine & Offline Data Cleansing
              </h3>
              <p class="text-xs text-slate-400">
                Complete instructions for field officers using the offline template without internet connectivity.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="downloadMacroTemplateXlsm()"
              class="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 rounded-lg transition-colors flex items-center gap-1.5">
              <mat-icon class="text-xs">file_download</mat-icon>
              <span>Download (.xlsm)</span>
            </button>
            <button
              type="button"
              (click)="toggleVbaCode()"
              class="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5">
              <mat-icon class="text-xs">{{ showVbaCode() ? 'visibility_off' : 'code' }}</mat-icon>
              <span>{{ showVbaCode() ? 'Hide VBA Code' : 'View VBA Code' }}</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="bg-slate-800/60 rounded-xl p-4 border border-slate-800">
            <span class="text-emerald-400 font-mono font-bold text-xs block mb-1">01. Live Excel Formulas</span>
            <p class="text-slate-400 text-[11px] leading-relaxed">
              Formulas calculate disaggregation percentages, gender ratios, and DQA accuracy automatically in Excel offline.
            </p>
          </div>

          <div class="bg-slate-800/60 rounded-xl p-4 border border-slate-800">
            <span class="text-emerald-400 font-mono font-bold text-xs block mb-1">02. Automated Cleaning Macro</span>
            <p class="text-slate-400 text-[11px] leading-relaxed">
              Trims whitespace from phone numbers, standardizes citizenship IDs, and highlights invalid Ward entries in red.
            </p>
          </div>

          <div class="bg-slate-800/60 rounded-xl p-4 border border-slate-800">
            <span class="text-emerald-400 font-mono font-bold text-xs block mb-1">03. 100% Reliable File Delivery</span>
            <p class="text-slate-400 text-[11px] leading-relaxed">
              Files are generated with matching MIME types and standard OpenXML structure, opening cleanly in Excel, Google Sheets, or Calc.
            </p>
          </div>
        </div>

        @if (showVbaCode()) {
          <div class="mt-5 pt-4 border-t border-slate-800">
            <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span>MEAL_Suite_Offline_Engine.bas (Embedded VBA Module)</span>
              <span class="text-emerald-400">Syntax: Visual Basic for Applications 7.1</span>
            </div>
            <pre class="bg-slate-950 p-4 rounded-xl text-emerald-300 font-mono text-[11px] overflow-x-auto border border-slate-800 max-h-60 leading-relaxed">
' ==============================================================================
' MEAL SUITE — OFFLINE FIELD COMPILER & VALIDATOR
' ==============================================================================
Sub ValidateAndCleanBeneficiaries()
    Dim ws As Worksheet: Set ws = ThisWorkbook.Sheets("Field_Data_Entry")
    Dim lastRow As Long: lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    Dim r As Long, cleanCount As Long: cleanCount = 0
    
    For r = 6 To lastRow
        ' Trim extra whitespace from citizenship & phone
        ws.Cells(r, 6).Value = Trim(ws.Cells(r, 6).Value)
        ws.Cells(r, 7).Value = Replace(Replace(ws.Cells(r, 7).Value, "-", ""), " ", "")
        
        ' Flag invalid Nepal Ward numbers (> 35)
        If Val(ws.Cells(r, 11).Value) < 1 Or Val(ws.Cells(r, 11).Value) > 35 Then
            ws.Cells(r, 11).Interior.Color = RGB(255, 200, 200)
        End If
        cleanCount = cleanCount + 1
    Next r
    MsgBox "MEAL Validation completed for " & (lastRow - 5) & " records!", vbInformation, "MEAL Suite Offline Engine"
End Sub
            </pre>
          </div>
        }
      </div>
    </div>
  `
})
export class SystemExportHubView {
  readonly mealService = inject(MealDataService);
  readonly excelService = inject(ExcelExportService);

  @ViewChild('previewSection') previewSection?: ElementRef<HTMLDivElement>;

  readonly showVbaCode = signal<boolean>(false);
  readonly isPreviewOpen = signal<boolean>(true); // Pre-open so users immediately see the preview capability
  readonly activePreviewId = signal<string>('master-database');

  toggleVbaCode() {
    this.showVbaCode.update(v => !v);
  }

  openPreview(workbookId: string) {
    this.activePreviewId.set(workbookId);
    this.isPreviewOpen.set(true);

    setTimeout(() => {
      if (this.previewSection) {
        this.previewSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  exportFullDatabase() {
    this.excelService.downloadFullDatabaseExcel();
  }

  downloadOfflineTemplateXlsx() {
    this.excelService.downloadMacroEnabledTemplate(false);
  }

  downloadMacroTemplateXlsm() {
    this.excelService.downloadMacroEnabledTemplate(true);
  }

  downloadSystemZip() {
    this.excelService.downloadCompleteSystemZip();
  }
}
