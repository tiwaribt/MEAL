import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NepalGeoService } from '../services/nepal-geo.service';
import { NepalGeoSelector } from './nepal-geo-selector';

export interface DerejaCandidate {
  id: string;
  candidateCode: string;
  fullName: string;
  gender: 'Female' | 'Male' | 'Other';
  age: number;
  phone: string;
  email: string;
  institution: string; // University / TVET College
  degreeTrack: 'Civil Engineering & Masonry' | 'Information Technology & Web' | 'Agribusiness & Food Processing' | 'Hospitality & Tourism' | 'Electrical & Renewable Energy';
  cohort: string;
  provinceId: number;
  districtId: string;
  municipalityId: string;
  ward: number;
  pwdStatus: boolean;
  trainingStatus: 'Enrolled' | 'In Training' | 'Certified Graduate' | 'Dropout';
  cvReadinessScore: number; // 0 - 100%
  placementStatus: 'Seeking Employment' | 'Interview Scheduled' | 'Internship' | 'Full-Time Employed' | 'Self-Employed / Founder';
  employerName?: string;
  jobTitle?: string;
  monthlyWageNpr?: number;
  placementDate?: string;
  tracer3MonthStatus: 'Retained' | 'Changed Job' | 'Unemployed' | 'Pending';
  tracer6MonthStatus: 'Retained' | 'Promoted' | 'Changed Job' | 'Unemployed' | 'Pending';
}

export interface DerejaEmployerPartner {
  id: string;
  name: string;
  sector: string;
  district: string;
  activeJobOpenings: number;
  totalHiresFromDereja: number;
  avgStartingSalaryNpr: number;
  mouSigned: boolean;
}

type DerejaTab = 'overview' | 'candidates' | 'funnel' | 'tracer' | 'employers' | 'new-candidate';

