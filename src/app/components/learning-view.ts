import { ChangeDetectionStrategy, Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { LessonLearned } from '../models/meal.model';

@Component({
  selector: 'app-learning-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Adaptive Management & Knowledge</span>
            <span aria-hidden="true">·</span>
            <span>MEAL Learning Agenda</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Lessons Learned, Case Studies & Reflection
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">
            Transform monitoring data into organizational knowledge, document human impact success stories, and track review meeting actions.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            (click)="activeSection.set('case-studies')"
            [class]="activeSection() === 'case-studies' ? 'bg-teal-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
            <mat-icon class="text-xs">auto_stories</mat-icon>
            <span>Case Studies</span>
          </button>
          <button
            type="button"
            (click)="activeSection.set('lessons')"
            [class]="activeSection() === 'lessons' ? 'bg-teal-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
            <mat-icon class="text-xs">lightbulb</mat-icon>
            <span>Lessons Learned</span>
          </button>
          <button
            type="button"
            (click)="activeSection.set('reviews')"
            [class]="activeSection() === 'reviews' ? 'bg-teal-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
            <mat-icon class="text-xs">forum</mat-icon>
            <span>Reflection & AARs</span>
          </button>
        </div>
      </div>

      <!-- Section 1: Case Studies (Human Impact & Success Stories) -->
      @if (activeSection() === 'case-studies') {
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Published Project Case Studies ({{ mealService.caseStudies().length }})
            </h2>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="triggerAiDraft.emit()"
                class="px-3 py-1.5 bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
                <mat-icon class="text-xs">auto_awesome</mat-icon>
                <span>Draft with MEAL AI</span>
              </button>
              <button
                type="button"
                (click)="openAddCaseStudyModal()"
                class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
                <mat-icon class="text-xs">add</mat-icon>
                <span>New Case Study</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (cs of mealService.caseStudies(); track cs.id) {
              <div class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col">
                <!-- Hero Image -->
                <div class="relative h-56 w-full bg-slate-100">
                  <img
                    [src]="cs.heroImage"
                    [alt]="cs.title"
                    class="w-full h-full object-cover"
                    referrerpolicy="no-referrer" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                    <span class="text-[11px] font-mono text-teal-300">{{ cs.publishedDate }} · {{ cs.location }}</span>
                    <h3 class="text-base font-bold leading-snug">{{ cs.title }}</h3>
                  </div>
                </div>

                <!-- Story Body -->
                <div class="p-5 space-y-4 flex-1 flex flex-col justify-between text-xs">
                  <div class="space-y-3">
                    <div>
                      <span class="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">The Challenge</span>
                      <p class="text-slate-700 leading-relaxed">{{ cs.theChallenge }}</p>
                    </div>

                    <div>
                      <span class="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">Program Intervention</span>
                      <p class="text-slate-700 leading-relaxed">{{ cs.theIntervention }}</p>
                    </div>

                    <div>
                      <span class="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-1">Verified Impact</span>
                      <p class="text-slate-800 font-medium leading-relaxed bg-teal-50/50 p-2.5 rounded-lg border border-teal-100">
                        {{ cs.measurableImpact }}
                      </p>
                    </div>

                    <!-- Direct Quote Callout -->
                    <div class="border-l-2 border-teal-800 pl-3 py-1 italic text-slate-800 bg-slate-50 rounded-r-lg">
                      "{{ cs.directQuote }}"
                      <span class="block text-[11px] font-semibold not-italic text-teal-900 mt-1">— {{ cs.quoteAuthor }}</span>
                    </div>
                  </div>

                  <!-- Footer Meta -->
                  <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{{ cs.donorVisibility }}</span>
                    <button
                      type="button"
                      (click)="printCaseStudy()"
                      class="text-teal-800 hover:text-teal-950 font-semibold flex items-center gap-1">
                      <mat-icon class="text-xs">print</mat-icon>
                      <span>Print PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Section 2: Lessons Learned Repository -->
      @if (activeSection() === 'lessons') {
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Institutional Lessons Learned Log ({{ mealService.lessonsLearned().length }})
            </h2>
            <button
              type="button"
              (click)="openAddLessonModal()"
              class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
              <mat-icon class="text-xs">add</mat-icon>
              <span>Log New Lesson</span>
            </button>
          </div>

          <div class="space-y-4">
            @for (item of mealService.lessonsLearned(); track item.id) {
              <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <div class="flex items-center gap-2 text-xs">
                      <span class="px-2 py-0.5 bg-slate-100 text-slate-800 font-semibold rounded text-[11px]">
                        {{ item.thematicArea }}
                      </span>
                      <span class="text-slate-400">·</span>
                      <span class="text-slate-500 font-mono">{{ item.dateLogged }}</span>
                    </div>
                    <h3 class="text-sm font-bold text-slate-900 mt-1">{{ item.title }}</h3>
                  </div>
                  <span class="text-xs text-slate-500 font-mono">By {{ item.author }}</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div class="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span class="font-semibold text-slate-700">Context & Challenge:</span>
                    <p class="text-slate-600 leading-relaxed">{{ item.challengeFaced }}</p>
                  </div>
                  <div class="p-3 bg-teal-50/60 rounded-lg border border-teal-100 space-y-1">
                    <span class="font-semibold text-teal-950">Lesson Discovered:</span>
                    <p class="text-teal-900 leading-relaxed">{{ item.lessonDiscovered }}</p>
                  </div>
                </div>

                <div class="p-3 bg-emerald-50/40 rounded-lg border border-emerald-200 text-xs">
                  <strong class="text-emerald-950">Actionable Operational Recommendation:</strong>
                  <p class="text-emerald-900 mt-0.5">{{ item.actionableRecommendation }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Section 3: Review & Reflection Meetings & Action Follow-up -->
      @if (activeSection() === 'reviews') {
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Quarterly Review, Reflection & AAR Logs
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (meeting of mealService.reviewMeetings(); track meeting.id) {
              <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
                <div>
                  <div class="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
                    <span>{{ meeting.meetingType }}</span>
                    <span>·</span>
                    <span>{{ meeting.date }}</span>
                    <span>·</span>
                    <span>{{ meeting.participantsCount }} Attendees</span>
                  </div>
                  <h3 class="text-base font-bold text-slate-900">{{ meeting.meetingTitle }}</h3>
                </div>

                <div>
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Key Reflection Decisions</h4>
                  <ul class="space-y-1 text-xs text-slate-700 list-disc list-inside leading-relaxed">
                    @for (dec of meeting.keyDecisions; track dec) {
                      <li>{{ dec }}</li>
                    }
                  </ul>
                </div>

                <div>
                  <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Agreed Action Items Follow-up</h4>
                  <div class="space-y-2 text-xs">
                    @for (act of meeting.actionItems; track act.action) {
                      <div class="p-2.5 border rounded-lg flex items-center justify-between gap-2"
                        [class.bg-emerald-50]="act.done"
                        [class.border-emerald-200]="act.done"
                        [class.bg-slate-50]="!act.done"
                        [class.border-slate-200]="!act.done">
                        <div class="flex items-center gap-2">
                          <mat-icon class="text-xs shrink-0" [class.text-emerald-700]="act.done" [class.text-slate-400]="!act.done">
                            {{ act.done ? 'check_circle' : 'pending' }}
                          </mat-icon>
                          <span class="font-medium text-slate-800" [class.line-through]="act.done">{{ act.action }}</span>
                        </div>
                        <div class="text-right shrink-0 text-[11px] font-mono text-slate-500">
                          <div>{{ act.owner }}</div>
                          <div>{{ act.dueDate }}</div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Add Case Study Modal -->
      @if (isAddCaseStudyOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 class="text-sm font-bold text-slate-900">Add New Success Story / Case Study</h3>
              <button
                type="button"
                (click)="isAddCaseStudyOpen.set(false)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="caseStudyForm" (ngSubmit)="saveCaseStudy()" class="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Headline / Story Title</label>
                <input
                  type="text"
                  formControlName="title"
                  placeholder="e.g. Building Resilience with Seismic Steel in Sindhupalchok"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Beneficiary Name & Role</label>
                  <input
                    type="text"
                    formControlName="beneficiaryName"
                    placeholder="e.g. Sunita Thapa (Mason)"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    formControlName="location"
                    placeholder="e.g. Chautara Ward 4, Sindhupalchok"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">The Challenge</label>
                <textarea
                  formControlName="theChallenge"
                  rows="2"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700"></textarea>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Program Intervention</label>
                <textarea
                  formControlName="theIntervention"
                  rows="2"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700"></textarea>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Measurable Impact Stats</label>
                <input
                  type="text"
                  formControlName="measurableImpact"
                  placeholder="e.g. 6 houses retrofitted, daily wage increased to NPR 1,200"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Direct Quote</label>
                <textarea
                  formControlName="directQuote"
                  rows="2"
                  placeholder="In beneficiary's own words..."
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700"></textarea>
              </div>

              <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  (click)="isAddCaseStudyOpen.set(false)"
                  class="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="caseStudyForm.invalid"
                  class="px-4 py-1.5 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs">
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Add Lesson Learned Modal -->
      @if (isAddLessonOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div class="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 class="text-sm font-bold text-slate-900">Log Institutional Lesson Learned</h3>
              <button
                type="button"
                (click)="isAddLessonOpen.set(false)"
                class="p-1 text-slate-400 hover:text-slate-700 rounded-md">
                <mat-icon class="text-sm">close</mat-icon>
              </button>
            </div>

            <form [formGroup]="lessonForm" (ngSubmit)="saveLesson()" class="p-6 space-y-4 text-xs">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Lesson Title</label>
                <input
                  type="text"
                  formControlName="title"
                  placeholder="Key takeaway headline"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Thematic Area</label>
                <select
                  formControlName="thematicArea"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700">
                  <option value="Mason Certification">Mason Certification</option>
                  <option value="Retrofitting Engineering">Retrofitting Engineering</option>
                  <option value="Municipal DRR Policy">Municipal DRR Policy</option>
                  <option value="Community Inclusion">Community Inclusion</option>
                  <option value="School Safety">School Safety</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Context & Challenge</label>
                <textarea
                  formControlName="challengeFaced"
                  rows="2"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700"></textarea>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Lesson Discovered</label>
                <textarea
                  formControlName="lessonDiscovered"
                  rows="2"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700"></textarea>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Actionable Recommendation</label>
                <textarea
                  formControlName="actionableRecommendation"
                  rows="2"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700"></textarea>
              </div>

              <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  (click)="isAddLessonOpen.set(false)"
                  class="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="lessonForm.invalid"
                  class="px-4 py-1.5 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs">
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class LearningView {
  readonly mealService = inject(MealDataService);
  readonly triggerAiDraft = output<void>();

  readonly activeSection = signal<'case-studies' | 'lessons' | 'reviews'>('case-studies');
  readonly isAddCaseStudyOpen = signal<boolean>(false);
  readonly isAddLessonOpen = signal<boolean>(false);

  readonly caseStudyForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    beneficiaryName: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    theChallenge: new FormControl('', [Validators.required]),
    theIntervention: new FormControl('', [Validators.required]),
    measurableImpact: new FormControl('', [Validators.required]),
    directQuote: new FormControl('', [Validators.required])
  });

  readonly lessonForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    thematicArea: new FormControl<LessonLearned['thematicArea']>('Mason Certification', [Validators.required]),
    challengeFaced: new FormControl('', [Validators.required]),
    lessonDiscovered: new FormControl('', [Validators.required]),
    actionableRecommendation: new FormControl('', [Validators.required])
  });

  openAddCaseStudyModal() {
    this.caseStudyForm.reset();
    this.isAddCaseStudyOpen.set(true);
  }

  saveCaseStudy() {
    if (this.caseStudyForm.invalid) return;
    const v = this.caseStudyForm.value;
    const activeP = this.mealService.activeProject();

    this.mealService.addCaseStudy({
      projectId: activeP ? activeP.id : 'proj-bcrp',
      title: v.title || '',
      heroImage: '/assets/images/drr_community_resilience_meeting_1790145573971.jpg',
      beneficiaryName: v.beneficiaryName || '',
      location: v.location || '',
      theChallenge: v.theChallenge || '',
      theIntervention: v.theIntervention || '',
      measurableImpact: v.measurableImpact || '',
      directQuote: v.directQuote || '',
      quoteAuthor: v.beneficiaryName || '',
      author: 'MEAL Team & Communications Desk',
      donorVisibility: activeP ? `Supported by ${activeP.donor} · MEAL Suite` : 'Disaster Risk Reduction Portfolio'
    });

    this.isAddCaseStudyOpen.set(false);
  }

  openAddLessonModal() {
    this.lessonForm.reset({
      thematicArea: 'Mason Certification'
    });
    this.isAddLessonOpen.set(true);
  }

  saveLesson() {
    if (this.lessonForm.invalid) return;
    const v = this.lessonForm.value;
    const activeP = this.mealService.activeProject();

    this.mealService.addLessonLearned({
      projectId: activeP ? activeP.id : 'proj-bcrp',
      title: v.title || '',
      thematicArea: v.thematicArea || 'Mason Certification',
      context: 'Field monitoring findings across project districts.',
      challengeFaced: v.challengeFaced || '',
      lessonDiscovered: v.lessonDiscovered || '',
      actionableRecommendation: v.actionableRecommendation || '',
      author: 'MEAL Specialist'
    });

    this.isAddLessonOpen.set(false);
  }

  printCaseStudy() {
    window.print();
  }
}
