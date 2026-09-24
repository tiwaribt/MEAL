import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { NepalGeoSelector } from './nepal-geo-selector';

@Component({
  selector: 'app-dashboard-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, NepalGeoSelector],
  template: `
    <div class="space-y-6">
      <!-- Project Scope Context Banner -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <span>MEAL Suite Platform</span>
              <span aria-hidden="true">·</span>
              <span>MEAL & Quality Assurance Directorate</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              @if (mealService.activeProject(); as proj) {
                {{ proj.name }} ({{ proj.code }})
              } @else {
                Multi-Project MEAL & Accountability Portfolio
              }
            </h1>
            <p class="text-sm text-slate-600 mt-1 max-w-3xl">
              @if (mealService.activeProject(); as proj) {
                Donor: <strong class="text-slate-800">{{ proj.donor }}</strong> · Districts: {{ proj.districts.join(', ') }} · Manager: {{ proj.manager }}
              } @else {
                Integrated monitoring, evaluation, accountability, and learning framework tracking 4 active disaster risk reduction & resilience projects across 14 target districts in Nepal.
              }
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              (click)="mealService.setActiveTab('gis-map')"
              class="px-3.5 py-2 bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
              <mat-icon class="text-xs">travel_explore</mat-icon>
              <span>753 Palika GIS Map</span>
            </button>
            <button
              type="button"
              (click)="isCustomizeModalOpen.set(true)"
              class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
              <mat-icon class="text-xs">dashboard_customize</mat-icon>
              <span>Customize Dashboard</span>
            </button>
            <button
              type="button"
              (click)="mealService.setActiveTab('form-builder')"
              class="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
              <mat-icon class="text-xs">dynamic_form</mat-icon>
              <span>Form Builder</span>
            </button>
            <button
              type="button"
              (click)="mealService.setActiveTab('mobile-collection')"
              class="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
              <mat-icon class="text-xs">cell_tower</mat-icon>
              <span>Mobile Collector</span>
            </button>
            <button
              type="button"
              (click)="mealService.setActiveTab('data-viz')"
              class="px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
              <mat-icon class="text-xs">insights</mat-icon>
              <span>Data Visualization</span>
            </button>
          </div>
        </div>

        <!-- LogAlto Multi-Level Portfolio Tabs -->
        <div class="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-700">
            <button
              type="button"
              (click)="mealService.setDashboardLevel('global')"
              [class]="mealService.dashboardLevel() === 'global' ? 'bg-white text-teal-950 shadow-xs' : 'hover:text-slate-900'"
              class="px-3 py-1 rounded-md flex items-center gap-1.5 transition-all">
              <mat-icon class="text-xs">public</mat-icon>
              <span>Global Multi-Project Portfolio</span>
            </button>
            <button
              type="button"
              (click)="mealService.setDashboardLevel('project')"
              [class]="mealService.dashboardLevel() === 'project' ? 'bg-white text-teal-950 shadow-xs' : 'hover:text-slate-900'"
              class="px-3 py-1 rounded-md flex items-center gap-1.5 transition-all">
              <mat-icon class="text-xs">layers</mat-icon>
              <span>Project Detailed View</span>
            </button>
            <button
              type="button"
              (click)="mealService.setDashboardLevel('operations')"
              [class]="mealService.dashboardLevel() === 'operations' ? 'bg-white text-teal-950 shadow-xs' : 'hover:text-slate-900'"
              class="px-3 py-1 rounded-md flex items-center gap-1.5 transition-all">
              <mat-icon class="text-xs">cell_tower</mat-icon>
              <span>Field Operations & Sync Telemetry</span>
            </button>
          </div>

          <!-- Pending Mobile Records Indicator -->
          @if (pendingMobileCount() > 0) {
            <div
              (click)="mealService.setActiveTab('mobile-collection')"
              class="cursor-pointer px-3 py-1 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
              <mat-icon class="text-xs text-amber-700 animate-pulse">cloud_off</mat-icon>
              <span>{{ pendingMobileCount() }} offline field submissions queued for sync</span>
              <span class="font-bold underline ml-1">Sync →</span>
            </div>
          }
        </div>
      </div>

      <!-- Nepal Geographic Filter Toolbar -->
      <app-nepal-geo-selector
        [isCompact]="true"
        title="Nepal Administrative Coverage & Geographical Filter">
      </app-nepal-geo-selector>

      <!-- Core MEAL Metric Highlights (Tabular Numerals & High Legibility) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Metric 1: Beneficiary Reach -->
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-teal-700/40 transition-colors">
          <div class="flex items-center justify-between text-slate-500 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Verified Beneficiaries</span>
            <mat-icon class="text-teal-800 text-sm">groups</mat-icon>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {{ mealService.summaryStats().verifiedBeneficiaries }} / {{ mealService.summaryStats().totalBeneficiaries }}
            </span>
            <span class="text-xs text-emerald-800 font-medium">Sampled Verified</span>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Female: <strong class="text-slate-800 font-mono tabular-nums">{{ mealService.summaryStats().femaleReach | number }}</strong></span>
            <span>Marginalized: <strong class="text-slate-800 font-mono tabular-nums">{{ mealService.summaryStats().marginalizedReach | number }}</strong></span>
          </div>
        </div>

        <!-- Metric 2: Indicator Milestone Health -->
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-teal-700/40 transition-colors">
          <div class="flex items-center justify-between text-slate-500 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Indicators On-Track</span>
            <mat-icon class="text-emerald-800 text-sm">track_changes</mat-icon>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {{ mealService.summaryStats().onTrackIndicators }} / {{ mealService.summaryStats().totalIndicators }}
            </span>
            <span class="text-xs text-slate-500">
              ({{ Math.round((mealService.summaryStats().onTrackIndicators / mealService.summaryStats().totalIndicators) * 100) }}%)
            </span>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Warning / Delay: <strong class="text-amber-800 font-mono tabular-nums">{{ mealService.summaryStats().warningIndicators }}</strong></span>
            <button
              type="button"
              (click)="mealService.setActiveTab('logframe')"
              class="text-teal-800 hover:text-teal-950 font-medium">
              View Matrix →
            </button>
          </div>
        </div>

        <!-- Metric 3: Field Monitoring & Quality Benchmark -->
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-teal-700/40 transition-colors">
          <div class="flex items-center justify-between text-slate-500 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">Quality Compliance Score</span>
            <mat-icon class="text-blue-800 text-sm">verified</mat-icon>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {{ mealService.summaryStats().avgQualityScore }}%
            </span>
            <span class="text-xs text-slate-600 font-medium">Field Visits Avg</span>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Missions: <strong class="text-slate-800 font-mono tabular-nums">{{ mealService.filteredFieldVisits().length }} completed</strong></span>
            <button
              type="button"
              (click)="mealService.setActiveTab('field-visits')"
              class="text-teal-800 hover:text-teal-950 font-medium">
              Checklists →
            </button>
          </div>
        </div>

        <!-- Metric 4: CFRM Accountability Loop -->
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-teal-700/40 transition-colors">
          <div class="flex items-center justify-between text-slate-500 mb-2">
            <span class="text-xs font-semibold uppercase tracking-wider">CFRM Resolution Rate</span>
            <mat-icon class="text-purple-800 text-sm">support_agent</mat-icon>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
              {{ mealService.summaryStats().resolutionRate }}%
            </span>
            <span class="text-xs text-emerald-800 font-medium font-mono tabular-nums">
              {{ mealService.summaryStats().resolvedComplaints }} / {{ mealService.summaryStats().totalComplaints }} Cases
            </span>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Avg SLA: <strong class="text-slate-800 font-mono tabular-nums">2.1 days</strong></span>
            <button
              type="button"
              (click)="mealService.setActiveTab('accountability')"
              class="text-teal-800 hover:text-teal-950 font-medium">
              Cases Log →
            </button>
          </div>
        </div>
      </div>

      <!-- Main Dual Grid: Active Indicators Progress & Field Quality Spotlights -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left 2 Cols: Indicator Progress vs Target Matrix -->
        <div class="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-base font-semibold text-slate-900">Key Performance Indicators (PIRS Tracker)</h2>
              <p class="text-xs text-slate-500">Progress against annual targets verified through MEAL spot-checks</p>
            </div>
            <button
              type="button"
              (click)="mealService.setActiveTab('logframe')"
              class="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1">
              <span>Full Logframe</span>
              <mat-icon class="text-xs">arrow_forward</mat-icon>
            </button>
          </div>

          <div class="space-y-4 pt-2">
            @for (ind of mealService.filteredIndicators(); track ind.id) {
              <div class="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div class="flex items-start justify-between gap-2 mb-1.5">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-mono font-semibold text-slate-800">{{ ind.code }}</span>
                    <span class="text-xs text-slate-500">·</span>
                    <span class="text-xs font-medium text-slate-800">{{ ind.title }}</span>
                  </div>
                  <span class="text-xs font-mono font-bold tabular-nums"
                    [class.text-emerald-800]="ind.status === 'on_track'"
                    [class.text-amber-800]="ind.status === 'warning'"
                    [class.text-rose-800]="ind.status === 'off_track'">
                    {{ ind.progressPercent }}%
                  </span>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    [style.width.%]="ind.progressPercent > 100 ? 100 : ind.progressPercent"
                    [class.bg-teal-700]="ind.status === 'on_track'"
                    [class.bg-amber-600]="ind.status === 'warning'"
                    [class.bg-rose-600]="ind.status === 'off_track'"></div>
                </div>

                <div class="flex items-center justify-between text-xs text-slate-500">
                  <span class="font-mono tabular-nums">
                    Achieved: <strong class="text-slate-800">{{ ind.actualTotal | number }}</strong> / Target: {{ ind.targetAnnual | number }} {{ ind.unit }}
                  </span>
                  <span>Freq: {{ ind.frequency }} · Lead: {{ ind.responsibleOfficer.split(' ')[0] }}</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Right 1 Col: Urgent Attention Items & Field Evidence -->
        <div class="space-y-6">
          <!-- MEAL Quality Action Items -->
          <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <mat-icon class="text-xs text-amber-700">warning</mat-icon>
                <span>Attention & Action Items</span>
              </h3>
              <span class="text-xs text-slate-500 font-mono tabular-nums">3 open</span>
            </div>

            <div class="space-y-2 text-xs">
              <div class="p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg space-y-1">
                <div class="flex items-center justify-between font-semibold text-amber-950">
                  <span>Sand Silt Specification Audit</span>
                  <span class="font-mono text-[11px]">Due in 3d</span>
                </div>
                <p class="text-slate-600 text-[11px]">Field visit in Gorkha Ward 7 flagged mortar silt exceeding 6% standard.</p>
              </div>

              <div class="p-2.5 bg-rose-50/60 border border-rose-200 rounded-lg space-y-1">
                <div class="flex items-center justify-between font-semibold text-rose-950">
                  <span>Flagged Duplicate Beneficiary</span>
                  <span class="font-mono text-[11px]">Action Req</span>
                </div>
                <p class="text-slate-600 text-[11px]">BEN-2026-0193 shares contact phone with verified mason record; audit needed.</p>
              </div>

              <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div class="flex items-center justify-between font-semibold text-slate-800">
                  <span>Upcoming Quarterly AAR</span>
                  <span class="font-mono text-[11px]">Oct 05</span>
                </div>
                <p class="text-slate-600 text-[11px]">Prepare DQA synthesis and verification dossier for municipal DRR steering.</p>
              </div>
            </div>
          </div>

          <!-- Featured Field Photographic Evidence -->
          <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div class="relative h-44 w-full bg-slate-100">
              <img
                src="/assets/images/drr_mason_training_1790145551465.jpg"
                alt="Mason retrofitting training verification"
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                <span class="text-[11px] font-medium text-teal-300">Field Evidence Spot-Check</span>
                <p class="text-xs font-semibold leading-snug">7-Day Seismic Retrofitting Training in Chautara, Sindhupalchok</p>
              </div>
            </div>
            <div class="p-3 text-xs text-slate-600 flex items-center justify-between bg-slate-50/70 border-t border-slate-100">
              <span>Verified by Anil Maharjan (MEAL)</span>
              <button
                type="button"
                (click)="mealService.setActiveTab('field-visits')"
                class="text-teal-800 hover:text-teal-950 font-semibold">
                Visit Details →
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick MEAL Operations Hub (Action Shortcuts) -->
      <div class="bg-slate-100/80 border border-slate-200/80 rounded-xl p-5">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">Frequent MEAL Operations</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            type="button"
            (click)="mealService.setActiveTab('field-visits')"
            class="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-left transition-colors flex flex-col gap-1 shadow-2xs">
            <mat-icon class="text-teal-800 text-sm">fact_check</mat-icon>
            <span class="text-xs font-semibold text-slate-800">Log Field Visit</span>
            <span class="text-[11px] text-slate-500">Quality checklist & GPS</span>
          </button>

          <button
            type="button"
            (click)="mealService.setActiveTab('verification')"
            class="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-left transition-colors flex flex-col gap-1 shadow-2xs">
            <mat-icon class="text-blue-800 text-sm">how_to_reg</mat-icon>
            <span class="text-xs font-semibold text-slate-800">Verify Beneficiaries</span>
            <span class="text-[11px] text-slate-500">DQA duplicate detection</span>
          </button>

          <button
            type="button"
            (click)="mealService.setActiveTab('digital-tools')"
            class="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-left transition-colors flex flex-col gap-1 shadow-2xs">
            <mat-icon class="text-indigo-800 text-sm">cloud_sync</mat-icon>
            <span class="text-xs font-semibold text-slate-800">Kobo / ODK Hub</span>
            <span class="text-[11px] text-slate-500">Run or import surveys</span>
          </button>

          <button
            type="button"
            (click)="mealService.setActiveTab('accountability')"
            class="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-left transition-colors flex flex-col gap-1 shadow-2xs">
            <mat-icon class="text-purple-800 text-sm">contact_support</mat-icon>
            <span class="text-xs font-semibold text-slate-800">Record Feedback</span>
            <span class="text-[11px] text-slate-500">CFRM & safeguarding</span>
          </button>

          <button
            type="button"
            (click)="mealService.setActiveTab('learning')"
            class="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-left transition-colors flex flex-col gap-1 shadow-2xs">
            <mat-icon class="text-amber-800 text-sm">auto_stories</mat-icon>
            <span class="text-xs font-semibold text-slate-800">Write Case Study</span>
            <span class="text-[11px] text-slate-500">Human impact & quotes</span>
          </button>

          <button
            type="button"
            (click)="mealService.setActiveTab('visibility')"
            class="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-left transition-colors flex flex-col gap-1 shadow-2xs">
            <mat-icon class="text-rose-800 text-sm">design_services</mat-icon>
            <span class="text-xs font-semibold text-slate-800">Canva Visibility</span>
            <span class="text-[11px] text-slate-500">Posters, factsheets, cards</span>
          </button>
        </div>
      </div>

      <!-- LogAlto Dashboard Customization Modal -->
      @if (isCustomizeModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div class="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-teal-800">dashboard_customize</mat-icon>
                <div>
                  <h3 class="text-sm font-bold text-slate-900">Customize Dashboard Widgets</h3>
                  <p class="text-[11px] text-slate-500">Enable, disable, reorder, or resize widgets in your personalized layout</p>
                </div>
              </div>
              <button
                type="button"
                (click)="isCustomizeModalOpen.set(false)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <!-- Widgets List -->
            <div class="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
              @for (w of mealService.dashboardWidgets(); track w.id; let i = $index) {
                <div class="flex items-center justify-between p-3 rounded-xl border transition-all"
                  [class.border-teal-700]="w.enabled"
                  [class.bg-teal-50/20]="w.enabled"
                  [class.border-slate-200]="!w.enabled"
                  [class.bg-slate-50/50]="!w.enabled">
                  <div class="flex items-center gap-3">
                    <button
                      type="button"
                      (click)="mealService.toggleWidget(w.id)"
                      class="w-5 h-5 rounded border flex items-center justify-center transition-colors"
                      [class.bg-teal-800]="w.enabled"
                      [class.border-teal-800]="w.enabled"
                      [class.text-white]="w.enabled"
                      [class.border-slate-300]="!w.enabled">
                      @if (w.enabled) {
                        <mat-icon class="text-[14px]">check</mat-icon>
                      }
                    </button>
                    <div>
                      <div class="flex items-center gap-2">
                        <mat-icon class="text-xs text-slate-500">{{ w.icon }}</mat-icon>
                        <span class="font-bold text-slate-900">{{ w.title }}</span>
                      </div>
                      <p class="text-[11px] text-slate-500 mt-0.5">{{ w.description }}</p>
                    </div>
                  </div>

                  <!-- Controls: Width & Order -->
                  <div class="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      (click)="mealService.setWidgetWidth(w.id, w.width === 'half' ? 'full' : 'half')"
                      class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold"
                      title="Toggle widget width">
                      {{ w.width === 'full' ? 'Full Width' : 'Half Width' }}
                    </button>
                    <button
                      type="button"
                      (click)="mealService.reorderWidget(w.id, 'up')"
                      [disabled]="i === 0"
                      class="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-25 rounded hover:bg-slate-100">
                      <mat-icon class="text-xs">arrow_upward</mat-icon>
                    </button>
                    <button
                      type="button"
                      (click)="mealService.reorderWidget(w.id, 'down')"
                      [disabled]="i === mealService.dashboardWidgets().length - 1"
                      class="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-25 rounded hover:bg-slate-100">
                      <mat-icon class="text-xs">arrow_downward</mat-icon>
                    </button>
                  </div>
                </div>
              }
            </div>

            <div class="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                (click)="isCustomizeModalOpen.set(false)"
                class="px-4 py-2 bg-teal-900 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow-xs">
                Save & Apply Layout
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DashboardView {
  readonly mealService = inject(MealDataService);
  protected readonly Math = Math;

  readonly isCustomizeModalOpen = signal<boolean>(false);

  readonly pendingMobileCount = computed(() => {
    return this.mealService.mobileSubmissions().filter(s => s.syncStatus === 'pending_sync').length;
  });
}
