import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
  AfterViewInit,
  OnDestroy,
  effect
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NepalGisService, PalikaGisFeature, GisMapLayerType, GisVisualizationMode } from '../services/nepal-gis.service';
import { MealDataService } from '../services/meal-data.service';
import { NepalGeoService } from '../services/nepal-geo.service';
import { BeneficiaryRecord } from '../models/meal.model';

type ActiveViewTab = 'map' | 'provincial-matrix' | 'gap-analysis' | 'palika-directory';

@Component({
  selector: 'app-gis-map-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Institutional Header & National Outreach Bar -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <mat-icon class="text-sm">travel_explore</mat-icon>
              </span>
              <div>
                <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  National Palika GIS Outreach & Beneficiary Mapping
                </h1>
                <p class="text-xs text-slate-500 mt-0.5">
                  Spatial distribution, demographic inclusion, and coverage deficit analysis across Nepal's 753 Local Bodies (Palikas)
                </p>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              (click)="resetNepalView()"
              class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              title="Reset map view to whole Nepal">
              <mat-icon class="text-xs">crop_free</mat-icon>
              <span>Fit Whole Nepal</span>
            </button>

            <button
              type="button"
              (click)="onIngestSurvey()"
              class="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              title="Simulate 25 additional palikas survey enumeration">
              <mat-icon class="text-xs">playlist_add</mat-icon>
              <span>Batch Ingest Survey</span>
            </button>

            <button
              type="button"
              (click)="exportGeoJsonFile()"
              class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Download standard GeoJSON for QGIS/ArcGIS">
              <mat-icon class="text-xs">file_download</mat-icon>
              <span>GeoJSON</span>
            </button>

            <button
              type="button"
              (click)="exportCsvFile()"
              class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              title="Export CSV dataset">
              <mat-icon class="text-xs">table_view</mat-icon>
              <span>CSV</span>
            </button>
          </div>
        </div>

        <!-- High-Impact Outreach Metric Bar (Zero-Pill Restraint) -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5 mt-5 border-t border-slate-100">
          <div class="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
            <span class="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">Palika Coverage</span>
            <div class="flex items-baseline gap-1.5 mt-1">
              <span class="text-xl font-bold text-slate-900">{{ regionalAnalysis().totalPalikasCovered }}</span>
              <span class="text-xs text-slate-500">/ 753</span>
            </div>
            <span class="text-[11px] font-semibold text-teal-700 mt-0.5 block">
              {{ regionalAnalysis().nationalPalikaPenetrationPct }}% National Reach
            </span>
          </div>

          <div class="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
            <span class="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">Districts Reached</span>
            <div class="flex items-baseline gap-1.5 mt-1">
              <span class="text-xl font-bold text-slate-900">{{ regionalAnalysis().totalDistrictsCovered }}</span>
              <span class="text-xs text-slate-500">/ 77</span>
            </div>
            <span class="text-[11px] font-semibold text-slate-600 mt-0.5 block">
              {{ ((regionalAnalysis().totalDistrictsCovered / 77) * 100).toFixed(0) }}% Coverage
            </span>
          </div>

          <div class="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
            <span class="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">Beneficiaries Mapped</span>
            <div class="flex items-baseline gap-1 mt-1">
              <span class="text-xl font-bold text-slate-900">{{ regionalAnalysis().totalBeneficiaries }}</span>
              <span class="text-xs text-slate-500">records</span>
            </div>
            <span class="text-[11px] text-slate-500 mt-0.5 block">
              {{ regionalAnalysis().verificationSplit.verified }} Verified
            </span>
          </div>

          <div class="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
            <span class="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">Gender Equity</span>
            <div class="flex items-baseline gap-1.5 mt-1">
              <span class="text-xl font-bold text-teal-800">{{ regionalAnalysis().genderSplit.femalePct }}%</span>
              <span class="text-xs text-slate-500">Female</span>
            </div>
            <span class="text-[11px] text-slate-500 mt-0.5 block">
              {{ regionalAnalysis().genderSplit.female }} F · {{ regionalAnalysis().genderSplit.male }} M
            </span>
          </div>

          <div class="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
            <span class="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">Disability Inclusion</span>
            <div class="flex items-baseline gap-1 mt-1">
              <span class="text-xl font-bold text-slate-900">{{ regionalAnalysis().vulnerabilityCounts.pwd }}</span>
              <span class="text-xs text-slate-500">PWD</span>
            </div>
            <span class="text-[11px] font-medium text-teal-700 mt-0.5 block">
              {{ ((regionalAnalysis().vulnerabilityCounts.pwd / (regionalAnalysis().totalBeneficiaries || 1)) * 100).toFixed(1) }}% Rate
            </span>
          </div>

          <div class="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
            <span class="text-[11px] font-medium text-slate-500 block uppercase tracking-wider">Marginalized / Janajati</span>
            <div class="flex items-baseline gap-1 mt-1">
              <span class="text-xl font-bold text-slate-900">{{ regionalAnalysis().vulnerabilityCounts.marginalized }}</span>
              <span class="text-xs text-slate-500">persons</span>
            </div>
            <span class="text-[11px] text-slate-500 mt-0.5 block">
              Targeted Inclusion
            </span>
          </div>
        </div>

        <!-- View Navigation Tabs -->
        <div class="flex items-center gap-2 mt-5 border-t border-slate-100 pt-3">
          <button
            type="button"
            (click)="activeTab.set('map')"
            [class]="activeTab() === 'map' ? 'bg-teal-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5">
            <mat-icon class="text-xs">map</mat-icon>
            <span>Interactive GIS Map</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('provincial-matrix')"
            [class]="activeTab() === 'provincial-matrix' ? 'bg-teal-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5">
            <mat-icon class="text-xs">bar_chart</mat-icon>
            <span>Provincial Outreach Matrix</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('gap-analysis')"
            [class]="activeTab() === 'gap-analysis' ? 'bg-teal-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5">
            <mat-icon class="text-xs">radar</mat-icon>
            <span>Outreach Gap Analysis</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('palika-directory')"
            [class]="activeTab() === 'palika-directory' ? 'bg-teal-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5">
            <mat-icon class="text-xs">view_list</mat-icon>
            <span>753 Palika Explorer</span>
          </button>
        </div>
      </div>

      <!-- MAIN TAB 1: INTERACTIVE GIS MAP -->
      @if (activeTab() === 'map') {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left / Main Area: Map Controls & Leaflet Container -->
          <div class="lg:col-span-8 xl:col-span-9 space-y-4">
            <!-- Filter Bar & Spatial Cascades -->
            <div class="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-3">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                <!-- Province Selector with Auto-Pan -->
                <div>
                  <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Province</label>
                  <select
                    [value]="gisService.selectedProvinceFilter() ?? 'all'"
                    (change)="onProvinceChange($event)"
                    class="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-teal-700">
                    <option value="all">All 7 Provinces</option>
                    @for (prov of provinces(); track prov.id) {
                      <option [value]="prov.id">{{ prov.name }}</option>
                    }
                  </select>
                </div>

                <!-- District Selector with Auto-Pan -->
                <div>
                  <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">District</label>
                  <select
                    [value]="gisService.selectedDistrictFilter() ?? 'all'"
                    (change)="onDistrictChange($event)"
                    class="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-teal-700">
                    <option value="all">All 77 Districts</option>
                    @for (dist of availableDistricts(); track dist.id) {
                      <option [value]="dist.id">{{ dist.name }}</option>
                    }
                  </select>
                </div>

                <!-- Project Filter -->
                <div>
                  <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Project</label>
                  <select
                    [value]="gisService.selectedProjectFilter()"
                    (change)="onProjectFilterChange($event)"
                    class="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-teal-700">
                    <option value="all">All Programs</option>
                    @for (proj of projects(); track proj.id) {
                      <option [value]="proj.id">{{ proj.code }} - {{ proj.name }}</option>
                    }
                  </select>
                </div>

                <!-- Palika Type Filter -->
                <div>
                  <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Palika Type</label>
                  <select
                    [value]="gisService.selectedPalikaTypeFilter()"
                    (change)="onTypeFilterChange($event)"
                    class="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-teal-700">
                    <option value="all">All Local Body Types</option>
                    <option value="Metropolitan City">Metropolitan Cities (6)</option>
                    <option value="Sub-Metropolitan City">Sub-Metropolitan (11)</option>
                    <option value="Municipality">Municipalities (276)</option>
                    <option value="Rural Municipality">Rural Municipalities (460)</option>
                  </select>
                </div>

                <!-- Verification Status -->
                <div>
                  <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">DQA Status</label>
                  <select
                    [value]="gisService.selectedVerificationFilter()"
                    (change)="onVerificationFilterChange($event)"
                    class="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-teal-700">
                    <option value="all">All Statuses</option>
                    <option value="verified">Verified Only</option>
                    <option value="pending">Pending DQA</option>
                    <option value="flagged">Flagged Duplicates</option>
                  </select>
                </div>

                <!-- Inclusion / Vulnerability Filter -->
                <div>
                  <label class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Vulnerability</label>
                  <select
                    [value]="gisService.selectedVulnerabilityFilter()"
                    (change)="onVulnerabilityFilterChange($event)"
                    class="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-slate-800 font-medium focus:ring-1 focus:ring-teal-700">
                    <option value="all">All Beneficiaries</option>
                    <option value="female">Female Beneficiaries</option>
                    <option value="pwd">PWD (Disability Set)</option>
                    <option value="marginalized">Dalit / Marginalized</option>
                    <option value="youth">Youth (15-29)</option>
                  </select>
                </div>
              </div>

              <!-- Second Filter Row: Search & Display Preferences -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <!-- Search across all 753 Palikas -->
                <div class="relative flex-1 min-w-[240px] max-w-md">
                  <mat-icon class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">search</mat-icon>
                  <input
                    type="text"
                    [value]="gisService.palikaSearchQuery()"
                    (input)="onSearchInput($event)"
                    placeholder="Search any palika (e.g. Chautara, Pokhara, चौतारा)..."
                    class="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-700" />
                  @if (gisService.palikaSearchQuery()) {
                    <button
                      type="button"
                      (click)="gisService.palikaSearchQuery.set('')"
                      class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <mat-icon class="text-xs">close</mat-icon>
                    </button>
                  }
                </div>

                <!-- Display Mode Controls -->
                <div class="flex items-center gap-3">
                  <!-- Show Zero-Reach Toggle -->
                  <label class="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      [checked]="gisService.showAll753Palikas()"
                      (change)="toggleShowAllPalikas($event)"
                      class="rounded border-slate-300 text-teal-800 focus:ring-teal-700" />
                    <span>Show 753 Gaps (Unreached)</span>
                  </label>

                  <!-- Base Tile Selector -->
                  <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-100 text-[11px] font-medium">
                    <button
                      type="button"
                      (click)="setBaseLayer('carto-light')"
                      [class]="gisService.activeBaseLayer() === 'carto-light' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                      class="px-2.5 py-1 transition-colors">
                      Light
                    </button>
                    <button
                      type="button"
                      (click)="setBaseLayer('osm-bright')"
                      [class]="gisService.activeBaseLayer() === 'osm-bright' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                      class="px-2.5 py-1 transition-colors">
                      OSM
                    </button>
                    <button
                      type="button"
                      (click)="setBaseLayer('humanitarian')"
                      [class]="gisService.activeBaseLayer() === 'humanitarian' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                      class="px-2.5 py-1 transition-colors">
                      Humanitarian
                    </button>
                  </div>

                  <!-- Reset Filters -->
                  <button
                    type="button"
                    (click)="gisService.resetFilters()"
                    class="text-xs text-slate-500 hover:text-slate-800 underline">
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <!-- Leaflet Map Container -->
            <div class="relative bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm min-h-[540px] h-[600px] w-full">
              <!-- Actual Map DOM element -->
              <div #mapContainer class="w-full h-full z-10"></div>

              <!-- Map Legend Overlay -->
              <div class="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3 shadow-md text-xs space-y-2 max-w-xs">
                <span class="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">Outreach Legend</span>
                
                <div class="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                  <div class="flex items-center gap-1.5">
                    <span class="w-3.5 h-3.5 rounded-full bg-teal-700 border-2 border-white shadow-xs"></span>
                    <span class="text-slate-700 font-medium">High Reach (5+)</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-3 h-3 rounded-full bg-sky-600 border border-white"></span>
                    <span class="text-slate-700 font-medium">Medium (2-4)</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white"></span>
                    <span class="text-slate-700 font-medium">Low Reach (1)</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-slate-400 border border-white"></span>
                    <span class="text-slate-500">Unreached Gap</span>
                  </div>
                </div>

                <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Displaying {{ filteredFeatures().length }} palikas</span>
                  <span class="font-medium text-teal-800">{{ activeBeneficiariesCount() }} Beneficiaries</span>
                </div>
              </div>

              <!-- Quick Province Jump Pills Overlay (Top-Right) -->
              <div class="absolute top-4 right-4 z-20 flex flex-wrap max-w-xs justify-end gap-1 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl border border-slate-200/80 shadow-xs">
                @for (prov of provinces(); track prov.id) {
                  <button
                    type="button"
                    (click)="zoomToProvince(prov.id)"
                    [class]="gisService.selectedProvinceFilter() === prov.id ? 'bg-teal-900 text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'"
                    class="px-2 py-0.5 text-[10px] rounded-md transition-colors">
                    P{{ prov.id }} ({{ prov.name.split(' ')[0] }})
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- Right Sidebar: Selected Palika Detail Dossier & Roster -->
          <div class="lg:col-span-4 xl:col-span-3 space-y-4">
            @if (selectedPalika(); as palika) {
              <!-- Active Palika Dossier Card -->
              <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                      {{ palika.provinceName }} · {{ palika.districtName }}
                    </span>
                    <h2 class="text-lg font-bold text-slate-900 leading-tight">
                      {{ palika.name }}
                    </h2>
                    @if (palika.nepaliName) {
                      <span class="text-xs text-slate-500 font-medium block mt-0.5">
                        {{ palika.nepaliName }} · {{ palika.type }}
                      </span>
                    }
                  </div>
                  <button
                    type="button"
                    (click)="gisService.selectPalika(null)"
                    class="text-slate-400 hover:text-slate-600 p-1">
                    <mat-icon class="text-xs">close</mat-icon>
                  </button>
                </div>

                <!-- Geographic Coordinates & Administrative Metadata -->
                <div class="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">Palika Code:</span>
                    <span class="font-mono text-slate-700 font-semibold">{{ palika.palikaId }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">Total Wards:</span>
                    <span class="font-semibold text-slate-800">{{ palika.totalWards }} Wards</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">Coordinates:</span>
                    <span class="font-mono text-slate-600">{{ palika.lat.toFixed(4) }}°N, {{ palika.lng.toFixed(4) }}°E</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">Coverage Level:</span>
                    <span class="font-semibold capitalize"
                      [class]="palika.coverageLevel === 'high' ? 'text-teal-700' : (palika.coverageLevel === 'medium' ? 'text-sky-700' : (palika.coverageLevel === 'low' ? 'text-amber-700' : 'text-slate-500'))">
                      {{ palika.coverageLevel }} ({{ palika.beneficiaryCount }} mapped)
                    </span>
                  </div>
                </div>

                <!-- Demographic Breakdown in this Palika -->
                <div>
                  <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Outreach Disaggregations</h3>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="bg-slate-50 rounded-lg p-2 border border-slate-100">
                      <span class="text-slate-500 block text-[10px]">Gender</span>
                      <span class="font-bold text-slate-800">{{ palika.femaleCount }} F / {{ palika.maleCount }} M</span>
                    </div>
                    <div class="bg-slate-50 rounded-lg p-2 border border-slate-100">
                      <span class="text-slate-500 block text-[10px]">Disability</span>
                      <span class="font-bold text-teal-800">{{ palika.pwdCount }} PWD</span>
                    </div>
                    <div class="bg-slate-50 rounded-lg p-2 border border-slate-100">
                      <span class="text-slate-500 block text-[10px]">Marginalized</span>
                      <span class="font-bold text-slate-800">{{ palika.marginalizedCount }} Dalit/Janajati</span>
                    </div>
                    <div class="bg-slate-50 rounded-lg p-2 border border-slate-100">
                      <span class="text-slate-500 block text-[10px]">Youth (15-29)</span>
                      <span class="font-bold text-slate-800">{{ palika.youthCount }} Young Persons</span>
                    </div>
                  </div>
                </div>

                <!-- Verification Status -->
                <div class="text-xs pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span class="text-slate-500">DQA Verification:</span>
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-emerald-700">{{ palika.verifiedCount }} Verified</span>
                    @if (palika.flaggedCount > 0) {
                      <span class="font-semibold text-amber-700">· {{ palika.flaggedCount }} Flagged</span>
                    }
                    @if (palika.pendingCount > 0) {
                      <span class="font-semibold text-slate-600">· {{ palika.pendingCount }} Pending</span>
                    }
                  </div>
                </div>

                <!-- Beneficiary Roster in this Palika -->
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Beneficiary Roster</h3>
                    <span class="text-[10px] text-slate-500">{{ palika.beneficiaries.length }} records</span>
                  </div>

                  @if (palika.beneficiaries.length === 0) {
                    <div class="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 space-y-2">
                      <div class="flex items-center gap-1.5 font-semibold text-amber-800">
                        <mat-icon class="text-xs">info</mat-icon>
                        <span>Unreached Palika</span>
                      </div>
                      <p class="text-[11px] text-amber-800/80">
                        No beneficiary interventions currently registered in {{ palika.name }}. Use the action below to enrol a field participant.
                      </p>
                    </div>
                  } @else {
                    <div class="space-y-2 max-h-64 overflow-y-auto pr-1 no-scrollbar">
                      @for (ben of palika.beneficiaries; track ben.id) {
                        <div class="border border-slate-200 rounded-xl p-2.5 text-xs hover:border-teal-700 transition-colors bg-white">
                          <div class="flex items-start justify-between gap-1">
                            <span class="font-bold text-slate-900">{{ ben.fullName }}</span>
                            <span class="text-[10px] font-semibold"
                              [class]="ben.verificationStatus === 'Verified' ? 'text-emerald-700' : (ben.verificationStatus === 'Flagged Duplicate' ? 'text-amber-700' : 'text-slate-500')">
                              {{ ben.verificationStatus }}
                            </span>
                          </div>
                          <span class="text-[11px] text-slate-600 block mt-0.5">
                            Ward {{ ben.ward }} · {{ ben.gender }}, {{ ben.age }}y · {{ ben.intervention }}
                          </span>
                          <div class="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                            <span>{{ ben.beneficiaryCode }}</span>
                            <span>{{ ben.phoneNumber }}</span>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>

                <!-- Add Beneficiary in this Palika Action -->
                <button
                  type="button"
                  (click)="openAddBeneficiaryModal(palika)"
                  class="w-full py-2 bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs">
                  <mat-icon class="text-xs">person_add</mat-icon>
                  <span>Enrol Beneficiary in {{ palika.name }}</span>
                </button>
              </div>
            } @else {
              <!-- Empty Selection State: Top Reached Palikas Leaderboard -->
              <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div class="flex items-center justify-between">
                  <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <mat-icon class="text-xs text-teal-800">workspace_premium</mat-icon>
                    <span>Top Reached Palikas</span>
                  </h2>
                  <span class="text-[10px] text-slate-500">Click to pan</span>
                </div>

                <div class="space-y-2 max-h-[480px] overflow-y-auto pr-1 no-scrollbar">
                  @for (top of regionalAnalysis().topReachedPalikas; track top.palikaId) {
                    <button
                      type="button"
                      (click)="focusOnPalika(top)"
                      class="w-full text-left border border-slate-200 rounded-xl p-3 hover:border-teal-700 hover:bg-teal-50/30 transition-all flex items-center justify-between gap-3 group">
                      <div>
                        <div class="flex items-center gap-1.5">
                          <span class="font-bold text-slate-900 text-xs group-hover:text-teal-900">{{ top.name }}</span>
                          @if (top.nepaliName) {
                            <span class="text-[10px] text-slate-400">{{ top.nepaliName }}</span>
                          }
                        </div>
                        <span class="text-[11px] text-slate-500 block mt-0.5">
                          {{ top.districtName }} · {{ top.provinceName }}
                        </span>
                      </div>

                      <div class="text-right shrink-0">
                        <span class="text-sm font-bold text-teal-800">{{ top.beneficiaryCount }}</span>
                        <span class="text-[10px] text-slate-400 block">beneficiaries</span>
                      </div>
                    </button>
                  }
                </div>

                <div class="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border border-slate-100 flex items-center gap-2">
                  <mat-icon class="text-xs text-slate-400 shrink-0">touch_app</mat-icon>
                  <span>Click on any bubble or circle on the map to view full ward disaggregation and beneficiary lists.</span>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- MAIN TAB 2: PROVINCIAL OUTREACH COMPARISON MATRIX -->
      @if (activeTab() === 'provincial-matrix') {
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h2 class="text-lg font-bold text-slate-900">
              Provincial Outreach & Equity Analysis Matrix
            </h2>
            <p class="text-xs text-slate-500 mt-1">
              Comparing beneficiary penetration, disability inclusion, and gender parity across all 7 Federal Provinces of Nepal
            </p>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px] bg-slate-50">
                  <th class="py-3 px-4">Province</th>
                  <th class="py-3 px-4 text-center">Total Palikas</th>
                  <th class="py-3 px-4 text-center">Palikas Reached</th>
                  <th class="py-3 px-4 text-center">Coverage %</th>
                  <th class="py-3 px-4 text-center">Beneficiaries</th>
                  <th class="py-3 px-4 text-center">Female %</th>
                  <th class="py-3 px-4 text-center">PWD Reached</th>
                  <th class="py-3 px-4 text-right">Map View</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (stat of regionalAnalysis().provinces; track stat.provinceId) {
                  <tr class="hover:bg-slate-50/70 transition-colors">
                    <td class="py-3 px-4 font-bold text-slate-900">
                      {{ stat.provinceName }}
                    </td>
                    <td class="py-3 px-4 text-center text-slate-600 font-medium">
                      {{ stat.totalPalikas }}
                    </td>
                    <td class="py-3 px-4 text-center text-slate-900 font-bold">
                      {{ stat.palikasReached }}
                    </td>
                    <td class="py-3 px-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <div class="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            class="bg-teal-700 h-full rounded-full"
                            [style.width.%]="stat.coveragePercent"></div>
                        </div>
                        <span class="font-bold text-slate-800">{{ stat.coveragePercent }}%</span>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-center font-bold text-teal-800">
                      {{ stat.beneficiariesCount }}
                    </td>
                    <td class="py-3 px-4 text-center">
                      <span class="font-semibold" [class]="stat.femalePercent >= 50 ? 'text-emerald-700' : 'text-slate-700'">
                        {{ stat.femalePercent }}%
                      </span>
                    </td>
                    <td class="py-3 px-4 text-center font-semibold text-slate-800">
                      {{ stat.pwdCount }}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button
                        type="button"
                        (click)="zoomToProvinceFromTable(stat.provinceId)"
                        class="px-2.5 py-1 bg-slate-100 hover:bg-teal-900 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1">
                        <mat-icon class="text-xs">pin_drop</mat-icon>
                        <span>Focus</span>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- MAIN TAB 3: OUTREACH GAP & DEFICIT ANALYSIS -->
      @if (activeTab() === 'gap-analysis') {
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                Outreach Deficit & High-Priority Gap Analysis
              </h2>
              <p class="text-xs text-slate-500 mt-1">
                Identifies districts and clusters across Nepal with zero intervention coverage to guide upcoming project cohorts
              </p>
            </div>
            <button
              type="button"
              (click)="onIngestSurvey()"
              class="px-3 py-1.5 bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs self-start">
              <mat-icon class="text-xs">expand</mat-icon>
              <span>Bridge Gaps (Auto-Enrol Cohort)</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            @for (gap of regionalAnalysis().unreachedCriticalDistricts; track gap.districtName) {
              <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                      {{ gap.provinceName }}
                    </span>
                    <h3 class="font-bold text-slate-900 text-sm mt-0.5">
                      {{ gap.districtName }}
                    </h3>
                  </div>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Zero Coverage
                  </span>
                </div>

                <div class="text-xs text-slate-600 space-y-1">
                  <div class="flex justify-between">
                    <span>Unreached Palikas:</span>
                    <span class="font-bold text-slate-800">{{ gap.palikaCount }} Palikas</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Priority Level:</span>
                    <span class="font-semibold text-rose-700">High Deficit</span>
                  </div>
                </div>

                <button
                  type="button"
                  (click)="filterByDistrictAndOpenMap(gap.districtName)"
                  class="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1">
                  <mat-icon class="text-xs">map</mat-icon>
                  <span>Explore on Map</span>
                </button>
              </div>
            }
          </div>
        </div>
      }

      <!-- MAIN TAB 4: 753 PALIKA EXPLORER DIRECTORY -->
      @if (activeTab() === 'palika-directory') {
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                Official 753 Local Bodies (Palika) GIS Directory
              </h2>
              <p class="text-xs text-slate-500 mt-1">
                Full gazetteer of 6 Metros, 11 Sub-Metros, 276 Municipalities, and 460 Rural Municipalities
              </p>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="text"
                [value]="gisService.palikaSearchQuery()"
                (input)="onSearchInput($event)"
                placeholder="Filter palikas..."
                class="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800" />
            </div>
          </div>

          <div class="overflow-x-auto max-h-[550px] border border-slate-200 rounded-xl">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="sticky top-0 bg-slate-100 z-10">
                <tr class="border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <th class="py-2.5 px-3">Palika Name</th>
                  <th class="py-2.5 px-3">Nepali Name</th>
                  <th class="py-2.5 px-3">Type</th>
                  <th class="py-2.5 px-3">District</th>
                  <th class="py-2.5 px-3">Province</th>
                  <th class="py-2.5 px-3 text-center">Wards</th>
                  <th class="py-2.5 px-3 text-center">Beneficiaries</th>
                  <th class="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white">
                @for (palika of filteredFeatures().slice(0, 100); track palika.palikaId) {
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="py-2.5 px-3 font-bold text-slate-900">
                      {{ palika.name }}
                    </td>
                    <td class="py-2.5 px-3 text-slate-500 font-medium">
                      {{ palika.nepaliName || '-' }}
                    </td>
                    <td class="py-2.5 px-3 text-slate-600">
                      {{ palika.type }}
                    </td>
                    <td class="py-2.5 px-3 text-slate-700">
                      {{ palika.districtName }}
                    </td>
                    <td class="py-2.5 px-3 text-slate-500">
                      {{ palika.provinceName }}
                    </td>
                    <td class="py-2.5 px-3 text-center font-medium">
                      {{ palika.totalWards }}
                    </td>
                    <td class="py-2.5 px-3 text-center">
                      <span class="font-bold" [class]="palika.beneficiaryCount > 0 ? 'text-teal-800' : 'text-slate-400'">
                        {{ palika.beneficiaryCount }}
                      </span>
                    </td>
                    <td class="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        (click)="focusOnPalikaFromDirectory(palika)"
                        class="px-2 py-1 bg-slate-100 hover:bg-teal-900 hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1">
                        <mat-icon class="text-xs">pin_drop</mat-icon>
                        <span>View on Map</span>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          @if (filteredFeatures().length > 100) {
            <p class="text-[11px] text-slate-500 text-center">
              Showing first 100 of {{ filteredFeatures().length }} palikas. Use search or district filters to narrow list.
            </p>
          }
        </div>
      }

      <!-- MODAL: Enrol Beneficiary in Specific Palika -->
      @if (enrolModalOpen()) {
        <div class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                  {{ modalTargetPalika()?.provinceName }} · {{ modalTargetPalika()?.districtName }}
                </span>
                <h3 class="text-lg font-bold text-slate-900">
                  Enrol Beneficiary in {{ modalTargetPalika()?.name }}
                </h3>
              </div>
              <button
                type="button"
                (click)="enrolModalOpen.set(false)"
                class="text-slate-400 hover:text-slate-600">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="enrolForm" (ngSubmit)="submitEnrolment()" class="space-y-3 text-xs">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  formControlName="fullName"
                  placeholder="e.g. Sita Kumari Magar"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-teal-700" />
              </div>

              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Gender *</label>
                  <select
                    formControlName="gender"
                    class="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-teal-700">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Age *</label>
                  <input
                    type="number"
                    formControlName="age"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-teal-700" />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Ward (1-{{ modalTargetPalika()?.totalWards }})</label>
                  <input
                    type="number"
                    formControlName="ward"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-teal-700" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    formControlName="phoneNumber"
                    placeholder="98XXXXXXXX"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-teal-700" />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Citizenship / National ID</label>
                  <input
                    type="text"
                    formControlName="citizenshipNumber"
                    placeholder="27-01-72-XXXX"
                    class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-teal-700" />
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Project & Intervention *</label>
                <select
                  formControlName="intervention"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-teal-700">
                  <option value="7-Day Mason Retrofitting & Seismic Training">7-Day Mason Retrofitting & Seismic Training</option>
                  <option value="Community Early Warning & Flood Evacuation">Community Early Warning & Flood Evacuation</option>
                  <option value="School Evacuation Drill & Student DRR Club">School Evacuation Drill & Student DRR Club</option>
                  <option value="Municipal Building Code NBC 105 Training">Municipal Building Code NBC 105 Training</option>
                  <option value="Community First Responder & Search/Rescue">Community First Responder & Search/Rescue</option>
                  <option value="Emergency Winterized Shelter & Cash Grant">Emergency Winterized Shelter & Cash Grant</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Vulnerability Dimensions</label>
                <div class="grid grid-cols-2 gap-2 pt-1">
                  <label class="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" formControlName="isFemaleHeaded" class="rounded border-slate-300 text-teal-800" />
                    <span>Female-Headed HH</span>
                  </label>
                  <label class="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" formControlName="isPwd" class="rounded border-slate-300 text-teal-800" />
                    <span>PWD (Disability)</span>
                  </label>
                  <label class="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" formControlName="isMarginalized" class="rounded border-slate-300 text-teal-800" />
                    <span>Dalit / Janajati</span>
                  </label>
                  <label class="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" formControlName="isYouth" class="rounded border-slate-300 text-teal-800" />
                    <span>Youth (15-29)</span>
                  </label>
                </div>
              </div>

              <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  (click)="enrolModalOpen.set(false)"
                  class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="enrolForm.invalid"
                  class="px-4 py-2 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs">
                  <mat-icon class="text-xs">check</mat-icon>
                  <span>Confirm Registration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class GisMapView implements AfterViewInit, OnDestroy {
  readonly gisService = inject(NepalGisService);
  readonly mealService = inject(MealDataService);
  readonly geoService = inject(NepalGeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly mapContainer = viewChild<ElementRef<HTMLDivElement>>('mapContainer');

  readonly activeTab = signal<ActiveViewTab>('map');
  readonly enrolModalOpen = signal<boolean>(false);
  readonly modalTargetPalika = signal<PalikaGisFeature | null>(null);

  // Map state
  private map: any = null;
  private markerLayerGroup: any = null;
  private tileLayer: any = null;
  private L: any = null;

  // Signals from services
  readonly provinces = this.geoService.provinces;
  readonly projects = this.mealService.projects;
  readonly regionalAnalysis = this.gisService.regionalAnalysis;
  readonly filteredFeatures = this.gisService.filteredPalikaFeatures;
  readonly selectedPalika = this.gisService.selectedPalika;

  readonly availableDistricts = computed(() => {
    const provId = this.gisService.selectedProvinceFilter();
    return this.geoService.getDistrictsForProvince(provId);
  });

  readonly activeBeneficiariesCount = computed(() => {
    return this.filteredFeatures().reduce((acc, p) => acc + p.beneficiaryCount, 0);
  });

  // Enrol form
  readonly enrolForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    gender: new FormControl<'Female' | 'Male' | 'Other'>('Female', [Validators.required]),
    age: new FormControl(32, [Validators.required, Validators.min(10), Validators.max(100)]),
    ward: new FormControl(1, [Validators.required, Validators.min(1)]),
    phoneNumber: new FormControl('9841000000', [Validators.required]),
    citizenshipNumber: new FormControl('27-01-75-0100', [Validators.required]),
    intervention: new FormControl('7-Day Mason Retrofitting & Seismic Training', [Validators.required]),
    isFemaleHeaded: new FormControl(false),
    isPwd: new FormControl(false),
    isMarginalized: new FormControl(true),
    isYouth: new FormControl(false)
  });

  constructor() {
    // Effect to update map markers when filtered features change
    effect(() => {
      const features = this.filteredFeatures();
      const currentTab = this.activeTab();
      if (this.isBrowser && this.map && currentTab === 'map') {
        this.renderPalikaMarkers(features);
      }
    });

    // Effect to react to base layer change
    effect(() => {
      const layerType = this.gisService.activeBaseLayer();
      if (this.isBrowser && this.map && this.L) {
        this.updateBaseTileLayer(layerType);
      }
    });
  }

  async ngAfterViewInit() {
    if (this.isBrowser) {
      try {
        const leafletModule = await import('leaflet');
        this.L = leafletModule.default || leafletModule;
        // Fix Leaflet's default icon URLs
        if (this.L?.Icon?.Default) {
          delete (this.L.Icon.Default.prototype as any)._getIconUrl;
          this.L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
          });
        }
        this.initMap();
      } catch (err) {
        console.error('Failed to load Leaflet GIS library:', err);
      }
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap() {
    const el = this.mapContainer()?.nativeElement;
    if (!el || !this.L) return;

    // Centered on Nepal [28.3949, 84.1240]
    this.map = this.L.map(el, {
      center: [28.3949, 84.1240],
      zoom: 7,
      minZoom: 6,
      maxZoom: 16,
      zoomControl: true,
      attributionControl: true
    });

    this.updateBaseTileLayer(this.gisService.activeBaseLayer());

    this.markerLayerGroup = this.L.layerGroup().addTo(this.map);
    this.renderPalikaMarkers(this.filteredFeatures());

    // Fix map rendering sizes after initial layout
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 200);
  }

  private updateBaseTileLayer(type: GisMapLayerType) {
    if (!this.map || !this.L) return;

    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    let attribution = '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap';

    if (type === 'osm-bright') {
      url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    } else if (type === 'humanitarian') {
      url = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
      attribution = '&copy; Humanitarian OpenStreetMap Team';
    }

    this.tileLayer = this.L.tileLayer(url, {
      maxZoom: 19,
      attribution
    }).addTo(this.map);
  }

  private renderPalikaMarkers(features: PalikaGisFeature[]) {
    if (!this.map || !this.markerLayerGroup || !this.L) return;

    this.markerLayerGroup.clearLayers();

    features.forEach(palika => {
      const hasBeneficiaries = palika.beneficiaryCount > 0;
      let radius = 6;
      let fillColor = '#94a3b8'; // Slate for unreached gaps
      let fillOpacity = 0.45;
      let strokeColor = '#64748b';
      let weight = 1;

      if (palika.coverageLevel === 'high') {
        radius = Math.min(24, 14 + palika.beneficiaryCount * 1.5);
        fillColor = '#0f766e'; // Deep Teal
        fillOpacity = 0.85;
        strokeColor = '#ffffff';
        weight = 2;
      } else if (palika.coverageLevel === 'medium') {
        radius = 12;
        fillColor = '#0284c7'; // Sky / Blue
        fillOpacity = 0.8;
        strokeColor = '#ffffff';
        weight = 1.5;
      } else if (palika.coverageLevel === 'low') {
        radius = 9;
        fillColor = '#d97706'; // Amber
        fillOpacity = 0.8;
        strokeColor = '#ffffff';
        weight = 1.5;
      }

      const marker = this.L.circleMarker([palika.lat, palika.lng], {
        radius,
        fillColor,
        color: strokeColor,
        weight,
        opacity: 0.9,
        fillOpacity
      });

      // Tooltip on Hover
      const tooltipContent = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; padding: 2px;">
          <strong style="color: #0f172a; font-size: 12px;">${palika.name}</strong>
          ${palika.nepaliName ? `<span style="color: #64748b;"> (${palika.nepaliName})</span>` : ''}
          <div style="color: #475569; margin-top: 2px;">
            ${palika.districtName} · ${palika.type}
          </div>
          <div style="margin-top: 4px; font-weight: 600; color: ${hasBeneficiaries ? '#0f766e' : '#64748b'};">
            ${hasBeneficiaries ? `${palika.beneficiaryCount} Beneficiaries Mapped` : 'Unreached Gap (0 Mapped)'}
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: [0, -radius],
        className: 'custom-leaflet-tooltip'
      });

      // Click to Select & Pan
      marker.on('click', () => {
        this.gisService.selectPalika(palika.palikaId);
        this.map.panTo([palika.lat, palika.lng], { animate: true, duration: 0.6 });
      });

      this.markerLayerGroup.addLayer(marker);
    });
  }

  // Map Navigation & Interaction Handlers
  resetNepalView() {
    if (!this.map) return;
    this.gisService.resetFilters();
    this.map.setView([28.3949, 84.1240], 7, { animate: true });
  }

  zoomToProvince(provinceId: number) {
    this.gisService.filterByProvince(provinceId);
    if (!this.map) return;
    const bound = this.gisService.getProvinceBound(provinceId);
    this.map.setView(bound.center, bound.zoom, { animate: true });
  }

  zoomToProvinceFromTable(provinceId: number) {
    this.activeTab.set('map');
    setTimeout(() => {
      this.zoomToProvince(provinceId);
    }, 100);
  }

  filterByDistrictAndOpenMap(districtName: string) {
    const d = this.geoService.districts().find(item => item.name.toLowerCase() === districtName.toLowerCase());
    if (d) {
      this.gisService.selectedProvinceFilter.set(d.provinceId);
      this.gisService.selectedDistrictFilter.set(d.id);
    }
    this.activeTab.set('map');
  }

  focusOnPalika(palika: PalikaGisFeature) {
    this.gisService.selectPalika(palika.palikaId);
    if (this.map) {
      this.map.setView([palika.lat, palika.lng], 11, { animate: true });
    }
  }

  focusOnPalikaFromDirectory(palika: PalikaGisFeature) {
    this.activeTab.set('map');
    setTimeout(() => {
      this.focusOnPalika(palika);
    }, 150);
  }

  setBaseLayer(type: GisMapLayerType) {
    this.gisService.activeBaseLayer.set(type);
  }

  setVisMode(mode: GisVisualizationMode) {
    this.gisService.visualizationMode.set(mode);
  }

  toggleShowAllPalikas(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.gisService.showAll753Palikas.set(checked);
  }

  // Filter change callbacks
  onProvinceChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    if (val === 'all') {
      this.gisService.selectedProvinceFilter.set(null);
      this.gisService.selectedDistrictFilter.set(null);
      this.map?.setView([28.3949, 84.1240], 7);
    } else {
      const pId = Number(val);
      this.zoomToProvince(pId);
    }
  }

  onDistrictChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    if (val === 'all') {
      this.gisService.selectedDistrictFilter.set(null);
    } else {
      this.gisService.selectedDistrictFilter.set(val);
      // Pan to district
      const palikaInDist = this.gisService.allPalikaGisFeatures().find(p => p.districtId === val);
      if (palikaInDist && this.map) {
        this.map.setView([palikaInDist.lat, palikaInDist.lng], 9, { animate: true });
      }
    }
  }

  onProjectFilterChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.gisService.selectedProjectFilter.set(val);
  }

  onTypeFilterChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.gisService.selectedPalikaTypeFilter.set(val);
  }

  onVerificationFilterChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.gisService.selectedVerificationFilter.set(val);
  }

  onVulnerabilityFilterChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.gisService.selectedVulnerabilityFilter.set(val);
  }

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.gisService.palikaSearchQuery.set(val);

    // If exact match found, pan to it
    if (val.length >= 3) {
      const match = this.filteredFeatures()[0];
      if (match && this.map) {
        this.map.panTo([match.lat, match.lng]);
      }
    }
  }

  // Batch Ingest Action
  onIngestSurvey() {
    this.gisService.ingestNationalSurveyBatch();
    alert('Successfully batch-ingested 25 additional palika field records! Map updated.');
  }

  // Export Handlers
  exportGeoJsonFile() {
    const geoJsonStr = this.gisService.exportGeoJson();
    const blob = new Blob([geoJsonStr], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nepal_palikas_beneficiaries_gis_${new Date().toISOString().split('T')[0]}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportCsvFile() {
    const csvStr = this.gisService.exportCsv();
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nepal_palikas_outreach_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Modal Enrolment
  openAddBeneficiaryModal(palika: PalikaGisFeature) {
    this.modalTargetPalika.set(palika);
    this.enrolForm.reset({
      fullName: '',
      gender: 'Female',
      age: 32,
      ward: 1,
      phoneNumber: '9841' + Math.floor(100000 + Math.random() * 900000),
      citizenshipNumber: '27-01-75-' + Math.floor(1000 + Math.random() * 9000),
      intervention: '7-Day Mason Retrofitting & Seismic Training',
      isFemaleHeaded: false,
      isPwd: false,
      isMarginalized: true,
      isYouth: false
    });
    this.enrolModalOpen.set(true);
  }

  submitEnrolment() {
    if (this.enrolForm.invalid) return;

    const palika = this.modalTargetPalika();
    if (!palika) return;

    const val = this.enrolForm.value;
    const vulns: string[] = [];
    if (val.isFemaleHeaded) vulns.push('Female-Headed');
    if (val.isPwd) vulns.push('PWD');
    if (val.isMarginalized) vulns.push('Marginalized Dalit/Janajati');
    if (val.isYouth) vulns.push('Youth');
    if (vulns.length === 0) vulns.push('None');

    const newRecord: BeneficiaryRecord = {
      id: 'ben-gis-' + Date.now(),
      beneficiaryCode: `BEN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: val.fullName || 'Beneficiary',
      gender: val.gender || 'Female',
      age: Number(val.age) || 30,
      vulnerabilities: vulns,
      citizenshipNumber: val.citizenshipNumber || 'N/A',
      phoneNumber: val.phoneNumber || 'N/A',
      projectId: 'proj-bcrp',
      district: palika.districtName,
      municipality: palika.name,
      palikaId: palika.palikaId,
      ward: Number(val.ward) || 1,
      intervention: val.intervention || '7-Day Mason Retrofitting & Seismic Training',
      verificationStatus: 'Verified',
      verifiedDate: new Date().toISOString().split('T')[0],
      verifiedBy: 'GIS Field Verification Desk',
      dqaNotes: 'Enrolled via National Palika GIS Module.',
      latitude: palika.lat,
      longitude: palika.lng
    };

    this.mealService.beneficiaries.update(list => [newRecord, ...list]);
    this.enrolModalOpen.set(false);
  }
}
