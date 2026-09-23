import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { ExcelExportService } from '../services/excel-export.service';
import { GanttActivity } from '../models/meal.model';

@Component({
  selector: 'app-gantt-workplan-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header Section -->
      <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
                Workplan Timeline
              </span>
              <span class="text-xs text-slate-400">·</span>
              <span class="text-xs text-slate-500 font-medium">FY 2026/2027 Implementation</span>
            </div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">
              Interactive Gantt Chart & Activity Tracker
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
              Real-time multi-quarter milestone scheduling, dependency mapping, and deliverable tracking across all DRR and resilience field interventions.
            </p>
          </div>

          <!-- Primary Actions -->
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              (click)="openAddModal.set(true)"
              class="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2">
              <mat-icon class="text-xs">add_task</mat-icon>
              <span>Add Activity</span>
            </button>

            <button
              type="button"
              (click)="exportToExcel()"
              class="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2"
              title="Download standalone Gantt Workplan schedule in formatted Excel (.xlsx)">
              <mat-icon class="text-xs">table_view</mat-icon>
              <span>Export to Excel</span>
            </button>

            <button
              type="button"
              (click)="mealService.setActiveTab('export')"
              class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5"
              title="Open full system export hub">
              <mat-icon class="text-xs">cloud_download</mat-icon>
              <span class="hidden sm:inline">Export Hub</span>
            </button>
          </div>
        </div>

        <!-- Summary Metric Tiles -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Activities</span>
            <div class="text-xl font-black text-slate-900 mt-0.5">
              {{ activities().length }}
            </div>
            <span class="text-[10px] text-slate-400">Across 4 components</span>
          </div>

          <div class="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3">
            <span class="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">Completed</span>
            <div class="text-xl font-black text-emerald-800 mt-0.5">
              {{ completedCount() }}
            </div>
            <span class="text-[10px] text-emerald-600 font-medium">100% verified delivered</span>
          </div>

          <div class="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3">
            <span class="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">In Progress</span>
            <div class="text-xl font-black text-amber-800 mt-0.5">
              {{ inProgressCount() }}
            </div>
            <span class="text-[10px] text-amber-600 font-medium">Active in field</span>
          </div>

          <div class="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3">
            <span class="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">Key Milestones</span>
            <div class="text-xl font-black text-blue-800 mt-0.5">
              {{ milestoneCount() }}
            </div>
            <span class="text-[10px] text-blue-600 font-medium">CTEVT / USAID criteria</span>
          </div>

          <div class="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 col-span-2 sm:col-span-1">
            <span class="text-[11px] font-semibold text-teal-700 uppercase tracking-wider block">Allocated Budget</span>
            <div class="text-xl font-black text-teal-900 mt-0.5">
              \${{ totalBudget() | number }}
            </div>
            <span class="text-[10px] text-teal-600 font-medium">Target disbursements</span>
          </div>
        </div>
      </div>

      <!-- Filters & View Customization Toolbar -->
      <div class="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex flex-wrap items-center gap-3">
          <!-- Component Filter -->
          <div class="relative">
            <select
              [value]="selectedComponent()"
              (change)="selectedComponent.set($any($event.target).value)"
              class="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden appearance-none pr-7">
              <option value="all">All Components ({{ components().length }})</option>
              @for (c of components(); track c) {
                <option [value]="c">{{ c }}</option>
              }
            </select>
            <mat-icon class="absolute right-2 top-2 text-xs text-slate-400 pointer-events-none">expand_more</mat-icon>
          </div>

          <!-- Status Filter -->
          <div class="relative">
            <select
              [value]="selectedStatus()"
              (change)="selectedStatus.set($any($event.target).value)"
              class="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden appearance-none pr-7">
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Delayed">Delayed</option>
            </select>
            <mat-icon class="absolute right-2 top-2 text-xs text-slate-400 pointer-events-none">expand_more</mat-icon>
          </div>

          <!-- Milestones Only Toggle -->
          <label class="inline-flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none">
            <input
              type="checkbox"
              [checked]="showMilestonesOnly()"
              (change)="showMilestonesOnly.set($any($event.target).checked)"
              class="rounded text-teal-700 focus:ring-teal-600 h-3.5 w-3.5 border-slate-300">
            <span>Milestones Only</span>
          </label>
        </div>

        <!-- Quick Timeline Zoom / Period Label -->
        <div class="flex items-center gap-2 text-slate-500 font-medium">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
            <mat-icon class="text-xs text-teal-800">calendar_month</mat-icon>
            Timeline: Jul 2026 - Dec 2026 (Q3 & Q4 Fiscal Window)
          </span>
        </div>
      </div>

      <!-- Gantt Interactive Visualization Board -->
      <div class="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <!-- Gantt Timeline Header -->
        <div class="grid grid-cols-12 border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-700 divide-x divide-slate-200">
          <!-- Left Columns (Task Metadata) -->
          <div class="col-span-12 lg:col-span-5 px-4 py-3 flex items-center justify-between">
            <span>Activity & Deliverable Details</span>
            <span class="text-[10px] text-slate-400 font-normal">Progress % · Owner · Budget</span>
          </div>

          <!-- Right Columns (Timeline Months: Jul, Aug, Sep, Oct, Nov, Dec) -->
          <div class="hidden lg:grid col-span-7 grid-cols-6 text-center divide-x divide-slate-200">
            <div class="py-2.5 bg-slate-100/60 font-semibold">
              <span class="block text-slate-800">Jul 2026</span>
              <span class="text-[9px] text-slate-400 uppercase">Q1 · M1</span>
            </div>
            <div class="py-2.5 bg-slate-100/60 font-semibold">
              <span class="block text-slate-800">Aug 2026</span>
              <span class="text-[9px] text-slate-400 uppercase">Q1 · M2</span>
            </div>
            <div class="py-2.5 bg-slate-100/60 font-semibold">
              <span class="block text-slate-800">Sep 2026</span>
              <span class="text-[9px] text-teal-700 font-bold uppercase">Current (M3)</span>
            </div>
            <div class="py-2.5 font-semibold">
              <span class="block text-slate-800">Oct 2026</span>
              <span class="text-[9px] text-slate-400 uppercase">Q2 · M4</span>
            </div>
            <div class="py-2.5 font-semibold">
              <span class="block text-slate-800">Nov 2026</span>
              <span class="text-[9px] text-slate-400 uppercase">Q2 · M5</span>
            </div>
            <div class="py-2.5 font-semibold">
              <span class="block text-slate-800">Dec 2026</span>
              <span class="text-[9px] text-slate-400 uppercase">Q2 · M6</span>
            </div>
          </div>
        </div>

        <!-- Activity Rows -->
        <div class="divide-y divide-slate-100">
          @for (act of displayedActivities(); track act.id) {
            <div class="grid grid-cols-12 hover:bg-slate-50/80 transition-colors divide-x divide-slate-100 items-stretch">
              <!-- Left Column: Activity Info -->
              <div class="col-span-12 lg:col-span-5 p-3.5 sm:p-4 flex flex-col justify-between">
                <div>
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <span class="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {{ act.code }}
                    </span>

                    @if (act.isMilestone) {
                      <span class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                        <mat-icon class="text-[10px]">flag</mat-icon>
                        Milestone
                      </span>
                    }

                    <span [class]="getStatusBadgeClass(act.status)" class="px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      {{ act.status }}
                    </span>

                    <span class="text-[11px] text-slate-400 ml-auto">
                      \${{ act.budgetAllocated | number }}
                    </span>
                  </div>

                  <h3 class="text-xs sm:text-sm font-bold text-slate-800 tracking-tight leading-snug">
                    {{ act.name }}
                  </h3>

                  @if (act.deliverableTarget) {
                    <p class="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <mat-icon class="text-xs text-teal-700">check_circle_outline</mat-icon>
                      <span class="font-medium">Target:</span> {{ act.deliverableTarget }}
                    </p>
                  }
                </div>

                <!-- Footer with Assignee & Inline Quick Updater -->
                <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span class="text-slate-500 flex items-center gap-1 truncate max-w-[180px]">
                    <mat-icon class="text-xs text-slate-400">person</mat-icon>
                    {{ act.assignee }}
                  </span>

                  <!-- Inline Quick Progress Modifier -->
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-slate-700">{{ act.progressPercent }}%</span>
                    @if (act.progressPercent < 100) {
                      <button
                        type="button"
                        (click)="incrementProgress(act, 10)"
                        class="px-1.5 py-0.5 rounded bg-slate-200 hover:bg-teal-100 text-slate-700 hover:text-teal-900 font-bold text-[10px] transition-colors"
                        title="Add +10% Progress">
                        +10%
                      </button>
                      <button
                        type="button"
                        (click)="setProgress(act, 100)"
                        class="px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px] transition-colors"
                        title="Mark 100% Complete">
                        Done
                      </button>
                    }
                  </div>
                </div>
              </div>

              <!-- Right Column: Gantt Visual Bar spanning the 6 months -->
              <div class="hidden lg:col-span-7 lg:grid grid-cols-6 relative p-3 items-center">
                <!-- Vertical Month Grid Guidelines -->
                <div class="absolute inset-0 grid grid-cols-6 divide-x divide-slate-100 pointer-events-none">
                  <div></div>
                  <div></div>
                  <div class="bg-teal-50/20"></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>

                <!-- Activity Timeline Bar Container -->
                <div class="col-span-6 relative z-10 w-full py-2">
                  <div class="w-full relative h-9 flex items-center">
                    <!-- The Gantt Bar Positioned with dynamic style -->
                    <div
                      [style.left]="getBarLeftPercent(act.startDate) + '%'"
                      [style.width]="getBarWidthPercent(act.startDate, act.endDate) + '%'"
                      class="absolute h-7 rounded-lg shadow-2xs border overflow-hidden flex items-center px-2 transition-all cursor-pointer group"
                      [class]="getBarColorClasses(act.status)">
                      
                      <!-- Inner Progress Fill -->
                      <div
                        [style.width]="act.progressPercent + '%'"
                        class="absolute inset-y-0 left-0 bg-black/15 transition-all"></div>

                      <!-- Content Inside Bar -->
                      <div class="relative z-10 flex items-center justify-between w-full text-white text-[10px] font-bold truncate">
                        <span class="truncate pr-1">{{ act.progressPercent }}% Complete</span>
                        @if (act.isMilestone) {
                          <mat-icon class="text-xs text-amber-300 drop-shadow">flag</mat-icon>
                        }
                      </div>

                      <!-- Hover Tooltip -->
                      <div class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] rounded-lg px-2.5 py-1 whitespace-nowrap z-30 shadow-md">
                        {{ act.startDate }} to {{ act.endDate }} · {{ act.progressPercent }}% · \${{ act.budgetAllocated | number }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          } @empty {
            <div class="p-12 text-center text-slate-500">
              <mat-icon class="text-3xl text-slate-300 mb-2">view_timeline</mat-icon>
              <p class="font-bold text-slate-700">No activities match your current filter</p>
              <p class="text-xs text-slate-400 mt-1">Try resetting the status or component dropdowns.</p>
            </div>
          }
        </div>
      </div>

      <!-- Add New Activity Modal -->
      @if (openAddModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div class="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 text-xs">
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <mat-icon class="text-sm">add_task</mat-icon>
                </span>
                <h3 class="text-base font-bold text-slate-900">Add New Workplan Activity</h3>
              </div>
              <button
                type="button"
                (click)="openAddModal.set(false)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form (submit)="onSaveNewActivity($event)" class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Activity Code *</label>
                  <input
                    name="code"
                    type="text"
                    required
                    placeholder="e.g. ACT-BCRP-2.3"
                    class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Project *</label>
                  <select
                    name="projectId"
                    required
                    class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                    @for (p of mealService.projects(); track p.id) {
                      <option [value]="p.id">{{ p.code }} - {{ p.name }}</option>
                    }
                  </select>
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Activity Name / Scope *</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Practical Mason Retrofitting Hands-on Workshop"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Thematic Component *</label>
                  <select
                    name="component"
                    required
                    class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                    <option value="Technical Capacity & Masonry">Technical Capacity & Masonry</option>
                    <option value="Community DRM & Preparedness">Community DRM & Preparedness</option>
                    <option value="Structural Retrofitting & Engineering">Structural Retrofitting & Engineering</option>
                    <option value="Quality Assurance & Accreditation">Quality Assurance & Accreditation</option>
                    <option value="Child-Centered Preparedness">Child-Centered Preparedness</option>
                    <option value="MEAL & Compliance">MEAL & Compliance</option>
                  </select>
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Lead Assignee *</label>
                  <input
                    name="assignee"
                    type="text"
                    required
                    placeholder="e.g. Anil Maharjan (MEAL)"
                    class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Start Date (2026) *</label>
                  <input
                    name="startDate"
                    type="date"
                    required
                    value="2026-10-01"
                    class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1">End Date (2026) *</label>
                  <input
                    name="endDate"
                    type="date"
                    required
                    value="2026-11-15"
                    class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Allocated Budget ($ USD)</label>
                  <input
                    name="budgetAllocated"
                    type="number"
                    value="15000"
                    class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                </div>

                <div class="flex items-center pt-5">
                  <label class="inline-flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                    <input
                      name="isMilestone"
                      type="checkbox"
                      class="rounded text-teal-700 focus:ring-teal-600 h-4 w-4 border-slate-300">
                    <span>Key Donor Milestone</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Deliverable Target</label>
                <input
                  name="deliverableTarget"
                  type="text"
                  placeholder="e.g. 25 Masons Certified & Handover Completed"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
              </div>

              <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  (click)="openAddModal.set(false)"
                  class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl shadow-xs">
                  Create Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class GanttWorkplanView {
  readonly mealService = inject(MealDataService);
  readonly excelService = inject(ExcelExportService);

  readonly openAddModal = signal<boolean>(false);
  readonly selectedComponent = signal<string>('all');
  readonly selectedStatus = signal<string>('all');
  readonly showMilestonesOnly = signal<boolean>(false);

  readonly activities = this.mealService.filteredGanttActivities;

  readonly components = computed(() => {
    const list = this.mealService.ganttActivities();
    return Array.from(new Set(list.map(a => a.component)));
  });

  readonly displayedActivities = computed(() => {
    let list = this.activities();
    const comp = this.selectedComponent();
    const status = this.selectedStatus();
    const milestonesOnly = this.showMilestonesOnly();

    if (comp !== 'all') {
      list = list.filter(a => a.component === comp);
    }
    if (status !== 'all') {
      list = list.filter(a => a.status === status);
    }
    if (milestonesOnly) {
      list = list.filter(a => a.isMilestone);
    }
    return list;
  });

  readonly completedCount = computed(() =>
    this.activities().filter(a => a.status === 'Completed').length
  );

  readonly inProgressCount = computed(() =>
    this.activities().filter(a => a.status === 'In Progress').length
  );

  readonly milestoneCount = computed(() =>
    this.activities().filter(a => a.isMilestone).length
  );

  readonly totalBudget = computed(() =>
    this.activities().reduce((acc, a) => acc + a.budgetAllocated, 0)
  );

  // Date positioning calculations for visual timeline (Jul 1, 2026 to Dec 31, 2026 = 184 days)
  private readonly timelineStart = new Date('2026-07-01').getTime();
  private readonly timelineEnd = new Date('2026-12-31').getTime();
  private readonly totalDuration = this.timelineEnd - this.timelineStart;

  getBarLeftPercent(startDateStr: string): number {
    const start = new Date(startDateStr).getTime();
    const offset = Math.max(0, start - this.timelineStart);
    const pct = (offset / this.totalDuration) * 100;
    return Math.min(95, Math.max(1, Math.round(pct * 10) / 10));
  }

  getBarWidthPercent(startDateStr: string, endDateStr: string): number {
    const start = new Date(startDateStr).getTime();
    const end = new Date(endDateStr).getTime();
    const duration = Math.max(86400000 * 7, end - start);
    const pct = (duration / this.totalDuration) * 100;
    return Math.max(6, Math.min(95, Math.round(pct * 10) / 10));
  }

  getStatusBadgeClass(status: GanttActivity['status']): string {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'In Progress':
        return 'bg-teal-100 text-teal-800';
      case 'Delayed':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  getBarColorClasses(status: GanttActivity['status']): string {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-600 border-emerald-700';
      case 'In Progress':
        return 'bg-teal-700 border-teal-800';
      case 'Delayed':
        return 'bg-rose-600 border-rose-700';
      default:
        return 'bg-slate-600 border-slate-700';
    }
  }

  incrementProgress(act: GanttActivity, delta: number) {
    const newProgress = Math.min(100, act.progressPercent + delta);
    this.mealService.updateGanttProgress(act.id, newProgress);
  }

  setProgress(act: GanttActivity, progress: number) {
    this.mealService.updateGanttProgress(act.id, progress);
  }

  exportToExcel() {
    this.excelService.exportGanttToExcel();
  }

  onSaveNewActivity(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newAct: Omit<GanttActivity, 'id'> = {
      projectId: formData.get('projectId') as string,
      code: formData.get('code') as string,
      name: formData.get('name') as string,
      component: formData.get('component') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      progressPercent: 0,
      status: 'Scheduled',
      assignee: formData.get('assignee') as string,
      budgetAllocated: Number(formData.get('budgetAllocated')) || 10000,
      isMilestone: formData.get('isMilestone') === 'on',
      deliverableTarget: (formData.get('deliverableTarget') as string) || ''
    };

    this.mealService.addGanttActivity(newAct);
    this.openAddModal.set(false);
  }
}
