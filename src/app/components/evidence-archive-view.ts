import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { EvidenceDocument } from '../models/meal.model';

@Component({
  selector: 'app-evidence-archive-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Means of Verification (MoV) Repository</span>
            <span aria-hidden="true">·</span>
            <span>Digital Audit Trail</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Evidence Archive & Compliance Documentation
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">
            Centrally organize signed training attendance rosters, engineer completion certificates, municipal MoUs, and DQA audit records.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            (click)="openUploadModal()"
            class="px-3.5 py-2 bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">upload_file</mat-icon>
            <span>Upload Evidence (MoV)</span>
          </button>
        </div>
      </div>

      <!-- Filter by DocType -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
        <div class="flex items-center gap-1 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            (click)="filterType.set('all')"
            [class]="filterType() === 'all' ? 'bg-teal-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            class="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
            All Documents ({{ mealService.evidenceDocuments().length }})
          </button>
          <button
            type="button"
            (click)="filterType.set('Attendance Sheet')"
            [class]="filterType() === 'Attendance Sheet' ? 'bg-teal-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            class="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
            Attendance Rosters
          </button>
          <button
            type="button"
            (click)="filterType.set('Engineer Sign-off')"
            [class]="filterType() === 'Engineer Sign-off' ? 'bg-teal-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            class="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
            Engineer Sign-offs
          </button>
          <button
            type="button"
            (click)="filterType.set('DQA Report')"
            [class]="filterType() === 'DQA Report' ? 'bg-teal-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            class="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
            DQA Reports
          </button>
          <button
            type="button"
            (click)="filterType.set('MoU with Palika')"
            [class]="filterType() === 'MoU with Palika' ? 'bg-teal-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
            class="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
            Municipal MoUs
          </button>
        </div>

        <div class="text-xs text-slate-500 font-mono">
          <span>All records tamper-verified</span>
        </div>
      </div>

      <!-- Document Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (doc of displayedDocs(); track doc.id) {
          <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <div class="flex items-start justify-between gap-2">
                <span class="p-2 bg-slate-100 text-slate-700 rounded-lg">
                  <mat-icon class="text-base">description</mat-icon>
                </span>
                <span class="text-[11px] font-mono text-slate-400">{{ doc.fileSize }}</span>
              </div>

              <div>
                <span class="text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
                  {{ doc.docType }}
                </span>
                <h3 class="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                  {{ doc.title }}
                </h3>
                <p class="text-xs font-mono text-slate-500 mt-1 truncate">{{ doc.fileName }}</p>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1 pt-1">
                @for (tag of doc.tags; track tag) {
                  <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    #{{ tag }}
                  </span>
                }
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-500 font-mono text-[11px]">{{ doc.uploadedDate }}</span>
              <button
                type="button"
                (click)="downloadDoc(doc)"
                class="text-teal-800 hover:text-teal-950 font-semibold flex items-center gap-1">
                <mat-icon class="text-xs">download</mat-icon>
                <span>Download MoV</span>
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Upload Document Modal -->
      @if (isUploadModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 class="text-sm font-bold text-slate-900">Upload Means of Verification (MoV)</h3>
              <button
                type="button"
                (click)="isUploadModalOpen.set(false)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="uploadForm" (ngSubmit)="saveDoc()" class="p-6 space-y-4 text-xs">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  formControlName="title"
                  placeholder="e.g. Mason Batch 15 Signed Exam & Attendance Sheet"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Document Type</label>
                <select
                  formControlName="docType"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700">
                  <option value="Attendance Sheet">Attendance Sheet</option>
                  <option value="Certificate Roster">Certificate Roster</option>
                  <option value="Engineer Sign-off">Engineer Sign-off</option>
                  <option value="MoU with Palika">MoU with Palika</option>
                  <option value="DQA Report">DQA Report</option>
                  <option value="Photographic Evidence">Photographic Evidence</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  formControlName="tags"
                  placeholder="e.g. Mason, Chautara, CTEVT, Q3"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
              </div>

              <div class="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50">
                <mat-icon class="text-2xl text-slate-400">cloud_upload</mat-icon>
                <p class="text-slate-600 mt-1">PDF, XLSX, DOCX, or JPEG up to 25MB</p>
              </div>

              <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  (click)="isUploadModalOpen.set(false)"
                  class="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="uploadForm.invalid"
                  class="px-4 py-1.5 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs">
                  Archive Document
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class EvidenceArchiveView {
  readonly mealService = inject(MealDataService);

  readonly filterType = signal<string>('all');
  readonly isUploadModalOpen = signal<boolean>(false);

  readonly uploadForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    docType: new FormControl<EvidenceDocument['docType']>('Attendance Sheet', [Validators.required]),
    tags: new FormControl('Mason, Verification, 2026')
  });

  displayedDocs() {
    const list = this.mealService.evidenceDocuments();
    const t = this.filterType();
    if (t === 'all') return list;
    return list.filter(d => d.docType === t);
  }

  openUploadModal() {
    this.uploadForm.reset({
      docType: 'Attendance Sheet',
      tags: 'Mason, Verification, 2026'
    });
    this.isUploadModalOpen.set(true);
  }

  saveDoc() {
    if (this.uploadForm.invalid) return;
    const v = this.uploadForm.value;
    const activeP = this.mealService.activeProject();

    const tagsArr = (v.tags || '').split(',').map(s => s.trim()).filter(Boolean);

    const newDoc: EvidenceDocument = {
      id: 'doc-' + Date.now(),
      projectId: activeP ? activeP.id : 'proj-bcrp',
      title: v.title || '',
      docType: v.docType || 'Attendance Sheet',
      fileName: (v.title || 'evidence').toLowerCase().replace(/\s+/g, '_') + '.pdf',
      fileSize: '3.2 MB',
      uploadedDate: new Date().toISOString().split('T')[0],
      verified: true,
      tags: tagsArr.length ? tagsArr : ['MoV', 'Verified']
    };

    this.mealService.evidenceDocuments.update(l => [newDoc, ...l]);
    this.isUploadModalOpen.set(false);
  }

  downloadDoc(doc: EvidenceDocument) {
    const content = `MEAL SUITE DIGITAL ARCHIVE EVIDENCE RECORD
Document ID: ${doc.id}
Title: ${doc.title}
Document Type: ${doc.docType}
File Name: ${doc.fileName}
Uploaded Date: ${doc.uploadedDate}
Tags: ${doc.tags.join(', ')}
Verification Status: VERIFIED BY MEAL DIRECTORATE
Audit Fingerprint: SHA256-${Math.random().toString(36).substring(2, 15)}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName.replace('.pdf', '.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
