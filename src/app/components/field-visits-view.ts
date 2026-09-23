import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { FieldVisit, QualityCheckItem } from '../models/meal.model';
import { NepalGeoSelector } from './nepal-geo-selector';

@Component({
  selector: 'app-field-visits-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, NepalGeoSelector],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>On-Site Monitoring & Verification</span>
            <span aria-hidden="true">·</span>
            <span>Quality Benchmarks & Compliance</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Field Monitoring Missions & Quality Audits
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">
            Track unannounced site visits, audit mason training compliance, inspect retrofitting works, and enforce corrective action loops.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            (click)="openAddVisitModal()"
            class="px-3.5 py-2 bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">add_location_alt</mat-icon>
            <span>Log Field Visit</span>
          </button>
        </div>
      </div>

      <!-- Nepal Geographic Scope Filter -->
      <app-nepal-geo-selector
        [isCompact]="true"
        title="Filter Field Monitoring Audits by Geographic Division">
      </app-nepal-geo-selector>

      <!-- Visits List & Selected Detail View -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Visits List (Left Column) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between px-1 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Completed Missions ({{ mealService.filteredFieldVisits().length }})</span>
            <span>Avg Quality: {{ mealService.summaryStats().avgQualityScore }}%</span>
          </div>

          @for (visit of mealService.filteredFieldVisits(); track visit.id) {
            <div
              (click)="selectedVisit.set(visit)"
              [class]="selectedVisit()?.id === visit.id ? 'border-teal-800 ring-1 ring-teal-800 bg-teal-50/20' : 'border-slate-200 bg-white hover:border-slate-300'"
              class="border rounded-xl p-4 cursor-pointer transition-all shadow-2xs space-y-2">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-2 text-xs">
                    <span class="font-mono font-bold text-slate-900">{{ visit.visitCode }}</span>
                    <span class="text-slate-400">·</span>
                    <span class="text-slate-500 font-mono">{{ visit.visitDate }}</span>
                  </div>
                  <h3 class="text-sm font-semibold text-slate-900 mt-0.5">{{ visit.location.municipality }} (Ward {{ visit.location.ward }})</h3>
                  <p class="text-xs text-slate-500">{{ visit.location.district }}, {{ visit.location.province }}</p>
                </div>

                <div class="text-right">
                  <span class="text-sm font-mono font-bold text-teal-900 tabular-nums">{{ visit.qualityScorePercent }}%</span>
                  <span class="block text-[11px] text-slate-500">Quality Score</span>
                </div>
              </div>

              <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {{ visit.objectives }}
              </p>

              <div class="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>Monitor: <strong class="text-slate-800">{{ visit.monitorName }}</strong></span>
                <span>{{ visit.checklists.length }} checkpoints · {{ visit.actionPoints.length }} actions</span>
              </div>
            </div>
          }
        </div>

        <!-- Visit Inspection Deep Dive (Right 2 Columns) -->
        <div class="lg:col-span-2">
          @if (selectedVisit(); as visit) {
            <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6 animate-in fade-in">
              <!-- Top Banner with Geolocation and Quality Score -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div class="flex items-center gap-2 text-xs text-slate-500 mb-1 font-mono">
                    <span>{{ visit.visitCode }}</span>
                    <span>·</span>
                    <span>{{ visit.visitDate }}</span>
                    @if (visit.location.latitude && visit.location.longitude) {
                      <span>·</span>
                      <span class="text-teal-800 flex items-center gap-0.5">
                        <mat-icon class="text-xs">pin_drop</mat-icon>
                        GPS: {{ visit.location.latitude }}, {{ visit.location.longitude }}
                      </span>
                    }
                  </div>
                  <h2 class="text-lg font-bold text-slate-900">
                    {{ visit.location.municipality }}, Ward {{ visit.location.ward }} · {{ visit.location.district }}
                  </h2>
                  <p class="text-xs text-slate-600 mt-0.5">
                    Lead Monitor: <strong class="text-slate-900">{{ visit.monitorName }}</strong> ({{ visit.role }})
                  </p>
                </div>

                <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center min-w-[130px]">
                  <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Quality Compliance</span>
                  <span class="text-2xl font-mono font-bold text-teal-900 tabular-nums">{{ visit.qualityScorePercent }}%</span>
                  <span class="text-[11px] text-emerald-800 block font-medium">Standards Verified</span>
                </div>
              </div>

              <!-- Mission Objective -->
              <div>
                <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Monitoring Objective</h3>
                <p class="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {{ visit.objectives }}
                </p>
              </div>

              <!-- Quality Benchmark Checklist -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quality Benchmarks Audit</h3>
                  <span class="text-xs text-slate-500 font-mono">
                    {{ countPassed(visit.checklists) }} / {{ visit.checklists.length }} Passed
                  </span>
                </div>

                <div class="space-y-2">
                  @for (chk of visit.checklists; track chk.id) {
                    <div class="p-3 border rounded-lg flex items-start gap-3 text-xs"
                      [class.border-emerald-200]="chk.passed"
                      [class.bg-emerald-50/30]="chk.passed"
                      [class.border-amber-200]="!chk.passed"
                      [class.bg-amber-50/40]="!chk.passed">
                      <mat-icon class="text-sm shrink-0"
                        [class.text-emerald-700]="chk.passed"
                        [class.text-amber-700]="!chk.passed">
                        {{ chk.passed ? 'check_circle' : 'error_outline' }}
                      </mat-icon>
                      <div class="flex-1 space-y-0.5">
                        <div class="flex items-center justify-between">
                          <span class="font-semibold text-slate-900">{{ chk.title }}</span>
                          <span class="text-[11px] font-medium"
                            [class.text-emerald-800]="chk.passed"
                            [class.text-amber-800]="!chk.passed">
                            {{ chk.passed ? 'Passed' : 'Corrective Need' }}
                          </span>
                        </div>
                        <span class="text-slate-500 text-[11px] block">Category: {{ chk.category }}</span>
                        <p class="text-slate-700 text-xs mt-1">{{ chk.observation }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Photographic Field Evidence -->
              @if (visit.photoUrl) {
                <div>
                  <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Photographic Evidence Archive</h3>
                  <div class="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      [src]="visit.photoUrl"
                      [alt]="visit.evidenceTitle || 'Field monitoring photographic verification'"
                      class="w-full max-h-72 object-cover"
                      referrerpolicy="no-referrer" />
                    @if (visit.evidenceTitle) {
                      <div class="p-2.5 bg-slate-50 text-xs text-slate-600 border-t border-slate-200 flex items-center justify-between">
                        <span>{{ visit.evidenceTitle }}</span>
                        <span class="text-[11px] text-slate-400 font-mono">Geotagged Evidence</span>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Action Points & Follow-up Matrix -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agreed Action Points & Follow-up</h3>
                  <span class="text-xs text-slate-500 font-mono">{{ visit.actionPoints.length }} assigned</span>
                </div>

                <div class="border border-slate-200 rounded-lg overflow-hidden">
                  <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold">
                      <tr>
                        <th class="py-2.5 px-3">Agreed Action Point</th>
                        <th class="py-2.5 px-3">Assignee</th>
                        <th class="py-2.5 px-3">Deadline</th>
                        <th class="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      @for (ap of visit.actionPoints; track ap.id) {
                        <tr>
                          <td class="py-2.5 px-3 font-medium text-slate-800">{{ ap.action }}</td>
                          <td class="py-2.5 px-3 text-slate-600">{{ ap.assignee }}</td>
                          <td class="py-2.5 px-3 font-mono text-slate-600">{{ ap.deadline }}</td>
                          <td class="py-2.5 px-3 text-right">
                            <span class="font-semibold text-[11px]"
                              [class.text-emerald-800]="ap.status === 'Resolved'"
                              [class.text-amber-800]="ap.status === 'In Progress'"
                              [class.text-rose-800]="ap.status === 'Open'">
                              {{ ap.status }}
                            </span>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Add New Field Visit Modal -->
      @if (isAddModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 class="text-sm font-bold text-slate-900">Log New Field Monitoring Mission</h3>
              <button
                type="button"
                (click)="isAddModalOpen.set(false)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="visitForm" (ngSubmit)="saveFieldVisit()" class="p-6 overflow-y-auto space-y-4 text-xs">
              <!-- Nepal Geo Selector embedded in Form -->
              <div class="space-y-1">
                <app-nepal-geo-selector
                  [isCompact]="true"
                  [syncGlobalFilter]="false"
                  [required]="true"
                  title="Field Monitoring Mission Location"
                  (selectionChange)="onModalGeoChange($event)">
                </app-nepal-geo-selector>
                <div class="flex items-center gap-2 text-[11px] text-slate-500 px-1 pt-1 font-mono">
                  <span>Selected: {{ visitForm.get('district')?.value }}, {{ visitForm.get('municipality')?.value }} (Ward {{ visitForm.get('ward')?.value }})</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Monitor Name</label>
                  <input
                    type="text"
                    formControlName="monitorName"
                    placeholder="e.g. Anil Maharjan"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Role</label>
                  <input
                    type="text"
                    formControlName="role"
                    placeholder="e.g. Senior MEAL Officer"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Mission Objectives</label>
                <textarea
                  formControlName="objectives"
                  rows="2"
                  placeholder="Describe purpose of site visit, beneficiaries sampled, or activity inspected..."
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Quality Score Calculated (%)</label>
                  <input
                    type="number"
                    formControlName="qualityScorePercent"
                    min="0"
                    max="100"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700 font-mono" />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">GPS Coordinates (Lat, Lng)</label>
                  <input
                    type="text"
                    formControlName="gps"
                    placeholder="27.7812, 85.7145"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700 font-mono" />
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Corrective Action Point</label>
                <div class="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    formControlName="actionPoint"
                    placeholder="Required action..."
                    class="col-span-2 px-3 py-2 border border-slate-300 rounded-lg" />
                  <input
                    type="text"
                    formControlName="actionAssignee"
                    placeholder="Assignee name"
                    class="px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
              </div>

              <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  (click)="isAddModalOpen.set(false)"
                  class="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="visitForm.invalid"
                  class="px-4 py-1.5 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs">
                  Save Mission Report
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class FieldVisitsView {
  readonly mealService = inject(MealDataService);

  readonly selectedVisit = signal<FieldVisit | null>(this.mealService.fieldVisits()[0] || null);
  readonly isAddModalOpen = signal<boolean>(false);

  readonly visitForm = new FormGroup({
    district: new FormControl('Sindhupalchok', [Validators.required]),
    municipality: new FormControl('Chautara Sangachokgadhi', [Validators.required]),
    ward: new FormControl(4, [Validators.required]),
    monitorName: new FormControl('Anil Maharjan', [Validators.required]),
    role: new FormControl('Senior MEAL Officer', [Validators.required]),
    objectives: new FormControl('', [Validators.required, Validators.minLength(10)]),
    qualityScorePercent: new FormControl(92, [Validators.required, Validators.min(1), Validators.max(100)]),
    gps: new FormControl('27.7812, 85.7145'),
    actionPoint: new FormControl('Ensure daily attendance matching before stipend release'),
    actionAssignee: new FormControl('Training Coordinator')
  });

  selectedProvinceName = 'Bagmati Province';

  onModalGeoChange(geo: { provinceName?: string; districtName?: string; municipalityName?: string; ward?: number }) {
    if (geo.provinceName) this.selectedProvinceName = geo.provinceName;
    if (geo.districtName) this.visitForm.patchValue({ district: geo.districtName });
    if (geo.municipalityName) this.visitForm.patchValue({ municipality: geo.municipalityName });
    if (geo.ward) this.visitForm.patchValue({ ward: geo.ward });
  }

  countPassed(checklists: QualityCheckItem[]): number {
    return checklists.filter(c => c.passed).length;
  }

  openAddVisitModal() {
    this.visitForm.reset({
      district: 'Sindhupalchok',
      municipality: 'Chautara Sangachokgadhi',
      ward: 4,
      monitorName: 'Anil Maharjan',
      role: 'Senior MEAL Officer',
      objectives: 'Conduct on-site quality benchmark audit on mason training cohort and inspect mock construction.',
      qualityScorePercent: 92,
      gps: '27.7812, 85.7145',
      actionPoint: 'Ensure daily attendance matching before certificate dispatch',
      actionAssignee: 'Field Training Engineer'
    });
    this.selectedProvinceName = 'Bagmati Province';
    this.isAddModalOpen.set(true);
  }

  saveFieldVisit() {
    if (this.visitForm.invalid) return;
    const v = this.visitForm.value;
    const activeP = this.mealService.activeProject();

    const [lat, lng] = (v.gps || '').split(',').map(s => parseFloat(s.trim()));

    const newVisit: Omit<FieldVisit, 'id' | 'visitCode'> = {
      projectId: activeP ? activeP.id : 'proj-bcrp',
      visitDate: new Date().toISOString().split('T')[0],
      location: {
        province: this.selectedProvinceName,
        district: v.district || 'Sindhupalchok',
        municipality: v.municipality || 'Chautara Sangachokgadhi',
        ward: Number(v.ward) || 1,
        latitude: isNaN(lat) ? 27.78 : lat,
        longitude: isNaN(lng) ? 85.71 : lng
      },
      monitorName: v.monitorName || 'MEAL Officer',
      role: v.role || 'MEAL Officer',
      objectives: v.objectives || '',
      qualityScorePercent: Number(v.qualityScorePercent) || 90,
      checklists: [
        { id: 'c-new1', title: 'Adherence to technical building code guidelines (NBC 105)', category: 'Engineering Quality', passed: true, observation: 'Mortar and steel tie verification inspected.' },
        { id: 'c-new2', title: 'Full gender & social inclusion verification', category: 'Inclusion', passed: true, observation: 'Female participation verified against national IDs.' },
        { id: 'c-new3', title: 'Beneficiary safety protocols and PPE compliance', category: 'Safeguarding', passed: true, observation: 'Helmets and safety gear used correctly.' }
      ],
      actionPoints: [
        {
          id: 'ap-new1',
          action: v.actionPoint || 'Follow up with local ward office',
          assignee: v.actionAssignee || 'MEAL Lead',
          deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          status: 'Open'
        }
      ],
      photoUrl: '/assets/images/drr_mason_training_1790145551465.jpg',
      evidenceTitle: 'Site inspection at ' + v.municipality,
      status: 'Completed'
    };

    this.mealService.addFieldVisit(newVisit);
    this.selectedVisit.set(this.mealService.fieldVisits()[0]);
    this.isAddModalOpen.set(false);
  }
}
