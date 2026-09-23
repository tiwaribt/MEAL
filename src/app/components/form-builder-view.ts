import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { CustomFormDef, FormQuestion, FormQuestionType, FormSkipLogicRule } from '../models/meal.model';

interface PaletteItem {
  type: FormQuestionType;
  label: string;
  icon: string;
  category: 'Basic' | 'Selection' | 'Advanced' | 'Media';
  defaultLabel: string;
}

@Component({
  selector: 'app-form-builder-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Section Header -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>LogAlto M&E Suite</span>
            <span aria-hidden="true">·</span>
            <span>Digital Data Collection Engine</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>M&E Survey & Form Builder</span>
            <span class="text-xs font-medium px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">ODK / XLSForm Compliant</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">
            Design conditional logic surveys with 14 field types, GPS coordinates, digital signatures, skip logic, and direct indicator aggregation.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            (click)="createNewForm()"
            class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">add_circle</mat-icon>
            <span>New Form</span>
          </button>
          <button
            type="button"
            (click)="openPreviewModal()"
            class="px-3 py-1.5 bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">visibility</mat-icon>
            <span>Live Device Preview</span>
          </button>
          <button
            type="button"
            (click)="openShareModal()"
            class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">qr_code_2</mat-icon>
            <span>Share & QR</span>
          </button>
          <button
            type="button"
            (click)="exportXlsForm()"
            class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">download</mat-icon>
            <span>Export XLSForm</span>
          </button>
        </div>
      </div>

      <!-- Form Selector & Metadata Ribbon -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <label class="text-xs font-semibold text-slate-600 whitespace-nowrap">Active Survey:</label>
          <select
            [value]="selectedFormId()"
            (change)="onFormSelect($event)"
            class="text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-teal-700 min-w-64">
            @for (f of mealService.customForms(); track f.id) {
              <option [value]="f.id">{{ f.title }} ({{ f.category }} - {{ f.version }})</option>
            }
          </select>
          <span class="text-xs px-2 py-0.5 rounded-md font-mono"
            [class.bg-emerald-100]="activeForm().status === 'Active'"
            [class.text-emerald-800]="activeForm().status === 'Active'"
            [class.bg-slate-100]="activeForm().status === 'Draft'"
            [class.text-slate-700]="activeForm().status === 'Draft'">
            {{ activeForm().status }}
          </span>
        </div>

        @if (activeForm(); as f) {
          <div class="flex items-center gap-4 text-xs text-slate-600 font-mono">
            <span>Questions: <strong class="text-slate-900">{{ f.questions.length }}</strong></span>
            <span>Submissions: <strong class="text-teal-900">{{ f.submissionsCount }}</strong></span>
            <span>Last Updated: <strong class="text-slate-800">{{ f.lastUpdated }}</strong></span>
            @if (f.linkedIndicatorId) {
              <span class="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 rounded font-sans text-[11px] flex items-center gap-1">
                <mat-icon class="text-[13px]">link</mat-icon>
                <span>Linked to {{ getLinkedIndicatorCode(f.linkedIndicatorId) }}</span>
              </span>
            }
          </div>
        }
      </div>

      <!-- Main Form Designer Workspace: Palette | Canvas | Inspector -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- LEFT: Palette of 14 Field Types (3 Cols) -->
        <div class="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <mat-icon class="text-xs text-teal-800">widgets</mat-icon>
              <span>Field Types (14)</span>
            </h2>
            <span class="text-[10px] text-slate-400">Click to add</span>
          </div>

          <!-- Basic Inputs -->
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Basic Text & Numbers</span>
            <div class="grid grid-cols-1 gap-1.5">
              @for (item of paletteBasic; track item.type) {
                <button
                  type="button"
                  (click)="addQuestionFromPalette(item.type, item.defaultLabel)"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-slate-200 hover:border-teal-700 hover:bg-teal-50/40 text-left text-xs font-medium text-slate-800 transition-all shadow-2xs group">
                  <mat-icon class="text-sm text-slate-500 group-hover:text-teal-800 transition-colors">{{ item.icon }}</mat-icon>
                  <span>{{ item.label }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Selection & Choices -->
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Choices & Selectors</span>
            <div class="grid grid-cols-1 gap-1.5">
              @for (item of paletteSelection; track item.type) {
                <button
                  type="button"
                  (click)="addQuestionFromPalette(item.type, item.defaultLabel)"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-slate-200 hover:border-teal-700 hover:bg-teal-50/40 text-left text-xs font-medium text-slate-800 transition-all shadow-2xs group">
                  <mat-icon class="text-sm text-slate-500 group-hover:text-teal-800 transition-colors">{{ item.icon }}</mat-icon>
                  <span>{{ item.label }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Media & Geospatial -->
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">GPS, Media & Audit</span>
            <div class="grid grid-cols-1 gap-1.5">
              @for (item of paletteMedia; track item.type) {
                <button
                  type="button"
                  (click)="addQuestionFromPalette(item.type, item.defaultLabel)"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-slate-200 hover:border-teal-700 hover:bg-teal-50/40 text-left text-xs font-medium text-slate-800 transition-all shadow-2xs group">
                  <mat-icon class="text-sm text-slate-500 group-hover:text-teal-800 transition-colors">{{ item.icon }}</mat-icon>
                  <span>{{ item.label }}</span>
                </button>
              }
            </div>
          </div>
        </div>

        <!-- CENTER: Form Canvas & Questions List (6 Cols) -->
        <div class="lg:col-span-6 space-y-4">
          @if (activeForm(); as form) {
            <!-- Form Header Meta Editor -->
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <input
                    type="text"
                    [value]="form.title"
                    (change)="updateFormTitle($event)"
                    class="text-base font-bold text-slate-900 w-full border-b border-dashed border-slate-300 hover:border-teal-700 focus:outline-hidden focus:border-teal-900 pb-1"
                    placeholder="Enter Survey / Form Title..." />
                  <textarea
                    [value]="form.description"
                    (change)="updateFormDescription($event)"
                    rows="2"
                    class="w-full text-xs text-slate-600 mt-2 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-teal-700"
                    placeholder="Survey objective, methodology, target beneficiaries..."></textarea>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <label class="block font-semibold text-slate-600 mb-1">Category</label>
                  <select
                    [value]="form.category"
                    (change)="updateFormCategory($event)"
                    class="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-teal-700">
                    <option value="PDM">Post-Distribution Monitoring (PDM)</option>
                    <option value="Baseline">Baseline Assessment</option>
                    <option value="Endline">Endline Evaluation</option>
                    <option value="Routine Monitoring">Routine Monitoring</option>
                    <option value="Rapid Damage">Rapid Disaster Damage</option>
                    <option value="Needs Assessment">Needs Assessment</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-slate-600 mb-1">Version Tag</label>
                  <input
                    type="text"
                    [value]="form.version"
                    (change)="updateFormVersion($event)"
                    class="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 font-mono focus:ring-1 focus:ring-teal-700" />
                </div>
                <div>
                  <label class="block font-semibold text-slate-600 mb-1">Link to Indicator</label>
                  <select
                    [value]="form.linkedIndicatorId || ''"
                    (change)="updateFormLinkedIndicator($event)"
                    class="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-teal-700">
                    <option value="">-- No Auto-Aggregation --</option>
                    @for (ind of mealService.indicators(); track ind.id) {
                      <option [value]="ind.id">{{ ind.code }}: {{ ind.title.substring(0, 32) }}...</option>
                    }
                  </select>
                </div>
              </div>
            </div>

            <!-- Questions Container -->
            <div class="space-y-3">
              @for (q of form.questions; track q.id; let i = $index) {
                <div
                  class="bg-white border rounded-xl p-4 shadow-2xs transition-all relative group"
                  [class.border-teal-700]="selectedQuestionId() === q.id"
                  [class.ring-2]="selectedQuestionId() === q.id"
                  [class.ring-teal-700/20]="selectedQuestionId() === q.id"
                  [class.border-slate-200]="selectedQuestionId() !== q.id">

                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center font-mono">
                        {{ i + 1 }}
                      </span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 flex items-center gap-1">
                        <mat-icon class="text-[12px]">{{ getIconForType(q.type) }}</mat-icon>
                        <span>{{ q.type }}</span>
                      </span>
                      @if (q.required) {
                        <span class="text-rose-600 font-bold text-xs">* Required</span>
                      }
                      @if (q.skipLogic) {
                        <span class="px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-mono">
                          Skip Logic Active
                        </span>
                      }
                    </div>

                    <!-- Actions: Move, Select, Delete -->
                    <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        (click)="moveQuestion(i, 'up')"
                        [disabled]="i === 0"
                        class="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                        title="Move question up">
                        <mat-icon class="text-xs">arrow_upward</mat-icon>
                      </button>
                      <button
                        type="button"
                        (click)="moveQuestion(i, 'down')"
                        [disabled]="i === form.questions.length - 1"
                        class="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                        title="Move question down">
                        <mat-icon class="text-xs">arrow_downward</mat-icon>
                      </button>
                      <button
                        type="button"
                        (click)="selectQuestion(q)"
                        class="px-2 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-50 rounded"
                        title="Edit question settings">
                        Configure
                      </button>
                      <button
                        type="button"
                        (click)="deleteQuestion(q.id)"
                        class="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                        title="Delete question">
                        <mat-icon class="text-xs">delete</mat-icon>
                      </button>
                    </div>
                  </div>

                  <!-- Question Body Preview -->
                  <div class="mt-2.5">
                    <p class="text-xs sm:text-sm font-semibold text-slate-900">{{ q.label }}</p>
                    @if (q.hint) {
                      <p class="text-[11px] text-slate-500 mt-0.5 italic">{{ q.hint }}</p>
                    }

                    <!-- Variable Name & Options -->
                    <div class="mt-2 flex items-center gap-2 text-[11px] font-mono text-slate-500">
                      <span>var: <code class="bg-slate-100 px-1 py-0.5 rounded text-slate-800">{{ q.name }}</code></span>
                      @if (q.options && q.options.length) {
                        <span>· {{ q.options.length }} options</span>
                      }
                    </div>

                    <!-- Skip logic display -->
                    @if (q.skipLogic) {
                      <div class="mt-2 p-2 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[11px] text-amber-900 font-mono">
                        <span>Show only if: </span>
                        <strong>{{ q.skipLogic.questionName }}</strong> {{ q.skipLogic.operator }} <em>"{{ q.skipLogic.value }}"</em>
                      </div>
                    }
                  </div>
                </div>
              } @empty {
                <div class="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-500">
                  <mat-icon class="text-3xl text-slate-300 mb-2">post_add</mat-icon>
                  <p class="text-sm font-semibold">No questions added yet</p>
                  <p class="text-xs text-slate-400 mt-1">Select any field type from the left palette to begin designing your survey.</p>
                </div>
              }
            </div>
          }
        </div>

        <!-- RIGHT: Question Configurator & Inspector (3 Cols) -->
        <div class="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <mat-icon class="text-xs text-teal-800">tune</mat-icon>
              <span>Field Properties</span>
            </h2>
            @if (activeQuestion()) {
              <button
                type="button"
                (click)="selectedQuestionId.set(null)"
                class="text-[10px] text-slate-400 hover:text-slate-700">
                Close
              </button>
            }
          </div>

          @if (activeQuestion(); as q) {
            <div class="space-y-3.5 text-xs">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Question Label</label>
                <textarea
                  [value]="q.label"
                  (input)="onQuestionLabelChange(q, $event)"
                  rows="2"
                  class="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-teal-700"></textarea>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Data Variable Name (ODK)</label>
                <input
                  type="text"
                  [value]="q.name"
                  (input)="onQuestionNameChange(q, $event)"
                  class="w-full text-xs font-mono border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-teal-700" />
                <span class="text-[10px] text-slate-400">Unique alphanumeric code (e.g. q_hh_income)</span>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Guidance / Hint Text</label>
                <input
                  type="text"
                  [value]="q.hint || ''"
                  (input)="onQuestionHintChange(q, $event)"
                  placeholder="Instructions for field enumerator..."
                  class="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-teal-700" />
              </div>

              <div class="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span class="font-semibold text-slate-700">Required Field</span>
                <input
                  type="checkbox"
                  [checked]="q.required"
                  (change)="toggleRequired(q)"
                  class="h-4 w-4 text-teal-700 rounded border-slate-300 focus:ring-teal-700" />
              </div>

              <!-- Options Editor for Choice Questions -->
              @if (isChoiceQuestion(q.type)) {
                <div class="space-y-2 border-t border-slate-100 pt-3">
                  <div class="flex items-center justify-between">
                    <label class="font-semibold text-slate-700">Options List</label>
                    <button
                      type="button"
                      (click)="addOption(q)"
                      class="text-[10px] text-teal-800 hover:text-teal-950 font-bold flex items-center gap-0.5">
                      <mat-icon class="text-[11px]">add</mat-icon>
                      <span>Add Option</span>
                    </button>
                  </div>

                  <div class="space-y-1.5">
                    @for (opt of q.options || []; track $index; let optIdx = $index) {
                      <div class="flex items-center gap-1.5">
                        <input
                          type="text"
                          [value]="opt"
                          (input)="updateOption(q, optIdx, $event)"
                          class="flex-1 text-xs border border-slate-200 rounded px-2 py-1" />
                        <button
                          type="button"
                          (click)="removeOption(q, optIdx)"
                          class="text-slate-400 hover:text-rose-600 p-1">
                          <mat-icon class="text-xs">close</mat-icon>
                        </button>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Skip Logic / Conditional Branching Editor -->
              <div class="border-t border-slate-100 pt-3 space-y-2">
                <div class="flex items-center justify-between">
                  <label class="font-semibold text-slate-700">Skip Logic / Branching</label>
                  @if (q.skipLogic) {
                    <button
                      type="button"
                      (click)="removeSkipLogic(q)"
                      class="text-[10px] text-rose-600 hover:text-rose-800 font-semibold">
                      Clear Logic
                    </button>
                  }
                </div>

                @if (q.skipLogic) {
                  <div class="space-y-2 p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg text-xs">
                    <div>
                      <span class="text-[11px] text-slate-600 block mb-0.5">Depends On Question:</span>
                      <select
                        [value]="q.skipLogic.questionName"
                        (change)="updateSkipLogicQuestion(q, $event)"
                        class="w-full text-xs bg-white border border-slate-300 rounded p-1">
                        @for (other of getAvailableConditionQuestions(q.id); track other.id) {
                          <option [value]="other.name">{{ other.label.substring(0, 30) }} ({{ other.name }})</option>
                        }
                      </select>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <span class="text-[11px] text-slate-600 block mb-0.5">Condition:</span>
                        <select
                          [value]="q.skipLogic.operator"
                          (change)="updateSkipLogicOperator(q, $event)"
                          class="w-full text-xs bg-white border border-slate-300 rounded p-1">
                          <option value="equals">Equals</option>
                          <option value="not_equals">Not Equals</option>
                          <option value="contains">Contains</option>
                        </select>
                      </div>
                      <div>
                        <span class="text-[11px] text-slate-600 block mb-0.5">Trigger Value:</span>
                        <input
                          type="text"
                          [value]="q.skipLogic.value"
                          (input)="updateSkipLogicValue(q, $event)"
                          class="w-full text-xs bg-white border border-slate-300 rounded p-1" />
                      </div>
                    </div>
                  </div>
                } @else {
                  <button
                    type="button"
                    (click)="enableSkipLogic(q)"
                    class="w-full py-1.5 border border-dashed border-slate-300 hover:border-teal-700 text-slate-600 hover:text-teal-900 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                    <mat-icon class="text-xs">call_split</mat-icon>
                    <span>Add Skip Condition</span>
                  </button>
                }
              </div>
            </div>
          } @else {
            <div class="py-12 text-center text-slate-400 text-xs">
              <mat-icon class="text-3xl text-slate-300 mb-1">touch_app</mat-icon>
              <p class="font-medium">No question selected</p>
              <p class="text-[11px] mt-1">Click "Configure" on any question card in the center canvas to customize properties.</p>
            </div>
          }
        </div>
      </div>

      <!-- Live Device Preview Simulator Modal -->
      @if (isPreviewModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <!-- Modal Header -->
            <div class="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div class="flex items-center gap-3">
                <mat-icon class="text-teal-800">devices</mat-icon>
                <div>
                  <h3 class="text-sm font-bold text-slate-900">Interactive Device Preview Simulator</h3>
                  <p class="text-[11px] text-slate-500">Test real-time skip logic, required validations, and mobile responsiveness</p>
                </div>
              </div>

              <!-- Viewport Switcher -->
              <div class="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg text-xs font-semibold text-slate-700">
                <button
                  type="button"
                  (click)="previewDevice.set('mobile')"
                  [class]="previewDevice() === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'"
                  class="px-2.5 py-1 rounded-md flex items-center gap-1">
                  <mat-icon class="text-xs">smartphone</mat-icon>
                  <span>Mobile</span>
                </button>
                <button
                  type="button"
                  (click)="previewDevice.set('tablet')"
                  [class]="previewDevice() === 'tablet' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'"
                  class="px-2.5 py-1 rounded-md flex items-center gap-1">
                  <mat-icon class="text-xs">tablet</mat-icon>
                  <span>Tablet</span>
                </button>
                <button
                  type="button"
                  (click)="previewDevice.set('desktop')"
                  [class]="previewDevice() === 'desktop' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'"
                  class="px-2.5 py-1 rounded-md flex items-center gap-1">
                  <mat-icon class="text-xs">computer</mat-icon>
                  <span>Desktop</span>
                </button>
              </div>

              <button
                type="button"
                (click)="isPreviewModalOpen.set(false)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <!-- Preview Container Frame -->
            <div class="flex-1 overflow-y-auto p-6 bg-slate-100 flex justify-center">
              <div
                class="bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-5 transition-all duration-300"
                [class.w-full]="previewDevice() === 'desktop'"
                [class.max-w-2xl]="previewDevice() === 'tablet'"
                [class.max-w-sm]="previewDevice() === 'mobile'">

                <!-- Survey Header in Simulator -->
                <div class="border-b border-slate-200 pb-3">
                  <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                    {{ activeForm().category }} · {{ activeForm().version }}
                  </span>
                  <h2 class="text-base font-bold text-slate-900 mt-2">{{ activeForm().title }}</h2>
                  <p class="text-xs text-slate-600 mt-1">{{ activeForm().description }}</p>
                </div>

                <!-- Render Survey Questions with Live Logic -->
                <div class="space-y-4">
                  @for (q of activeForm().questions; track q.id; let i = $index) {
                    @if (isQuestionVisibleInPreview(q)) {
                      <div class="space-y-1.5 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                        <label class="block text-xs font-bold text-slate-800">
                          <span class="text-slate-500 font-mono">{{ i + 1 }}.</span> {{ q.label }}
                          @if (q.required) {
                            <span class="text-rose-600">*</span>
                          }
                        </label>
                        @if (q.hint) {
                          <p class="text-[11px] text-slate-500 italic">{{ q.hint }}</p>
                        }

                        <!-- Dynamic Input Renderer by Type -->
                        @switch (q.type) {
                          @case ('text') {
                            <input
                              type="text"
                              [value]="previewAnswers()[q.name] || ''"
                              (input)="onPreviewAnswerChange(q.name, $event)"
                              placeholder="Enter text answer..."
                              class="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-teal-700" />
                          }
                          @case ('textarea') {
                            <textarea
                              rows="3"
                              [value]="previewAnswers()[q.name] || ''"
                              (input)="onPreviewAnswerChange(q.name, $event)"
                              placeholder="Enter detailed narrative..."
                              class="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-700"></textarea>
                          }
                          @case ('number') {
                            <input
                              type="number"
                              [value]="previewAnswers()[q.name] || ''"
                              (input)="onPreviewAnswerChange(q.name, $event)"
                              placeholder="e.g. 24"
                              class="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-teal-700" />
                          }
                          @case ('select_one') {
                            <div class="space-y-1.5 mt-1">
                              @for (opt of q.options; track opt) {
                                <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                  <input
                                    type="radio"
                                    [name]="'preview_' + q.name"
                                    [value]="opt"
                                    [checked]="previewAnswers()[q.name] === opt"
                                    (change)="onPreviewRadioSelect(q.name, opt)"
                                    class="text-teal-700 focus:ring-teal-700" />
                                  <span>{{ opt }}</span>
                                </label>
                              }
                            </div>
                          }
                          @case ('select_multiple') {
                            <div class="space-y-1.5 mt-1">
                              @for (opt of q.options; track opt) {
                                <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    [value]="opt"
                                    class="text-teal-700 rounded focus:ring-teal-700" />
                                  <span>{{ opt }}</span>
                                </label>
                              }
                            </div>
                          }
                          @case ('dropdown') {
                            <select
                              [value]="previewAnswers()[q.name] || ''"
                              (change)="onPreviewAnswerChange(q.name, $event)"
                              class="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-teal-700">
                              <option value="">-- Choose option --</option>
                              @for (opt of q.options; track opt) {
                                <option [value]="opt">{{ opt }}</option>
                              }
                            </select>
                          }
                          @case ('date') {
                            <input
                              type="date"
                              [value]="previewAnswers()[q.name] || ''"
                              (input)="onPreviewAnswerChange(q.name, $event)"
                              class="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-teal-700" />
                          }
                          @case ('geopoint') {
                            <div class="flex items-center gap-2">
                              <input
                                type="text"
                                readonly
                                value="27.7172° N, 85.3240° E (Acc: 3.2m)"
                                class="flex-1 text-xs font-mono bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-700" />
                              <button
                                type="button"
                                class="px-3 py-2 bg-teal-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs">
                                <mat-icon class="text-xs">my_location</mat-icon>
                                <span>Get GPS</span>
                              </button>
                            </div>
                          }
                          @case ('rating') {
                            <div class="flex items-center gap-2 py-1">
                              @for (star of [1,2,3,4,5]; track star) {
                                <button
                                  type="button"
                                  (click)="setPreviewRating(q.name, star)"
                                  class="text-amber-500 hover:scale-110 transition-transform">
                                  <mat-icon class="text-xl">
                                    {{ (previewAnswers()[q.name] || 0) >= star ? 'star' : 'star_border' }}
                                  </mat-icon>
                                </button>
                              }
                              <span class="text-xs text-slate-500 ml-2 font-mono">
                                {{ previewAnswers()[q.name] ? previewAnswers()[q.name] + ' / 5' : 'Unrated' }}
                              </span>
                            </div>
                          }
                          @case ('image') {
                            <div class="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center text-slate-500 bg-white">
                              <mat-icon class="text-2xl text-slate-400">add_a_photo</mat-icon>
                              <p class="text-xs font-medium mt-1">Tap to capture or upload field photo</p>
                              <span class="text-[10px] text-slate-400">JPEG/PNG up to 10MB</span>
                            </div>
                          }
                          @case ('signature') {
                            <div class="border border-slate-300 rounded-lg bg-white p-3 space-y-1">
                              <div class="h-20 bg-slate-50 rounded border border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-serif italic text-sm">
                                [ Interactive Beneficiary Sign-Off Canvas ]
                              </div>
                              <div class="flex justify-between items-center text-[10px] text-slate-400">
                                <span>Sign above line</span>
                                <button type="button" class="text-slate-600 hover:text-slate-900 underline">Clear</button>
                              </div>
                            </div>
                          }
                          @default {
                            <input
                              type="text"
                              placeholder="Standard field entry..."
                              class="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2" />
                          }
                        }
                      </div>
                    }
                  }
                </div>

                <!-- Submit Button in Simulator -->
                <div class="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    (click)="submitPreviewForm()"
                    class="w-full py-2.5 bg-teal-900 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                    <mat-icon class="text-xs">send</mat-icon>
                    <span>Submit Simulated Record</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Share & QR Modal -->
      @if (isShareModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-teal-800">share</mat-icon>
                <h3 class="text-sm font-bold text-slate-900">Share Survey to Field Enumerators</h3>
              </div>
              <button
                type="button"
                (click)="isShareModalOpen.set(false)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <div class="text-center space-y-3">
              <!-- Visual Simulated QR Code -->
              <div class="w-48 h-48 mx-auto bg-slate-900 p-3 rounded-xl flex items-center justify-center shadow-md">
                <div class="w-full h-full bg-white p-2 rounded-lg flex flex-col items-center justify-center">
                  <mat-icon class="text-6xl text-slate-900">qr_code_2</mat-icon>
                  <span class="text-[9px] font-mono text-slate-500 mt-1">{{ activeForm().id }}</span>
                </div>
              </div>

              <p class="text-xs text-slate-600">
                Scan with <strong>LogAlto Mobile App</strong>, <strong>ODK Collect</strong>, or <strong>KoboCollect</strong> for instant offline caching.
              </p>

              <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  readonly
                  [value]="getShareUrl()"
                  class="flex-1 text-[11px] font-mono bg-transparent text-slate-700 outline-hidden" />
                <button
                  type="button"
                  (click)="copyShareUrl()"
                  class="px-2.5 py-1 bg-slate-900 text-white rounded text-[10px] font-semibold shrink-0">
                  {{ urlCopied() ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class FormBuilderView {
  readonly mealService = inject(MealDataService);

  readonly selectedFormId = signal<string>('form-pdm-1');
  readonly selectedQuestionId = signal<string | null>(null);

  // Modals & Preview State
  readonly isPreviewModalOpen = signal<boolean>(false);
  readonly isShareModalOpen = signal<boolean>(false);
  readonly previewDevice = signal<'mobile' | 'tablet' | 'desktop'>('mobile');
  readonly previewAnswers = signal<Record<string, any>>({});
  readonly urlCopied = signal<boolean>(false);

  readonly activeForm = computed(() => {
    return this.mealService.customForms().find(f => f.id === this.selectedFormId()) || this.mealService.customForms()[0];
  });

  readonly activeQuestion = computed(() => {
    const form = this.activeForm();
    if (!form || !this.selectedQuestionId()) return null;
    return form.questions.find(q => q.id === this.selectedQuestionId()) || null;
  });

  // 14 Palettes categorized
  readonly paletteBasic: PaletteItem[] = [
    { type: 'text', label: 'Short Text', icon: 'short_text', category: 'Basic', defaultLabel: 'Short narrative response' },
    { type: 'textarea', label: 'Paragraph / Notes', icon: 'notes', category: 'Basic', defaultLabel: 'Detailed observation or explanation' },
    { type: 'number', label: 'Integer Number', icon: 'tag', category: 'Basic', defaultLabel: 'Numeric count (e.g. persons, days)' },
    { type: 'decimal', label: 'Decimal / Measurement', icon: 'money', category: 'Basic', defaultLabel: 'Decimal measurement (e.g. meters, NPR)' }
  ];

  readonly paletteSelection: PaletteItem[] = [
    { type: 'select_one', label: 'Single Choice (Radio)', icon: 'radio_button_checked', category: 'Selection', defaultLabel: 'Select one option' },
    { type: 'select_multiple', label: 'Multiple Choice (Checkbox)', icon: 'check_box', category: 'Selection', defaultLabel: 'Select all applicable options' },
    { type: 'dropdown', label: 'Dropdown List', icon: 'arrow_drop_down_circle', category: 'Selection', defaultLabel: 'Choose from predefined list' },
    { type: 'rating', label: 'Likert / Rating Scale (1-5)', icon: 'star', category: 'Selection', defaultLabel: 'Overall satisfaction or quality rating' }
  ];

  readonly paletteMedia: PaletteItem[] = [
    { type: 'date', label: 'Calendar Date', icon: 'calendar_today', category: 'Advanced', defaultLabel: 'Date of event or monitoring' },
    { type: 'time', label: 'Time of Day', icon: 'schedule', category: 'Advanced', defaultLabel: 'Time of observation' },
    { type: 'geopoint', label: 'GPS Geopoint (Lat/Lng)', icon: 'location_on', category: 'Media', defaultLabel: 'GPS Coordinates with accuracy radius' },
    { type: 'image', label: 'Photo / Media Upload', icon: 'camera_alt', category: 'Media', defaultLabel: 'Capture photo of site, voucher, or structure' },
    { type: 'signature', label: 'Digital Signature Pad', icon: 'draw', category: 'Media', defaultLabel: 'Beneficiary or assessor digital sign-off' },
    { type: 'repeat_group', label: 'Repeat Roster / Sub-group', icon: 'table_rows', category: 'Advanced', defaultLabel: 'Household members repeat group' }
  ];

  getIconForType(type: FormQuestionType): string {
    const all = [...this.paletteBasic, ...this.paletteSelection, ...this.paletteMedia];
    return all.find(i => i.type === type)?.icon || 'help';
  }

  isChoiceQuestion(type: FormQuestionType): boolean {
    return ['select_one', 'select_multiple', 'dropdown'].includes(type);
  }

  onFormSelect(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedFormId.set(val);
    this.selectedQuestionId.set(null);
  }

  selectQuestion(q: FormQuestion) {
    this.selectedQuestionId.set(q.id);
  }

  createNewForm() {
    const newId = 'form-' + Date.now();
    const newForm: CustomFormDef = {
      id: newId,
      projectId: this.mealService.selectedProjectId() === 'all' ? 'proj-bcrp' : this.mealService.selectedProjectId(),
      title: 'New M&E Field Assessment Survey',
      category: 'Routine Monitoring',
      version: 'v1.0',
      status: 'Draft',
      description: 'Standard MEAL survey with disaggregation and means of verification.',
      submissionsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      questions: [
        { id: 'q-' + Date.now() + '-1', name: 'enumerator_name', label: 'Enumerator / MEAL Officer Name', type: 'text', required: true },
        { id: 'q-' + Date.now() + '-2', name: 'gps_point', label: 'Interview GPS Coordinates', type: 'geopoint', required: true }
      ]
    };
    this.mealService.saveFormDef(newForm);
    this.selectedFormId.set(newId);
    this.selectedQuestionId.set(newForm.questions[0].id);
  }

  addQuestionFromPalette(type: FormQuestionType, defaultLabel: string) {
    const form = this.activeForm();
    if (!form) return;

    const count = form.questions.length + 1;
    const newQ: FormQuestion = {
      id: 'q-' + Date.now(),
      name: `q_${type}_${count}`,
      label: defaultLabel,
      type,
      required: false,
      options: this.isChoiceQuestion(type) ? ['Option A', 'Option B', 'Option C'] : undefined
    };

    this.mealService.addQuestionToForm(form.id, newQ);
    this.selectedQuestionId.set(newQ.id);
  }

  deleteQuestion(qId: string) {
    const form = this.activeForm();
    if (!form) return;
    this.mealService.deleteQuestionFromForm(form.id, qId);
    if (this.selectedQuestionId() === qId) {
      this.selectedQuestionId.set(null);
    }
  }

  moveQuestion(index: number, direction: 'up' | 'down') {
    const form = this.activeForm();
    if (!form) return;
    const questions = [...form.questions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;

    const temp = questions[index];
    questions[index] = questions[targetIdx];
    questions[targetIdx] = temp;

    this.mealService.saveFormDef({
      ...form,
      questions
    });
  }

  // Question editing handlers
  onQuestionLabelChange(q: FormQuestion, ev: Event) {
    const label = (ev.target as HTMLTextAreaElement).value;
    this.updateQuestion({ ...q, label });
  }

  onQuestionNameChange(q: FormQuestion, ev: Event) {
    const name = (ev.target as HTMLInputElement).value.replace(/[^a-zA-Z0-9_]/g, '');
    this.updateQuestion({ ...q, name });
  }

  onQuestionHintChange(q: FormQuestion, ev: Event) {
    const hint = (ev.target as HTMLInputElement).value;
    this.updateQuestion({ ...q, hint });
  }

  toggleRequired(q: FormQuestion) {
    this.updateQuestion({ ...q, required: !q.required });
  }

  addOption(q: FormQuestion) {
    const opts = q.options ? [...q.options, `Option ${q.options.length + 1}`] : ['Option 1'];
    this.updateQuestion({ ...q, options: opts });
  }

  updateOption(q: FormQuestion, index: number, ev: Event) {
    const val = (ev.target as HTMLInputElement).value;
    if (!q.options) return;
    const opts = [...q.options];
    opts[index] = val;
    this.updateQuestion({ ...q, options: opts });
  }

  removeOption(q: FormQuestion, index: number) {
    if (!q.options) return;
    const opts = q.options.filter((_, i) => i !== index);
    this.updateQuestion({ ...q, options: opts });
  }

  enableSkipLogic(q: FormQuestion) {
    const avail = this.getAvailableConditionQuestions(q.id);
    const firstOther = avail[0]?.name || 'previous_question';
    const rule: FormSkipLogicRule = {
      questionName: firstOther,
      operator: 'equals',
      value: 'Yes'
    };
    this.updateQuestion({ ...q, skipLogic: rule });
  }

  removeSkipLogic(q: FormQuestion) {
    const updated = { ...q };
    delete updated.skipLogic;
    this.updateQuestion(updated);
  }

  updateSkipLogicQuestion(q: FormQuestion, ev: Event) {
    const qName = (ev.target as HTMLSelectElement).value;
    if (!q.skipLogic) return;
    this.updateQuestion({ ...q, skipLogic: { ...q.skipLogic, questionName: qName } });
  }

  updateSkipLogicOperator(q: FormQuestion, ev: Event) {
    const op = (ev.target as HTMLSelectElement).value as any;
    if (!q.skipLogic) return;
    this.updateQuestion({ ...q, skipLogic: { ...q.skipLogic, operator: op } });
  }

  updateSkipLogicValue(q: FormQuestion, ev: Event) {
    const val = (ev.target as HTMLInputElement).value;
    if (!q.skipLogic) return;
    this.updateQuestion({ ...q, skipLogic: { ...q.skipLogic, value: val } });
  }

  private updateQuestion(q: FormQuestion) {
    const form = this.activeForm();
    if (!form) return;
    this.mealService.updateQuestionInForm(form.id, q);
  }

  getAvailableConditionQuestions(currentQId: string): FormQuestion[] {
    const form = this.activeForm();
    if (!form) return [];
    return form.questions.filter(q => q.id !== currentQId);
  }

  // Form Header metadata updaters
  updateFormTitle(ev: Event) {
    const form = this.activeForm();
    if (!form) return;
    const title = (ev.target as HTMLInputElement).value;
    this.mealService.saveFormDef({ ...form, title });
  }

  updateFormDescription(ev: Event) {
    const form = this.activeForm();
    if (!form) return;
    const description = (ev.target as HTMLTextAreaElement).value;
    this.mealService.saveFormDef({ ...form, description });
  }

  updateFormCategory(ev: Event) {
    const form = this.activeForm();
    if (!form) return;
    const category = (ev.target as HTMLSelectElement).value as any;
    this.mealService.saveFormDef({ ...form, category });
  }

  updateFormVersion(ev: Event) {
    const form = this.activeForm();
    if (!form) return;
    const version = (ev.target as HTMLInputElement).value;
    this.mealService.saveFormDef({ ...form, version });
  }

  updateFormLinkedIndicator(ev: Event) {
    const form = this.activeForm();
    if (!form) return;
    const linkedIndicatorId = (ev.target as HTMLSelectElement).value || undefined;
    this.mealService.saveFormDef({ ...form, linkedIndicatorId });
  }

  getLinkedIndicatorCode(indId: string): string {
    const ind = this.mealService.indicators().find(i => i.id === indId);
    return ind ? ind.code : indId;
  }

  // Preview Simulator Logic
  openPreviewModal() {
    this.previewAnswers.set({});
    this.isPreviewModalOpen.set(true);
  }

  onPreviewAnswerChange(varName: string, ev: Event) {
    const val = (ev.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
    this.previewAnswers.update(curr => ({ ...curr, [varName]: val }));
  }

  onPreviewRadioSelect(varName: string, val: string) {
    this.previewAnswers.update(curr => ({ ...curr, [varName]: val }));
  }

  setPreviewRating(varName: string, stars: number) {
    this.previewAnswers.update(curr => ({ ...curr, [varName]: stars }));
  }

  isQuestionVisibleInPreview(q: FormQuestion): boolean {
    if (!q.skipLogic) return true;
    const targetVal = this.previewAnswers()[q.skipLogic.questionName];
    if (targetVal === undefined || targetVal === null) return false;

    if (q.skipLogic.operator === 'equals') {
      return String(targetVal).trim().toLowerCase() === String(q.skipLogic.value).trim().toLowerCase();
    }
    if (q.skipLogic.operator === 'not_equals') {
      return String(targetVal).trim().toLowerCase() !== String(q.skipLogic.value).trim().toLowerCase();
    }
    if (q.skipLogic.operator === 'contains') {
      return String(targetVal).toLowerCase().includes(String(q.skipLogic.value).toLowerCase());
    }
    return true;
  }

  submitPreviewForm() {
    const form = this.activeForm();
    if (!form) return;

    // Simulate submission into mobile submissions
    this.mealService.submitMobileRecord({
      formId: form.id,
      formTitle: form.title,
      enumeratorName: 'Preview Test Enumerator',
      deviceId: 'BROWSER-SIMULATOR',
      isOfflineDraft: false,
      gps: { latitude: 27.7172, longitude: 85.3240, accuracy: 3.2, locationName: 'Kathmandu Headquarters' },
      photoAttached: true,
      signatureCaptured: true,
      data: this.previewAnswers()
    });

    this.isPreviewModalOpen.set(false);
  }

  // Share & Export
  openShareModal() {
    this.urlCopied.set(false);
    this.isShareModalOpen.set(true);
  }

  getShareUrl(): string {
    const form = this.activeForm();
    return `https://collect.logalto.idrcef.org/enketo/survey/${form?.id || 'form-1'}?v=2.4`;
  }

  copyShareUrl() {
    navigator.clipboard?.writeText(this.getShareUrl());
    this.urlCopied.set(true);
    setTimeout(() => this.urlCopied.set(false), 2500);
  }

  exportXlsForm() {
    const form = this.activeForm();
    if (!form) return;

    // Generate XLSForm structured JSON / CSV representation
    const surveyRows = [
      ['type', 'name', 'label', 'required', 'relevant', 'hint'],
      ...form.questions.map(q => [
        q.type,
        q.name,
        `"${q.label}"`,
        q.required ? 'yes' : 'no',
        q.skipLogic ? `\${${q.skipLogic.questionName}} = '${q.skipLogic.value}'` : '',
        q.hint ? `"${q.hint}"` : ''
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + surveyRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${form.id}_xlsform_schema.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
