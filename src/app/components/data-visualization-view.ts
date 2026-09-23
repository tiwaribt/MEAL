import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';

type VizTab = 'pivot' | 'charts' | 'geospatial';

@Component({
  selector: 'app-data-visualization-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Section Header -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>LogAlto M&E Suite</span>
            <span aria-hidden="true">·</span>
            <span>Analytics & Business Intelligence</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Data Visualization & Cross-Tabulation Studio</span>
            <span class="text-xs font-medium px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">Interactive Pivot & GIS</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">
            Multi-dimensional cross-tabulation, disaggregated charts, Core Humanitarian Standard radar rubrics, and district-level reach mapping.
          </p>
        </div>

        <!-- Mode Switcher Tabs -->
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <button
            type="button"
            (click)="activeVizTab.set('pivot')"
            [class]="activeVizTab() === 'pivot' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'"
            class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
            <mat-icon class="text-xs text-teal-800">table_chart</mat-icon>
            <span>Cross-Tab Pivot</span>
          </button>
          <button
            type="button"
            (click)="activeVizTab.set('charts')"
            [class]="activeVizTab() === 'charts' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'"
            class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
            <mat-icon class="text-xs text-teal-800">bar_chart</mat-icon>
            <span>Analytics Charts</span>
          </button>
          <button
            type="button"
            (click)="activeVizTab.set('geospatial')"
            [class]="activeVizTab() === 'geospatial' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'"
            class="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
            <mat-icon class="text-xs text-teal-800">map</mat-icon>
            <span>District GIS Map</span>
          </button>
        </div>
      </div>

      <!-- TAB 1: Multi-Dimensional Cross-Tabulation Pivot Table -->
      @if (activeVizTab() === 'pivot') {
        <div class="space-y-4 animate-in fade-in">
          <!-- Pivot Configuration Ribbon -->
          <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
            <div class="flex flex-wrap items-center gap-4">
              <!-- Row Dimension -->
              <div class="flex items-center gap-2">
                <span class="font-semibold text-slate-600">Row Dimension:</span>
                <select
                  [value]="pivotRowDimension()"
                  (change)="pivotRowDimension.set($any($event.target).value)"
                  class="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-semibold text-slate-900 focus:ring-1 focus:ring-teal-700">
                  <option value="project">Project / Program</option>
                  <option value="district">District / Municipality</option>
                  <option value="vulnerability">Vulnerability Category</option>
                  <option value="gender">Gender (Sex)</option>
                </select>
              </div>

              <!-- Column Dimension -->
              <div class="flex items-center gap-2">
                <span class="font-semibold text-slate-600">Column Dimension:</span>
                <select
                  [value]="pivotColDimension()"
                  (change)="pivotColDimension.set($any($event.target).value)"
                  class="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-semibold text-slate-900 focus:ring-1 focus:ring-teal-700">
                  <option value="verification">DQA Verification Status</option>
                  <option value="gender">Gender (Sex)</option>
                  <option value="vulnerability">Vulnerability Status</option>
                </select>
              </div>

              <!-- Aggregation Metric -->
              <div class="flex items-center gap-2">
                <span class="font-semibold text-slate-600">Metric:</span>
                <select
                  [value]="pivotMetric()"
                  (change)="pivotMetric.set($any($event.target).value)"
                  class="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-semibold text-slate-900 focus:ring-1 focus:ring-teal-700">
                  <option value="count">Count of Beneficiaries (Persons)</option>
                  <option value="direct_support">Direct Assistance Value ($)</option>
                </select>
              </div>
            </div>

            <!-- Export Pivot -->
            <button
              type="button"
              (click)="exportPivotCsv()"
              class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs">
              <mat-icon class="text-xs">download</mat-icon>
              <span>Export Pivot CSV</span>
            </button>
          </div>

          <!-- Dynamic Pivot Table Matrix -->
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
            <div class="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div class="flex items-center gap-2">
                <mat-icon class="text-xs text-teal-800">pivot_table_chart</mat-icon>
                <span class="font-bold text-xs uppercase tracking-wider text-slate-900">
                  {{ pivotRowDimension() | titlecase }} vs {{ pivotColDimension() | titlecase }} Cross-Tabulation
                </span>
              </div>
              <span class="text-xs text-slate-500 font-mono">Grand Total: {{ pivotMatrix().grandTotal | number }}</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                    <th class="py-3 px-4">{{ pivotRowDimension() | titlecase }}</th>
                    @for (col of pivotMatrix().cols; track col) {
                      <th class="py-3 px-4 text-right">{{ col }}</th>
                    }
                    <th class="py-3 px-4 text-right bg-teal-50/60 text-teal-950 font-extrabold">Row Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (row of pivotMatrix().rows; track row.label) {
                    <tr class="hover:bg-slate-50/70 transition-colors">
                      <td class="py-3 px-4 font-semibold text-slate-900">{{ row.label }}</td>
                      @for (cell of row.cells; track $index) {
                        <td class="py-3 px-4 text-right font-mono text-slate-700">
                          {{ cell | number }}
                        </td>
                      }
                      <td class="py-3 px-4 text-right font-mono font-bold text-teal-950 bg-teal-50/30">
                        {{ row.total | number }}
                      </td>
                    </tr>
                  }
                </tbody>
                <tfoot>
                  <tr class="bg-slate-100/80 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td class="py-3 px-4 uppercase text-[11px]">Column Totals</td>
                    @for (cTotal of pivotMatrix().colTotals; track $index) {
                      <td class="py-3 px-4 text-right font-mono">{{ cTotal | number }}</td>
                    }
                    <td class="py-3 px-4 text-right font-mono text-sm text-teal-900 bg-teal-100/50">
                      {{ pivotMatrix().grandTotal | number }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- TAB 2: Dynamic Chart Studio -->
      @if (activeVizTab() === 'charts') {
        <div class="space-y-6 animate-in fade-in">
          <!-- Charts Grid: 2 Columns -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Chart 1: Quarterly Indicator Progress (Grouped Bars) -->
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-teal-800">insights</mat-icon>
                  <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Quarterly Target vs Actual Performance</h3>
                </div>
                <span class="text-[10px] font-mono text-slate-400">BCRP-IND-01</span>
              </div>

              <div class="space-y-3 pt-2">
                @for (quarter of quarterlyData; track quarter.period) {
                  <div class="space-y-1">
                    <div class="flex justify-between text-xs font-semibold">
                      <span class="text-slate-800">{{ quarter.period }}</span>
                      <span class="text-slate-600 font-mono">
                        {{ quarter.actual | number }} / {{ quarter.target | number }}
                        <span class="text-teal-800 font-bold ml-1">({{ quarter.percent }}%)</span>
                      </span>
                    </div>
                    <!-- Stacked Progress Bar -->
                    <div class="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        class="bg-teal-800 h-full rounded-full transition-all duration-500"
                        [style.width.%]="Math.min(100, quarter.percent)"></div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Chart 2: Disaggregation by Gender & Social Inclusion -->
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-teal-800">pie_chart</mat-icon>
                  <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">GESI & Vulnerability Distribution</h3>
                </div>
                <span class="text-[10px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded">Verified Cohort</span>
              </div>

              <div class="space-y-3 pt-2">
                @for (group of gesiBreakdown; track group.category) {
                  <div class="space-y-1">
                    <div class="flex justify-between text-xs font-semibold">
                      <span class="text-slate-800 flex items-center gap-1.5">
                        <span class="w-2.5 h-2.5 rounded-full" [style.backgroundColor]="group.color"></span>
                        <span>{{ group.category }}</span>
                      </span>
                      <span class="text-slate-600 font-mono">{{ group.count | number }} ({{ group.percent }}%)</span>
                    </div>
                    <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        [style.backgroundColor]="group.color"
                        [style.width.%]="group.percent"></div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Chart 3: Core Humanitarian Standard (CHS) 9 Commitments Radar Rubric -->
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-teal-800">verified_user</mat-icon>
                  <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">CHS 9 Commitments MEAL Radar Rubric</h3>
                </div>
                <span class="text-[10px] font-mono text-slate-400">Global Humanitarian Quality</span>
              </div>

              <div class="space-y-2 pt-1 text-xs">
                @for (chs of chsScores; track chs.id) {
                  <div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors">
                    <div class="flex items-center gap-2">
                      <span class="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center">
                        {{ chs.id }}
                      </span>
                      <span class="text-slate-800 font-medium">{{ chs.title }}</span>
                    </div>
                    <div class="flex items-center gap-3 font-mono">
                      <div class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div class="bg-teal-800 h-full rounded-full" [style.width.%]="(chs.score / 5) * 100"></div>
                      </div>
                      <strong class="text-slate-900 w-8 text-right">{{ chs.score }} / 5</strong>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Chart 4: CFRM Complaints Intake by Channel & Resolution Velocity -->
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-teal-800">support_agent</mat-icon>
                  <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">CFRM Accountability & Channel Resolution</h3>
                </div>
                <span class="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">91.4% Closed</span>
              </div>

              <div class="space-y-3 pt-2">
                @for (chan of cfrmChannels; track chan.channel) {
                  <div class="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs">
                    <div class="flex items-center gap-2.5">
                      <mat-icon class="text-sm text-slate-500">{{ chan.icon }}</mat-icon>
                      <span class="font-semibold text-slate-800">{{ chan.channel }}</span>
                    </div>
                    <div class="flex items-center gap-4 font-mono">
                      <span class="text-slate-600">{{ chan.count }} tickets</span>
                      <span class="px-2 py-0.5 bg-teal-100 text-teal-800 font-bold rounded text-[10px]">
                        {{ chan.resolutionRate }}% Resolved
                      </span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 3: Nepal Geospatial District Choropleth Map & Profile Inspector -->
      @if (activeVizTab() === 'geospatial') {
        <div class="space-y-6 animate-in fade-in">
          <!-- District Cards Grid -->
          <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-teal-800">public</mat-icon>
                <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Nepal District MEAL Operations Map & Profiles</h3>
              </div>
              <span class="text-xs text-slate-500">Select any district to inspect disaggregated indicators</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              @for (dist of nepalDistricts; track dist.name) {
                <div
                  (click)="selectedDistrict.set(dist)"
                  class="border rounded-xl p-4 cursor-pointer transition-all shadow-2xs hover:shadow-xs"
                  [class.border-teal-700]="selectedDistrict()?.name === dist.name"
                  [class.bg-teal-50/30]="selectedDistrict()?.name === dist.name"
                  [class.border-slate-200]="selectedDistrict()?.name !== dist.name"
                  [class.bg-white]="selectedDistrict()?.name !== dist.name">

                  <div class="flex items-start justify-between">
                    <div>
                      <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800">{{ dist.province }}</span>
                      <h4 class="text-sm font-bold text-slate-900 mt-0.5">{{ dist.name }}</h4>
                    </div>
                    <span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full font-mono text-[10px] font-bold">
                      {{ dist.activeProjects }} Proj
                    </span>
                  </div>

                  <div class="mt-3 grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-100">
                    <div>
                      <span class="text-[9px] text-slate-400 uppercase block">Reach</span>
                      <strong class="text-slate-800">{{ dist.beneficiariesReached | number }}</strong>
                    </div>
                    <div>
                      <span class="text-[9px] text-slate-400 uppercase block">DQA Rate</span>
                      <span class="text-emerald-700 font-bold">{{ dist.dqaPassRate }}%</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Selected District Detailed Dossier -->
          @if (selectedDistrict(); as dist) {
            <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4 animate-in fade-in">
              <div class="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span class="text-xs font-mono font-bold uppercase text-teal-800">{{ dist.province }} · Nepal</span>
                  <h3 class="text-lg font-bold text-slate-900">{{ dist.name }} District MEAL Performance Dossier</h3>
                  <p class="text-xs text-slate-600 mt-0.5">Municipalities: {{ dist.municipalities.join(', ') }}</p>
                </div>
                <div class="text-right">
                  <span class="text-xs text-slate-500">Seismic Vulnerability Zone</span>
                  <span class="block text-xs font-bold text-rose-700 font-mono">{{ dist.seismicZone }}</span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span class="text-slate-400 text-[10px] block">VERIFIED BENEFICIARIES</span>
                  <span class="text-base font-bold text-slate-900">{{ dist.beneficiariesReached | number }}</span>
                </div>
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span class="text-slate-400 text-[10px] block">CERTIFIED MASONS</span>
                  <span class="text-base font-bold text-teal-900">{{ dist.masonsCertified }}</span>
                </div>
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span class="text-slate-400 text-[10px] block">RETROFITTED STRUCTURES</span>
                  <span class="text-base font-bold text-slate-900">{{ dist.structuresRetrofit }}</span>
                </div>
                <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span class="text-slate-400 text-[10px] block">OPEN CFRM COMPLAINTS</span>
                  <span class="text-base font-bold text-amber-700">{{ dist.openComplaints }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class DataVisualizationView {
  readonly mealService = inject(MealDataService);
  readonly Math = Math;

  readonly activeVizTab = signal<VizTab>('pivot');
  readonly pivotRowDimension = signal<'project' | 'district' | 'vulnerability' | 'gender'>('project');
  readonly pivotColDimension = signal<'verification' | 'gender' | 'vulnerability'>('verification');
  readonly pivotMetric = signal<'count' | 'direct_support'>('count');

  readonly selectedDistrict = signal<any>(null);

  // Dynamic Cross-Tabulation Pivot Calculation
  readonly pivotMatrix = computed(() => {
    const bens = this.mealService.beneficiaries();
    const rowDim = this.pivotRowDimension();
    const colDim = this.pivotColDimension();

    // Extract unique column headers
    const colsSet = new Set<string>();
    bens.forEach(b => {
      const colVal = this.getDimensionValue(b, colDim);
      colsSet.add(colVal);
    });
    const cols = Array.from(colsSet);

    // Group by rows
    const rowsMap = new Map<string, Record<string, number>>();
    bens.forEach(b => {
      const rowVal = this.getDimensionValue(b, rowDim);
      const colVal = this.getDimensionValue(b, colDim);

      if (!rowsMap.has(rowVal)) {
        rowsMap.set(rowVal, {});
      }
      const rowObj = rowsMap.get(rowVal)!;
      rowObj[colVal] = (rowObj[colVal] || 0) + 1;
    });

    const rows = Array.from(rowsMap.entries()).map(([label, colData]) => {
      const cells = cols.map(c => colData[c] || 0);
      const total = cells.reduce((sum, n) => sum + n, 0);
      return { label, cells, total };
    });

    const colTotals = cols.map((_, colIdx) => {
      return rows.reduce((sum, r) => sum + r.cells[colIdx], 0);
    });

    const grandTotal = colTotals.reduce((sum, n) => sum + n, 0);

    return { cols, rows, colTotals, grandTotal };
  });

  private getDimensionValue(b: any, dim: string): string {
    switch (dim) {
      case 'project':
        return b.projectId === 'proj-bcrp' ? 'BCRP (Seismic)' : (b.projectId === 'proj-eed' ? 'EED (Education)' : 'WASH/Health');
      case 'district':
        return b.district || 'Sindhupalchok';
      case 'vulnerability':
        return b.vulnerabilityCategory || 'General Community';
      case 'gender':
        return b.gender || 'Female';
      case 'verification':
        return b.verificationStatus || 'Verified';
      default:
        return 'Other';
    }
  }

  // Quarterly Progress Data
  readonly quarterlyData = [
    { period: 'Q1-2026 (Oct - Dec 2025)', target: 200, actual: 215, percent: 107.5 },
    { period: 'Q2-2026 (Jan - Mar 2026)', target: 250, actual: 240, percent: 96.0 },
    { period: 'Q3-2026 (Apr - Jun 2026)', target: 220, actual: 185, percent: 84.1 },
    { period: 'Q4-2026 (Jul - Sep 2026)', target: 130, actual: 40, percent: 30.8 }
  ];

  // GESI Breakdown
  readonly gesiBreakdown = [
    { category: 'Women Headed Households', count: 1840, percent: 38.5, color: '#0f766e' },
    { category: 'Persons with Disabilities (PWD)', count: 420, percent: 8.8, color: '#0284c7' },
    { category: 'Dalit & Marginalized Caste', count: 1250, percent: 26.2, color: '#d97706' },
    { category: 'Youth Under 29', count: 980, percent: 20.5, color: '#6366f1' },
    { category: 'Elderly (>65)', count: 290, percent: 6.0, color: '#e11d48' }
  ];

  // Core Humanitarian Standard Radar Scores
  readonly chsScores = [
    { id: '1', title: 'Commitment 1: Appropriate & Relevant Assistance', score: 4.6 },
    { id: '2', title: 'Commitment 2: Effective & Timely Delivery', score: 4.4 },
    { id: '3', title: 'Commitment 3: Local Capacities & Resilience', score: 4.8 },
    { id: '4', title: 'Commitment 4: Communication & Participation', score: 4.5 },
    { id: '5', title: 'Commitment 5: Accessible Complaints Mechanism', score: 4.9 },
    { id: '6', title: 'Commitment 6: Coordinated & Complementary Aid', score: 4.3 },
    { id: '7', title: 'Commitment 7: Continuous Learning & Adaptation', score: 4.7 },
    { id: '8', title: 'Commitment 8: Competent & Well-Managed Staff', score: 4.5 },
    { id: '9', title: 'Commitment 9: Transparent & Ethical Resource Use', score: 4.8 }
  ];

  // CFRM Channels Data
  readonly cfrmChannels = [
    { channel: 'Toll-Free Hotline 1660-01-XXXX', count: 68, resolutionRate: 94.1, icon: 'phone_in_talk' },
    { channel: 'Community Suggestion Boxes', count: 42, resolutionRate: 90.5, icon: 'markunread_mailbox' },
    { channel: 'Field MEAL Helpdesk & Verification Spot', count: 35, resolutionRate: 91.4, icon: 'desk' },
    { channel: 'SMS & WhatsApp Rapid Hotline', count: 19, resolutionRate: 89.5, icon: 'chat' }
  ];

  // Nepal Target Districts Data
  readonly nepalDistricts = [
    {
      name: 'Sindhupalchok',
      province: 'Bagmati Province',
      activeProjects: 3,
      beneficiariesReached: 4120,
      dqaPassRate: 96.8,
      masonsCertified: 240,
      structuresRetrofit: 18,
      openComplaints: 2,
      seismicZone: 'Very High (Zone V)',
      municipalities: ['Chautara Sangachokgadhi', 'Melamchi', 'Helambu', 'Bhotekoshi']
    },
    {
      name: 'Gorkha',
      province: 'Gandaki Province',
      activeProjects: 2,
      beneficiariesReached: 3250,
      dqaPassRate: 94.2,
      masonsCertified: 180,
      structuresRetrofit: 14,
      openComplaints: 1,
      seismicZone: 'High (Zone IV-V)',
      municipalities: ['Gorkha Municipality', 'Palungtar', 'Barpak Sulikot']
    },
    {
      name: 'Jajarkot',
      province: 'Karnali Province',
      activeProjects: 2,
      beneficiariesReached: 2840,
      dqaPassRate: 92.5,
      masonsCertified: 110,
      structuresRetrofit: 22,
      openComplaints: 3,
      seismicZone: 'High (Zone IV)',
      municipalities: ['Bheri Municipality', 'Nalgad', 'Barekot']
    },
    {
      name: 'Dhading',
      province: 'Bagmati Province',
      activeProjects: 1,
      beneficiariesReached: 1960,
      dqaPassRate: 98.1,
      masonsCertified: 85,
      structuresRetrofit: 9,
      openComplaints: 0,
      seismicZone: 'High (Zone IV)',
      municipalities: ['Nilkantha', 'Dhuni Besi', 'Benighat Rorang']
    }
  ];

  constructor() {
    this.selectedDistrict.set(this.nepalDistricts[0]);
  }

  exportPivotCsv() {
    const p = this.pivotMatrix();
    const rows = [
      [this.pivotRowDimension(), ...p.cols, 'Row Total'],
      ...p.rows.map(r => [r.label, ...r.cells, r.total]),
      ['Column Totals', ...p.colTotals, p.grandTotal]
    ];

    const csv = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encoded = encodeURI(csv);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `meal_pivot_${this.pivotRowDimension()}_vs_${this.pivotColDimension()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