@Component({
  selector: 'app-dereja-dashboard-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, NepalGeoSelector],
  template: `
    <div class="space-y-6">
      <!-- Top Dereja Brand Header -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-indigo-800/40 relative overflow-hidden">
        <div class="relative z-10 max-w-4xl">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
              MERQ Systems · Dereja M&E Architecture
            </span>
            <span class="text-xs text-indigo-200">
              Youth Employability · TVET Tracking · Placement Pipeline · Longitudinal Tracer Studies
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dereja Youth Employability M&E Dashboard
          </h1>
          <p class="text-sm text-indigo-100/90 mt-2 leading-relaxed">
            Integrated labor market monitoring suite developed with MERQ Systems standards. Tracks candidate trajectories from technical training and career development through job placement, minimum wage compliance, and 3/6/12-month post-employment tracer retention across Nepal's 753 palikas.
          </p>

          <!-- Topline Metrics Strip -->
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-indigo-800/60">
            <div>
              <div class="text-2xl font-black text-amber-300">{{ totalCandidatesCount() }}</div>
              <div class="text-[11px] text-indigo-200">Youth Enrolled</div>
            </div>
            <div>
              <div class="text-2xl font-black text-emerald-300">{{ certifiedCount() }}</div>
              <div class="text-[11px] text-indigo-200">Certified Graduates</div>
            </div>
            <div>
              <div class="text-2xl font-black text-sky-300">{{ placedCount() }}</div>
              <div class="text-[11px] text-indigo-200">Gainfully Employed</div>
            </div>
            <div>
              <div class="text-2xl font-black text-teal-300">{{ placementRate() }}%</div>
              <div class="text-[11px] text-indigo-200">Placement Rate</div>
            </div>
            <div>
              <div class="text-2xl font-black text-fuchsia-300">{{ femaleSharePercent() }}%</div>
              <div class="text-[11px] text-indigo-200">Female Participation</div>
            </div>
            <div>
              <div class="text-2xl font-black text-rose-300">{{ tracerRetentionRate() }}%</div>
              <div class="text-[11px] text-indigo-200">6-Mo Retention Rate</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="bg-white border border-slate-200 rounded-xl p-1.5 shadow-2xs overflow-x-auto no-scrollbar">
        <div class="flex items-center gap-1 min-w-max">
          <button
            type="button"
            (click)="activeTab.set('overview')"
            [class]="activeTab() === 'overview' ? 'bg-indigo-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all">
            <mat-icon class="text-xs">dashboard</mat-icon>
            <span>Overview & KPIs</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('funnel')"
            [class]="activeTab() === 'funnel' ? 'bg-indigo-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all">
            <mat-icon class="text-xs">filter_alt</mat-icon>
            <span>Employment Pipeline Funnel</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('candidates')"
            [class]="activeTab() === 'candidates' ? 'bg-indigo-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all">
            <mat-icon class="text-xs">badge</mat-icon>
            <span>Candidate Registry ({{ filteredCandidates().length }})</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('tracer')"
            [class]="activeTab() === 'tracer' ? 'bg-indigo-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all">
            <mat-icon class="text-xs">timeline</mat-icon>
            <span>Longitudinal Tracer Study</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('employers')"
            [class]="activeTab() === 'employers' ? 'bg-indigo-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all">
            <mat-icon class="text-xs">apartment</mat-icon>
            <span>Employer Partners</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('new-candidate')"
            [class]="activeTab() === 'new-candidate' ? 'bg-indigo-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all">
            <mat-icon class="text-xs">person_add</mat-icon>
            <span>Register Candidate</span>
          </button>
        </div>
      </div>

      <!-- TAB 1: OVERVIEW & KPIS -->
      @if (activeTab() === 'overview') {
        <div class="space-y-6">
          <!-- Geographic Filter Integration -->
          <app-nepal-geo-selector
            title="Filter Candidates by Nepal Geographic Level"
            [allowDirectDistrictSelect]="true"
            [syncGlobalFilter]="false"
            (selectionChange)="onGeoFilterChange($event)">
          </app-nepal-geo-selector>

          <!-- Core Metric Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div class="flex items-center justify-between text-slate-500 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider">Average Monthly Wage</span>
                <span class="p-2 rounded-lg bg-emerald-50 text-emerald-800">
                  <mat-icon class="text-sm">payments</mat-icon>
                </span>
              </div>
              <div class="text-2xl font-black text-slate-900">
                NPR {{ avgWageNpr().toLocaleString() }}
              </div>
              <p class="text-[11px] text-emerald-700 font-semibold mt-1">
                +42% above Nepal statutory minimum (NPR 17,300)
              </p>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div class="flex items-center justify-between text-slate-500 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider">Female Placements</span>
                <span class="p-2 rounded-lg bg-fuchsia-50 text-fuchsia-800">
                  <mat-icon class="text-sm">female</mat-icon>
                </span>
              </div>
              <div class="text-2xl font-black text-slate-900">
                {{ femalePlacedCount() }} / {{ totalPlacedCount() }}
              </div>
              <p class="text-[11px] text-fuchsia-700 font-semibold mt-1">
                {{ femaleSharePercent() }}% Gender Inclusion target reached
              </p>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div class="flex items-center justify-between text-slate-500 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider">Persons with Disabilities (PWD)</span>
                <span class="p-2 rounded-lg bg-sky-50 text-sky-800">
                  <mat-icon class="text-sm">accessible</mat-icon>
                </span>
              </div>
              <div class="text-2xl font-black text-slate-900">
                {{ pwdCandidatesCount() }} Enrolled
              </div>
              <p class="text-[11px] text-sky-700 font-semibold mt-1">
                {{ pwdPlacementCount() }} placed in inclusive enterprises
              </p>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div class="flex items-center justify-between text-slate-500 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider">Employer Partner Network</span>
                <span class="p-2 rounded-lg bg-indigo-50 text-indigo-800">
                  <mat-icon class="text-sm">handshake</mat-icon>
                </span>
              </div>
              <div class="text-2xl font-black text-slate-900">
                {{ employerPartners.length }} Employers
              </div>
              <p class="text-[11px] text-indigo-700 font-semibold mt-1">
                {{ totalActiveJobOpenings() }} active vacancies ready for matching
              </p>
            </div>
          </div>

          <!-- Sectoral Distribution Breakdown -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <mat-icon class="text-indigo-800">work</mat-icon> Placement Breakdown by Technical Track
              </h3>

              <div class="space-y-3">
                @for (track of sectoralBreakdown(); track track.name) {
                  <div class="space-y-1 text-xs">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-slate-800">{{ track.name }}</span>
                      <span class="font-mono text-slate-600">
                        {{ track.placed }} Placed / {{ track.total }} Enrolled ({{ track.rate }}%)
                      </span>
                    </div>
                    <div class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all"
                        [class.bg-teal-700]="track.rate >= 70"
                        [class.bg-amber-600]="track.rate >= 50 && track.rate < 70"
                        [class.bg-slate-400]="track.rate < 50"
                        [style.width.%]="track.rate">
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div class="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <mat-icon class="text-indigo-800">stars</mat-icon> MERQ Systems M&E Standards Compliance
              </h3>

              <div class="space-y-2 text-xs">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div class="font-bold text-slate-800 flex items-center justify-between">
                    <span>1. Bi-Weekly Tracer Telephone Calls</span>
                    <span class="text-emerald-800 font-bold">100% Compliant</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Every placed graduate contacted at Days 30, 90, and 180.</p>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div class="font-bold text-slate-800 flex items-center justify-between">
                    <span>2. Verified Formal Employment Contracts</span>
                    <span class="text-emerald-800 font-bold">96% Verified</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Documented written appointment letters or Social Security Fund (SSF) registrations.</p>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div class="font-bold text-slate-800 flex items-center justify-between">
                    <span>3. Geolocation & Palika Tagging</span>
                    <span class="text-emerald-800 font-bold">753 Palikas</span>
                  </div>
                  <p class="text-[11px] text-slate-500">Complete spatial disaggregation across all Nepal federal administrative units.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 2: PIPELINE FUNNEL -->
      @if (activeTab() === 'funnel') {
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <mat-icon class="text-indigo-800">filter_alt</mat-icon>
              Youth Employability Progression Funnel
            </h3>
            <p class="text-xs text-slate-500">
              Visualizes step-by-step conversion rates through the Dereja employability acceleration pipeline
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
            <!-- Stage 1 -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Step 1: Enrolled</div>
              <div class="text-3xl font-black text-slate-900">{{ funnelStats().enrolled }}</div>
              <div class="text-[11px] text-slate-500">Total Registered</div>
              <div class="text-xs font-bold text-indigo-700">100% Baseline</div>
            </div>

            <!-- Stage 2 -->
            <div class="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
              <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-800">Step 2: Certified</div>
              <div class="text-3xl font-black text-indigo-950">{{ funnelStats().certified }}</div>
              <div class="text-[11px] text-indigo-700">Passed Assessment</div>
              <div class="text-xs font-bold text-indigo-800">{{ funnelStats().certRate }}% Completion</div>
            </div>

            <!-- Stage 3 -->
            <div class="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-2">
              <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-800">Step 3: Interviewed</div>
              <div class="text-3xl font-black text-sky-950">{{ funnelStats().interviewed }}</div>
              <div class="text-[11px] text-sky-700">CV Matched to Jobs</div>
              <div class="text-xs font-bold text-sky-800">{{ funnelStats().interviewRate }}% of Certified</div>
            </div>

            <!-- Stage 4 -->
            <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800">Step 4: Placed</div>
              <div class="text-3xl font-black text-emerald-950">{{ funnelStats().placed }}</div>
              <div class="text-[11px] text-emerald-700">Internship & Jobs</div>
              <div class="text-xs font-bold text-emerald-800">{{ funnelStats().placedRate }}% of Enrolled</div>
            </div>

            <!-- Stage 5 -->
            <div class="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-2">
              <div class="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800">Step 5: Retained (6 Mo)</div>
              <div class="text-3xl font-black text-teal-950">{{ funnelStats().retained }}</div>
              <div class="text-[11px] text-teal-700">Sustained Career</div>
              <div class="text-xs font-bold text-teal-800">{{ funnelStats().retainedRate }}% Retention</div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 3: CANDIDATE REGISTRY -->
      @if (activeTab() === 'candidates') {
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <mat-icon class="text-indigo-800">badge</mat-icon>
                Dereja Candidate Longitudinal Roster
              </h3>
              <p class="text-xs text-slate-500">
                Individual youth records disaggregated across Nepal provinces, districts, palikas, and employment states
              </p>
            </div>

            <!-- Search input -->
            <div class="w-full sm:w-64 relative">
              <input
                type="text"
                [value]="candidateSearchTerm()"
                (input)="candidateSearchTerm.set($any($event.target).value)"
                placeholder="Search name, code, employer..."
                class="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-700">
              <mat-icon class="absolute left-2.5 top-2 text-xs text-slate-400">search</mat-icon>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto border border-slate-200 rounded-xl">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th class="py-2.5 px-3">Code</th>
                  <th class="py-2.5 px-3">Candidate Name</th>
                  <th class="py-2.5 px-3">Gender / Age</th>
                  <th class="py-2.5 px-3">Technical Track</th>
                  <th class="py-2.5 px-3">Location (Palika / District)</th>
                  <th class="py-2.5 px-3">Training</th>
                  <th class="py-2.5 px-3">Placement Status</th>
                  <th class="py-2.5 px-3">Employer / Wage</th>
                  <th class="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (c of filteredCandidates(); track c.id) {
                  <tr class="hover:bg-slate-50/70">
                    <td class="py-3 px-3 font-mono font-bold text-slate-700">{{ c.candidateCode }}</td>
                    <td class="py-3 px-3">
                      <div class="font-bold text-slate-900">{{ c.fullName }}</div>
                      <div class="text-[10px] text-slate-400">{{ c.email }} · {{ c.phone }}</div>
                    </td>
                    <td class="py-3 px-3">
                      <span class="inline-flex items-center gap-1 font-medium">
                        {{ c.gender }} ({{ c.age }}y)
                        @if (c.pwdStatus) {
                          <span class="px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 text-[9px] font-bold">PWD</span>
                        }
                      </span>
                    </td>
                    <td class="py-3 px-3">
                      <div class="font-semibold text-slate-800">{{ c.degreeTrack }}</div>
                      <div class="text-[10px] text-slate-500">{{ c.institution }}</div>
                    </td>
                    <td class="py-3 px-3">
                      <div class="font-medium text-slate-800">{{ c.municipalityId | titlecase }}, Ward {{ c.ward }}</div>
                      <div class="text-[10px] text-slate-500">{{ c.districtId | uppercase }}</div>
                    </td>
                    <td class="py-3 px-3">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        [class.bg-emerald-100]="c.trainingStatus === 'Certified Graduate'"
                        [class.text-emerald-800]="c.trainingStatus === 'Certified Graduate'"
                        [class.bg-amber-100]="c.trainingStatus === 'In Training'"
                        [class.text-amber-800]="c.trainingStatus === 'In Training'"
                        [class.bg-slate-100]="c.trainingStatus === 'Enrolled'"
                        [class.text-slate-700]="c.trainingStatus === 'Enrolled'">
                        {{ c.trainingStatus }}
                      </span>
                    </td>
                    <td class="py-3 px-3">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        [class.bg-teal-100]="c.placementStatus === 'Full-Time Employed' || c.placementStatus === 'Self-Employed / Founder'"
                        [class.text-teal-800]="c.placementStatus === 'Full-Time Employed' || c.placementStatus === 'Self-Employed / Founder'"
                        [class.bg-sky-100]="c.placementStatus === 'Internship'"
                        [class.text-sky-800]="c.placementStatus === 'Internship'"
                        [class.bg-purple-100]="c.placementStatus === 'Interview Scheduled'"
                        [class.text-purple-800]="c.placementStatus === 'Interview Scheduled'"
                        [class.bg-slate-100]="c.placementStatus === 'Seeking Employment'"
                        [class.text-slate-600]="c.placementStatus === 'Seeking Employment'">
                        {{ c.placementStatus }}
                      </span>
                    </td>
                    <td class="py-3 px-3">
                      @if (c.employerName) {
                        <div class="font-semibold text-slate-800">{{ c.employerName }}</div>
                        <div class="text-[10px] font-mono text-emerald-800">NPR {{ c.monthlyWageNpr?.toLocaleString() }}/mo</div>
                      } @else {
                        <span class="text-slate-400 italic">Not placed yet</span>
                      }
                    </td>
                    <td class="py-3 px-3 text-right">
                      <button
                        type="button"
                        (click)="recordTracerCall(c)"
                        class="text-indigo-800 hover:text-indigo-900 font-bold text-xs">
                        Tracer Call
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- TAB 4: TRACER STUDY ENGINE -->
      @if (activeTab() === 'tracer') {
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <mat-icon class="text-indigo-800">timeline</mat-icon>
                Longitudinal Tracer Follow-up Study (3-Month & 6-Month Benchmarks)
              </h3>
              <p class="text-xs text-slate-500">
                Evaluates job retention, wage growth trajectory, and labor market resilience after graduation
              </p>
            </div>
            <button
              type="button"
              (click)="exportTracerDataset()"
              class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5">
              <mat-icon class="text-xs">file_download</mat-icon>
              <span>Export Tracer CSV</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div class="text-xs font-bold text-slate-700">3-Month Tracer Verification</div>
              <div class="text-3xl font-black text-emerald-900">92%</div>
              <p class="text-[11px] text-slate-600">Candidates remaining with initial employer at day 90.</p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div class="text-xs font-bold text-slate-700">6-Month Career Retention</div>
              <div class="text-3xl font-black text-teal-900">{{ tracerRetentionRate() }}%</div>
              <p class="text-[11px] text-slate-600">Candidates retained or promoted with formal contract at day 180.</p>
            </div>

            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div class="text-xs font-bold text-slate-700">Salary Progression</div>
              <div class="text-3xl font-black text-indigo-900">+18.5%</div>
              <p class="text-[11px] text-slate-600">Average wage increment experienced by retained candidates.</p>
            </div>
          </div>
        </div>
      }

      <!-- TAB 5: EMPLOYER PARTNERS -->
      @if (activeTab() === 'employers') {
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <mat-icon class="text-indigo-800">apartment</mat-icon>
              Corporate & Industrial Placement Partners
            </h3>
            <p class="text-xs text-slate-500">Private sector enterprises offering apprenticeships, TVET placements, and direct hiring</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (emp of employerPartners; track emp.id) {
              <div class="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50 hover:bg-white space-y-3 transition-all">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-900">{{ emp.name }}</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    MoU Active
                  </span>
                </div>
                <div class="text-xs text-slate-600">
                  <div><strong>Sector:</strong> {{ emp.sector }}</div>
                  <div><strong>Location:</strong> {{ emp.district | titlecase }}</div>
                </div>
                <div class="pt-2 border-t border-slate-200 text-[11px] flex items-center justify-between text-slate-500">
                  <span>Hired: <strong>{{ emp.totalHiresFromDereja }} youth</strong></span>
                  <span>Avg Wage: <strong>NPR {{ emp.avgStartingSalaryNpr.toLocaleString() }}</strong></span>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- TAB 6: NEW CANDIDATE REGISTRATION -->
      @if (activeTab() === 'new-candidate') {
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 max-w-3xl mx-auto">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <mat-icon class="text-indigo-800">person_add</mat-icon>
              Register Candidate to Dereja M&E Database
            </h3>
            <p class="text-xs text-slate-500">Enroll a new youth participant with full geographic and demographic tagging</p>
          </div>

          <form [formGroup]="candidateForm" (ngSubmit)="submitNewCandidate()" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  formControlName="fullName"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Gender *</label>
                <select
                  formControlName="gender"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Age *</label>
                <input
                  type="number"
                  formControlName="age"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Phone *</label>
                <input
                  type="text"
                  formControlName="phone"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  formControlName="email"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Technical Track *</label>
                <select
                  formControlName="degreeTrack"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
                  <option value="Civil Engineering & Masonry">Civil Engineering & Masonry</option>
                  <option value="Information Technology & Web">Information Technology & Web</option>
                  <option value="Agribusiness & Food Processing">Agribusiness & Food Processing</option>
                  <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                  <option value="Electrical & Renewable Energy">Electrical & Renewable Energy</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Institution / TVET Center</label>
                <input
                  type="text"
                  formControlName="institution"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
              </div>
            </div>

            <!-- Geographic Cascade Selector for Registration -->
            <div class="pt-2">
              <app-nepal-geo-selector
                title="Candidate Permanent Location (Nepal Admin Division)"
                [isCompact]="true"
                [required]="true"
                (selectionChange)="onCandidateGeoChange($event)">
              </app-nepal-geo-selector>
            </div>

            <button
              type="submit"
              [disabled]="candidateForm.invalid"
              class="w-full py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded-lg transition-colors disabled:bg-slate-300 shadow-xs">
              Save Candidate to Dereja Roster
            </button>
          </form>
        </div>
      }
    </div>
  `
})
export class DerejaDashboardView {
  readonly geoService = inject(NepalGeoService);
  private fb = inject(FormBuilder);

