import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { FormQuestion, MobileSubmission } from '../models/meal.model';

@Component({
  selector: 'app-mobile-collector-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Section Header & Remote Network Mode Controller -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>LogAlto M&E Suite</span>
            <span aria-hidden="true">·</span>
            <span>Mobile Data Collection & Offline Engine</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>Mobile Field Collector & Offline Sync</span>
            @if (mealService.isSimulatedOffline()) {
              <span class="text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full flex items-center gap-1">
                <mat-icon class="text-xs">cloud_off</mat-icon>
                <span>Offline Mode Active</span>
              </span>
            } @else {
              <span class="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                <mat-icon class="text-xs">cloud_done</mat-icon>
                <span>Online Cloud Connected</span>
              </span>
            }
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">
            Collect verified field data in remote Nepal mountain districts with zero internet, capture GPS coordinates, photos, digital signatures, and bulk sync upon returning to coverage.
          </p>
        </div>

        <div class="flex items-center gap-3 shrink-0 flex-wrap">
          <!-- Offline / Online Simulator Toggle -->
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-2xs"
            [class.bg-rose-50]="mealService.isSimulatedOffline()"
            [class.border-rose-200]="mealService.isSimulatedOffline()"
            [class.text-rose-900]="mealService.isSimulatedOffline()"
            [class.bg-emerald-50]="!mealService.isSimulatedOffline()"
            [class.border-emerald-200]="!mealService.isSimulatedOffline()"
            [class.text-emerald-900]="!mealService.isSimulatedOffline()">
            <span>{{ mealService.isSimulatedOffline() ? 'Simulated Remote Offline' : 'Online High-Speed' }}</span>
            <button
              type="button"
              (click)="toggleOfflineMode()"
              class="ml-1 px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-xs transition-colors"
              [class.bg-rose-700]="mealService.isSimulatedOffline()"
              [class.hover:bg-rose-800]="mealService.isSimulatedOffline()"
              [class.bg-emerald-700]="!mealService.isSimulatedOffline()"
              [class.hover:bg-emerald-800]="!mealService.isSimulatedOffline()">
              {{ mealService.isSimulatedOffline() ? 'Go Online' : 'Simulate Offline' }}
            </button>
          </div>

          <!-- Bulk Sync Trigger -->
          <button
            type="button"
            (click)="triggerSync()"
            [disabled]="pendingCount() === 0 || isSyncing()"
            class="px-3 py-1.5 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs" [class.animate-spin]="isSyncing()">sync</mat-icon>
            <span>Sync Queue ({{ pendingCount() }})</span>
          </button>
        </div>
      </div>

      <!-- Sync Queue Alert Notification Banner -->
      @if (pendingCount() > 0) {
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <mat-icon class="text-base">storage</mat-icon>
            </div>
            <div>
              <strong class="font-bold">{{ pendingCount() }} Field Submissions Stored Locally on Device</strong>
              <p class="text-[11px] text-amber-800">
                These records contain GPS fixes, photos, and signatures stored in encrypted device storage. Connect to internet and click "Sync Queue" to commit them to the central database and update project indicators.
              </p>
            </div>
          </div>
          <button
            type="button"
            (click)="triggerSync()"
            [disabled]="isSyncing()"
            class="px-3 py-1.5 bg-amber-900 hover:bg-amber-950 text-white font-bold rounded-lg text-xs whitespace-nowrap shadow-xs">
            Sync {{ pendingCount() }} Records Now
          </button>
        </div>
      }

      <!-- Main Workspace: Left (Mobile Field Entry Simulator) | Right (Sync Queue & Submissions Stream) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- LEFT: Mobile Form Entry Terminal (5 Cols) -->
        <div class="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2">
              <mat-icon class="text-teal-800">smartphone</mat-icon>
              <div>
                <h2 class="text-xs font-bold uppercase tracking-wider text-slate-800">Field Entry Terminal</h2>
                <span class="text-[10px] text-slate-400 font-mono">Device: SM-T500 · Battery: 88%</span>
              </div>
            </div>
            <select
              [value]="selectedFormId()"
              (change)="onFormSelect($event)"
              class="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 font-semibold text-slate-800">
              @for (f of mealService.customForms(); track f.id) {
                <option [value]="f.id">{{ f.title.substring(0, 24) }}...</option>
              }
            </select>
          </div>

          <!-- Form Details Banner -->
          @if (activeForm(); as form) {
            <div class="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1">
              <div class="flex justify-between items-center">
                <span class="font-bold text-slate-900">{{ form.title }}</span>
                <span class="text-[10px] font-mono px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded">{{ form.version }}</span>
              </div>
              <p class="text-[11px] text-slate-600 line-clamp-2">{{ form.description }}</p>
            </div>

            <!-- Field Entry Questions -->
            <div class="space-y-3.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
              <!-- Enumerator Name -->
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Enumerator Name *</label>
                <input
                  type="text"
                  [value]="enumeratorName()"
                  (input)="enumeratorName.set($any($event.target).value)"
                  class="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-teal-700" />
              </div>

              <!-- GPS Geopoint Acquisition Button -->
              <div class="p-3 bg-teal-50/50 border border-teal-200/80 rounded-xl space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-teal-950 flex items-center gap-1">
                    <mat-icon class="text-sm text-teal-800">my_location</mat-icon>
                    <span>GPS Coordinates Fix</span>
                  </span>
                  <button
                    type="button"
                    (click)="acquireGps()"
                    class="px-2.5 py-1 bg-teal-900 hover:bg-teal-800 text-white text-[11px] font-semibold rounded-md shadow-2xs flex items-center gap-1">
                    <mat-icon class="text-xs">gps_fixed</mat-icon>
                    <span>Acquire GPS</span>
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white p-2 rounded-lg border border-teal-100">
                  <div>
                    <span class="text-slate-400 block text-[9px]">LATITUDE</span>
                    <strong class="text-slate-800">{{ currentGps().latitude }}° N</strong>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[9px]">LONGITUDE</span>
                    <strong class="text-slate-800">{{ currentGps().longitude }}° E</strong>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[9px]">ACCURACY</span>
                    <span class="text-emerald-700 font-bold">±{{ currentGps().accuracy }}m</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[9px]">LOCATION</span>
                    <span class="text-slate-700 truncate block">{{ currentGps().locationName }}</span>
                  </div>
                </div>
              </div>

              <!-- Dynamic Questions Render -->
              @for (q of form.questions; track q.id; let i = $index) {
                @if (isQuestionVisible(q)) {
                  <div class="space-y-1">
                    <label class="block font-semibold text-slate-800">
                      {{ q.label }}
                      @if (q.required) {
                        <span class="text-rose-600">*</span>
                      }
                    </label>

                    @if (q.hint) {
                      <p class="text-[10px] text-slate-400 italic">{{ q.hint }}</p>
                    }

                    @switch (q.type) {
                      @case ('text') {
                        <input
                          type="text"
                          [value]="fieldAnswers()[q.name] || ''"
                          (input)="onAnswerChange(q.name, $event)"
                          class="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-teal-700" />
                      }
                      @case ('textarea') {
                        <textarea
                          rows="2"
                          [value]="fieldAnswers()[q.name] || ''"
                          (input)="onAnswerChange(q.name, $event)"
                          class="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-700"></textarea>
                      }
                      @case ('number') {
                        <input
                          type="number"
                          [value]="fieldAnswers()[q.name] || ''"
                          (input)="onAnswerChange(q.name, $event)"
                          class="w-full text-xs font-mono border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-teal-700" />
                      }
                      @case ('select_one') {
                        <select
                          [value]="fieldAnswers()[q.name] || ''"
                          (change)="onAnswerChange(q.name, $event)"
                          class="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-teal-700">
                          <option value="">-- Select option --</option>
                          @for (opt of q.options; track opt) {
                            <option [value]="opt">{{ opt }}</option>
                          }
                        </select>
                      }
                      @case ('select_multiple') {
                        <div class="space-y-1 mt-1">
                          @for (opt of q.options; track opt) {
                            <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                (change)="onCheckboxChange(q.name, opt, $event)"
                                class="text-teal-700 rounded focus:ring-teal-700" />
                              <span>{{ opt }}</span>
                            </label>
                          }
                        </div>
                      }
                      @case ('dropdown') {
                        <select
                          [value]="fieldAnswers()[q.name] || ''"
                          (change)="onAnswerChange(q.name, $event)"
                          class="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-teal-700">
                          <option value="">-- Choose --</option>
                          @for (opt of q.options; track opt) {
                            <option [value]="opt">{{ opt }}</option>
                          }
                        </select>
                      }
                      @case ('date') {
                        <input
                          type="date"
                          [value]="fieldAnswers()[q.name] || ''"
                          (input)="onAnswerChange(q.name, $event)"
                          class="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-teal-700" />
                      }
                      @case ('rating') {
                        <div class="flex items-center gap-1 py-1">
                          @for (star of [1,2,3,4,5]; track star) {
                            <button
                              type="button"
                              (click)="setRating(q.name, star)"
                              class="text-amber-500 hover:scale-110 transition-transform">
                              <mat-icon class="text-lg">
                                {{ (fieldAnswers()[q.name] || 0) >= star ? 'star' : 'star_border' }}
                              </mat-icon>
                            </button>
                          }
                          <span class="text-[11px] font-mono text-slate-500 ml-2">
                            {{ fieldAnswers()[q.name] ? fieldAnswers()[q.name] + ' / 5' : 'Not rated' }}
                          </span>
                        </div>
                      }
                      @case ('image') {
                        <div class="border border-slate-300 rounded-lg p-2.5 bg-slate-50 flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <mat-icon class="text-teal-800">photo_camera</mat-icon>
                            <span class="text-[11px] text-slate-700">
                              {{ photoCaptured() ? 'Photo attached (IMG_2026_NEPAL.jpg)' : 'No photo taken' }}
                            </span>
                          </div>
                          <button
                            type="button"
                            (click)="capturePhoto()"
                            class="px-2 py-1 bg-slate-900 text-white rounded text-[10px] font-semibold">
                            {{ photoCaptured() ? 'Retake' : 'Capture' }}
                          </button>
                        </div>
                      }
                      @case ('signature') {
                        <div class="border border-slate-300 rounded-lg p-2.5 bg-slate-50 space-y-1">
                          <div class="h-16 bg-white border border-dashed border-slate-300 rounded flex items-center justify-center font-serif italic text-slate-400 text-xs">
                            {{ signatureDone() ? '✓ Validated Digital Signature [Devaki Tamang]' : 'Click to Sign Beneficiary Consent' }}
                          </div>
                          <div class="flex justify-between items-center text-[10px]">
                            <button
                              type="button"
                              (click)="signConsent()"
                              class="text-teal-800 font-bold hover:underline">
                              {{ signatureDone() ? 'Signed ✓' : 'Tap to Sign' }}
                            </button>
                            <button
                              type="button"
                              (click)="signatureDone.set(false)"
                              class="text-slate-400 hover:text-slate-700">Clear</button>
                          </div>
                        </div>
                      }
                    }
                  </div>
                }
              }

              <!-- Submission Button -->
              <div class="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  (click)="submitRecord()"
                  class="w-full py-2.5 bg-teal-900 hover:bg-teal-800 text-white rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5">
                  <mat-icon class="text-xs">{{ mealService.isSimulatedOffline() ? 'save' : 'cloud_upload' }}</mat-icon>
                  <span>{{ mealService.isSimulatedOffline() ? 'Save to Device Storage (Offline)' : 'Submit Record to Central Server' }}</span>
                </button>
              </div>
            </div>
          }
        </div>

        <!-- RIGHT: Offline Queue & Mobile Submissions Stream (7 Cols) -->
        <div class="lg:col-span-7 space-y-4">
          <!-- Queue Statistics Card -->
          <div class="grid grid-cols-3 gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs text-xs">
            <div>
              <span class="text-slate-500 uppercase tracking-wider text-[10px] font-semibold block">Total Mobile Records</span>
              <span class="text-lg font-bold font-mono text-slate-900">{{ mealService.mobileSubmissions().length }}</span>
            </div>
            <div>
              <span class="text-slate-500 uppercase tracking-wider text-[10px] font-semibold block">Pending Offline Sync</span>
              <span class="text-lg font-bold font-mono" [class.text-amber-700]="pendingCount() > 0" [class.text-slate-400]="pendingCount() === 0">
                {{ pendingCount() }}
              </span>
            </div>
            <div>
              <span class="text-slate-500 uppercase tracking-wider text-[10px] font-semibold block">Synced to Cloud</span>
              <span class="text-lg font-bold font-mono text-emerald-700">{{ syncedCount() }}</span>
            </div>
          </div>

          <!-- Submissions Table Card -->
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div class="flex items-center gap-2">
                <mat-icon class="text-xs text-teal-800">table_rows</mat-icon>
                <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider">Field Submissions Log</h3>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  (click)="filterStatus.set('all')"
                  [class]="filterStatus() === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500'"
                  class="px-2 py-0.5 rounded text-[11px]">
                  All ({{ mealService.mobileSubmissions().length }})
                </button>
                <button
                  type="button"
                  (click)="filterStatus.set('pending_sync')"
                  [class]="filterStatus() === 'pending_sync' ? 'bg-white text-amber-900 font-bold shadow-2xs' : 'text-slate-500'"
                  class="px-2 py-0.5 rounded text-[11px]">
                  Pending ({{ pendingCount() }})
                </button>
                <button
                  type="button"
                  (click)="filterStatus.set('synced')"
                  [class]="filterStatus() === 'synced' ? 'bg-white text-emerald-900 font-bold shadow-2xs' : 'text-slate-500'"
                  class="px-2 py-0.5 rounded text-[11px]">
                  Synced ({{ syncedCount() }})
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50/70 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-semibold tracking-wider">
                    <th class="py-2.5 px-3">Form & Enumerator</th>
                    <th class="py-2.5 px-3">GPS Geolocation</th>
                    <th class="py-2.5 px-3">Timestamp</th>
                    <th class="py-2.5 px-3 text-center">Sync Status</th>
                    <th class="py-2.5 px-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (sub of displayedSubmissions(); track sub.id) {
                    <tr class="hover:bg-slate-50/70 transition-colors">
                      <td class="py-3 px-3">
                        <div class="flex flex-col">
                          <span class="font-semibold text-slate-900">{{ sub.formTitle }}</span>
                          <span class="text-[11px] text-slate-500">{{ sub.enumeratorName }} · <span class="font-mono text-[10px]">{{ sub.deviceId }}</span></span>
                        </div>
                      </td>
                      <td class="py-3 px-3">
                        <div class="flex flex-col font-mono text-[11px] text-slate-600">
                          <span>{{ sub.gps.latitude.toFixed(4) }}°, {{ sub.gps.longitude.toFixed(4) }}°</span>
                          <span class="text-[10px] text-slate-400">±{{ sub.gps.accuracy }}m · {{ sub.gps.locationName }}</span>
                        </div>
                      </td>
                      <td class="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                        {{ sub.timestamp }}
                      </td>
                      <td class="py-3 px-3 text-center whitespace-nowrap">
                        @if (sub.syncStatus === 'synced') {
                          <span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] inline-flex items-center gap-0.5">
                            <mat-icon class="text-[11px]">cloud_done</mat-icon>
                            <span>Synced</span>
                          </span>
                        } @else {
                          <span class="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px] inline-flex items-center gap-0.5">
                            <mat-icon class="text-[11px]">cloud_off</mat-icon>
                            <span>On Device</span>
                          </span>
                        }
                      </td>
                      <td class="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          (click)="inspectSubmission(sub)"
                          class="px-2 py-1 text-teal-800 hover:text-teal-950 font-bold hover:bg-teal-50 rounded">
                          Inspect
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="py-8 text-center text-slate-400">
                        No submissions match this filter.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Submission Inspection Modal -->
      @if (inspectingSub(); as sub) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span class="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{{ sub.id }}</span>
                <h3 class="text-sm font-bold text-slate-900">{{ sub.formTitle }}</h3>
              </div>
              <button
                type="button"
                (click)="inspectingSub.set(null)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div class="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg font-mono">
                <div>
                  <span class="text-slate-400 text-[10px] block">ENUMERATOR</span>
                  <span class="text-slate-800 font-bold">{{ sub.enumeratorName }}</span>
                </div>
                <div>
                  <span class="text-slate-400 text-[10px] block">DEVICE ID</span>
                  <span class="text-slate-800">{{ sub.deviceId }}</span>
                </div>
                <div>
                  <span class="text-slate-400 text-[10px] block">COLLECTED AT</span>
                  <span class="text-slate-800">{{ sub.timestamp }}</span>
                </div>
                <div>
                  <span class="text-slate-400 text-[10px] block">SYNC STATUS</span>
                  <span [class.text-emerald-700]="sub.syncStatus === 'synced'" [class.text-amber-700]="sub.syncStatus === 'pending_sync'" class="font-bold uppercase">
                    {{ sub.syncStatus }}
                  </span>
                </div>
              </div>

              <!-- GPS Block -->
              <div class="p-3 bg-teal-50/60 border border-teal-200/80 rounded-lg">
                <span class="font-bold text-teal-950 block mb-1">Geospatial Fix:</span>
                <p class="font-mono text-teal-900">{{ sub.gps.latitude }}° N, {{ sub.gps.longitude }}° E (Acc: ±{{ sub.gps.accuracy }}m)</p>
                <p class="text-[11px] text-teal-800 mt-0.5">{{ sub.gps.locationName }}</p>
              </div>

              <!-- Form Response Data -->
              <div>
                <span class="font-semibold text-slate-700 block mb-1">Survey Responses:</span>
                <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5 font-mono text-[11px]">
                  @for (entry of getObjectEntries(sub.data); track entry[0]) {
                    <div class="flex justify-between border-b border-slate-200/60 pb-1">
                      <span class="text-slate-500">{{ entry[0] }}:</span>
                      <strong class="text-slate-900 text-right max-w-[60%] truncate">{{ entry[1] }}</strong>
                    </div>
                  }
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                (click)="inspectingSub.set(null)"
                class="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800">
                Close
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class MobileCollectorView {
  readonly mealService = inject(MealDataService);

  readonly selectedFormId = signal<string>('form-pdm-1');
  readonly filterStatus = signal<'all' | 'pending_sync' | 'synced'>('all');
  readonly isSyncing = signal<boolean>(false);
  readonly inspectingSub = signal<MobileSubmission | null>(null);

  // Field entry form state
  readonly enumeratorName = signal<string>('Maya Tamang (Field MEAL)');
  readonly fieldAnswers = signal<Record<string, any>>({
    received_complete_kit: 'Yes, complete set',
    actively_employed: 'Yes, actively building',
    satisfaction_rating: 5
  });
  readonly photoCaptured = signal<boolean>(true);
  readonly signatureDone = signal<boolean>(true);

  // Realistic Nepal mountain GPS fix coordinates
  readonly currentGps = signal({
    latitude: 27.7738,
    longitude: 85.7196,
    accuracy: 3.4,
    locationName: 'Chautara Sangachokgadhi, Sindhupalchok'
  });

  readonly activeForm = computed(() => {
    return this.mealService.customForms().find(f => f.id === this.selectedFormId()) || this.mealService.customForms()[0];
  });

  readonly pendingCount = computed(() => {
    return this.mealService.mobileSubmissions().filter(s => s.syncStatus === 'pending_sync').length;
  });

  readonly syncedCount = computed(() => {
    return this.mealService.mobileSubmissions().filter(s => s.syncStatus === 'synced').length;
  });

  readonly displayedSubmissions = computed(() => {
    const filter = this.filterStatus();
    const list = this.mealService.mobileSubmissions();
    if (filter === 'all') return list;
    return list.filter(s => s.syncStatus === filter);
  });

  onFormSelect(ev: Event) {
    this.selectedFormId.set((ev.target as HTMLSelectElement).value);
    this.fieldAnswers.set({});
  }

  toggleOfflineMode() {
    this.mealService.toggleSimulatedOffline();
  }

  acquireGps() {
    // Generates high-accuracy realistic Nepal mountain GPS coordinates
    const locations = [
      { lat: 27.7738, lng: 85.7196, loc: 'Chautara Sangachokgadhi Ward 4, Sindhupalchok' },
      { lat: 28.0055, lng: 84.6297, loc: 'Gorkha Municipality Ward 6, Gorkha' },
      { lat: 27.9541, lng: 85.9452, loc: 'Tatopani High Mountain Ridge, Sindhupalchok' },
      { lat: 28.7042, lng: 82.2038, loc: 'Bheri Municipality Ward 2, Jajarkot' },
      { lat: 27.9231, lng: 84.8912, loc: 'Nilkantha Municipality Ward 8, Dhading' }
    ];
    const picked = locations[Math.floor(Math.random() * locations.length)];
    this.currentGps.set({
      latitude: Number((picked.lat + (Math.random() * 0.005 - 0.0025)).toFixed(4)),
      longitude: Number((picked.lng + (Math.random() * 0.005 - 0.0025)).toFixed(4)),
      accuracy: Number((2.5 + Math.random() * 2).toFixed(1)),
      locationName: picked.loc
    });
  }

  onAnswerChange(name: string, ev: Event) {
    const val = (ev.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value;
    this.fieldAnswers.update(curr => ({ ...curr, [name]: val }));
  }

  onCheckboxChange(name: string, opt: string, ev: Event) {
    const checked = (ev.target as HTMLInputElement).checked;
    const currList: string[] = this.fieldAnswers()[name] || [];
    const updated = checked ? [...currList, opt] : currList.filter(o => o !== opt);
    this.fieldAnswers.update(curr => ({ ...curr, [name]: updated }));
  }

  setRating(name: string, stars: number) {
    this.fieldAnswers.update(curr => ({ ...curr, [name]: stars }));
  }

  capturePhoto() {
    this.photoCaptured.set(true);
  }

  signConsent() {
    this.signatureDone.set(true);
  }

  isQuestionVisible(q: FormQuestion): boolean {
    if (!q.skipLogic) return true;
    const targetVal = this.fieldAnswers()[q.skipLogic.questionName];
    if (targetVal === undefined || targetVal === null) return false;

    if (q.skipLogic.operator === 'equals') {
      return String(targetVal).trim().toLowerCase() === String(q.skipLogic.value).trim().toLowerCase();
    }
    if (q.skipLogic.operator === 'not_equals') {
      return String(targetVal).trim().toLowerCase() !== String(q.skipLogic.value).trim().toLowerCase();
    }
    return true;
  }

  submitRecord() {
    const form = this.activeForm();
    if (!form) return;

    this.mealService.submitMobileRecord({
      formId: form.id,
      formTitle: form.title,
      enumeratorName: this.enumeratorName(),
      deviceId: 'SM-T500-MEAL-04',
      isOfflineDraft: this.mealService.isSimulatedOffline(),
      gps: this.currentGps(),
      photoAttached: this.photoCaptured(),
      signatureCaptured: this.signatureDone(),
      data: this.fieldAnswers()
    });

    // Reset entry fields
    this.fieldAnswers.set({});
  }

  triggerSync() {
    this.isSyncing.set(true);
    setTimeout(() => {
      this.mealService.syncOfflineQueue();
      this.isSyncing.set(false);
    }, 1200);
  }

  inspectSubmission(sub: MobileSubmission) {
    this.inspectingSub.set(sub);
  }

  getObjectEntries(obj: Record<string, any>) {
    return Object.entries(obj || {});
  }
}
