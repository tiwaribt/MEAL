import { ChangeDetectionStrategy, Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { MealIndicator } from '../models/meal.model';

@Component({
  selector: 'app-logframe-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Section Header -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Project Monitoring Plan</span>
            <span aria-hidden="true">·</span>
            <span>Logical Framework & PIRS Matrix</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Indicators & LogFrame Management
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">
            Track quantitative & qualitative indicators against USAID/FCDO donor baselines, disaggregated by gender, vulnerability, and caste.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            (click)="triggerAiAssist.emit()"
            class="px-3 py-1.5 bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">auto_awesome</mat-icon>
            <span>AI Formulate PIRS</span>
          </button>
          <button
            type="button"
            (click)="openAddModal()"
            class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">add</mat-icon>
            <span>New Indicator</span>
          </button>
          <button
            type="button"
            (click)="exportCsv()"
            class="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">download</mat-icon>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <!-- Filters & Level Tabs -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
        <div class="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            type="button"
            (click)="selectedLevel.set('all')"
            [class]="selectedLevel() === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
            class="px-3 py-1 rounded-md transition-colors">
            All Levels ({{ mealService.filteredIndicators().length }})
          </button>
          <button
            type="button"
            (click)="selectedLevel.set('Outcome')"
            [class]="selectedLevel() === 'Outcome' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
            class="px-3 py-1 rounded-md transition-colors">
            Outcomes
          </button>
          <button
            type="button"
            (click)="selectedLevel.set('Output')"
            [class]="selectedLevel() === 'Output' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
            class="px-3 py-1 rounded-md transition-colors">
            Outputs
          </button>
        </div>

        <div class="relative w-full sm:w-72">
          <input
            type="text"
            [value]="mealService.searchQuery()"
            (input)="onSearchInput($event)"
            placeholder="Search indicator code, title, MoV..."
            class="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-teal-700" />
          <mat-icon class="text-xs text-slate-400 absolute left-2.5 top-2 pointer-events-none">search</mat-icon>
        </div>
      </div>

      <!-- Indicators Detailed Table / Grid -->
      <div class="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold tracking-wider">
                <th class="py-3 px-4">Code & Indicator Title</th>
                <th class="py-3 px-4">Level</th>
                <th class="py-3 px-4 text-right">Baseline</th>
                <th class="py-3 px-4 text-right">Annual Target</th>
                <th class="py-3 px-4 text-right">Actual to Date</th>
                <th class="py-3 px-4 text-center">Progress %</th>
                <th class="py-3 px-4">Disaggregation Reach</th>
                <th class="py-3 px-4">Means of Verification (MoV)</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (ind of displayedIndicators(); track ind.id) {
                <tr class="hover:bg-slate-50/80 transition-colors">
                  <!-- Title -->
                  <td class="py-3.5 px-4 max-w-sm">
                    <div class="flex flex-col gap-0.5">
                      <div class="flex items-center gap-1.5">
                        <span class="font-mono font-bold text-slate-900">{{ ind.code }}</span>
                        <span class="text-slate-400">·</span>
                        <span class="text-slate-500 text-[11px]">{{ ind.frequency }}</span>
                      </div>
                      <span class="text-slate-800 font-medium leading-snug">{{ ind.title }}</span>
                      <span class="text-slate-500 text-[11px]">Source: {{ ind.dataSource }}</span>
                    </div>
                  </td>

                  <!-- Level -->
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <span class="font-semibold text-slate-700">
                      {{ ind.level }}
                    </span>
                  </td>

                  <!-- Baseline -->
                  <td class="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600">
                    {{ ind.baseline | number }} {{ ind.unit }}
                  </td>

                  <!-- Annual Target -->
                  <td class="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                    {{ ind.targetAnnual | number }} {{ ind.unit }}
                  </td>

                  <!-- Actuals to Date -->
                  <td class="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    {{ ind.actualTotal | number }}
                  </td>

                  <!-- Progress -->
                  <td class="py-3.5 px-4 text-center">
                    <div class="flex flex-col items-center gap-1">
                      <span
                        class="font-mono font-bold text-xs tabular-nums"
                        [class.text-emerald-800]="ind.status === 'on_track'"
                        [class.text-amber-800]="ind.status === 'warning'"
                        [class.text-rose-800]="ind.status === 'off_track'">
                        {{ ind.progressPercent }}%
                      </span>
                      <div class="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          class="h-full rounded-full"
                          [style.width.%]="ind.progressPercent > 100 ? 100 : ind.progressPercent"
                          [class.bg-teal-700]="ind.status === 'on_track'"
                          [class.bg-amber-600]="ind.status === 'warning'"
                          [class.bg-rose-600]="ind.status === 'off_track'"></div>
                      </div>
                    </div>
                  </td>

                  <!-- Disaggregation -->
                  <td class="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    <div class="flex flex-col gap-0.5 text-[11px] font-mono tabular-nums">
                      <span>F: <strong class="text-slate-800">{{ ind.disaggregation.female | number }}</strong> · M: {{ ind.disaggregation.male | number }}</span>
                      <span>Marginalized: <strong class="text-slate-800">{{ ind.disaggregation.marginalized | number }}</strong> · PWD: {{ ind.disaggregation.pwd | number }}</span>
                    </div>
                  </td>

                  <!-- Means of Verification -->
                  <td class="py-3.5 px-4 max-w-xs text-slate-600 text-[11px]">
                    {{ ind.meansOfVerification }}
                  </td>

                  <!-- Actions -->
                  <td class="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      (click)="mealService.setActiveTab('mobile-collection')"
                      class="px-2 py-1 text-emerald-700 hover:text-emerald-900 font-medium hover:bg-emerald-50 rounded transition-colors mr-1"
                      title="Collect data for this indicator via Mobile Collector">
                      <mat-icon class="text-xs align-middle">cell_tower</mat-icon>
                      <span class="text-[11px] ml-0.5">Collect</span>
                    </button>
                    <button
                      type="button"
                      (click)="openEditModal(ind)"
                      class="px-2 py-1 text-teal-800 hover:text-teal-950 font-medium hover:bg-teal-50 rounded transition-colors"
                      title="Update Actuals">
                      Update
                    </button>
                    <button
                      type="button"
                      (click)="viewPirsDetails(ind)"
                      class="px-2 py-1 text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-100 rounded transition-colors"
                      title="View full PIRS sheet">
                      PIRS
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="9" class="py-12 text-center text-slate-500">
                    <mat-icon class="text-3xl text-slate-300 mb-2">track_changes</mat-icon>
                    <p class="text-sm font-medium">No indicators match your filter</p>
                    <p class="text-xs text-slate-400 mt-1">Try changing project selection or clearing the search query.</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- PIRS Detailed Reference Sheet Modal -->
      @if (selectedPirs(); as pirs) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span class="text-xs font-mono font-bold text-teal-800">{{ pirs.code }}</span>
                <h3 class="text-base font-bold text-slate-900">Performance Indicator Reference Sheet (PIRS)</h3>
              </div>
              <button
                type="button"
                (click)="selectedPirs.set(null)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <div class="p-6 overflow-y-auto space-y-4 text-xs">
              <div class="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                <div>
                  <span class="text-slate-500 font-semibold uppercase tracking-wider block mb-1">Indicator Level</span>
                  <span class="text-slate-900 font-medium">{{ pirs.level }}</span>
                </div>
                <div>
                  <span class="text-slate-500 font-semibold uppercase tracking-wider block mb-1">Unit of Measure</span>
                  <span class="text-slate-900 font-medium">{{ pirs.unit }}</span>
                </div>
              </div>

              <div>
                <span class="text-slate-500 font-semibold uppercase tracking-wider block mb-1">Full Indicator Definition</span>
                <p class="text-slate-800 text-sm leading-relaxed">{{ pirs.title }}</p>
              </div>

              <div class="grid grid-cols-3 gap-4 border-y border-slate-100 py-3 bg-slate-50/50 p-3 rounded-lg">
                <div>
                  <span class="text-slate-500 block mb-0.5">Baseline</span>
                  <span class="font-mono text-base font-bold text-slate-900">{{ pirs.baseline | number }}</span>
                </div>
                <div>
                  <span class="text-slate-500 block mb-0.5">Annual Target</span>
                  <span class="font-mono text-base font-bold text-slate-900">{{ pirs.targetAnnual | number }}</span>
                </div>
                <div>
                  <span class="text-slate-500 block mb-0.5">Life of Project (LOP)</span>
                  <span class="font-mono text-base font-bold text-slate-900">{{ pirs.targetLOP | number }}</span>
                </div>
              </div>

              <div class="space-y-2">
                <span class="text-slate-500 font-semibold uppercase tracking-wider block">Disaggregation Breakdown</span>
                <div class="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg font-mono tabular-nums text-slate-800">
                  <span>Female: <strong>{{ pirs.disaggregation.female | number }}</strong></span>
                  <span>Male: <strong>{{ pirs.disaggregation.male | number }}</strong></span>
                  <span>Youth (&lt;29): <strong>{{ pirs.disaggregation.youth | number }}</strong></span>
                  <span>PWD: <strong>{{ pirs.disaggregation.pwd | number }}</strong></span>
                  <span>Marginalized: <strong>{{ pirs.disaggregation.marginalized | number }}</strong></span>
                  <span>Other: <strong>{{ pirs.disaggregation.other | number }}</strong></span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                <div>
                  <span class="text-slate-500 font-semibold uppercase tracking-wider block mb-1">Means of Verification (MoV)</span>
                  <p class="text-slate-700 leading-relaxed">{{ pirs.meansOfVerification }}</p>
                </div>
                <div>
                  <span class="text-slate-500 font-semibold uppercase tracking-wider block mb-1">Data Source & Lead</span>
                  <p class="text-slate-700 leading-relaxed">{{ pirs.dataSource }}</p>
                  <p class="text-slate-500 mt-1">Responsible: {{ pirs.responsibleOfficer }}</p>
                </div>
              </div>

              @if (pirs.notes) {
                <div class="p-3 bg-teal-50/60 border border-teal-200 rounded-lg text-teal-950">
                  <span class="font-semibold block mb-0.5">MEAL Monitoring Note:</span>
                  <p>{{ pirs.notes }}</p>
                </div>
              }
            </div>

            <div class="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                (click)="selectedPirs.set(null)"
                class="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800">
                Close PIRS
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Edit / Add Indicator Modal -->
      @if (isEditModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 class="text-sm font-bold text-slate-900">
                {{ editingIndicatorId() ? 'Update Indicator Actuals & Progress' : 'Add New MEAL Indicator' }}
              </h3>
              <button
                type="button"
                (click)="isEditModalOpen.set(false)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="indicatorForm" (ngSubmit)="saveIndicator()" class="p-6 space-y-4 text-xs">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Indicator Title</label>
                <input
                  type="text"
                  formControlName="title"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Level</label>
                  <select
                    formControlName="level"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700">
                    <option value="Outcome">Outcome</option>
                    <option value="Output">Output</option>
                    <option value="Impact">Impact</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Unit of Measure</label>
                  <input
                    type="text"
                    formControlName="unit"
                    placeholder="e.g. Masons, Schools, People"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Annual Target</label>
                  <input
                    type="number"
                    formControlName="targetAnnual"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700 font-mono" />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Quarter Actual</label>
                  <input
                    type="number"
                    formControlName="actualQuarter"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700 font-mono" />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Total Actual</label>
                  <input
                    type="number"
                    formControlName="actualTotal"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700 font-mono" />
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Means of Verification (MoV)</label>
                <input
                  type="text"
                  formControlName="meansOfVerification"
                  placeholder="e.g., Attendance rosters, municipal certifications"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
              </div>

              <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  (click)="isEditModalOpen.set(false)"
                  class="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="indicatorForm.invalid"
                  class="px-4 py-1.5 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class LogframeView {
  readonly mealService = inject(MealDataService);
  readonly triggerAiAssist = output<void>();

  readonly selectedLevel = signal<string>('all');
  readonly selectedPirs = signal<MealIndicator | null>(null);
  readonly isEditModalOpen = signal<boolean>(false);
  readonly editingIndicatorId = signal<string | null>(null);

  readonly indicatorForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    level: new FormControl<'Outcome' | 'Output' | 'Impact'>('Output', [Validators.required]),
    unit: new FormControl('', [Validators.required]),
    targetAnnual: new FormControl(0, [Validators.required, Validators.min(1)]),
    actualQuarter: new FormControl(0, [Validators.required]),
    actualTotal: new FormControl(0, [Validators.required]),
    meansOfVerification: new FormControl('', [Validators.required])
  });

  displayedIndicators() {
    const list = this.mealService.filteredIndicators();
    const lvl = this.selectedLevel();
    if (lvl === 'all') return list;
    return list.filter(i => i.level === lvl);
  }

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.mealService.setSearchQuery(val);
  }

  viewPirsDetails(ind: MealIndicator) {
    this.selectedPirs.set(ind);
  }

  openAddModal() {
    this.editingIndicatorId.set(null);
    this.indicatorForm.reset({
      title: '',
      level: 'Output',
      unit: '',
      targetAnnual: 100,
      actualQuarter: 0,
      actualTotal: 0,
      meansOfVerification: 'Attendance lists & verification sheets'
    });
    this.isEditModalOpen.set(true);
  }

  openEditModal(ind: MealIndicator) {
    this.editingIndicatorId.set(ind.id);
    this.indicatorForm.patchValue({
      title: ind.title,
      level: ind.level,
      unit: ind.unit,
      targetAnnual: ind.targetAnnual,
      actualQuarter: ind.actualQuarter,
      actualTotal: ind.actualTotal,
      meansOfVerification: ind.meansOfVerification
    });
    this.isEditModalOpen.set(true);
  }

  saveIndicator() {
    if (this.indicatorForm.invalid) return;
    const formVal = this.indicatorForm.value;
    const editId = this.editingIndicatorId();

    if (editId) {
      this.mealService.updateIndicatorActuals(editId, Number(formVal.actualQuarter), Number(formVal.actualTotal));
    } else {
      const activeP = this.mealService.activeProject();
      this.mealService.addIndicator({
        projectId: activeP ? activeP.id : 'proj-bcrp',
        logframeId: 'lf-3',
        title: formVal.title || '',
        level: formVal.level || 'Output',
        unit: formVal.unit || '',
        baseline: 0,
        targetAnnual: Number(formVal.targetAnnual),
        targetLOP: Number(formVal.targetAnnual) * 2,
        actualQuarter: Number(formVal.actualQuarter),
        actualTotal: Number(formVal.actualTotal),
        frequency: 'Quarterly',
        meansOfVerification: formVal.meansOfVerification || '',
        dataSource: 'MEAL Field Verification & Roster',
        responsibleOfficer: 'MEAL Specialist',
        status: 'on_track',
        disaggregation: { female: 0, male: 0, other: 0, pwd: 0, marginalized: 0, youth: 0 },
        notes: 'Added via MEAL suite portal'
      });
    }

    this.isEditModalOpen.set(false);
  }

  exportCsv() {
    const list = this.displayedIndicators();
    const rows = [
      ['Code', 'Title', 'Level', 'Unit', 'Baseline', 'Target Annual', 'Actual to Date', 'Progress %', 'MoV', 'Frequency'],
      ...list.map(i => [
        i.code,
        `"${i.title.replace(/"/g, '""')}"`,
        i.level,
        i.unit,
        i.baseline,
        i.targetAnnual,
        i.actualTotal,
        `${i.progressPercent}%`,
        `"${i.meansOfVerification.replace(/"/g, '""')}"`,
        i.frequency
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MEAL_Indicators_PIRS_Tracker_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
