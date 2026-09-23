import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NepalGeoService } from '../services/nepal-geo.service';

@Component({
  selector: 'app-nepal-geo-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div [class]="isCompact() ? 'bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-2xs' : 'bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs'">
      <!-- Header / Title -->
      <div class="flex items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-2">
          <span class="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <mat-icon class="text-sm">location_on</mat-icon>
          </span>
          <div>
            <h4 class="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
              {{ title() }}
            </h4>
            <p class="text-[11px] text-slate-500">
              Nepal Administrative Hierarchy (Provinces · 77 Districts · Palikas · Wards)
            </p>
          </div>
        </div>

        @if (hasActiveSelection()) {
          <button
            type="button"
            (click)="clearSelection()"
            class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200/80 transition-colors">
            <mat-icon class="text-xs">clear</mat-icon>
            <span>Reset Geo</span>
          </button>
        }
      </div>

      <!-- Cascading Controls Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <!-- 1. Province Dropdown -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-700 mb-1">
            Province / Pradesh @if (required()) { <span class="text-rose-500">*</span> }
          </label>
          <div class="relative">
            <select
              [value]="selectedProvinceId() || ''"
              (change)="onProvinceChange($any($event.target).value)"
              class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden appearance-none cursor-pointer pr-8 text-xs">
              <option value="">-- All 7 Provinces --</option>
              @for (prov of provinces(); track prov.id) {
                <option [value]="prov.id">
                  {{ prov.name }} (Cap: {{ prov.capital }})
                </option>
              }
            </select>
            <mat-icon class="absolute right-2 top-2.5 text-xs text-slate-400 pointer-events-none">expand_more</mat-icon>
          </div>
        </div>

        <!-- 2. District Dropdown -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-700 mb-1">
            District / Jilla @if (required()) { <span class="text-rose-500">*</span> }
          </label>
          <div class="relative">
            <select
              [value]="selectedDistrictId() || ''"
              [disabled]="!selectedProvinceId() && !allowDirectDistrictSelect()"
              (change)="onDistrictChange($any($event.target).value)"
              class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden appearance-none cursor-pointer pr-8 text-xs disabled:bg-slate-100 disabled:text-slate-400">
              <option value="">-- All Districts ({{ availableDistricts().length }}) --</option>
              @for (dist of availableDistricts(); track dist.id) {
                <option [value]="dist.id">
                  {{ dist.name }} (HQ: {{ dist.headquarter }})
                </option>
              }
            </select>
            <mat-icon class="absolute right-2 top-2.5 text-xs text-slate-400 pointer-events-none">expand_more</mat-icon>
          </div>
        </div>

        <!-- 3. Municipality / Palika Dropdown -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-700 mb-1">
            Municipality / Palika
          </label>
          <div class="relative">
            <select
              [value]="selectedMunicipalityId() || ''"
              [disabled]="!selectedDistrictId()"
              (change)="onMunicipalityChange($any($event.target).value)"
              class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden appearance-none cursor-pointer pr-8 text-xs disabled:bg-slate-100 disabled:text-slate-400">
              <option value="">
                @if (selectedDistrictId()) {
                  -- Select Palika ({{ availableMunicipalities().length }}) --
                } @else {
                  -- Select District First --
                }
              </option>
              @for (muni of availableMunicipalities(); track muni.id) {
                <option [value]="muni.id">
                  {{ muni.name }} @if (muni.nepaliName) { ({{ muni.nepaliName }}) } [{{ muni.type }}]
                </option>
              }
            </select>
            <mat-icon class="absolute right-2 top-2.5 text-xs text-slate-400 pointer-events-none">expand_more</mat-icon>
          </div>
        </div>

        <!-- 4. Ward Number Selector -->
        <div>
          <label class="block text-[11px] font-semibold text-slate-700 mb-1">
            Ward No. (1 - {{ maxWards() }})
          </label>
          <div class="relative">
            <select
              [value]="selectedWard() || ''"
              [disabled]="!selectedMunicipalityId() && !allowFreeWard()"
              (change)="onWardChange($any($event.target).value)"
              class="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden appearance-none cursor-pointer pr-8 text-xs disabled:bg-slate-100 disabled:text-slate-400">
              <option value="">-- All Wards --</option>
              @for (w of availableWards(); track w) {
                <option [value]="w">Ward No. {{ w }}</option>
              }
            </select>
            <mat-icon class="absolute right-2 top-2.5 text-xs text-slate-400 pointer-events-none">expand_more</mat-icon>
          </div>
        </div>
      </div>

      <!-- Active Filter Pill Badges / Context Information -->
      @if (hasActiveSelection()) {
        <div class="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-2 text-xs">
          <span class="text-slate-500 font-medium text-[11px] flex items-center gap-1">
            <mat-icon class="text-xs text-teal-700">filter_alt</mat-icon> Active Scope:
          </span>

          @if (currentProvince()) {
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-medium text-[11px]">
              Province: {{ currentProvince()?.name }}
            </span>
          }

          @if (currentDistrict()) {
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-medium text-[11px]">
              District: {{ currentDistrict()?.name }} (HQ: {{ currentDistrict()?.headquarter }})
            </span>
          }

          @if (currentMunicipality()) {
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 font-medium text-[11px]">
              Palika: {{ currentMunicipality()?.name }} ({{ currentMunicipality()?.type }})
            </span>
          }

          @if (selectedWard()) {
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-medium text-[11px]">
              Ward: {{ selectedWard() }}
            </span>
          }
        </div>
      }
    </div>
  `
})
export class NepalGeoSelector {
  readonly geoService = inject(NepalGeoService);

  // Inputs
  readonly title = input<string>('Geographic Coverage & Field Location');
  readonly isCompact = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly allowDirectDistrictSelect = input<boolean>(true);
  readonly allowFreeWard = input<boolean>(true);
  readonly syncGlobalFilter = input<boolean>(true);

  // Outputs for form consumption
  readonly selectionChange = output<{
    provinceId?: number;
    provinceName?: string;
    districtId?: string;
    districtName?: string;
    municipalityId?: string;
    municipalityName?: string;
    ward?: number;
  }>();

  // Internal Signals
  readonly selectedProvinceId = signal<number | null>(null);
  readonly selectedDistrictId = signal<string | null>(null);
  readonly selectedMunicipalityId = signal<string | null>(null);
  readonly selectedWard = signal<number | null>(null);

  // Data references
  readonly provinces = this.geoService.provinces;

  readonly availableDistricts = computed(() => {
    const provId = this.selectedProvinceId();
    if (provId) {
      return this.geoService.districts().filter(d => d.provinceId === provId);
    }
    return this.geoService.districts();
  });

  readonly availableMunicipalities = computed(() => {
    const distId = this.selectedDistrictId();
    if (!distId) return [];
    return this.geoService.municipalities().filter(m => m.districtId === distId);
  });

  readonly maxWards = computed(() => {
    const muni = this.currentMunicipality();
    return muni?.totalWards || 12;
  });

  readonly availableWards = computed(() => {
    const count = this.maxWards();
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  readonly currentProvince = computed(() => {
    const id = this.selectedProvinceId();
    if (!id) return null;
    return this.geoService.provinces().find(p => p.id === id) || null;
  });

  readonly currentDistrict = computed(() => {
    const id = this.selectedDistrictId();
    if (!id) return null;
    return this.geoService.districts().find(d => d.id === id) || null;
  });

  readonly currentMunicipality = computed(() => {
    const id = this.selectedMunicipalityId();
    if (!id) return null;
    return this.geoService.municipalities().find(m => m.id === id) || null;
  });

  readonly hasActiveSelection = computed(() => {
    return !!(this.selectedProvinceId() || this.selectedDistrictId() || this.selectedMunicipalityId() || this.selectedWard());
  });

  onProvinceChange(value: string) {
    const provId = value ? parseInt(value, 10) : null;
    this.selectedProvinceId.set(provId);
    this.selectedDistrictId.set(null);
    this.selectedMunicipalityId.set(null);
    this.selectedWard.set(null);
    this.emitAndSync();
  }

  onDistrictChange(value: string) {
    const distId = value || null;
    this.selectedDistrictId.set(distId);
    this.selectedMunicipalityId.set(null);
    this.selectedWard.set(null);

    // If district chosen without province, backfill province
    if (distId) {
      const dist = this.geoService.districts().find(d => d.id === distId);
      if (dist && !this.selectedProvinceId()) {
        this.selectedProvinceId.set(dist.provinceId);
      }
    }

    this.emitAndSync();
  }

  onMunicipalityChange(value: string) {
    const muniId = value || null;
    this.selectedMunicipalityId.set(muniId);
    this.selectedWard.set(null);
    this.emitAndSync();
  }

  onWardChange(value: string) {
    const wardNum = value ? parseInt(value, 10) : null;
    this.selectedWard.set(wardNum);
    this.emitAndSync();
  }

  clearSelection() {
    this.selectedProvinceId.set(null);
    this.selectedDistrictId.set(null);
    this.selectedMunicipalityId.set(null);
    this.selectedWard.set(null);
    if (this.syncGlobalFilter()) {
      this.geoService.resetGeoFilter();
    }
    this.selectionChange.emit({});
  }

  private emitAndSync() {
    const payload = {
      provinceId: this.selectedProvinceId() || undefined,
      provinceName: this.currentProvince()?.name,
      districtId: this.selectedDistrictId() || undefined,
      districtName: this.currentDistrict()?.name,
      municipalityId: this.selectedMunicipalityId() || undefined,
      municipalityName: this.currentMunicipality()?.name,
      ward: this.selectedWard() || undefined
    };

    if (this.syncGlobalFilter()) {
      this.geoService.setGeoFilter(payload);
    }

    this.selectionChange.emit(payload);
  }
}
