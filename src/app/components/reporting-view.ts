import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { CustomReportConfig, ReportDisaggregationRow, ReportSignatory } from '../models/meal.model';

const STORAGE_KEY = 'meal_custom_report_config_v1';

@Component({
  selector: 'app-reporting-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Top Action & Customization Toolbar (Hidden when printing to PDF) -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Verified Donor Reporting Engine</span>
            <span aria-hidden="true">·</span>
            <span class="text-teal-800 font-bold">Interactive Dossier & PDF Studio</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Donor Reporting & Progress Dashboards</span>
            @if (isEditMode()) {
              <span class="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold animate-pulse">
                <mat-icon class="text-xs">edit</mat-icon>
                <span>Edit Mode Active</span>
              </span>
            }
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">
            Customize names, signatories, narratives, and target figures directly on the document. Print or save as an official high-fidelity PDF for USAID, FCDO, and NDRRMA.
          </p>
        </div>

        <!-- Toolbar Buttons -->
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <!-- Format Selector -->
          <div class="relative">
            <select
              [value]="selectedFormat()"
              (change)="onFormatSelect($event)"
              class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl py-2 px-3 pr-8 font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-700 cursor-pointer transition-colors">
              <option value="usaid">USAID / BHA Performance Format</option>
              <option value="fcdo">FCDO / UNICEF Milestone Brief</option>
              <option value="ndrrma">Government NDRRMA Disaster Synthesis</option>
              <option value="custom">Custom Partner / Internal Format</option>
            </select>
            <mat-icon class="absolute right-2 top-2 text-xs text-slate-400 pointer-events-none">expand_more</mat-icon>
          </div>

          <!-- Toggle In-Place Edit Mode -->
          <button
            type="button"
            (click)="toggleEditMode()"
            [class]="isEditMode() ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'"
            class="px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs">
            <mat-icon class="text-xs">{{ isEditMode() ? 'done_all' : 'edit' }}</mat-icon>
            <span>{{ isEditMode() ? 'Done Editing' : 'Edit Report Fields' }}</span>
          </button>

          <!-- Quick Edit Drawer / Dialog -->
          <button
            type="button"
            (click)="openEditModal()"
            class="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Open comprehensive field editing form">
            <mat-icon class="text-xs">tune</mat-icon>
            <span class="hidden sm:inline">Fields Panel</span>
          </button>

          <!-- Reset to Template Defaults -->
          <button
            type="button"
            (click)="resetToDefaults()"
            class="px-3 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Reset names and content to standard template">
            <mat-icon class="text-xs">restart_alt</mat-icon>
            <span class="hidden sm:inline">Reset</span>
          </button>

          <!-- Primary Action: Print PDF -->
          <button
            type="button"
            (click)="printReport()"
            class="px-4 py-2 bg-teal-900 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md">
            <mat-icon class="text-xs">picture_as_pdf</mat-icon>
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      <!-- Quick Edit Instructions Banner (Visible only in Edit Mode, hidden in print) -->
      @if (isEditMode()) {
        <div class="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs print:hidden animate-fadeIn">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <mat-icon class="text-base">mode_edit</mat-icon>
            </span>
            <div>
              <strong class="font-bold">In-Place Editing Active:</strong>
              <span> Click directly on any text or field box below to rename signatories, change titles, update figures, or revise narratives.</span>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              (click)="addSignatory()"
              class="px-2.5 py-1.5 bg-amber-200/70 hover:bg-amber-200 text-amber-900 font-bold rounded-lg transition-colors flex items-center gap-1">
              <mat-icon class="text-xs">person_add</mat-icon>
              <span>Add Signatory</span>
            </button>
            <button
              type="button"
              (click)="addDisaggregationRow()"
              class="px-2.5 py-1.5 bg-amber-200/70 hover:bg-amber-200 text-amber-900 font-bold rounded-lg transition-colors flex items-center gap-1">
              <mat-icon class="text-xs">playlist_add</mat-icon>
              <span>Add Table Row</span>
            </button>
            <button
              type="button"
              (click)="saveCustomConfig()"
              class="px-3 py-1.5 bg-teal-900 hover:bg-teal-800 text-white font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs">
              <mat-icon class="text-xs">save</mat-icon>
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      }

      <!-- Save/Action Toast Feedback Message -->
      @if (feedbackMessage()) {
        <div class="bg-teal-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md print:hidden animate-fadeIn">
          <div class="flex items-center gap-2">
            <mat-icon class="text-sm text-teal-300">check_circle</mat-icon>
            <span>{{ feedbackMessage() }}</span>
          </div>
          <button
            type="button"
            (click)="feedbackMessage.set(null)"
            class="text-teal-200 hover:text-white">
            <mat-icon class="text-xs">close</mat-icon>
          </button>
        </div>
      }

      <!-- ===================================================================== -->
      <!-- OFFICIAL PRINTABLE REPORT DOSSIER DOCUMENT CANVAS                      -->
      <!-- ===================================================================== -->
      <div class="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0 print:m-0 print:space-y-6">

        <!-- 1. Document Letterhead Header Block -->
        <div class="flex items-start justify-between border-b-2 border-slate-900 pb-5 gap-4">
          <div class="space-y-1.5 flex-1">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-lg bg-teal-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                M
              </span>
              @if (isEditMode()) {
                <input
                  type="text"
                  [value]="config().letterheadOrg"
                  (input)="updateConfigField('letterheadOrg', $any($event.target).value)"
                  class="font-black text-lg text-slate-900 tracking-tight border border-dashed border-teal-400 hover:border-teal-600 bg-teal-50/40 rounded px-2 py-0.5 w-full max-w-md focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-700"
                  placeholder="Organization Letterhead Name" />
              } @else {
                <span class="font-black text-lg sm:text-xl text-slate-900 tracking-tight">
                  {{ config().letterheadOrg }}
                </span>
              }
            </div>

            @if (isEditMode()) {
              <input
                type="text"
                [value]="config().letterheadBureau"
                (input)="updateConfigField('letterheadBureau', $any($event.target).value)"
                class="text-xs text-slate-600 border border-dashed border-teal-400 hover:border-teal-600 bg-teal-50/40 rounded px-2 py-0.5 w-full max-w-lg focus:bg-white focus:outline-hidden"
                placeholder="Department / Program Directorate" />
            } @else {
              <p class="text-xs text-slate-500 font-medium">
                {{ config().letterheadBureau }}
              </p>
            }
          </div>

          <!-- Document Metadata Stamps -->
          <div class="text-right text-xs font-mono shrink-0 space-y-1">
            @if (isEditMode()) {
              <input
                type="text"
                [value]="config().reportClassification"
                (input)="updateConfigField('reportClassification', $any($event.target).value)"
                class="font-bold text-slate-900 text-right border border-dashed border-teal-400 bg-teal-50/40 rounded px-1.5 py-0.5 w-36 text-xs block ml-auto focus:bg-white"
                placeholder="Classification" />
              <div class="flex items-center justify-end gap-1 text-[11px] text-slate-500">
                <span>Ref:</span>
                <input
                  type="text"
                  [value]="config().reportRef"
                  (input)="updateConfigField('reportRef', $any($event.target).value)"
                  class="font-mono text-right border border-dashed border-teal-400 bg-teal-50/40 rounded px-1.5 py-0.5 w-36 text-[11px] focus:bg-white"
                  placeholder="Reference Code" />
              </div>
              <div class="flex items-center justify-end gap-1 text-[11px] text-slate-500">
                <span>Date:</span>
                <input
                  type="date"
                  [value]="config().reportDate"
                  (input)="updateConfigField('reportDate', $any($event.target).value)"
                  class="font-mono text-right border border-dashed border-teal-400 bg-teal-50/40 rounded px-1.5 py-0.5 text-[11px] focus:bg-white" />
              </div>
            } @else {
              <span class="font-bold text-slate-900 block tracking-wide">
                {{ config().reportClassification }}
              </span>
              <span class="text-slate-500 block">
                Ref: {{ config().reportRef }}
              </span>
              <span class="text-slate-500 block">
                Date: {{ config().reportDate }}
              </span>
            }
          </div>
        </div>

        <!-- 2. Project Title & Executive Synthesis Header -->
        <div class="space-y-2">
          <!-- Subtitle / Format Header -->
          @if (isEditMode()) {
            <input
              type="text"
              [value]="config().reportSubtitle"
              (input)="updateConfigField('reportSubtitle', $any($event.target).value)"
              class="text-xs font-mono font-bold text-teal-800 uppercase tracking-wider border border-dashed border-teal-400 bg-teal-50/40 rounded px-2 py-1 w-full max-w-md focus:bg-white"
              placeholder="Report Subtitle / Donor Format" />
          } @else {
            <span class="text-xs font-mono font-bold text-teal-800 uppercase tracking-wider block">
              {{ config().reportSubtitle }}
            </span>
          }

          <!-- Main Report Title -->
          @if (isEditMode()) {
            <input
              type="text"
              [value]="config().reportTitle"
              (input)="updateConfigField('reportTitle', $any($event.target).value)"
              class="text-xl sm:text-2xl font-bold text-slate-900 border border-dashed border-teal-400 bg-teal-50/40 rounded px-2 py-1 w-full focus:bg-white"
              placeholder="Report Title" />
          } @else {
            <h2 class="text-2xl font-bold text-slate-900 tracking-tight">
              {{ config().reportTitle }}
            </h2>
          }

          <!-- Key Project Parameters / Metadata Bar -->
          <div class="mt-2 text-xs text-slate-600 flex flex-wrap items-center gap-x-5 gap-y-2 font-medium bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <div class="flex items-center gap-1.5">
              <span class="text-slate-500">Period:</span>
              @if (isEditMode()) {
                <input
                  type="text"
                  [value]="config().reportingPeriod"
                  (input)="updateConfigField('reportingPeriod', $any($event.target).value)"
                  class="font-bold text-slate-900 border border-dashed border-teal-400 bg-white rounded px-1.5 py-0.5 w-40 text-xs" />
              } @else {
                <strong class="text-slate-900">{{ config().reportingPeriod }}</strong>
              }
            </div>

            <div class="flex items-center gap-1.5">
              <span class="text-slate-500">Target Pop:</span>
              @if (isEditMode()) {
                <input
                  type="text"
                  [value]="config().targetPopulation"
                  (input)="updateConfigField('targetPopulation', $any($event.target).value)"
                  class="font-bold text-slate-900 border border-dashed border-teal-400 bg-white rounded px-1.5 py-0.5 w-32 text-xs" />
              } @else {
                <strong class="text-slate-900">{{ config().targetPopulation }}</strong>
              }
            </div>

            <div class="flex items-center gap-1.5">
              <span class="text-slate-500">Reach to Date:</span>
              @if (isEditMode()) {
                <input
                  type="text"
                  [value]="config().verifiedReach"
                  (input)="updateConfigField('verifiedReach', $any($event.target).value)"
                  class="font-bold text-teal-900 border border-dashed border-teal-400 bg-white rounded px-1.5 py-0.5 w-48 text-xs" />
              } @else {
                <strong class="text-teal-900 font-bold">{{ config().verifiedReach }}</strong>
              }
            </div>

            <div class="flex items-center gap-1.5">
              <span class="text-slate-500">DQA Quality Score:</span>
              @if (isEditMode()) {
                <input
                  type="text"
                  [value]="config().dqaScore"
                  (input)="updateConfigField('dqaScore', $any($event.target).value)"
                  class="font-bold text-emerald-800 border border-dashed border-teal-400 bg-white rounded px-1.5 py-0.5 w-28 text-xs" />
              } @else {
                <strong class="text-emerald-800 font-bold">{{ config().dqaScore }}</strong>
              }
            </div>
          </div>

          <!-- Executive Summary Paragraph -->
          <div class="pt-2">
            @if (isEditMode()) {
              <div class="space-y-1">
                <label class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Executive Summary</label>
                <textarea
                  rows="3"
                  [value]="config().executiveSummary"
                  (input)="updateConfigField('executiveSummary', $any($event.target).value)"
                  class="w-full text-xs text-slate-700 leading-relaxed border border-dashed border-teal-400 bg-teal-50/20 rounded-xl p-2.5 focus:bg-white focus:outline-hidden"
                  placeholder="Executive Summary narrative..."></textarea>
              </div>
            } @else {
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {{ config().executiveSummary }}
              </p>
            }
          </div>
        </div>

        <!-- 3. Indicator Achievement Visual Progress Graphic (Responsive) -->
        <div class="space-y-3 print-avoid-break">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <mat-icon class="text-sm text-teal-800">analytics</mat-icon>
              <span>Indicator Achievement vs Target Milestones</span>
            </h3>
            <span class="text-[11px] text-slate-400 font-mono hidden sm:inline">
              PIRS Audit Baseline: verified
            </span>
          </div>

          <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3.5">
            @for (ind of mealService.filteredIndicators().slice(0, 5); track ind.id) {
              <div>
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-medium text-slate-800 truncate pr-2">
                    <strong class="font-mono text-teal-900">{{ ind.code }}:</strong> {{ ind.title }}
                  </span>
                  <span class="font-mono font-bold tabular-nums shrink-0" [class.text-emerald-800]="ind.progressPercent >= 90" [class.text-amber-800]="ind.progressPercent < 90">
                    {{ ind.actualTotal | number }} / {{ ind.targetAnnual | number }} ({{ ind.progressPercent }}%)
                  </span>
                </div>
                <div class="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    [style.width.%]="ind.progressPercent > 100 ? 100 : ind.progressPercent"
                    [class.bg-teal-700]="ind.progressPercent >= 90"
                    [class.bg-amber-600]="ind.progressPercent < 90"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- 4. Disaggregation & Vulnerability Table (GEDSI Compliance) -->
        <div class="space-y-3 print-avoid-break">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <mat-icon class="text-sm text-teal-800">group_work</mat-icon>
              <span>Verified Demographic Disaggregation (GEDSI & Disability Compliance)</span>
            </h3>
            @if (isEditMode()) {
              <button
                type="button"
                (click)="addDisaggregationRow()"
                class="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-900 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1">
                <mat-icon class="text-[11px]">add</mat-icon>
                <span>Add Row</span>
              </button>
            }
          </div>

          <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase text-[11px] font-bold">
                <tr>
                  <th class="py-2.5 px-3">Intervention Category</th>
                  <th class="py-2.5 px-3 text-right">Female</th>
                  <th class="py-2.5 px-3 text-right">Male</th>
                  <th class="py-2.5 px-3 text-right">PWD</th>
                  <th class="py-2.5 px-3 text-right">Marginalized (Dalit/Janajati)</th>
                  <th class="py-2.5 px-3 text-right">Total Verified</th>
                  @if (isEditMode()) {
                    <th class="py-2.5 px-2 text-center w-8 print:hidden">Del</th>
                  }
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono tabular-nums">
                @for (row of config().disaggregations; track row.id; let idx = $index) {
                  <tr class="hover:bg-slate-50/60 transition-colors">
                    <td class="py-2 px-3 font-sans font-medium text-slate-800">
                      @if (isEditMode()) {
                        <input
                          type="text"
                          [value]="row.category"
                          (input)="updateDisaggregationRow(idx, 'category', $any($event.target).value)"
                          class="w-full border border-dashed border-teal-400 bg-teal-50/20 rounded px-1.5 py-0.5 text-xs font-sans font-medium focus:bg-white" />
                      } @else {
                        <span>{{ row.category }}</span>
                      }
                    </td>

                    <td class="py-2 px-3 text-right text-slate-800 font-bold">
                      @if (isEditMode()) {
                        <input
                          type="text"
                          [value]="row.female"
                          (input)="updateDisaggregationRow(idx, 'female', $any($event.target).value)"
                          class="w-20 text-right border border-dashed border-teal-400 bg-teal-50/20 rounded px-1 py-0.5 text-xs font-mono focus:bg-white" />
                      } @else {
                        <span>{{ row.female }}</span>
                      }
                    </td>

                    <td class="py-2 px-3 text-right text-slate-600">
                      @if (isEditMode()) {
                        <input
                          type="text"
                          [value]="row.male"
                          (input)="updateDisaggregationRow(idx, 'male', $any($event.target).value)"
                          class="w-16 text-right border border-dashed border-teal-400 bg-teal-50/20 rounded px-1 py-0.5 text-xs font-mono focus:bg-white" />
                      } @else {
                        <span>{{ row.male }}</span>
                      }
                    </td>

                    <td class="py-2 px-3 text-right text-slate-600">
                      @if (isEditMode()) {
                        <input
                          type="text"
                          [value]="row.pwd"
                          (input)="updateDisaggregationRow(idx, 'pwd', $any($event.target).value)"
                          class="w-14 text-right border border-dashed border-teal-400 bg-teal-50/20 rounded px-1 py-0.5 text-xs font-mono focus:bg-white" />
                      } @else {
                        <span>{{ row.pwd }}</span>
                      }
                    </td>

                    <td class="py-2 px-3 text-right text-slate-800 font-bold">
                      @if (isEditMode()) {
                        <input
                          type="text"
                          [value]="row.marginalized"
                          (input)="updateDisaggregationRow(idx, 'marginalized', $any($event.target).value)"
                          class="w-20 text-right border border-dashed border-teal-400 bg-teal-50/20 rounded px-1 py-0.5 text-xs font-mono focus:bg-white" />
                      } @else {
                        <span>{{ row.marginalized }}</span>
                      }
                    </td>

                    <td class="py-2 px-3 text-right text-slate-900 font-bold">
                      @if (isEditMode()) {
                        <input
                          type="text"
                          [value]="row.total"
                          (input)="updateDisaggregationRow(idx, 'total', $any($event.target).value)"
                          class="w-16 text-right border border-dashed border-teal-400 bg-teal-50/20 rounded px-1 py-0.5 text-xs font-mono font-bold focus:bg-white" />
                      } @else {
                        <span>{{ row.total }}</span>
                      }
                    </td>

                    @if (isEditMode()) {
                      <td class="py-2 px-1 text-center print:hidden">
                        <button
                          type="button"
                          (click)="removeDisaggregationRow(idx)"
                          class="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove row">
                          <mat-icon class="text-xs">delete</mat-icon>
                        </button>
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5. Accountability & Quality Assurance Synthesis Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 print-avoid-break">
          <!-- CFRM Block -->
          <div class="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span class="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <mat-icon class="text-sm text-teal-800">support_agent</mat-icon>
              <span>CFRM Accountability Synthesis</span>
            </span>
            @if (isEditMode()) {
              <textarea
                rows="4"
                [value]="config().cfrmSynthesis"
                (input)="updateConfigField('cfrmSynthesis', $any($event.target).value)"
                class="w-full text-xs text-slate-700 leading-relaxed border border-dashed border-teal-400 bg-white rounded-lg p-2 focus:outline-hidden"
                placeholder="CFRM accountability findings..."></textarea>
            } @else {
              <p class="text-slate-600 leading-relaxed">
                {{ config().cfrmSynthesis }}
              </p>
            }
          </div>

          <!-- DQA Block -->
          <div class="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span class="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <mat-icon class="text-sm text-emerald-800">verified</mat-icon>
              <span>DQA Quality Assurance Audit</span>
            </span>
            @if (isEditMode()) {
              <textarea
                rows="4"
                [value]="config().dqaSynthesis"
                (input)="updateConfigField('dqaSynthesis', $any($event.target).value)"
                class="w-full text-xs text-slate-700 leading-relaxed border border-dashed border-teal-400 bg-white rounded-lg p-2 focus:outline-hidden"
                placeholder="DQA quality audit findings..."></textarea>
            } @else {
              <p class="text-slate-600 leading-relaxed">
                {{ config().dqaSynthesis }}
              </p>
            }
          </div>
        </div>

        <!-- 6. Operational Challenges & Strategic Recommendations (Collapsible or Full) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 print-avoid-break">
          <div class="p-4 sm:p-5 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-2 text-xs">
            <span class="font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <mat-icon class="text-sm text-amber-700">warning_amber</mat-icon>
              <span>Key Challenges & Mitigation</span>
            </span>
            @if (isEditMode()) {
              <textarea
                rows="3"
                [value]="config().keyChallenges"
                (input)="updateConfigField('keyChallenges', $any($event.target).value)"
                class="w-full text-xs text-slate-700 leading-relaxed border border-dashed border-amber-400 bg-white rounded-lg p-2 focus:outline-hidden"
                placeholder="Operational challenges and solutions..."></textarea>
            } @else {
              <p class="text-slate-700 leading-relaxed">
                {{ config().keyChallenges }}
              </p>
            }
          </div>

          <div class="p-4 sm:p-5 bg-teal-50/50 border border-teal-200/80 rounded-xl space-y-2 text-xs">
            <span class="font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <mat-icon class="text-sm text-teal-700">lightbulb</mat-icon>
              <span>Recommendations & Next Steps</span>
            </span>
            @if (isEditMode()) {
              <textarea
                rows="3"
                [value]="config().recommendations"
                (input)="updateConfigField('recommendations', $any($event.target).value)"
                class="w-full text-xs text-slate-700 leading-relaxed border border-dashed border-teal-400 bg-white rounded-lg p-2 focus:outline-hidden"
                placeholder="Recommendations and follow-up activities..."></textarea>
            } @else {
              <p class="text-slate-700 leading-relaxed">
                {{ config().recommendations }}
              </p>
            }
          </div>
        </div>

        <!-- 7. Official Sign-off Block (Names, Designations, Approvals) -->
        <div class="pt-8 border-t-2 border-slate-900 print-avoid-break space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <mat-icon class="text-sm text-teal-900">draw</mat-icon>
              <span>Institutional Sign-off Authorities & Endorsements</span>
            </span>
            @if (isEditMode()) {
              <button
                type="button"
                (click)="addSignatory()"
                class="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
                <mat-icon class="text-xs">person_add</mat-icon>
                <span>Add Signatory</span>
              </button>
            }
          </div>

          <!-- Signatory Columns (Grid of 3 or 4) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 text-xs">
            @for (sig of config().signatories; track sig.id; let idx = $index) {
              <div class="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 flex flex-col justify-between relative group">
                @if (isEditMode() && config().signatories.length > 1) {
                  <button
                    type="button"
                    (click)="removeSignatory(idx)"
                    class="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 transition-colors print:hidden"
                    title="Remove signatory">
                    <mat-icon class="text-xs">close</mat-icon>
                  </button>
                }

                <div>
                  <!-- Role Label (Prepared by / Verified by / Approved by) -->
                  @if (isEditMode()) {
                    <input
                      type="text"
                      [value]="sig.roleLabel"
                      (input)="updateSignatory(idx, 'roleLabel', $any($event.target).value)"
                      class="block font-semibold text-slate-500 mb-4 border border-dashed border-teal-400 bg-white rounded px-1.5 py-0.5 text-xs w-full max-w-[140px]" />
                  } @else {
                    <span class="block text-slate-500 font-medium mb-6">
                      {{ sig.roleLabel }}
                    </span>
                  }

                  <!-- Visual Signature Line -->
                  <div class="border-t border-slate-400 pt-2 space-y-0.5">
                    <!-- Full Name -->
                    @if (isEditMode()) {
                      <div class="space-y-1">
                        <label class="text-[10px] text-slate-400 uppercase font-semibold">Full Name</label>
                        <input
                          type="text"
                          [value]="sig.name"
                          (input)="updateSignatory(idx, 'name', $any($event.target).value)"
                          class="font-bold text-slate-900 border border-dashed border-teal-400 bg-teal-50/30 rounded px-1.5 py-1 text-xs w-full focus:bg-white"
                          placeholder="Signatory Name" />
                      </div>
                    } @else {
                      <div class="font-bold text-slate-900 text-sm">
                        {{ sig.name }}
                      </div>
                    }

                    <!-- Title / Designation -->
                    @if (isEditMode()) {
                      <div class="space-y-1 pt-1">
                        <label class="text-[10px] text-slate-400 uppercase font-semibold">Title / Designation</label>
                        <input
                          type="text"
                          [value]="sig.title"
                          (input)="updateSignatory(idx, 'title', $any($event.target).value)"
                          class="text-[11px] text-slate-600 border border-dashed border-teal-400 bg-teal-50/30 rounded px-1.5 py-0.5 text-xs w-full focus:bg-white"
                          placeholder="Designation" />
                      </div>
                    } @else {
                      <div class="text-[11px] text-slate-600 font-medium">
                        {{ sig.title }}
                      </div>
                    }

                    <!-- Department -->
                    @if (isEditMode()) {
                      <div class="space-y-1 pt-1">
                        <label class="text-[10px] text-slate-400 uppercase font-semibold">Department / Organization</label>
                        <input
                          type="text"
                          [value]="sig.department"
                          (input)="updateSignatory(idx, 'department', $any($event.target).value)"
                          class="text-[10px] text-slate-400 border border-dashed border-teal-400 bg-teal-50/30 rounded px-1.5 py-0.5 text-[11px] w-full focus:bg-white"
                          placeholder="Department" />
                      </div>
                    } @else {
                      <div class="text-[10px] text-slate-400">
                        {{ sig.department }}
                      </div>
                    }

                    <!-- Date Stamp -->
                    <div class="text-[10px] text-slate-400 font-mono pt-1">
                      Date: {{ sig.date || config().reportDate }}
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Document Footer Stamp -->
        <div class="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>MEAL Suite Verified Enterprise Report · System Ref: {{ config().reportRef }}</span>
          <span>Compliance: USAID ADS 201 · FCDO Smart Rules · Sphere Core Standards</span>
        </div>
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- QUICK EDIT FIELDS MODAL DIALOG                                         -->
    <!-- ===================================================================== -->
    @if (showEditModal()) {
      <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 print:hidden animate-fadeIn">
        <div class="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          <!-- Modal Header -->
          <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-teal-700 flex items-center justify-center font-bold">
                <mat-icon class="text-sm">tune</mat-icon>
              </span>
              <div>
                <h3 class="text-sm font-bold">Edit Report Fields & Signatories</h3>
                <p class="text-[11px] text-slate-300">Quickly change names, designations, titles, and report parameters</p>
              </div>
            </div>
            <button
              type="button"
              (click)="closeEditModal()"
              class="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors">
              <mat-icon class="text-base">close</mat-icon>
            </button>
          </div>

          <!-- Modal Tabs -->
          <div class="bg-slate-100 border-b border-slate-200 px-6 flex items-center gap-2 text-xs font-semibold">
            <button
              type="button"
              (click)="activeModalTab.set('signatories')"
              [class]="activeModalTab() === 'signatories' ? 'border-teal-800 text-teal-950 font-bold border-b-2 bg-white' : 'text-slate-600 hover:text-slate-900'"
              class="py-3 px-3 transition-colors flex items-center gap-1.5">
              <mat-icon class="text-xs">draw</mat-icon>
              <span>1. Signatories (Names & Titles)</span>
            </button>
            <button
              type="button"
              (click)="activeModalTab.set('header')"
              [class]="activeModalTab() === 'header' ? 'border-teal-800 text-teal-950 font-bold border-b-2 bg-white' : 'text-slate-600 hover:text-slate-900'"
              class="py-3 px-3 transition-colors flex items-center gap-1.5">
              <mat-icon class="text-xs">badge</mat-icon>
              <span>2. Headers & Period</span>
            </button>
            <button
              type="button"
              (click)="activeModalTab.set('narratives')"
              [class]="activeModalTab() === 'narratives' ? 'border-teal-800 text-teal-950 font-bold border-b-2 bg-white' : 'text-slate-600 hover:text-slate-900'"
              class="py-3 px-3 transition-colors flex items-center gap-1.5">
              <mat-icon class="text-xs">description</mat-icon>
              <span>3. Narratives & Synthesis</span>
            </button>
          </div>

          <!-- Modal Content Body -->
          <div class="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
            <!-- TAB 1: Signatories (Names and Roles) -->
            @if (activeModalTab() === 'signatories') {
              <div class="space-y-4">
                <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                  <p class="text-slate-600">Modify the names and designations of the authorities signing off on this report.</p>
                  <button
                    type="button"
                    (click)="addSignatory()"
                    class="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-900 font-bold rounded-lg flex items-center gap-1">
                    <mat-icon class="text-xs">add</mat-icon>
                    <span>Add Signatory</span>
                  </button>
                </div>

                @for (sig of config().signatories; track sig.id; let idx = $index) {
                  <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-teal-900">Signatory #{{ idx + 1 }}</span>
                      @if (config().signatories.length > 1) {
                        <button
                          type="button"
                          (click)="removeSignatory(idx)"
                          class="text-rose-600 hover:text-rose-800 flex items-center gap-1 text-[11px]">
                          <mat-icon class="text-xs">delete</mat-icon>
                          <span>Remove</span>
                        </button>
                      }
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label class="block font-semibold text-slate-700 mb-1">Role Heading (e.g. Prepared by:)</label>
                        <input
                          type="text"
                          [value]="sig.roleLabel"
                          (input)="updateSignatory(idx, 'roleLabel', $any($event.target).value)"
                          class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-teal-700" />
                      </div>

                      <div>
                        <label class="block font-semibold text-slate-700 mb-1">Signatory Full Name</label>
                        <input
                          type="text"
                          [value]="sig.name"
                          (input)="updateSignatory(idx, 'name', $any($event.target).value)"
                          class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 focus:ring-1 focus:ring-teal-700"
                          placeholder="e.g. Anil Maharjan" />
                      </div>

                      <div>
                        <label class="block font-semibold text-slate-700 mb-1">Official Designation / Title</label>
                        <input
                          type="text"
                          [value]="sig.title"
                          (input)="updateSignatory(idx, 'title', $any($event.target).value)"
                          class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:ring-1 focus:ring-teal-700"
                          placeholder="e.g. Senior MEAL Officer" />
                      </div>

                      <div>
                        <label class="block font-semibold text-slate-700 mb-1">Department / Organization</label>
                        <input
                          type="text"
                          [value]="sig.department"
                          (input)="updateSignatory(idx, 'department', $any($event.target).value)"
                          class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:ring-1 focus:ring-teal-700"
                          placeholder="e.g. MEAL & DQA Directorate" />
                      </div>
                    </div>
                  </div>
                }
              </div>
            }

            <!-- TAB 2: Headers & Period -->
            @if (activeModalTab() === 'header') {
              <div class="space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Organization Letterhead</label>
                    <input
                      type="text"
                      [value]="config().letterheadOrg"
                      (input)="updateConfigField('letterheadOrg', $any($event.target).value)"
                      class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold focus:ring-1 focus:ring-teal-700" />
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Directorate / Bureau</label>
                    <input
                      type="text"
                      [value]="config().letterheadBureau"
                      (input)="updateConfigField('letterheadBureau', $any($event.target).value)"
                      class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-teal-700" />
                  </div>

                  <div class="sm:col-span-2">
                    <label class="block font-semibold text-slate-700 mb-1">Report Main Title</label>
                    <input
                      type="text"
                      [value]="config().reportTitle"
                      (input)="updateConfigField('reportTitle', $any($event.target).value)"
                      class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold focus:ring-1 focus:ring-teal-700" />
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Report Subtitle / Format</label>
                    <input
                      type="text"
                      [value]="config().reportSubtitle"
                      (input)="updateConfigField('reportSubtitle', $any($event.target).value)"
                      class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-teal-700" />
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Reporting Period</label>
                    <input
                      type="text"
                      [value]="config().reportingPeriod"
                      (input)="updateConfigField('reportingPeriod', $any($event.target).value)"
                      class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-teal-700" />
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Report Reference Number</label>
                    <input
                      type="text"
                      [value]="config().reportRef"
                      (input)="updateConfigField('reportRef', $any($event.target).value)"
                      class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-teal-700" />
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Report Date</label>
                    <input
                      type="date"
                      [value]="config().reportDate"
                      (input)="updateConfigField('reportDate', $any($event.target).value)"
                      class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-teal-700" />
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Target Population</label>
                    <input
                      type="text"
                      [value]="config().targetPopulation"
                      (input)="updateConfigField('targetPopulation', $any($event.target).value)"
                      class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-teal-700" />
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Verified Reach</label>
                    <input
                      type="text"
                      [value]="config().verifiedReach"
                      (input)="updateConfigField('verifiedReach', $any($event.target).value)"
                      class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-teal-700" />
                  </div>
                </div>
              </div>
            }

            <!-- TAB 3: Narratives & Synthesis -->
            @if (activeModalTab() === 'narratives') {
              <div class="space-y-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Executive Summary</label>
                  <textarea
                    rows="3"
                    [value]="config().executiveSummary"
                    (input)="updateConfigField('executiveSummary', $any($event.target).value)"
                    class="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-teal-700"></textarea>
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1">CFRM Accountability Synthesis</label>
                  <textarea
                    rows="3"
                    [value]="config().cfrmSynthesis"
                    (input)="updateConfigField('cfrmSynthesis', $any($event.target).value)"
                    class="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-teal-700"></textarea>
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1">DQA Quality Assurance Synthesis</label>
                  <textarea
                    rows="3"
                    [value]="config().dqaSynthesis"
                    (input)="updateConfigField('dqaSynthesis', $any($event.target).value)"
                    class="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-teal-700"></textarea>
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Key Operational Challenges</label>
                  <textarea
                    rows="2"
                    [value]="config().keyChallenges"
                    (input)="updateConfigField('keyChallenges', $any($event.target).value)"
                    class="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-teal-700"></textarea>
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Recommendations & Next Steps</label>
                  <textarea
                    rows="2"
                    [value]="config().recommendations"
                    (input)="updateConfigField('recommendations', $any($event.target).value)"
                    class="w-full bg-white border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-teal-700"></textarea>
                </div>
              </div>
            }
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              (click)="resetToDefaults()"
              class="px-3 py-1.5 text-rose-700 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-1 transition-colors">
              <mat-icon class="text-xs">restart_alt</mat-icon>
              <span>Reset Template</span>
            </button>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="closeEditModal()"
                class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold transition-colors">
                Done
              </button>
              <button
                type="button"
                (click)="saveCustomConfig(); closeEditModal()"
                class="px-4 py-2 bg-teal-900 hover:bg-teal-800 text-white rounded-xl font-bold transition-colors flex items-center gap-1.5 shadow-2xs">
                <mat-icon class="text-xs">save</mat-icon>
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ReportingView {
  readonly mealService = inject(MealDataService);

  readonly selectedFormat = signal<'usaid' | 'fcdo' | 'ndrrma' | 'custom'>('usaid');
  readonly isEditMode = signal<boolean>(false);
  readonly showEditModal = signal<boolean>(false);
  readonly activeModalTab = signal<'signatories' | 'header' | 'narratives'>('signatories');
  readonly feedbackMessage = signal<string | null>(null);

  readonly config = signal<CustomReportConfig>(this.loadInitialConfig('usaid'));

  toggleEditMode() {
    this.isEditMode.update(val => !val);
  }

  openEditModal() {
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
  }

  onFormatSelect(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    if (!target) return;
    const format = target.value as 'usaid' | 'fcdo' | 'ndrrma' | 'custom';
    this.selectedFormat.set(format);
    this.config.set(this.getPresetConfig(format));
    this.showFeedback(`Switched report template to ${this.getFormatTitle(format)}`);
  }

  updateConfigField(field: keyof CustomReportConfig, value: string) {
    this.config.update(prev => ({
      ...prev,
      [field]: value
    }));
  }

  updateSignatory(index: number, field: keyof ReportSignatory, value: string) {
    this.config.update(prev => {
      const updatedSigs = [...prev.signatories];
      if (updatedSigs[index]) {
        updatedSigs[index] = {
          ...updatedSigs[index],
          [field]: value
        };
      }
      return {
        ...prev,
        signatories: updatedSigs
      };
    });
  }

  addSignatory() {
    this.config.update(prev => {
      const newSig: ReportSignatory = {
        id: 'sig-' + Date.now(),
        roleLabel: 'Endorsed by:',
        name: 'Full Name Here',
        title: 'Designation / Advisor',
        department: 'Partner Directorate',
        date: prev.reportDate
      };
      return {
        ...prev,
        signatories: [...prev.signatories, newSig]
      };
    });
    this.showFeedback('New signatory slot added');
  }

  removeSignatory(index: number) {
    this.config.update(prev => {
      if (prev.signatories.length <= 1) return prev;
      const updated = prev.signatories.filter((_, i) => i !== index);
      return { ...prev, signatories: updated };
    });
    this.showFeedback('Signatory removed');
  }

  updateDisaggregationRow(index: number, field: keyof ReportDisaggregationRow, value: string) {
    this.config.update(prev => {
      const updatedRows = [...prev.disaggregations];
      if (updatedRows[index]) {
        updatedRows[index] = {
          ...updatedRows[index],
          [field]: value
        };
      }
      return { ...prev, disaggregations: updatedRows };
    });
  }

  addDisaggregationRow() {
    this.config.update(prev => {
      const newRow: ReportDisaggregationRow = {
        id: 'dis-' + Date.now(),
        category: 'New Intervention Activity',
        female: '0 (0%)',
        male: '0',
        pwd: '0',
        marginalized: '0',
        total: '0'
      };
      return {
        ...prev,
        disaggregations: [...prev.disaggregations, newRow]
      };
    });
    this.showFeedback('Added new disaggregation table row');
  }

  removeDisaggregationRow(index: number) {
    this.config.update(prev => {
      if (prev.disaggregations.length <= 1) return prev;
      const updated = prev.disaggregations.filter((_, i) => i !== index);
      return { ...prev, disaggregations: updated };
    });
    this.showFeedback('Disaggregation row removed');
  }

  saveCustomConfig() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config()));
      this.showFeedback('Report fields & signatories saved to local storage!');
    } catch {
      this.showFeedback('Changes applied for this session.');
    }
  }

  resetToDefaults() {
    const def = this.getPresetConfig(this.selectedFormat());
    this.config.set(def);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    this.showFeedback(`Reset to default ${this.getFormatTitle(this.selectedFormat())} fields`);
  }

  printReport() {
    // Show instruction guidance and trigger browser print dialog
    this.showFeedback('🖨️ Opening print dialog... Choose "Save as PDF" under Destination to generate your file.');
    setTimeout(() => {
      window.print();
    }, 200);
  }

  private showFeedback(msg: string) {
    this.feedbackMessage.set(msg);
    setTimeout(() => {
      if (this.feedbackMessage() === msg) {
        this.feedbackMessage.set(null);
      }
    }, 4500);
  }

  private getFormatTitle(format: string): string {
    switch (format) {
      case 'usaid': return 'USAID BHA Format';
      case 'fcdo': return 'FCDO / UNICEF Format';
      case 'ndrrma': return 'Government NDRRMA Format';
      default: return 'Custom Format';
    }
  }

  private loadInitialConfig(format: 'usaid' | 'fcdo' | 'ndrrma' | 'custom'): CustomReportConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.signatories && parsed.signatories.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore fallback
    }
    return this.getPresetConfig(format);
  }

  private getPresetConfig(format: 'usaid' | 'fcdo' | 'ndrrma' | 'custom'): CustomReportConfig {
    const today = new Date().toISOString().split('T')[0];
    const stats = this.mealService.summaryStats();
    const org = this.mealService.orgProfile();

    if (format === 'fcdo') {
      return {
        format: 'fcdo',
        letterheadOrg: 'FCDO RESILIENCE PROGRAMME & UNICEF ALLIANCE',
        letterheadBureau: 'Independent Monitoring, Evaluation & Learning Directorate',
        reportClassification: 'OFFICIAL MILESTONE VERIFICATION',
        reportRef: 'MEAL-FCDO-Q3-2026',
        reportDate: today,
        reportTitle: 'Disaster Risk Reduction & Earthquake Safety Milestone Dossier',
        reportSubtitle: 'FCDO / UNICEF Output-Based Milestone Verification',
        reportingPeriod: 'Quarter 3 (July - September 2026)',
        targetPopulation: '32,000 Direct Individuals',
        verifiedReach: `${stats.verifiedBeneficiaries} Sampled Verified Households`,
        dqaScore: '96.2% (Passed)',
        executiveSummary: 'This milestone verification brief provides high-integrity proof of indicator achievement for the Nepal Earthquake Resilience Project. Field auditors executed technical sample spot-checks across Gorkha, Sindhupalchok, and Rasuwa, verifying that structural seismic code compliance meets national standards.',
        cfrmSynthesis: 'Under FCDO accountability guidelines, the toll-free hotline recorded 84 community calls with a 95.2% resolution rate within 48 hours. Community feedback resulted in 3 technical adjustments to school sanitation ramps.',
        dqaSynthesis: 'Independent technical validation confirmed 100% authenticity of trained artisan logs and engineering certificates with zero non-conformances identified.',
        keyChallenges: 'Seasonal access limitations in high-altitude Rasuwa required remote satellite verification for 2 secondary school sites.',
        recommendations: 'Expand digital tablet distribution to local palika technicians to enable real-time geotagged DQA sync.',
        signatories: [
          {
            id: 'sig-1',
            roleLabel: 'Prepared by:',
            name: 'Sujata Shrestha',
            title: 'Monitoring & Results Specialist',
            department: 'Planning & Evaluation Cell',
            date: today
          },
          {
            id: 'sig-2',
            roleLabel: 'Verified by:',
            name: 'Dr. Ramesh Guragain',
            title: 'Technical Quality Director',
            department: 'Seismic Engineering & QA',
            date: today
          },
          {
            id: 'sig-3',
            roleLabel: 'Approved by:',
            name: 'Bikash Sharma',
            title: 'Chief of Party / Team Leader',
            department: 'Executive Project Directorate',
            date: today
          }
        ],
        disaggregations: [
          {
            id: 'dis-1',
            category: 'Mason Retrofitting & Code Certification',
            female: '215 (34%)',
            male: '418',
            pwd: '20',
            marginalized: '290 (46%)',
            total: '633'
          },
          {
            id: 'dis-2',
            category: 'School Evacuation & Safety Drills',
            female: '8,900 (53%)',
            male: '7,900',
            pwd: '195',
            marginalized: '6,200',
            total: '16,800'
          },
          {
            id: 'dis-3',
            category: 'Community DRMC Preparedness',
            female: '430 (48%)',
            male: '465',
            pwd: '40',
            marginalized: '410',
            total: '895'
          }
        ]
      };
    }

    if (format === 'ndrrma') {
      return {
        format: 'ndrrma',
        letterheadOrg: 'GOVERNMENT OF NEPAL · NATIONAL DISASTER RISK REDUCTION & MANAGEMENT AUTHORITY',
        letterheadBureau: 'Planning, Monitoring & Information Technology Directorate · Singhadurbar, Kathmandu',
        reportClassification: 'GOVERNMENT COMPLIANCE DOSSIER',
        reportRef: 'NDRRMA-MEAL-SYNTHESIS-2026',
        reportDate: today,
        reportTitle: 'National Mason Certification & School DRR Synthesis Report',
        reportSubtitle: 'Government NDRRMA Strategic Disaster Resilience Matrix',
        reportingPeriod: 'Bhadra - Ashoj 2083 (FY 2082/83)',
        targetPopulation: '60,000 Community Residents',
        verifiedReach: `${stats.verifiedBeneficiaries} Certified Technicians`,
        dqaScore: '92.8% (Verified)',
        executiveSummary: 'Prepared in accordance with the National Disaster Risk Reduction Policy 2075 and local Palika guidelines. This report summarizes verified achievements across earthquake-resilient infrastructure, municipal safety drills, and artisan capacity development.',
        cfrmSynthesis: 'Public grievances logged through local ward grievance boxes and municipal desks were 92.1% addressed within designated statutory response windows.',
        dqaSynthesis: 'Field engineering inspectors cross-referenced national citizenship database records and municipal builder licenses to ensure full integrity of artisan rosters.',
        keyChallenges: 'Harmonization between provincial reporting formats and municipal DRR plans required localized orientation sessions.',
        recommendations: 'Institutionalize the MEAL Suite digital platform across all 77 District Emergency Operations Centers (DEOCs).',
        signatories: [
          {
            id: 'sig-1',
            roleLabel: 'Prepared by:',
            name: 'Rajesh Karki',
            title: 'Focal MEAL Officer',
            department: 'Information & Monitoring Unit',
            date: today
          },
          {
            id: 'sig-2',
            roleLabel: 'Verified by:',
            name: 'Er. Deepak Thapa',
            title: 'Under Secretary / Chief Engineer',
            department: 'Technical & Infrastructure Division',
            date: today
          },
          {
            id: 'sig-3',
            roleLabel: 'Approved by:',
            name: 'Joint Secretary / Director General',
            title: 'Director General',
            department: 'NDRRMA Executive Leadership',
            date: today
          }
        ],
        disaggregations: [
          {
            id: 'dis-1',
            category: 'Mason Retrofitting & Code Certification',
            female: '198 (32%)',
            male: '422',
            pwd: '18',
            marginalized: '284 (46%)',
            total: '620'
          },
          {
            id: 'dis-2',
            category: 'School Evacuation & Safety Drills',
            female: '9,120 (54%)',
            male: '7,780',
            pwd: '210',
            marginalized: '6,450',
            total: '16,900'
          },
          {
            id: 'dis-3',
            category: 'Community DRMC Preparedness',
            female: '410 (46%)',
            male: '485',
            pwd: '42',
            marginalized: '395',
            total: '895'
          }
        ]
      };
    }

    // Default: USAID / BHA Format
    return {
      format: 'usaid',
      letterheadOrg: `${org.name.toUpperCase()} PERFORMANCE & ACCOUNTABILITY`,
      letterheadBureau: 'MEAL & Quality Assurance Directorate · Operations & Compliance Bureau',
      reportClassification: 'DQA CERTIFIED DOSSIER',
      reportRef: 'MEAL-USAID-BHA-2026-Q3',
      reportDate: today,
      reportTitle: 'Multi-Project Disaster Resilience Portfolio Report',
      reportSubtitle: 'USAID BHA Performance & Accountability Dossier',
      reportingPeriod: 'Q3 FY2026 (Apr - Sep 2026)',
      targetPopulation: '45,000 Individuals',
      verifiedReach: `${stats.verifiedBeneficiaries} Sampled Masons/Households`,
      dqaScore: '94.0% (Passed)',
      executiveSummary: 'This quarterly donor synthesis captures verified field monitoring data, quarterly indicator progress, technical DQA audits, and accountability feedback collected across 7 priority earthquake-affected districts of Nepal. Data collection strictly adhered to USAID ADS 201 and Sphere Quality Standards.',
      cfrmSynthesis: 'During this quarter, 92 feedback and complaint tickets were logged across the Toll-Free 1660 hotline and ward suggestion boxes. 94.2% were successfully resolved with citizen notification within the average SLA of 2.1 days. No unresolved safeguarding matters remain.',
      dqaSynthesis: 'Independent DQA sample audits verified 58 random mason certificates and verified national citizenship cards with zero fraudulent entries. Overall data quality score reached 94.0%, meeting full USAID and FCDO compliance criteria.',
      keyChallenges: 'Seasonal monsoon landslides temporarily disrupted road access in northern Gorkha and Sindhupalchok wards 4-6, delaying on-site technical verifications by 8 days. Field teams mobilized satellite phones and local enumerators to maintain continuity.',
      recommendations: 'Accelerate digital tablet deployment with offline validation scripts for Q4 data entry; establish joint community feedback sessions with local ward DRMCs.',
      signatories: [
        {
          id: 'sig-1',
          roleLabel: 'Prepared by:',
          name: 'Anil Maharjan',
          title: 'Senior MEAL Officer',
          department: 'MEAL & DQA Directorate',
          date: today
        },
        {
          id: 'sig-2',
          roleLabel: 'Verified by:',
          name: 'Dr. Ramesh Guragain',
          title: 'Technical Director / DQA Lead',
          department: 'Quality Assurance Division',
          date: today
        },
        {
          id: 'sig-3',
          roleLabel: 'Approved by:',
          name: 'Surya Narayan Shrestha',
          title: 'Executive Director',
          department: 'Country Office Management',
          date: today
        }
      ],
      disaggregations: [
        {
          id: 'dis-1',
          category: 'Mason Retrofitting & Code Certification',
          female: '198 (32%)',
          male: '422',
          pwd: '18',
          marginalized: '284 (46%)',
          total: '620'
        },
        {
          id: 'dis-2',
          category: 'School Evacuation & Safety Drills',
          female: '9,120 (54%)',
          male: '7,780',
          pwd: '210',
          marginalized: '6,450',
          total: '16,900'
        },
        {
          id: 'dis-3',
          category: 'Community DRMC Preparedness',
          female: '410 (46%)',
          male: '485',
          pwd: '42',
          marginalized: '395',
          total: '895'
        }
      ]
    };
  }
}
