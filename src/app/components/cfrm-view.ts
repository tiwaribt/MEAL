import { ChangeDetectionStrategy, Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { CfrmComplaint } from '../models/meal.model';

@Component({
  selector: 'app-cfrm-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Accountability to Affected Populations (AAP)</span>
            <span aria-hidden="true">·</span>
            <span>Core Humanitarian Standard 5</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Community Feedback & Response Mechanism (CFRM)
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">
            Manage feedback channels, enforce strict safeguarding/PSEA protocols, track SLA turnaround times, and close feedback loops transparently.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            (click)="triggerAiAnalysis.emit()"
            class="px-3.5 py-2 bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">auto_awesome</mat-icon>
            <span>AI CFRM Analysis</span>
          </button>
          <button
            type="button"
            (click)="openAddModal()"
            class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">add_comment</mat-icon>
            <span>Record Feedback / Ticket</span>
          </button>
        </div>
      </div>

      <!-- CFRM Channel & SLA Overview -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-semibold uppercase">Toll-Free Hotline 1660</span>
            <mat-icon class="text-teal-800 text-sm">phone_in_talk</mat-icon>
          </div>
          <span class="text-xl font-mono font-bold text-slate-900 tabular-nums">48 Calls</span>
          <span class="text-[11px] text-slate-500 block mt-1">Direct community hotline</span>
        </div>

        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-semibold uppercase">Ward Suggestion Boxes</span>
            <mat-icon class="text-blue-800 text-sm">mail</mat-icon>
          </div>
          <span class="text-xl font-mono font-bold text-slate-900 tabular-nums">26 Letters</span>
          <span class="text-[11px] text-slate-500 block mt-1">Locked boxes opened bi-weekly</span>
        </div>

        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-semibold uppercase">Field Help Desks</span>
            <mat-icon class="text-purple-800 text-sm">front_hand</mat-icon>
          </div>
          <span class="text-xl font-mono font-bold text-slate-900 tabular-nums">18 Inquiries</span>
          <span class="text-[11px] text-slate-500 block mt-1">Present at training sites</span>
        </div>

        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div class="flex items-center justify-between text-slate-500 mb-1">
            <span class="text-xs font-semibold uppercase">Resolution SLA Rate</span>
            <mat-icon class="text-emerald-800 text-sm">task_alt</mat-icon>
          </div>
          <span class="text-xl font-mono font-bold text-emerald-900 tabular-nums">{{ mealService.summaryStats().resolutionRate }}%</span>
          <span class="text-[11px] text-slate-500 block mt-1">Average SLA: 2.1 days</span>
        </div>
      </div>

      <!-- Critical Safeguarding Banner if any open -->
      @if (hasSafeguardingAlert()) {
        <div class="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 animate-in fade-in">
          <mat-icon class="text-rose-700 text-base shrink-0 mt-0.5">shield</mat-icon>
          <div class="text-xs space-y-1">
            <div class="flex items-center gap-2">
              <span class="font-bold text-rose-950 uppercase tracking-wider">Confidential Safeguarding Escalation (Ticket #CFRM-2026-092)</span>
              <span class="px-2 py-0.5 bg-rose-200 text-rose-900 font-mono font-bold rounded text-[10px]">Under Investigation</span>
            </div>
            <p class="text-rose-900">
              Protection/Conduct incident logged via 1660 hotline. Managed exclusively by Executive Safeguarding Focal Point under strict anonymity.
            </p>
          </div>
        </div>
      }

      <!-- Complaints & Feedback Register -->
      <div class="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold tracking-wider">
                <th class="py-3 px-4">Ticket & Date</th>
                <th class="py-3 px-4">Channel & Source</th>
                <th class="py-3 px-4">Category</th>
                <th class="py-3 px-4">Location</th>
                <th class="py-3 px-4">Urgency</th>
                <th class="py-3 px-4">Description</th>
                <th class="py-3 px-4">Status & Feedback Loop</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (c of mealService.filteredComplaints(); track c.id) {
                <tr class="hover:bg-slate-50/80 transition-colors">
                  <!-- Ticket -->
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <div class="flex flex-col">
                      <span class="font-mono font-bold text-slate-900">{{ c.ticketNumber }}</span>
                      <span class="font-mono text-slate-500 text-[11px]">{{ c.submissionDate }}</span>
                    </div>
                  </td>

                  <!-- Channel -->
                  <td class="py-3.5 px-4 whitespace-nowrap text-slate-700">
                    <div class="flex flex-col">
                      <span class="font-medium text-slate-900">{{ c.channel }}</span>
                      <span class="text-[11px] text-slate-500">
                        {{ c.isAnonymous ? 'Anonymous' : (c.complainantName || 'Confidential') }}
                      </span>
                    </div>
                  </td>

                  <!-- Category -->
                  <td class="py-3.5 px-4 text-slate-800 font-medium">
                    {{ c.category }}
                  </td>

                  <!-- Location -->
                  <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    <div>{{ c.municipality }}</div>
                    <span class="text-[11px] text-slate-400">Ward {{ c.ward }}, {{ c.district }}</span>
                  </td>

                  <!-- Urgency -->
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <span class="font-semibold text-[11px]"
                      [class.text-rose-800]="c.urgency === 'Critical Safeguarding' || c.urgency === 'High'"
                      [class.text-amber-800]="c.urgency === 'Medium'"
                      [class.text-slate-600]="c.urgency === 'Low'">
                      {{ c.urgency }}
                    </span>
                  </td>

                  <!-- Description -->
                  <td class="py-3.5 px-4 max-w-sm text-slate-700 leading-snug">
                    <p class="line-clamp-2">{{ c.description }}</p>
                    @if (c.resolutionSummary) {
                      <div class="mt-1 p-1.5 bg-emerald-50 text-emerald-900 rounded text-[11px]">
                        <strong>Resolution:</strong> {{ c.resolutionSummary }}
                      </div>
                    }
                  </td>

                  <!-- Status -->
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <div class="flex flex-col gap-0.5">
                      <span class="font-semibold text-[11px]"
                        [class.text-emerald-800]="c.status === 'Closed' || c.status === 'Corrective Action Taken'"
                        [class.text-amber-800]="c.status === 'Under Investigation'"
                        [class.text-rose-800]="c.status === 'New'">
                        {{ c.status }}
                      </span>
                      <span class="text-[10px]" [class.text-emerald-800]="c.feedbackGivenToComplainant" [class.text-slate-400]="!c.feedbackGivenToComplainant">
                        {{ c.feedbackGivenToComplainant ? '✓ Closed loop with citizen' : 'Pending feedback' }}
                      </span>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      (click)="openResolutionModal(c)"
                      class="px-2.5 py-1 text-teal-800 hover:text-teal-950 font-semibold hover:bg-teal-50 rounded transition-colors">
                      Manage / Resolve
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Feedback Modal -->
      @if (isAddModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 class="text-sm font-bold text-slate-900">Record Community Feedback / Complaint</h3>
              <button
                type="button"
                (click)="isAddModalOpen.set(false)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="complaintForm" (ngSubmit)="saveComplaint()" class="p-6 space-y-4 text-xs">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Feedback Channel</label>
                  <select
                    formControlName="channel"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700">
                    <option value="Toll-Free Hotline 1660">Toll-Free Hotline 1660</option>
                    <option value="Ward Suggestion Box">Ward Suggestion Box</option>
                    <option value="Field Help Desk">Field Help Desk</option>
                    <option value="Community Meeting">Community Meeting</option>
                    <option value="Staff Direct">Staff Direct</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    formControlName="category"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700">
                    <option value="Quality of Construction">Quality of Construction</option>
                    <option value="Training Selection Dispute">Training Selection Dispute</option>
                    <option value="Delays in Grant/Kit">Delays in Grant/Kit</option>
                    <option value="Staff Conduct / Ethics">Staff Conduct / Ethics</option>
                    <option value="Safeguarding / Protection">Safeguarding / Protection</option>
                    <option value="General DRR Inquiry">General DRR Inquiry</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Complainant Name (Optional)</label>
                  <input
                    type="text"
                    formControlName="complainantName"
                    placeholder="Leave blank if anonymous"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Urgency Level</label>
                  <select
                    formControlName="urgency"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700">
                    <option value="Low">Low (General Inquiry)</option>
                    <option value="Medium">Medium (7-day SLA)</option>
                    <option value="High">High (3-day SLA)</option>
                    <option value="Critical Safeguarding">Critical Safeguarding (24-hour SLA)</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    formControlName="district"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Municipality & Ward</label>
                  <div class="flex gap-2">
                    <input
                      type="text"
                      formControlName="municipality"
                      class="flex-1 px-3 py-2 border border-slate-300 rounded-lg" />
                    <input
                      type="number"
                      formControlName="ward"
                      class="w-16 px-2 py-2 border border-slate-300 rounded-lg font-mono" />
                  </div>
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Feedback / Complaint Details</label>
                <textarea
                  formControlName="description"
                  rows="3"
                  placeholder="Accurately describe the issue raised by the community member..."
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700"></textarea>
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
                  [disabled]="complaintForm.invalid"
                  class="px-4 py-1.5 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs">
                  Log Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Resolve Ticket Modal -->
      @if (selectedComplaintForResolution(); as comp) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span class="text-xs font-mono font-bold text-teal-800">{{ comp.ticketNumber }}</span>
                <h3 class="text-sm font-bold text-slate-900">Resolve Feedback & Close Loop</h3>
              </div>
              <button
                type="button"
                (click)="selectedComplaintForResolution.set(null)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="resolutionForm" (ngSubmit)="saveResolution(comp.id)" class="p-6 space-y-4 text-xs">
              <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span class="font-semibold text-slate-800">Original Complaint:</span>
                <p class="text-slate-600 leading-relaxed">{{ comp.description }}</p>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">New Status</label>
                <select
                  formControlName="status"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700">
                  <option value="Closed">Closed (Resolved & Feedback Given)</option>
                  <option value="Corrective Action Taken">Corrective Action Taken</option>
                  <option value="Under Investigation">Under Investigation</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Resolution & Corrective Actions Summary</label>
                <textarea
                  formControlName="resolutionSummary"
                  rows="3"
                  placeholder="Detail investigation findings, action taken by engineers or management, and how the citizen was informed..."
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700"></textarea>
              </div>

              <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  (click)="selectedComplaintForResolution.set(null)"
                  class="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-1.5 bg-teal-900 hover:bg-teal-800 text-white font-semibold rounded-lg shadow-xs">
                  Save & Update Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class CfrmView {
  readonly mealService = inject(MealDataService);
  readonly triggerAiAnalysis = output<void>();

  readonly isAddModalOpen = signal<boolean>(false);
  readonly selectedComplaintForResolution = signal<CfrmComplaint | null>(null);

  readonly complaintForm = new FormGroup({
    channel: new FormControl<CfrmComplaint['channel']>('Toll-Free Hotline 1660', [Validators.required]),
    category: new FormControl<CfrmComplaint['category']>('Quality of Construction', [Validators.required]),
    complainantName: new FormControl(''),
    urgency: new FormControl<CfrmComplaint['urgency']>('Medium', [Validators.required]),
    district: new FormControl('Sindhupalchok', [Validators.required]),
    municipality: new FormControl('Chautara Sangachokgadhi', [Validators.required]),
    ward: new FormControl(4, [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  readonly resolutionForm = new FormGroup({
    status: new FormControl<CfrmComplaint['status']>('Closed', [Validators.required]),
    resolutionSummary: new FormControl('', [Validators.required])
  });

  hasSafeguardingAlert() {
    return this.mealService.complaints().some(c => c.urgency === 'Critical Safeguarding' && c.status !== 'Closed');
  }

  openAddModal() {
    this.complaintForm.reset({
      channel: 'Toll-Free Hotline 1660',
      category: 'Quality of Construction',
      complainantName: '',
      urgency: 'Medium',
      district: 'Sindhupalchok',
      municipality: 'Chautara Sangachokgadhi',
      ward: 4,
      description: ''
    });
    this.isAddModalOpen.set(true);
  }

  saveComplaint() {
    if (this.complaintForm.invalid) return;
    const v = this.complaintForm.value;
    const activeP = this.mealService.activeProject();

    this.mealService.addComplaint({
      projectId: activeP ? activeP.id : 'proj-bcrp',
      channel: v.channel || 'Toll-Free Hotline 1660',
      category: v.category || 'Quality of Construction',
      complainantName: v.complainantName || undefined,
      isAnonymous: !v.complainantName,
      contactNumber: '9841000000',
      district: v.district || 'Sindhupalchok',
      municipality: v.municipality || 'Chautara',
      ward: Number(v.ward) || 1,
      urgency: v.urgency || 'Medium',
      description: v.description || ''
    });

    this.isAddModalOpen.set(false);
  }

  openResolutionModal(comp: CfrmComplaint) {
    this.selectedComplaintForResolution.set(comp);
    this.resolutionForm.patchValue({
      status: comp.status === 'New' ? 'Under Investigation' : comp.status,
      resolutionSummary: comp.resolutionSummary || 'Investigated on site and corrective measures implemented. Explained to citizen.'
    });
  }

  saveResolution(id: string) {
    if (this.resolutionForm.invalid) return;
    const val = this.resolutionForm.value;
    this.mealService.updateComplaintStatus(id, val.status || 'Closed', val.resolutionSummary || '');
    this.selectedComplaintForResolution.set(null);
  }
}
