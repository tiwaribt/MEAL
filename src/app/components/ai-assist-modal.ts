import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AiAssistService } from '../services/ai-assist.service';
import { MealDataService } from '../services/meal-data.service';

@Component({
  selector: 'app-ai-assist-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
        <div class="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div class="flex items-center gap-2">
              <span class="p-1.5 bg-teal-900 text-white rounded-lg flex items-center justify-center">
                <mat-icon class="text-sm">auto_awesome</mat-icon>
              </span>
              <div>
                <h3 class="text-base font-semibold text-slate-900">MEAL AI Technical Assistant</h3>
                <p class="text-xs text-slate-500">Grounded in Disaster Risk Reduction & MEAL Standards</p>
              </div>
            </div>
            <button
              type="button"
              (click)="close()"
              class="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
              aria-label="Close modal">
              <mat-icon class="text-sm">close</mat-icon>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto space-y-5 flex-1">
            <!-- Action Selector Buttons -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Select MEAL Task</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  (click)="setTask('generate-indicator')"
                  [class]="selectedTask() === 'generate-indicator' ? 'bg-teal-900 text-white border-teal-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                  class="p-2.5 text-left border rounded-lg transition-colors flex flex-col gap-1">
                  <span class="text-xs font-semibold">Formulate PIRS</span>
                  <span class="text-[11px] opacity-80 leading-tight">SMART indicator & disaggregation</span>
                </button>

                <button
                  type="button"
                  (click)="setTask('draft-case-study')"
                  [class]="selectedTask() === 'draft-case-study' ? 'bg-teal-900 text-white border-teal-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                  class="p-2.5 text-left border rounded-lg transition-colors flex flex-col gap-1">
                  <span class="text-xs font-semibold">Draft Case Study</span>
                  <span class="text-[11px] opacity-80 leading-tight">Human impact & success story</span>
                </button>

                <button
                  type="button"
                  (click)="setTask('analyze-cfrm')"
                  [class]="selectedTask() === 'analyze-cfrm' ? 'bg-teal-900 text-white border-teal-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                  class="p-2.5 text-left border rounded-lg transition-colors flex flex-col gap-1">
                  <span class="text-xs font-semibold">CFRM Analysis</span>
                  <span class="text-[11px] opacity-80 leading-tight">Safeguarding & complaint trends</span>
                </button>

                <button
                  type="button"
                  (click)="setTask('generate-donor-summary')"
                  [class]="selectedTask() === 'generate-donor-summary' ? 'bg-teal-900 text-white border-teal-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                  class="p-2.5 text-left border rounded-lg transition-colors flex flex-col gap-1">
                  <span class="text-xs font-semibold">Donor Summary</span>
                  <span class="text-[11px] opacity-80 leading-tight">Executive progress brief</span>
                </button>
              </div>
            </div>

            <!-- Input Form -->
            <form [formGroup]="form" (ngSubmit)="submit()">
              <div class="space-y-3">
                <label class="block text-xs font-semibold text-slate-700">
                  @switch (selectedTask()) {
                    @case ('generate-indicator') {
                      Enter Target Objective or Output (e.g., "Mason seismic retrofitting in Gorkha", "School earthquake drills in Kathmandu")
                    }
                    @case ('draft-case-study') {
                      Raw Field Notes & Beneficiary Details (e.g., "Sunita Thapa, 34, single mother in Sindhupalchok, trained in NBC 105 masonry, retrofitted 4 houses")
                    }
                    @case ('analyze-cfrm') {
                      Recent Feedback Topics or Complaints Summary (e.g., "Ward 4 sand silt dispute, training selection inquiry, wheelchair access")
                    }
                    @case ('generate-donor-summary') {
                      Key Milestones & Reporting Scope (e.g., "Q3 FY2026 progress for USAID BCRP project, 620 masons certified, 94% DQA score")
                    }
                  }
                </label>

                <textarea
                  formControlName="prompt"
                  rows="3"
                  class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-700 focus:border-teal-700"
                  placeholder="Provide context or parameters..."></textarea>

                <div class="flex items-center justify-between pt-1">
                  <span class="text-xs text-slate-500">
                    Project Context: <strong class="text-slate-800">{{ currentProjectName() }}</strong>
                  </span>
                  <button
                    type="submit"
                    [disabled]="form.invalid || aiService.isLoading()"
                    class="px-4 py-2 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
                    @if (aiService.isLoading()) {
                      <mat-icon class="text-xs animate-spin">refresh</mat-icon>
                      <span>Synthesizing...</span>
                    } @else {
                      <mat-icon class="text-xs">bolt</mat-icon>
                      <span>Generate with MEAL AI</span>
                    }
                  </button>
                </div>
              </div>
            </form>

            <!-- Results Display -->
            @if (resultText()) {
              <div class="mt-4 border border-teal-200 bg-teal-50/40 rounded-lg p-4 space-y-3 animate-in fade-in">
                <div class="flex items-center justify-between border-b border-teal-200/60 pb-2">
                  <span class="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1">
                    <mat-icon class="text-xs text-teal-700">check_circle</mat-icon>
                    Generated MEAL Output
                  </span>
                  <button
                    type="button"
                    (click)="copyToClipboard()"
                    class="text-xs text-teal-800 hover:text-teal-950 font-medium flex items-center gap-1 px-2 py-1 bg-white rounded border border-teal-200 hover:bg-teal-50">
                    <mat-icon class="text-xs">{{ copied() ? 'done' : 'content_copy' }}</mat-icon>
                    <span>{{ copied() ? 'Copied' : 'Copy Output' }}</span>
                  </button>
                </div>

                <div class="prose prose-sm max-w-none text-slate-800 text-xs sm:text-sm font-sans whitespace-pre-wrap leading-relaxed">
                  {{ resultText() }}
                </div>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>Powered by Gemini 3.8 Flash · Strict MEAL Quality Standards</span>
            <button
              type="button"
              (click)="close()"
              class="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-medium rounded-md hover:bg-slate-200">
              Close
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class AiAssistModal {
  readonly aiService = inject(AiAssistService);
  readonly mealService = inject(MealDataService);

  readonly isOpen = signal<boolean>(false);
  readonly selectedTask = signal<'generate-indicator' | 'draft-case-study' | 'analyze-cfrm' | 'generate-donor-summary'>('generate-indicator');
  readonly resultText = signal<string>('');
  readonly copied = signal<boolean>(false);

  readonly form = new FormGroup({
    prompt: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  currentProjectName() {
    const p = this.mealService.activeProject();
    return p ? `${p.code} - ${p.name}` : 'All Projects Portfolio';
  }

  open(defaultTask: 'generate-indicator' | 'draft-case-study' | 'analyze-cfrm' | 'generate-donor-summary' = 'generate-indicator', defaultPrompt = '') {
    this.selectedTask.set(defaultTask);
    this.form.patchValue({ prompt: defaultPrompt });
    this.resultText.set('');
    this.copied.set(false);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  setTask(task: 'generate-indicator' | 'draft-case-study' | 'analyze-cfrm' | 'generate-donor-summary') {
    this.selectedTask.set(task);
    this.resultText.set('');
  }

  async submit() {
    if (this.form.invalid) return;

    const task = this.selectedTask();
    const prompt = this.form.value.prompt || '';
    const activeP = this.mealService.activeProject();
    const context = {
      projectCode: activeP?.code,
      projectName: activeP?.name,
      districts: activeP?.districts,
      donor: activeP?.donor
    };

    const output = await this.aiService.generate(task, prompt, context);
    this.resultText.set(output);
  }

  copyToClipboard() {
    if (!this.resultText()) return;
    navigator.clipboard.writeText(this.resultText());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
