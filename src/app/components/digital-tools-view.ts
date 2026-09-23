import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { DigitalForm } from '../models/meal.model';

@Component({
  selector: 'app-digital-tools-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Digital MEAL Infrastructure</span>
            <span aria-hidden="true">·</span>
            <span>Mobile Data Collection & XLSForm Hub</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            KoboToolbox, ODK & Digital Platform Hub
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">
            Manage mobile data collection forms (XLSForm/Enketo), test field interviewers with live simulation, and batch validate Excel/CSV datasets.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            (click)="activeSubTab.set('forms')"
            [class]="activeSubTab() === 'forms' ? 'bg-teal-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
            <mat-icon class="text-xs">dynamic_form</mat-icon>
            <span>Surveys & XLSForms</span>
          </button>
          <button
            type="button"
            (click)="activeSubTab.set('emulator')"
            [class]="activeSubTab() === 'emulator' ? 'bg-teal-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
            <mat-icon class="text-xs">phone_android</mat-icon>
            <span>Live Web Form</span>
          </button>
          <button
            type="button"
            (click)="activeSubTab.set('excel-validator')"
            [class]="activeSubTab() === 'excel-validator' ? 'bg-teal-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
            <mat-icon class="text-xs">table_view</mat-icon>
            <span>Excel Validator</span>
          </button>
        </div>
      </div>

      <!-- Tab 1: Surveys & XLSForm Inventory -->
      @if (activeSubTab() === 'forms') {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Forms List -->
          <div class="space-y-3">
            <div class="flex items-center justify-between px-1 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <span>Configured Digital Forms ({{ mealService.digitalForms().length }})</span>
              <span>All Active</span>
            </div>

            @for (form of mealService.digitalForms(); track form.id) {
              <div
                (click)="selectedForm.set(form)"
                [class]="selectedForm()?.id === form.id ? 'border-teal-800 ring-1 ring-teal-800 bg-teal-50/20' : 'border-slate-200 bg-white hover:border-slate-300'"
                class="border rounded-xl p-4 cursor-pointer transition-all shadow-2xs space-y-2">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-[11px] font-mono font-bold text-teal-900">{{ form.toolType }} · {{ form.formCategory }}</span>
                    <h3 class="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5 leading-snug">{{ form.title }}</h3>
                  </div>
                  <span class="text-[11px] font-mono text-slate-500">{{ form.version }}</span>
                </div>

                <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span class="font-mono tabular-nums">
                    Submissions: <strong class="text-slate-900">{{ form.submissionsCount | number }}</strong>
                  </span>
                  <span>Sync: {{ form.lastSyncDate }}</span>
                </div>
              </div>
            }
          </div>

          <!-- Form Structure & XLSForm Inspector -->
          <div class="lg:col-span-2">
            @if (selectedForm(); as form) {
              <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div class="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
                      <span>Platform: {{ form.toolType }}</span>
                      <span>·</span>
                      <span>Category: {{ form.formCategory }}</span>
                      <span>·</span>
                      <span>Version: {{ form.version }}</span>
                    </div>
                    <h2 class="text-lg font-bold text-slate-900">{{ form.title }}</h2>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="downloadXlsForm(form)"
                      class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs">
                      <mat-icon class="text-xs">download</mat-icon>
                      <span>Download XLSForm Schema</span>
                    </button>
                  </div>
                </div>

                <!-- Fields Schema Table -->
                <div>
                  <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Form Schema & Question Variables ({{ form.fields.length }} Fields)
                  </h3>

                  <div class="border border-slate-200 rounded-lg overflow-hidden">
                    <table class="w-full text-left text-xs">
                      <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                        <tr>
                          <th class="py-2.5 px-3">Variable Name</th>
                          <th class="py-2.5 px-3">Question Label (En/Np)</th>
                          <th class="py-2.5 px-3">Field Type</th>
                          <th class="py-2.5 px-3">Constraints & Options</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        @for (fld of form.fields; track fld.name) {
                          <tr>
                            <td class="py-2.5 px-3 font-mono font-semibold text-teal-950">{{ fld.name }}</td>
                            <td class="py-2.5 px-3 text-slate-800 font-medium">{{ fld.label }}</td>
                            <td class="py-2.5 px-3 font-mono text-slate-600">
                              <span class="px-1.5 py-0.5 bg-slate-100 rounded text-[11px]">{{ fld.type }}</span>
                            </td>
                            <td class="py-2.5 px-3 text-slate-600 text-[11px]">
                              @if (fld.options) {
                                <span>Choices: {{ fld.options.join(' | ') }}</span>
                              } @else {
                                <span class="text-slate-400">Required: {{ fld.required ? 'yes' : 'no' }}</span>
                              }
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- API Connector Metadata -->
                <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
                  <span class="font-semibold text-slate-800 flex items-center gap-1.5">
                    <mat-icon class="text-xs text-teal-800">sync</mat-icon>
                    KoboToolbox & ODK API Endpoint Configuration
                  </span>
                  <div class="font-mono text-[11px] text-slate-600 bg-white p-2.5 rounded border border-slate-200 space-y-1">
                    <div>SERVER: <code>https://kf.kobotoolbox.org/api/v2/assets/aMEAL2026_PDM/data.json</code></div>
                    <div>ODK ENDPOINT: <code>https://central.mealsuite.org/v1/projects/4/forms/rapid_damage_v4</code></div>
                    <div>AUTOMATIC SYNC: Scheduled daily at 02:00 NPT · Zero data loss buffer</div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Tab 2: Live Mobile Interviewer Web Emulator -->
      @if (activeSubTab() === 'emulator') {
        <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs max-w-2xl mx-auto space-y-5">
          <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <span class="text-[11px] font-mono font-bold text-teal-800 uppercase">Enketo Web Form Preview</span>
              <h2 class="text-base font-bold text-slate-900">Post-Distribution Monitoring (PDM) - Field Entry</h2>
              <p class="text-xs text-slate-500">Test data entry workflow as experienced by field MEAL enumerators on tablets.</p>
            </div>
            <mat-icon class="text-slate-400">tablet_mac</mat-icon>
          </div>

          <form [formGroup]="emulatorForm" (ngSubmit)="submitEmulator()" class="space-y-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Beneficiary National ID / Reg Number *</label>
              <input
                type="text"
                formControlName="beneficiaryId"
                placeholder="27-01-72-XXXXX"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-teal-700" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Municipality *</label>
                <select
                  formControlName="municipality"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700">
                  <option value="Chautara Sangachokgadhi">Chautara Sangachokgadhi</option>
                  <option value="Gorkha Municipality">Gorkha Municipality</option>
                  <option value="Nilkantha Municipality">Nilkantha Municipality</option>
                  <option value="Melamchi Municipality">Melamchi Municipality</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Ward Number *</label>
                <input
                  type="number"
                  formControlName="ward"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-teal-700" />
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Did you receive all items in the mason toolkit voucher? *</label>
              <select
                formControlName="toolkitReceived"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700">
                <option value="Yes, complete set">Yes, complete set (Trowel, plumb bob, spirit level, rebar bender)</option>
                <option value="Partial set">Partial set (Some items pending delivery)</option>
                <option value="Damaged items">Damaged items observed upon opening</option>
                <option value="No, not received">No, voucher not yet redeemed</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">How would you rate the quality and usability of tools? *</label>
              <div class="grid grid-cols-4 gap-2 pt-1">
                <label class="flex items-center gap-1.5 p-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="radio" formControlName="qualityRating" value="Excellent" />
                  <span>Excellent</span>
                </label>
                <label class="flex items-center gap-1.5 p-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="radio" formControlName="qualityRating" value="Good" />
                  <span>Good</span>
                </label>
                <label class="flex items-center gap-1.5 p-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="radio" formControlName="qualityRating" value="Adequate" />
                  <span>Adequate</span>
                </label>
                <label class="flex items-center gap-1.5 p-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                  <input type="radio" formControlName="qualityRating" value="Poor" />
                  <span>Poor</span>
                </label>
              </div>
            </div>

            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <span class="text-slate-600 font-mono text-[11px]">GPS Geopoint (Auto-acquired): 27.7812° N, 85.7145° E (±3m)</span>
              <span class="text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                <mat-icon class="text-xs">gps_fixed</mat-icon>
                Locked
              </span>
            </div>

            @if (emulatorSuccessMessage()) {
              <div class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-lg flex items-center gap-2 animate-in fade-in">
                <mat-icon class="text-emerald-700 text-sm">check_circle</mat-icon>
                <span>Submission queued and synchronized with KoboToolbox server successfully!</span>
              </div>
            }

            <div class="flex justify-end pt-2">
              <button
                type="submit"
                [disabled]="emulatorForm.invalid"
                class="px-5 py-2 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5">
                <mat-icon class="text-xs">send</mat-icon>
                <span>Submit Field Response</span>
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Tab 3: Excel & CSV Batch Data Validator -->
      @if (activeSubTab() === 'excel-validator') {
        <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
          <div>
            <span class="text-[11px] font-mono font-bold text-teal-800 uppercase">Data Hygiene Engine</span>
            <h2 class="text-base font-bold text-slate-900">Excel / CSV Batch Cleaning & Header Validator</h2>
            <p class="text-xs text-slate-500">Pre-check raw assessment files before merging into official project databases.</p>
          </div>

          <div class="border-2 border-dashed border-slate-300 hover:border-teal-700 rounded-xl p-8 text-center bg-slate-50/50 transition-colors cursor-pointer">
            <mat-icon class="text-4xl text-slate-400 mb-2">upload_file</mat-icon>
            <h4 class="text-sm font-semibold text-slate-800">Upload Assessment Spreadsheet (.xlsx or .csv)</h4>
            <p class="text-xs text-slate-500 mt-1">Accepts standard KoboToolbox and ODK export files with geopoint headers.</p>
            <div class="mt-4 flex justify-center gap-2">
              <button
                type="button"
                (click)="loadDemoDataset()"
                class="px-3 py-1.5 bg-teal-900 text-white text-xs font-semibold rounded-lg hover:bg-teal-800">
                Load Sample Field Dataset (48 Records)
              </button>
            </div>
          </div>

          @if (batchValidationResults(); as res) {
            <div class="space-y-3 animate-in fade-in">
              <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-700">Data Hygiene Audit Report</h4>
                <span class="text-xs font-mono tabular-nums text-emerald-800 font-bold">
                  {{ res.validRows }} / {{ res.totalRows }} Rows Cleared ({{ Math.round((res.validRows / res.totalRows) * 100) }}%)
                </span>
              </div>

              <div class="grid grid-cols-3 gap-3 text-center text-xs">
                <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span class="text-slate-500 block">Valid Rows</span>
                  <span class="text-lg font-mono font-bold text-emerald-900">{{ res.validRows }}</span>
                </div>
                <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <span class="text-slate-500 block">Missing Phone/Ward</span>
                  <span class="text-lg font-mono font-bold text-amber-900">{{ res.warningsCount }}</span>
                </div>
                <div class="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                  <span class="text-slate-500 block">Duplicate Citizen IDs</span>
                  <span class="text-lg font-mono font-bold text-rose-900">{{ res.errorCount }}</span>
                </div>
              </div>

              <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <span class="font-semibold text-slate-800">Automated Remediation Log:</span>
                <p class="text-slate-600">
                  • 2 duplicate citizenship records quarantined for physical verification.<br>
                  • GPS coordinate coordinates formatted to WGS84 standard precision.<br>
                  • 48 records validated against CTEVT qualification checklist.
                </p>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class DigitalToolsView {
  readonly mealService = inject(MealDataService);
  protected readonly Math = Math;

  readonly activeSubTab = signal<'forms' | 'emulator' | 'excel-validator'>('forms');
  readonly selectedForm = signal<DigitalForm | null>(this.mealService.digitalForms()[0] || null);

  readonly emulatorSuccessMessage = signal<boolean>(false);
  readonly batchValidationResults = signal<{ totalRows: number; validRows: number; warningsCount: number; errorCount: number } | null>(null);

  readonly emulatorForm = new FormGroup({
    beneficiaryId: new FormControl('27-01-72-04519', [Validators.required]),
    municipality: new FormControl('Chautara Sangachokgadhi', [Validators.required]),
    ward: new FormControl(4, [Validators.required]),
    toolkitReceived: new FormControl('Yes, complete set', [Validators.required]),
    qualityRating: new FormControl('Excellent', [Validators.required])
  });

  submitEmulator() {
    if (this.emulatorForm.invalid) return;
    const curr = this.selectedForm();
    if (curr) {
      this.mealService.simulateKoboSubmission(curr.id, 1);
    }
    this.emulatorSuccessMessage.set(true);
    setTimeout(() => this.emulatorSuccessMessage.set(false), 4000);
  }

  loadDemoDataset() {
    this.batchValidationResults.set({
      totalRows: 48,
      validRows: 45,
      warningsCount: 2,
      errorCount: 1
    });
  }

  downloadXlsForm(form: DigitalForm) {
    const xml = `<?xml version="1.0"?>
<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml">
  <h:head>
    <h:title>${form.title}</h:title>
    <model>
      <instance>
        <data id="${form.id}">
          ${form.fields.map(f => `<${f.name}/>`).join('\n          ')}
        </data>
      </instance>
    </model>
  </h:head>
  <h:body>
    ${form.fields.map(f => `<input ref="/data/${f.name}"><label>${f.label}</label></input>`).join('\n    ')}
  </h:body>
</h:html>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.id}_schema.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