  readonly activeTab = signal<DerejaTab>('overview');
  readonly candidateSearchTerm = signal<string>('');
  readonly selectedFilterGeo = signal<{ provinceId?: number; districtId?: string; municipalityId?: string }>({});

  // Registered Candidate State
  readonly candidates = signal<DerejaCandidate[]>([
    {
      id: 'can-1',
      candidateCode: 'DER-2026-001',
      fullName: 'Aarav Shrestha',
      gender: 'Male',
      age: 23,
      phone: '9841234567',
      email: 'aarav.shrestha@example.com',
      institution: 'Sindhupalchok Polytechnic Institute',
      degreeTrack: 'Civil Engineering & Masonry',
      cohort: 'Cohort 2025-A',
      provinceId: 3,
      districtId: 'sindhupalchok',
      municipalityId: 'chautara-sangachokgadhi',
      ward: 4,
      pwdStatus: false,
      trainingStatus: 'Certified Graduate',
      cvReadinessScore: 95,
      placementStatus: 'Full-Time Employed',
      employerName: 'Himal Construction & Engineering',
      jobTitle: 'Assistant Structural Mason',
      monthlyWageNpr: 28500,
      placementDate: '2025-10-15',
      tracer3MonthStatus: 'Retained',
      tracer6MonthStatus: 'Retained'
    },
    {
      id: 'can-2',
      candidateCode: 'DER-2026-002',
      fullName: 'Sunita Tamang',
      gender: 'Female',
      age: 22,
      phone: '9849876543',
      email: 'sunita.tamang@example.com',
      institution: 'Melamchi Technical College',
      degreeTrack: 'Information Technology & Web',
      cohort: 'Cohort 2025-A',
      provinceId: 3,
      districtId: 'sindhupalchok',
      municipalityId: 'melamchi',
      ward: 2,
      pwdStatus: false,
      trainingStatus: 'Certified Graduate',
      cvReadinessScore: 90,
      placementStatus: 'Full-Time Employed',
      employerName: 'Smart Palika Digital Solutions',
      jobTitle: 'Junior Data Analyst',
      monthlyWageNpr: 32000,
      placementDate: '2025-11-01',
      tracer3MonthStatus: 'Retained',
      tracer6MonthStatus: 'Promoted'
    },
    {
      id: 'can-3',
      candidateCode: 'DER-2026-003',
      fullName: 'Bikash Gurung',
      gender: 'Male',
      age: 24,
      phone: '9856012345',
      email: 'bikash.gurung@example.com',
      institution: 'Gorkha Community TVET Center',
      degreeTrack: 'Civil Engineering & Masonry',
      cohort: 'Cohort 2025-B',
      provinceId: 4,
      districtId: 'gorkha',
      municipalityId: 'gorkha-muni',
      ward: 8,
      pwdStatus: false,
      trainingStatus: 'Certified Graduate',
      cvReadinessScore: 88,
      placementStatus: 'Internship',
      employerName: 'Gorkha Municipal Infrastructure Dept',
      jobTitle: 'Seismic Building Inspector Intern',
      monthlyWageNpr: 22000,
      placementDate: '2026-01-10',
      tracer3MonthStatus: 'Retained',
      tracer6MonthStatus: 'Pending'
    },
    {
      id: 'can-4',
      candidateCode: 'DER-2026-004',
      fullName: 'Pooja Tharu',
      gender: 'Female',
      age: 21,
      phone: '9812345678',
      email: 'pooja.tharu@example.com',
      institution: 'Banke Agro-Enterprise Institute',
      degreeTrack: 'Agribusiness & Food Processing',
      cohort: 'Cohort 2025-B',
      provinceId: 5,
      districtId: 'banke',
      municipalityId: 'nepalgunj-sub',
      ward: 12,
      pwdStatus: true,
      trainingStatus: 'Certified Graduate',
      cvReadinessScore: 92,
      placementStatus: 'Self-Employed / Founder',
      employerName: 'Kisan Seed & Drip Co-op',
      jobTitle: 'Managing Partner',
      monthlyWageNpr: 35000,
      placementDate: '2025-09-20',
      tracer3MonthStatus: 'Retained',
      tracer6MonthStatus: 'Retained'
    },
    {
      id: 'can-5',
      candidateCode: 'DER-2026-005',
      fullName: 'Rohan Sharma',
      gender: 'Male',
      age: 25,
      phone: '9860112233',
      email: 'rohan.sharma@example.com',
      institution: 'Kathmandu School of Applied Sciences',
      degreeTrack: 'Electrical & Renewable Energy',
      cohort: 'Cohort 2025-A',
      provinceId: 3,
      districtId: 'kathmandu',
      municipalityId: 'kathmandu-metro',
      ward: 15,
      pwdStatus: false,
      trainingStatus: 'Certified Graduate',
      cvReadinessScore: 85,
      placementStatus: 'Interview Scheduled',
      tracer3MonthStatus: 'Pending',
      tracer6MonthStatus: 'Pending'
    },
    {
      id: 'can-6',
      candidateCode: 'DER-2026-006',
      fullName: 'Anjali Chaudhari',
      gender: 'Female',
      age: 22,
      phone: '9823456789',
      email: 'anjali.chaudhari@example.com',
      institution: 'Kailali TVET Academy',
      degreeTrack: 'Hospitality & Tourism',
      cohort: 'Cohort 2025-B',
      provinceId: 7,
      districtId: 'kailali',
      municipalityId: 'dhangadhi-sub',
      ward: 5,
      pwdStatus: false,
      trainingStatus: 'In Training',
      cvReadinessScore: 78,
      placementStatus: 'Seeking Employment',
      tracer3MonthStatus: 'Pending',
      tracer6MonthStatus: 'Pending'
    }
  ]);

