import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { NepalGeoSelector } from './nepal-geo-selector';

@Component({
  selector: 'app-dqa-verification-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, NepalGeoSelector],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Data Quality Assessment (DQA)</span>
            <span aria-hidden="true">·</span>
            <span>Beneficiary Verification Registry</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            DQA & Beneficiary Compliance Verification
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">
            Verify beneficiary identification, prevent double-counting, audit citizenship records, and ensure donor DQA standards (USAID/FCDO).
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            (click)="runDuplicateScan()"
            class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">security</mat-icon>
            <span>Scan Duplicate IDs</span>
          </button>
          <button
            type="button"
            (click)="openAddBenModal()"
            class="px-3.5 py-2 bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">person_add</mat-icon>
            <span>Add Beneficiary</span>
          </button>
        </div>
      </div>

      <!-- Nepal Geographic Scope Filter -->
      <app-nepal-geo-selector
        [isCompact]="true"
        title="Filter Beneficiary Registry by Nepal Region">
      </app-nepal-geo-selector>

      <!-- 5 DQA Dimensions Overview Cards -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          USAID 5-Dimension Data Quality Assessment (DQA) Status
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span class="text-[11px] font-semibold text-slate-500 uppercase block mb-1">1. Validity</span>
            <span class="text-xl font-mono font-bold text-teal-900 tabular-nums">96.0%</span>
            <span class="text-[11px] text-emerald-800 block mt-0.5">High Validity</span>
          </div>

          <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span class="text-[11px] font-semibold text-slate-500 uppercase block mb-1">2. Reliability</span>
            <span class="text-xl font-mono font-bold text-teal-900 tabular-nums">92.5%</span>
            <span class="text-[11px] text-emerald-800 block mt-0.5">Standard Protocol</span>
          </div>

          <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span class="text-[11px] font-semibold text-slate-500 uppercase block mb-1">3. Precision</span>
            <span class="text-xl font-mono font-bold text-teal-900 tabular-nums">94.0%</span>
            <span class="text-[11px] text-emerald-800 block mt-0.5">Disaggregated</span>
          </div>

          <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span class="text-[11px] font-semibold text-slate-500 uppercase block mb-1">4. Integrity</span>
            <span class="text-xl font-mono font-bold text-teal-900 tabular-nums">98.0%</span>
            <span class="text-[11px] text-emerald-800 block mt-0.5">Tamper Proof</span>
          </div>

          <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg col-span-2 sm:col-span-1">
            <span class="text-[11px] font-semibold text-slate-500 uppercase block mb-1">5. Timeliness</span>
            <span class="text-xl font-mono font-bold text-teal-900 tabular-nums">90.0%</span>
            <span class="text-[11px] text-emerald-800 block mt-0.5">Quarterly Sync</span>
          </div>
        </div>
      </div>

      <!-- Duplicate Scan Alert Banner (if scan triggered or duplicates exist) -->
      @if (duplicateAlert()) {
        <div class="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in">
          <mat-icon class="text-rose-700 text-base shrink-0 mt-0.5">warning</mat-icon>
          <div class="text-xs space-y-1">
            <h4 class="font-bold text-rose-950">DQA Verification Alert: Duplicate Phone / ID Detected</h4>
            <p class="text-rose-900">
              Beneficiary <strong>BEN-2026-0193</strong> shares phone number <strong>(9841238910)</strong> with certified mason <strong>BEN-2026-0189</strong>. 
              Please review physical attendance sheets and call the applicant to confirm separate household identity.
            </p>
          </div>
        </div>
      }

      <!-- Beneficiary Verification Table -->
      <div class="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <!-- Filter Bar -->
        <div class="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div class="flex items-center gap-1">
            <button
              type="button"
              (click)="filterStatus.set('all')"
              [class]="filterStatus() === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
              class="px-2.5 py-1 text-xs rounded-md border border-slate-200">
              All ({{ mealService.filteredBeneficiaries().length }})
            </button>
            <button
              type="button"
              (click)="filterStatus.set('Verified')"
              [class]="filterStatus() === 'Verified' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
              class="px-2.5 py-1 text-xs rounded-md border border-slate-200">
              Verified
            </button>
            <button
              type="button"
              (click)="filterStatus.set('Pending DQA')"
              [class]="filterStatus() === 'Pending DQA' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
              class="px-2.5 py-1 text-xs rounded-md border border-slate-200">
              Pending DQA
            </button>
            <button
              type="button"
              (click)="filterStatus.set('Flagged Duplicate')"
              [class]="filterStatus() === 'Flagged Duplicate' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'"
              class="px-2.5 py-1 text-xs rounded-md border border-slate-200">
              Flagged Duplicate
            </button>
          </div>

          <span class="text-xs text-slate-500 font-mono tabular-nums">
            {{ verifiedCount() }} verified / {{ mealService.filteredBeneficiaries().length }} records
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold tracking-wider">
                <th class="py-3 px-4">Code & Full Name</th>
                <th class="py-3 px-4">Gender / Age</th>
                <th class="py-3 px-4">Citizenship & Contact</th>
                <th class="py-3 px-4">Location</th>
                <th class="py-3 px-4">Intervention / Activity</th>
                <th class="py-3 px-4">Vulnerabilities</th>
                <th class="py-3 px-4">Verification Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (ben of displayedBeneficiaries(); track ben.id) {
                <tr class="hover:bg-slate-50/80 transition-colors">
                  <!-- Name & Code -->
                  <td class="py-3 px-4">
                    <div class="flex flex-col">
                      <span class="font-mono font-bold text-slate-900">{{ ben.beneficiaryCode }}</span>
                      <span class="font-semibold text-slate-800">{{ ben.fullName }}</span>
                    </div>
                  </td>

                  <!-- Gender / Age -->
                  <td class="py-3 px-4 font-mono tabular-nums text-slate-700">
                    {{ ben.gender }}, {{ ben.age }}y
                  </td>

                  <!-- Citizenship & Phone -->
                  <td class="py-3 px-4 font-mono text-[11px] text-slate-600">
                    <div>ID: {{ ben.citizenshipNumber }}</div>
                    <div>Ph: {{ ben.phoneNumber }}</div>
                  </td>

                  <!-- Location -->
                  <td class="py-3 px-4 text-slate-700">
                    <div>{{ ben.municipality }}</div>
                    <span class="text-[11px] text-slate-500">Ward {{ ben.ward }}, {{ ben.district }}</span>
                  </td>

                  <!-- Intervention -->
                  <td class="py-3 px-4 text-slate-800 font-medium max-w-xs">
                    {{ ben.intervention }}
                  </td>

                  <!-- Vulnerabilities -->
                  <td class="py-3 px-4 text-[11px] text-slate-600">
                    {{ ben.vulnerabilities.join(', ') }}
                  </td>

                  <!-- Verification Status -->
                  <td class="py-3 px-4">
                    <div class="flex flex-col gap-0.5">
                      <span class="font-semibold text-[11px]"
                        [class.text-emerald-800]="ben.verificationStatus === 'Verified'"
                        [class.text-amber-800]="ben.verificationStatus === 'Pending DQA'"
                        [class.text-rose-800]="ben.verificationStatus === 'Flagged Duplicate'">
                        {{ ben.verificationStatus }}
                      </span>
                      @if (ben.verifiedDate) {
                        <span class="text-[10px] text-slate-400 font-mono">{{ ben.verifiedDate }}</span>
                      }
                      @if (ben.dqaNotes) {
                        <span class="text-[10px] text-slate-500 italic max-w-xs truncate" [title]="ben.dqaNotes">
                          {{ ben.dqaNotes }}
                        </span>
                      }
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="py-3 px-4 text-right whitespace-nowrap">
                    @if (ben.verificationStatus !== 'Verified') {
                      <button
                        type="button"
                        (click)="verify(ben.id)"
                        class="px-2 py-1 text-emerald-800 hover:text-emerald-950 font-semibold hover:bg-emerald-50 rounded transition-colors"
                        title="Mark as Verified">
                        Verify
                      </button>
                    }
                    @if (ben.verificationStatus !== 'Flagged Duplicate') {
                      <button
                        type="button"
                        (click)="flag(ben.id)"
                        class="px-2 py-1 text-rose-800 hover:text-rose-950 font-semibold hover:bg-rose-50 rounded transition-colors"
                        title="Flag for DQA Audit">
                        Flag
                      </button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Beneficiary Modal -->
      @if (isAddModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 class="text-sm font-bold text-slate-900">Add Beneficiary to DQA Registry</h3>
              <button
                type="button"
                (click)="isAddModalOpen.set(false)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="benForm" (ngSubmit)="saveBeneficiary()" class="p-6 space-y-4 text-xs">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  formControlName="fullName"
                  placeholder="e.g. Maya Kumari Shrestha"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    formControlName="gender"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    formControlName="age"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700 font-mono" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Citizenship / National ID</label>
                  <input
                    type="text"
                    formControlName="citizenshipNumber"
                    placeholder="27-01-72-XXXXX"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700 font-mono" />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    formControlName="phoneNumber"
                    placeholder="98XXXXXXXX"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700 font-mono" />
                </div>
              </div>

              <!-- Embedded Nepal Geo Selector -->
              <div class="space-y-1">
                <app-nepal-geo-selector
                  [isCompact]="true"
                  [syncGlobalFilter]="false"
                  [required]="true"
                  title="Beneficiary Permanent Address"
                  (selectionChange)="onModalGeoChange($event)">
                </app-nepal-geo-selector>
                <div class="flex items-center gap-2 text-[11px] text-slate-500 px-1 pt-1 font-mono">
                  <span>Selected: {{ benForm.get('district')?.value }}, {{ benForm.get('municipality')?.value }} (Ward {{ benForm.get('ward')?.value }})</span>
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Intervention Category</label>
                <input
                  type="text"
                  formControlName="intervention"
                  placeholder="e.g. 7-Day Mason Retrofitting & Seismic Training"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
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
                  [disabled]="benForm.invalid"
                  class="px-4 py-1.5 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs">
                  Save to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class DqaVerificationView {
  readonly mealService = inject(MealDataService);

  readonly filterStatus = signal<string>('all');
  readonly duplicateAlert = signal<boolean>(false);
  readonly isAddModalOpen = signal<boolean>(false);

  readonly benForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    gender: new FormControl<'Female' | 'Male' | 'Other'>('Female', [Validators.required]),
    age: new FormControl(32, [Validators.required, Validators.min(15), Validators.max(90)]),
    citizenshipNumber: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    district: new FormControl('Sindhupalchok', [Validators.required]),
    municipality: new FormControl('Chautara Sangachokgadhi', [Validators.required]),
    ward: new FormControl(4, [Validators.required]),
    intervention: new FormControl('7-Day Mason Retrofitting & Seismic Training', [Validators.required])
  });

  readonly verifiedCount = computed(() => {
    return this.mealService.filteredBeneficiaries().filter(b => b.verificationStatus === 'Verified').length;
  });

  displayedBeneficiaries() {
    const list = this.mealService.filteredBeneficiaries();
    const st = this.filterStatus();
    if (st === 'all') return list;
    return list.filter(b => b.verificationStatus === st);
  }

  runDuplicateScan() {
    this.duplicateAlert.set(true);
  }

  onModalGeoChange(geo: { districtName?: string; municipalityName?: string; ward?: number }) {
    if (geo.districtName) this.benForm.patchValue({ district: geo.districtName });
    if (geo.municipalityName) this.benForm.patchValue({ municipality: geo.municipalityName });
    if (geo.ward) this.benForm.patchValue({ ward: geo.ward });
  }

  verify(id: string) {
    this.mealService.verifyBeneficiary(id, 'Anil Maharjan (MEAL Assessor)');
  }

  flag(id: string) {
    this.mealService.flagDuplicate(id, 'DQA audit flagged potential duplicate contact; physical cross-check required.');
  }

  openAddBenModal() {
    this.benForm.reset({
      fullName: '',
      gender: 'Female',
      age: 32,
      citizenshipNumber: `27-01-${Math.floor(65 + Math.random() * 15)}-0${Math.floor(1000 + Math.random() * 9000)}`,
      phoneNumber: `9841${Math.floor(100000 + Math.random() * 900000)}`,
      district: 'Sindhupalchok',
      municipality: 'Chautara Sangachokgadhi',
      ward: 4,
      intervention: '7-Day Mason Retrofitting & Seismic Training'
    });
    this.isAddModalOpen.set(true);
  }

  saveBeneficiary() {
    if (this.benForm.invalid) return;
    const val = this.benForm.value;
    const activeP = this.mealService.activeProject();

    this.mealService.addBeneficiary({
      fullName: val.fullName || '',
      gender: val.gender || 'Female',
      age: Number(val.age) || 30,
      vulnerabilities: ['Marginalized Dalit/Janajati'],
      citizenshipNumber: val.citizenshipNumber || '',
      phoneNumber: val.phoneNumber || '',
      projectId: activeP ? activeP.id : 'proj-bcrp',
      district: val.district || 'Sindhupalchok',
      municipality: val.municipality || 'Chautara',
      ward: Number(val.ward) || 1,
      intervention: val.intervention || 'Mason Training',
      verificationStatus: 'Verified',
      verifiedDate: new Date().toISOString().split('T')[0],
      verifiedBy: 'Anil Maharjan (MEAL)',
      dqaNotes: 'Registered and verified in DQA database.'
    });

    this.isAddModalOpen.set(false);
  }
}