  readonly employerPartners: DerejaEmployerPartner[] = [
    { id: 'emp-1', name: 'Himal Construction & Engineering', sector: 'Construction & Infrastructure', district: 'sindhupalchok', activeJobOpenings: 12, totalHiresFromDereja: 24, avgStartingSalaryNpr: 28000, mouSigned: true },
    { id: 'emp-2', name: 'Smart Palika Digital Solutions', sector: 'Information Technology', district: 'kathmandu', activeJobOpenings: 8, totalHiresFromDereja: 16, avgStartingSalaryNpr: 32000, mouSigned: true },
    { id: 'emp-3', name: 'Gorkha Eco-Tourism & Hospitality', sector: 'Tourism', district: 'gorkha', activeJobOpenings: 6, totalHiresFromDereja: 11, avgStartingSalaryNpr: 25000, mouSigned: true },
    { id: 'emp-4', name: 'Lumbini Renewable Solar Power', sector: 'Renewable Energy', district: 'rupandehi', activeJobOpenings: 5, totalHiresFromDereja: 9, avgStartingSalaryNpr: 30000, mouSigned: true },
    { id: 'emp-5', name: 'Kisan Krishi Co-operative Banke', sector: 'Agribusiness', district: 'banke', activeJobOpenings: 10, totalHiresFromDereja: 18, avgStartingSalaryNpr: 26000, mouSigned: true }
  ];

  // Form
  readonly candidateForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    gender: ['Female', Validators.required],
    age: [22, [Validators.required, Validators.min(18), Validators.max(35)]],
    phone: ['', Validators.required],
    email: [''],
    institution: ['Tribhuvan University / CTEVT College', Validators.required],
    degreeTrack: ['Civil Engineering & Masonry', Validators.required],
    provinceId: [3],
    districtId: ['sindhupalchok'],
    municipalityId: ['chautara-sangachokgadhi'],
    ward: [1]
  });

  // Filtered Candidates
  readonly filteredCandidates = computed(() => {
    const term = this.candidateSearchTerm().toLowerCase().trim();
    const geo = this.selectedFilterGeo();

    return this.candidates().filter(c => {
      const matchSearch = !term ||
        c.fullName.toLowerCase().includes(term) ||
        c.candidateCode.toLowerCase().includes(term) ||
        (c.employerName && c.employerName.toLowerCase().includes(term)) ||
        c.degreeTrack.toLowerCase().includes(term);

      const matchProv = !geo.provinceId || c.provinceId === geo.provinceId;
      const matchDist = !geo.districtId || c.districtId.toLowerCase() === geo.districtId.toLowerCase();
      const matchMuni = !geo.municipalityId || c.municipalityId.toLowerCase() === geo.municipalityId.toLowerCase();

      return matchSearch && matchProv && matchDist && matchMuni;
    });
  });

  // Topline Stats
  readonly totalCandidatesCount = computed(() => this.filteredCandidates().length);

  readonly certifiedCount = computed(() => {
    return this.filteredCandidates().filter(c => c.trainingStatus === 'Certified Graduate').length;
  });

  readonly placedCount = computed(() => {
    return this.filteredCandidates().filter(c =>
      c.placementStatus === 'Full-Time Employed' ||
      c.placementStatus === 'Internship' ||
      c.placementStatus === 'Self-Employed / Founder'
    ).length;
  });

  readonly placementRate = computed(() => {
    const total = this.totalCandidatesCount();
    if (total === 0) return 0;
    return Math.round((this.placedCount() / total) * 100);
  });

  readonly femalePlacedCount = computed(() => {
    return this.filteredCandidates().filter(c =>
      c.gender === 'Female' &&
      (c.placementStatus === 'Full-Time Employed' || c.placementStatus === 'Internship' || c.placementStatus === 'Self-Employed / Founder')
    ).length;
  });

  readonly totalPlacedCount = computed(() => this.placedCount());

  readonly femaleSharePercent = computed(() => {
    const total = this.totalCandidatesCount();
    if (total === 0) return 0;
    const femaleTotal = this.filteredCandidates().filter(c => c.gender === 'Female').length;
    return Math.round((femaleTotal / total) * 100);
  });

  readonly tracerRetentionRate = computed(() => {
    const placed = this.filteredCandidates().filter(c =>
      c.tracer6MonthStatus === 'Retained' || c.tracer6MonthStatus === 'Promoted'
    ).length;
    const eligible = this.filteredCandidates().filter(c =>
      c.tracer6MonthStatus !== 'Pending'
    ).length;
    if (eligible === 0) return 88;
    return Math.round((placed / eligible) * 100);
  });

  readonly avgWageNpr = computed(() => {
    const placedWithWage = this.filteredCandidates().filter(c => c.monthlyWageNpr && c.monthlyWageNpr > 0);
    if (placedWithWage.length === 0) return 26500;
    const sum = placedWithWage.reduce((acc, cur) => acc + (cur.monthlyWageNpr || 0), 0);
    return Math.round(sum / placedWithWage.length);
  });

  readonly pwdCandidatesCount = computed(() => {
    return this.filteredCandidates().filter(c => c.pwdStatus).length;
  });

  readonly pwdPlacementCount = computed(() => {
    return this.filteredCandidates().filter(c =>
      c.pwdStatus &&
      (c.placementStatus === 'Full-Time Employed' || c.placementStatus === 'Internship' || c.placementStatus === 'Self-Employed / Founder')
    ).length;
  });

  readonly totalActiveJobOpenings = computed(() => {
    return this.employerPartners.reduce((acc, cur) => acc + cur.activeJobOpenings, 0);
  });

  readonly sectoralBreakdown = computed(() => {
    const tracks: DerejaCandidate['degreeTrack'][] = [
      'Civil Engineering & Masonry',
      'Information Technology & Web',
      'Agribusiness & Food Processing',
      'Hospitality & Tourism',
      'Electrical & Renewable Energy'
    ];

    return tracks.map(name => {
      const candidates = this.filteredCandidates().filter(c => c.degreeTrack === name);
      const placed = candidates.filter(c =>
        c.placementStatus === 'Full-Time Employed' ||
        c.placementStatus === 'Internship' ||
        c.placementStatus === 'Self-Employed / Founder'
      ).length;
      const rate = candidates.length > 0 ? Math.round((placed / candidates.length) * 100) : 0;
      return { name, total: candidates.length, placed, rate };
    });
  });

  readonly funnelStats = computed(() => {
    const enrolled = this.totalCandidatesCount();
    const certified = this.certifiedCount();
    const interviewed = this.filteredCandidates().filter(c =>
      c.placementStatus !== 'Seeking Employment' && c.trainingStatus === 'Certified Graduate'
    ).length;
    const placed = this.placedCount();
    const retained = this.filteredCandidates().filter(c =>
      c.tracer6MonthStatus === 'Retained' || c.tracer6MonthStatus === 'Promoted'
    ).length;

    const certRate = enrolled > 0 ? Math.round((certified / enrolled) * 100) : 0;
    const interviewRate = certified > 0 ? Math.round((interviewed / certified) * 100) : 0;
    const placedRate = enrolled > 0 ? Math.round((placed / enrolled) * 100) : 0;
    const retainedRate = placed > 0 ? Math.round((retained / placed) * 100) : 0;

    return { enrolled, certified, certRate, interviewed, interviewRate, placed, placedRate, retained, retainedRate };
  });

  onGeoFilterChange(sel: { provinceId?: number; districtId?: string; municipalityId?: string }) {
    this.selectedFilterGeo.set(sel);
  }

  onCandidateGeoChange(sel: { provinceId?: number; districtId?: string; municipalityId?: string; ward?: number }) {
    this.candidateForm.patchValue({
      provinceId: sel.provinceId || 3,
      districtId: sel.districtId || 'sindhupalchok',
      municipalityId: sel.municipalityId || 'chautara-sangachokgadhi',
      ward: sel.ward || 1
    });
  }

  submitNewCandidate() {
    if (this.candidateForm.invalid) return;
    const val = this.candidateForm.value;
    const newCand: DerejaCandidate = {
      id: `can-${Date.now()}`,
      candidateCode: `DER-2026-${Math.floor(100 + Math.random() * 900)}`,
      fullName: val.fullName,
      gender: val.gender,
      age: val.age,
      phone: val.phone,
      email: val.email || `${val.fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      institution: val.institution,
      degreeTrack: val.degreeTrack,
      cohort: 'Cohort 2026-A',
      provinceId: val.provinceId,
      districtId: val.districtId,
      municipalityId: val.municipalityId,
      ward: val.ward,
      pwdStatus: false,
      trainingStatus: 'Enrolled',
      cvReadinessScore: 60,
      placementStatus: 'Seeking Employment',
      tracer3MonthStatus: 'Pending',
      tracer6MonthStatus: 'Pending'
    };

    this.candidates.update(list => [newCand, ...list]);
    alert(`Success! ${newCand.fullName} (${newCand.candidateCode}) registered to Dereja Youth Employability database.`);
    this.candidateForm.reset({
      gender: 'Female',
      age: 22,
      institution: 'Tribhuvan University / CTEVT College',
      degreeTrack: 'Civil Engineering & Masonry'
    });
    this.activeTab.set('candidates');
  }

  recordTracerCall(c: DerejaCandidate) {
    const status = prompt(`Log Tracer Call for ${c.fullName} (${c.phone}):\nEnter 3-month or 6-month status: (Retained / Promoted / Changed Job / Unemployed)`, c.tracer6MonthStatus);
    if (!status) return;

    this.candidates.update(list =>
      list.map(cand => cand.id === c.id ? { ...cand, tracer6MonthStatus: status as DerejaCandidate['tracer6MonthStatus'] } : cand)
    );
    alert(`Tracer record updated for ${c.fullName}: ${status}`);
  }

  exportTracerDataset() {
    const rows = [
      'CandidateCode,FullName,Gender,Age,District,Palika,DegreeTrack,Employer,MonthlyWage,3MonthTracer,6MonthTracer',
      ...this.candidates().map(c =>
        `"${c.candidateCode}","${c.fullName}","${c.gender}",${c.age},"${c.districtId}","${c.municipalityId}","${c.degreeTrack}","${c.employerName || 'N/A'}",${c.monthlyWageNpr || 0},"${c.tracer3MonthStatus}","${c.tracer6MonthStatus}"`
      )
    ].join('\n');

    const blob = new Blob([rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dereja_tracer_study_nepal_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
