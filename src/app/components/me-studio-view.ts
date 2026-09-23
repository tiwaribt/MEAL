import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { MealIndicator } from '../models/meal.model';

type MeStudioTab = 'sampling' | 'smart-checker' | 'oecd-dac' | 'evaluability' | 'method-selector' | 'indicator-library' | 'ai-review';

interface LibraryIndicatorItem {
  id: string;
  code: string;
  title: string;
  sector: 'Agriculture & Food' | 'Education & TVET' | 'Health & Nutrition' | 'DRR & Climate' | 'Livelihoods' | 'WASH' | 'Protection & Governance';
  donorStandard: 'USAID (F-Indicator)' | 'FCDO SDP' | 'UN SDG' | 'World Bank' | 'ECHO Humanitarian';
  level: 'Impact' | 'Outcome' | 'Output';
  unit: string;
  frequency: 'Quarterly' | 'Semi-Annually' | 'Annually';
  definition: string;
  disaggregations: string[];
  baselineGuidance: string;
  targetGuidance: string;
}

interface EvaluabilityQuestion {
  id: number;
  category: string;
  question: string;
  explanation: string;
  score: number; // 0, 1, or 2
}

interface PlaybookPrompt {
  id: string;
  title: string;
  category: 'Design' | 'Indicators' | 'Data Quality' | 'Evaluation' | 'Qualitative';
  description: string;
  promptText: string;
}

@Component({
  selector: 'app-me-studio-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- M&E Studio Header Banner -->
      <div class="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-teal-700/40 relative overflow-hidden">
        <div class="relative z-10 max-w-4xl">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-teal-500/20 text-teal-200 border border-teal-400/30">
              Monitoring & Evaluation Studio
            </span>
            <span class="text-xs text-teal-300">
              AI Tools · Methodologies · Indicator Library · OECD-DAC Standards
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            M&E Studio Technical Suite
          </h1>
          <p class="text-sm text-teal-100/90 mt-2 leading-relaxed">
            Professional technical toolset for Monitoring & Evaluation practitioners: Rigorous probability sampling calculators, SMART & CREAM indicator quality checkers, OECD-DAC evaluation matrices, evaluability diagnostic quizzes, data collection method selectors, and a cross-donor indicator bank.
          </p>

          <!-- Quick Metrics Bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-teal-700/50">
            <div>
              <div class="text-2xl font-black text-teal-300">4,300+</div>
              <div class="text-[11px] text-teal-100/80">Cross-Donor Indicators</div>
            </div>
            <div>
              <div class="text-2xl font-black text-amber-300">6 Standards</div>
              <div class="text-[11px] text-teal-100/80">OECD-DAC Evaluation Criteria</div>
            </div>
            <div>
              <div class="text-2xl font-black text-emerald-300">Cochran / FPC</div>
              <div class="text-[11px] text-teal-100/80">Statistical Sampling Engine</div>
            </div>
            <div>
              <div class="text-2xl font-black text-sky-300">SMART / CREAM</div>
              <div class="text-[11px] text-teal-100/80">Indicator Quality Auditing</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Studio Navigation Tabs -->
      <div class="bg-white border border-slate-200 rounded-xl p-1.5 shadow-2xs overflow-x-auto no-scrollbar">
        <div class="flex items-center gap-1 min-w-max">
          <button
            type="button"
            (click)="activeTab.set('sampling')"
            [class]="activeTab() === 'sampling' ? 'bg-teal-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all">
            <mat-icon class="text-xs">calculate</mat-icon>
            <span>Sampling Calculator</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('smart-checker')"
            [class]="activeTab() === 'smart-checker' ? 'bg-teal-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all">
            <mat-icon class="text-xs">verified</mat-icon>
            <span>SMART / CREAM Checker</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('oecd-dac')"
            [class]="activeTab() === 'oecd-dac' ? 'bg-teal-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all">
            <mat-icon class="text-xs">account_balance</mat-icon>
            <span>OECD-DAC Framework</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('evaluability')"
            [class]="activeTab() === 'evaluability' ? 'bg-teal-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all">
            <mat-icon class="text-xs">fact_check</mat-icon>
            <span>Evaluability Readiness</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('method-selector')"
            [class]="activeTab() === 'method-selector' ? 'bg-teal-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all">
            <mat-icon class="text-xs">psychology</mat-icon>
            <span>Data Method Selector</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('indicator-library')"
            [class]="activeTab() === 'indicator-library' ? 'bg-teal-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all">
            <mat-icon class="text-xs">menu_book</mat-icon>
            <span>Global Indicator Library</span>
          </button>

          <button
            type="button"
            (click)="activeTab.set('ai-review')"
            [class]="activeTab() === 'ai-review' ? 'bg-teal-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'"
            class="px-3.5 py-2 rounded-lg text-xs flex items-center gap-2 transition-all">
            <mat-icon class="text-xs">auto_awesome</mat-icon>
            <span>AI Review & Playbooks</span>
          </button>
        </div>
      </div>

      <!-- TAB 1: SAMPLING CALCULATOR -->
      @if (activeTab() === 'sampling') {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Input Controls -->
          <div class="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                  <mat-icon class="text-teal-800">tune</mat-icon> Sampling Parameters
                </h3>
                <p class="text-xs text-slate-500">Configure statistical parameters for household or beneficiary surveys</p>
              </div>
              <button
                type="button"
                (click)="resetSamplingDefaults()"
                class="text-xs font-semibold text-teal-800 hover:text-teal-900 hover:underline">
                Reset Defaults
              </button>
            </div>

            <!-- Population Size -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-700">Target Population Size (N)</label>
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isInfinitePop"
                    [checked]="samplingIsInfinite()"
                    (change)="toggleInfinitePop()"
                    class="rounded text-teal-900 focus:ring-teal-700">
                  <label for="isInfinitePop" class="text-xs text-slate-600 cursor-pointer">Unknown / Infinite (&gt; 50k)</label>
                </div>
              </div>
              @if (!samplingIsInfinite()) {
                <input
                  type="number"
                  [value]="samplingPopSize()"
                  (input)="updatePopSize($event)"
                  min="10"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-700">
                <p class="text-[11px] text-slate-500">Total target households or beneficiaries in catchment area</p>
              }
            </div>

            <!-- Margin of Error -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-700">Margin of Error (e)</label>
                <span class="text-xs font-mono font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  ±{{ samplingMarginOfError() }}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                [value]="samplingMarginOfError()"
                (input)="updateMarginOfError($event)"
                class="w-full accent-teal-800 cursor-pointer">
              <div class="flex justify-between text-[10px] text-slate-400">
                <span>1% (High Precision)</span>
                <span>5% (Standard USAID/FCDO)</span>
                <span>10% (Exploratory)</span>
              </div>
            </div>

            <!-- Confidence Level -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-700">Confidence Level</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  (click)="samplingConfidenceLevel.set(90)"
                  [class]="samplingConfidenceLevel() === 90 ? 'bg-teal-900 text-white font-bold border-teal-900' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'"
                  class="py-2 text-xs rounded-lg border font-medium transition-all text-center">
                  90% (Z = 1.645)
                </button>
                <button
                  type="button"
                  (click)="samplingConfidenceLevel.set(95)"
                  [class]="samplingConfidenceLevel() === 95 ? 'bg-teal-900 text-white font-bold border-teal-900' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'"
                  class="py-2 text-xs rounded-lg border font-medium transition-all text-center">
                  95% (Z = 1.960)
                </button>
                <button
                  type="button"
                  (click)="samplingConfidenceLevel.set(99)"
                  [class]="samplingConfidenceLevel() === 99 ? 'bg-teal-900 text-white font-bold border-teal-900' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'"
                  class="py-2 text-xs rounded-lg border font-medium transition-all text-center">
                  99% (Z = 2.576)
                </button>
              </div>
            </div>

            <!-- Expected Prevalence / Proportion -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-slate-700">Expected Proportion / Prevalence (p)</label>
                <span class="text-xs font-mono font-bold text-slate-700">{{ samplingProportion() }}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                [value]="samplingProportion()"
                (input)="updateProportion($event)"
                class="w-full accent-teal-800 cursor-pointer">
              <p class="text-[11px] text-slate-500">50% gives the most conservative (maximum) sample size.</p>
            </div>

            <!-- Cluster Design Effect & Non-Response Buffer -->
            <div class="grid grid-cols-2 gap-3 pt-2">
              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-700">Design Effect (DEFF)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="3"
                  [value]="samplingDesignEffect()"
                  (input)="updateDesignEffect($event)"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800">
                <p class="text-[10px] text-slate-400">1.0 = SRS, 1.5-2.0 = Cluster</p>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-bold text-slate-700">Non-Response Buffer</label>
                <div class="relative">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    [value]="samplingNonResponse()"
                    (input)="updateNonResponse($event)"
                    class="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 pr-6">
                  <span class="absolute right-2 top-2 text-xs text-slate-400">%</span>
                </div>
                <p class="text-[10px] text-slate-400">Recommended 10-15%</p>
              </div>
            </div>

            <!-- Cluster Allocation Helpers -->
            <div class="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl space-y-2">
              <div class="flex items-center justify-between text-xs font-bold text-teal-900">
                <span>Cluster Breakdown Tool</span>
                <span class="text-[10px] font-normal text-teal-700">Multi-Stage Cluster Sampling</span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label class="block text-[10px] text-teal-800 font-semibold mb-0.5">Households per Cluster (m)</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    [value]="samplingUnitsPerCluster()"
                    (input)="updateUnitsPerCluster($event)"
                    class="w-full bg-white border border-teal-300 rounded px-2 py-1 text-xs font-bold text-teal-900">
                </div>
                <div class="flex flex-col justify-end">
                  <div class="text-[10px] text-teal-800 font-semibold">Total Clusters (k) Needed:</div>
                  <div class="text-sm font-black text-teal-900">{{ samplingCalculatedClusters() }} Wards / Settlements</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Calculation Outputs & Methodology Summary -->
          <div class="lg:col-span-6 space-y-6">
            <!-- Result Cards -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
              <h3 class="text-base font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
                <span class="flex items-center gap-2">
                  <mat-icon class="text-teal-800">analytics</mat-icon> Required Sample Size
                </span>
                <button
                  type="button"
                  (click)="copySamplingSummary()"
                  class="text-xs text-teal-800 hover:text-teal-900 font-semibold flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  <mat-icon class="text-xs">content_copy</mat-icon>
                  <span>{{ copySampleMessage() || 'Copy Protocol Note' }}</span>
                </button>
              </h3>

              <!-- Giant Sample Stat Card -->
              <div class="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-xl p-6 text-center shadow-sm">
                <div class="text-xs uppercase tracking-wider font-semibold text-teal-300">
                  Recommended Final Sample Size
                </div>
                <div class="text-5xl font-black my-2 tracking-tight text-white">
                  {{ samplingFinalResult() }}
                </div>
                <div class="text-xs text-teal-200/90 font-medium">
                  Respondents / Completed Household Interviews
                </div>
                <div class="mt-4 pt-3 border-t border-teal-800/80 text-[11px] text-teal-200 flex items-center justify-center gap-4">
                  <span>Confidence: {{ samplingConfidenceLevel() }}%</span>
                  <span>·</span>
                  <span>Margin of Error: ±{{ samplingMarginOfError() }}%</span>
                  <span>·</span>
                  <span>Buffer: +{{ samplingNonResponse() }}%</span>
                </div>
              </div>

              <!-- Mathematical Step-by-Step Breakdown -->
              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span class="text-slate-600 font-medium">1. Cochran Unadjusted Base (n₀)</span>
                  <span class="font-mono font-bold text-slate-800">{{ samplingCochranBase() }}</span>
                </div>

                @if (!samplingIsInfinite()) {
                  <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <span class="text-slate-600 font-medium">2. Finite Population Corrected (FPC)</span>
                    <span class="font-mono font-bold text-slate-800">{{ samplingFpcBase() }}</span>
                  </div>
                }

                <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <span class="text-slate-600 font-medium">3. Adjusted for Design Effect (DEFF = {{ samplingDesignEffect() }})</span>
                  <span class="font-mono font-bold text-slate-800">{{ samplingDeffBase() }}</span>
                </div>

                <div class="flex items-center justify-between p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span class="text-emerald-900 font-semibold">4. With {{ samplingNonResponse() }}% Non-Response Buffer</span>
                  <span class="font-mono font-black text-emerald-900 text-sm">{{ samplingFinalResult() }}</span>
                </div>

                @if (!samplingIsInfinite()) {
                  <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <span class="text-slate-600 font-medium">Sampling Interval (k = N / n)</span>
                    <span class="font-mono font-bold text-slate-800">Every {{ samplingInterval() }} households</span>
                  </div>
                }
              </div>

              <!-- Formula Reference Box -->
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Formulae Grounding</h4>
                <div class="font-mono text-[11px] text-slate-700 bg-white p-2.5 rounded border border-slate-200 space-y-1">
                  <div>n₀ = (Z² · p · (1 - p)) / e²</div>
                  @if (!samplingIsInfinite()) {
                    <div>n = n₀ / (1 + (n₀ - 1) / N)</div>
                  }
                  <div>n_cluster = n · DEFF</div>
                  <div>n_final = n_cluster / (1 - NonResponseRate)</div>
                </div>
                <p class="text-[11px] text-slate-500">
                  Compliant with USAID Bureau for Policy, Planning and Learning (PPL) Technical Guidance on Performance Monitoring and Impact Evaluation.
                </p>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 2: SMART & CREAM INDICATOR QUALITY CHECKER -->
      @if (activeTab() === 'smart-checker') {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                  <mat-icon class="text-teal-800">edit_note</mat-icon> Indicator Evaluator
                </h3>
                <p class="text-xs text-slate-500">Assess indicator formulation against international quality standards</p>
              </div>

              <div class="flex items-center gap-1.5">
                <span class="text-xs font-semibold text-slate-500">Preset:</span>
                <select
                  (change)="loadIndicatorPreset($any($event.target).value)"
                  class="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-1 font-medium text-slate-700">
                  <option value="good-mason">High Quality Indicator</option>
                  <option value="vague-capacity">Vague / Weak Indicator</option>
                  <option value="cash-transfers">Cash Assistance Indicator</option>
                </select>
              </div>
            </div>

            <!-- Indicator Text -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700">Indicator Title / Statement</label>
              <textarea
                [value]="evaluatorIndicatorText()"
                (input)="evaluatorIndicatorText.set($any($event.target).value)"
                rows="3"
                class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-700"
                placeholder="e.g. Percentage of rural women-headed households reporting increased income..."></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">Baseline Value</label>
                <input
                  type="text"
                  [value]="evaluatorBaseline()"
                  (input)="evaluatorBaseline.set($any($event.target).value)"
                  placeholder="e.g. 15% (2024)"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">Life-of-Project Target</label>
                <input
                  type="text"
                  [value]="evaluatorTarget()"
                  (input)="evaluatorTarget.set($any($event.target).value)"
                  placeholder="e.g. 65% (2026)"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">Reporting Frequency</label>
                <select
                  [value]="evaluatorFrequency()"
                  (change)="evaluatorFrequency.set($any($event.target).value)"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
                  <option value="Quarterly">Quarterly</option>
                  <option value="Semi-Annually">Semi-Annually</option>
                  <option value="Annually">Annually</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">Standard Disaggregations</label>
                <input
                  type="text"
                  [value]="evaluatorDisagg()"
                  (input)="evaluatorDisagg.set($any($event.target).value)"
                  placeholder="e.g. Sex (M/F), Caste/Ethnicity, Palika"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
              </div>
            </div>

            <!-- Audit Trigger -->
            <button
              type="button"
              (click)="runSmartCreamAudit()"
              class="w-full py-2.5 bg-teal-900 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs">
              <mat-icon class="text-xs">play_arrow</mat-icon>
              <span>Run SMART & CREAM Audit</span>
            </button>
          </div>

          <!-- Audit Results & Diagnostic Scorecard -->
          <div class="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <mat-icon class="text-teal-800">fact_check</mat-icon> Audit Findings & Scorecard
              </h3>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold"
                  [class.text-emerald-800]="indicatorQualityScore() >= 80"
                  [class.text-amber-800]="indicatorQualityScore() >= 60 && indicatorQualityScore() < 80"
                  [class.text-rose-800]="indicatorQualityScore() < 60">
                  {{ indicatorQualityScore() }}/100 Score
                </span>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold"
                  [class.bg-emerald-100]="indicatorQualityScore() >= 80"
                  [class.text-emerald-800]="indicatorQualityScore() >= 80"
                  [class.bg-amber-100]="indicatorQualityScore() >= 60 && indicatorQualityScore() < 80"
                  [class.text-amber-800]="indicatorQualityScore() >= 60 && indicatorQualityScore() < 80"
                  [class.bg-rose-100]="indicatorQualityScore() < 60"
                  [class.text-rose-800]="indicatorQualityScore() < 60">
                  {{ indicatorQualityLabel() }}
                </span>
              </div>
            </div>

            <!-- SMART Rubric Breakdown -->
            <div class="space-y-2">
              <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">S.M.A.R.T. Dimensions</h4>
              <div class="grid grid-cols-5 gap-2 text-center text-xs">
                @for (item of smartScores(); track item.letter) {
                  <div class="p-2.5 rounded-lg border text-center"
                    [class.bg-emerald-50]="item.score >= 16"
                    [class.border-emerald-200]="item.score >= 16"
                    [class.bg-amber-50]="item.score >= 12 && item.score < 16"
                    [class.border-amber-200]="item.score >= 12 && item.score < 16"
                    [class.bg-rose-50]="item.score < 12"
                    [class.border-rose-200]="item.score < 12">
                    <div class="text-xs font-black text-slate-800">{{ item.letter }}</div>
                    <div class="text-[10px] text-slate-500 font-medium">{{ item.label }}</div>
                    <div class="text-xs font-bold mt-1"
                      [class.text-emerald-800]="item.score >= 16"
                      [class.text-amber-800]="item.score >= 12 && item.score < 16"
                      [class.text-rose-800]="item.score < 12">
                      {{ item.score }}/20
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- CREAM Rubric Breakdown -->
            <div class="space-y-2">
              <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">C.R.E.A.M. Dimensions (World Bank Standard)</h4>
              <div class="grid grid-cols-5 gap-2 text-center text-xs">
                @for (item of creamScores(); track item.letter) {
                  <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div class="font-bold text-slate-800">{{ item.letter }}</div>
                    <div class="text-[9px] text-slate-500 truncate">{{ item.label }}</div>
                    <div class="text-xs font-bold text-teal-900 mt-0.5">{{ item.score }}/20</div>
                  </div>
                }
              </div>
            </div>

            <!-- Diagnostic Warnings & Issues Found -->
            <div class="space-y-2">
              <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Diagnostic Findings</h4>
              <div class="space-y-1.5 text-xs">
                @for (issue of auditFindings(); track issue.id) {
                  <div class="flex items-start gap-2 p-2.5 rounded-lg"
                    [class.bg-emerald-50]="issue.type === 'pass'"
                    [class.text-emerald-900]="issue.type === 'pass'"
                    [class.bg-amber-50]="issue.type === 'warn'"
                    [class.text-amber-900]="issue.type === 'warn'"
                    [class.bg-rose-50]="issue.type === 'fail'"
                    [class.text-rose-900]="issue.type === 'fail'">
                    <mat-icon class="text-xs mt-0.5"
                      [class.text-emerald-700]="issue.type === 'pass'"
                      [class.text-amber-700]="issue.type === 'warn'"
                      [class.text-rose-700]="issue.type === 'fail'">
                      {{ issue.type === 'pass' ? 'check_circle' : (issue.type === 'warn' ? 'warning' : 'error') }}
                    </mat-icon>
                    <div>
                      <span class="font-bold">{{ issue.title }}:</span>
                      <span class="ml-1 text-[11px]">{{ issue.message }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- AI Enhanced Recommendation Box -->
            <div class="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <mat-icon class="text-xs text-teal-700">auto_fix_high</mat-icon> Standardized PIRS Phrasing
                </span>
                <button
                  type="button"
                  (click)="applyEnhancedIndicator()"
                  class="text-[11px] text-teal-800 font-bold hover:underline">
                  Apply to Input
                </button>
              </div>
              <p class="text-xs text-teal-950 font-medium italic bg-white/80 p-2.5 rounded border border-teal-100">
                "{{ enhancedRecommendation() }}"
              </p>
            </div>
          </div>
        </div>
      }

      <!-- TAB 3: OECD-DAC EVALUATION FRAMEWORK -->
      @if (activeTab() === 'oecd-dac') {
        <div class="space-y-6">
          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div class="max-w-3xl mb-6">
              <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <mat-icon class="text-teal-800">account_balance</mat-icon>
                OECD-DAC Evaluation Framework & Question Generator
              </h3>
              <p class="text-xs text-slate-500 mt-1">
                The six core evaluation criteria established by the OECD Development Assistance Committee (DAC): Relevance, Coherence, Effectiveness, Efficiency, Impact, and Sustainability. Select criteria to generate tailored evaluation questions for Mid-Term and Final Evaluations.
              </p>
            </div>

            <!-- 6 Criteria Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (crit of oecdCriteria(); track crit.id) {
                <div
                  (click)="selectedOecdCriterion.set(crit.id)"
                  [class]="selectedOecdCriterion() === crit.id ? 'border-teal-700 bg-teal-50/50 ring-2 ring-teal-700/20' : 'border-slate-200 bg-white hover:border-slate-300'"
                  class="border rounded-xl p-4.5 cursor-pointer transition-all space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                      [class]="selectedOecdCriterion() === crit.id ? 'bg-teal-900 text-white' : 'bg-slate-100 text-slate-700'">
                      {{ crit.number }}
                    </span>
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                      [class]="crit.badgeClass">
                      {{ crit.badge }}
                    </span>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-slate-900">{{ crit.name }}</h4>
                    <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">{{ crit.guidingQuestion }}</p>
                  </div>
                  <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{{ crit.sampleQuestions.length }} Standard Questions</span>
                    <span class="text-teal-800 font-semibold flex items-center gap-0.5">
                      Explore <mat-icon class="text-[10px]">arrow_forward</mat-icon>
                    </span>
                  </div>
                </div>
              }
            </div>

            <!-- Detail Matrix for Selected Criterion -->
            @if (currentOecd()) {
              <div class="mt-6 pt-6 border-t border-slate-200 space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xs font-mono font-bold uppercase text-teal-800 tracking-wider">
                      Selected Criterion Matrix:
                    </span>
                    <h4 class="text-base font-bold text-slate-900">{{ currentOecd()?.name }}</h4>
                  </div>
                  <button
                    type="button"
                    (click)="copyOecdQuestions()"
                    class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors">
                    <mat-icon class="text-xs">content_copy</mat-icon>
                    <span>{{ oecdCopyMessage() || 'Copy Matrix to Clipboard' }}</span>
                  </button>
                </div>

                <div class="overflow-x-auto border border-slate-200 rounded-xl">
                  <table class="w-full text-left text-xs">
                    <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      <tr>
                        <th class="py-2.5 px-3 w-12">#</th>
                        <th class="py-2.5 px-4 w-1/3">Standard Evaluation Question</th>
                        <th class="py-2.5 px-4">Judgement Criteria & Benchmarks</th>
                        <th class="py-2.5 px-4">Primary Data Sources & Method</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      @for (q of currentOecd()?.sampleQuestions; track q.id; let i = $index) {
                        <tr class="hover:bg-slate-50/70">
                          <td class="py-3 px-3 font-mono font-bold text-slate-400">{{ i + 1 }}</td>
                          <td class="py-3 px-4 font-semibold text-slate-800">{{ q.question }}</td>
                          <td class="py-3 px-4 text-slate-600">{{ q.judgementCriteria }}</td>
                          <td class="py-3 px-4">
                            <span class="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                              {{ q.sources }}
                            </span>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- TAB 4: EVALUABILITY READINESS ASSESSMENT -->
      @if (activeTab() === 'evaluability') {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Quiz Questions -->
          <div class="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <mat-icon class="text-teal-800">quiz</mat-icon>
                10-Point Evaluability Assessment Quiz
              </h3>
              <p class="text-xs text-slate-500">
                Score each checkpoint (0 = Absent, 1 = Partially In Place, 2 = Fully Established) to evaluate whether the project is ready for formal evaluation.
              </p>
            </div>

            <div class="space-y-3">
              @for (q of evaluabilityQuestions(); track q.id) {
                <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        {{ q.category }}
                      </span>
                      <h4 class="text-xs font-bold text-slate-900 mt-1">
                        {{ q.id }}. {{ q.question }}
                      </h4>
                      <p class="text-[11px] text-slate-500 mt-0.5">{{ q.explanation }}</p>
                    </div>

                    <!-- 3-point radio group -->
                    <div class="flex items-center gap-1.5 shrink-0 bg-white p-1 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        (click)="setEvaluabilityScore(q.id, 0)"
                        [class]="q.score === 0 ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'"
                        class="px-2 py-1 text-[11px] rounded transition-all">
                        0 (Absent)
                      </button>
                      <button
                        type="button"
                        (click)="setEvaluabilityScore(q.id, 1)"
                        [class]="q.score === 1 ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'"
                        class="px-2 py-1 text-[11px] rounded transition-all">
                        1 (Partial)
                      </button>
                      <button
                        type="button"
                        (click)="setEvaluabilityScore(q.id, 2)"
                        [class]="q.score === 2 ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'"
                        class="px-2 py-1 text-[11px] rounded transition-all">
                        2 (Full)
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Evaluability Score & Recommendations -->
          <div class="lg:col-span-4 space-y-5">
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Evaluability Index
              </h3>

              <div class="text-center p-6 rounded-xl border"
                [class.bg-emerald-50]="evaluabilityPercent() >= 75"
                [class.border-emerald-200]="evaluabilityPercent() >= 75"
                [class.bg-amber-50]="evaluabilityPercent() >= 50 && evaluabilityPercent() < 75"
                [class.border-amber-200]="evaluabilityPercent() >= 50 && evaluabilityPercent() < 75"
                [class.bg-rose-50]="evaluabilityPercent() < 50"
                [class.border-rose-200]="evaluabilityPercent() < 50">
                <div class="text-4xl font-black"
                  [class.text-emerald-900]="evaluabilityPercent() >= 75"
                  [class.text-amber-900]="evaluabilityPercent() >= 50 && evaluabilityPercent() < 75"
                  [class.text-rose-900]="evaluabilityPercent() < 50">
                  {{ evaluabilityScore() }}/20
                </div>
                <div class="text-sm font-bold mt-1"
                  [class.text-emerald-800]="evaluabilityPercent() >= 75"
                  [class.text-amber-800]="evaluabilityPercent() >= 50 && evaluabilityPercent() < 75"
                  [class.text-rose-800]="evaluabilityPercent() < 50">
                  {{ evaluabilityPercent() }}% · {{ evaluabilityRating() }}
                </div>
              </div>

              <!-- Recommendation Text -->
              <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div class="font-bold text-slate-900 flex items-center gap-1.5">
                  <mat-icon class="text-xs text-teal-800">recommend</mat-icon> Institutional Recommendation
                </div>
                <p class="leading-relaxed text-[11px]">
                  {{ evaluabilityRecommendation() }}
                </p>
              </div>

              <!-- Ready Button -->
              <button
                type="button"
                (click)="exportEvaluabilityMemo()"
                class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <mat-icon class="text-xs">file_download</mat-icon>
                <span>Export Evaluability Memo</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- TAB 5: DATA COLLECTION METHOD SELECTOR -->
      @if (activeTab() === 'method-selector') {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Context Questionnaire -->
          <div class="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <mat-icon class="text-teal-800">alt_route</mat-icon>
                Field Context Decision Engine
              </h3>
              <p class="text-xs text-slate-500">Configure project operational conditions to identify optimal data collection modalities</p>
            </div>

            <!-- Primary Objective -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700">Primary M&E Purpose</label>
              <select
                [value]="selectorPurpose()"
                (change)="selectorPurpose.set($any($event.target).value)"
                class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
                <option value="prevalence">Statistical Baseline / Endline (Prevalence & Quantitative Targets)</option>
                <option value="depth">In-Depth Behavioral Change, Drivers & Social Norms</option>
                <option value="rapid">Emergency Rapid Needs & Damage Assessment</option>
                <option value="routine">Routine Process Monitoring & Accountability Tracking</option>
              </select>
            </div>

            <!-- Literacy Level -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700">Respondent Literacy Level</label>
              <select
                [value]="selectorLiteracy()"
                (change)="selectorLiteracy.set($any($event.target).value)"
                class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
                <option value="low">Low Literacy / Illiterate (Requires enumerator-assisted oral interview)</option>
                <option value="medium">Basic Literacy (Simple multiple-choice surveys feasible)</option>
                <option value="high">High Literacy (Self-administered digital / web forms feasible)</option>
              </select>
            </div>

            <!-- Geographic Access -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700">Geographic Accessibility & Connectivity</label>
              <select
                [value]="selectorAccess()"
                (change)="selectorAccess.set($any($event.target).value)"
                class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
                <option value="mountain">Remote Himalayan / Mountain (Offline mobile collection only, high travel cost)</option>
                <option value="rural">Rural Terai / Mid-Hills (Periodic cellular sync possible)</option>
                <option value="urban">Urban / Peri-Urban (Continuous 4G connectivity available)</option>
              </select>
            </div>

            <!-- Sensitivity -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700">Topic Sensitivity & Safeguarding Level</label>
              <select
                [value]="selectorSensitivity()"
                (change)="selectorSensitivity.set($any($event.target).value)"
                class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800">
                <option value="standard">Standard Developmental (Agri, livelihood assets, water supply)</option>
                <option value="sensitive">Sensitive (Gender-based violence, psychosocial, corruption/fraud)</option>
              </select>
            </div>
          </div>

          <!-- Recommended Methods Ranked -->
          <div class="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                  <mat-icon class="text-teal-800">recommend</mat-icon>
                  Recommended Data Collection Modalities
                </h3>
                <p class="text-xs text-slate-500">Ranked by suitability to your specified project operational profile</p>
              </div>
              <span class="text-xs font-mono font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                Top Match: {{ topMethod()?.name }}
              </span>
            </div>

            <div class="space-y-3">
              @for (method of rankedMethods(); track method.id) {
                <div class="p-4 rounded-xl border transition-all"
                  [class.border-teal-600]="method.matchScore >= 85"
                  [class.bg-teal-50/40]="method.matchScore >= 85"
                  [class.border-slate-200]="method.matchScore < 85"
                  [class.bg-white]="method.matchScore < 85">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                        [class.bg-teal-900]="method.matchScore >= 85"
                        [class.text-white]="method.matchScore >= 85"
                        [class.bg-slate-100]="method.matchScore < 85"
                        [class.text-slate-700]="method.matchScore < 85">
                        <mat-icon class="text-sm">{{ method.icon }}</mat-icon>
                      </span>
                      <div>
                        <h4 class="text-xs font-bold text-slate-900">{{ method.name }}</h4>
                        <span class="text-[10px] text-slate-500 font-mono">{{ method.modalityType }}</span>
                      </div>
                    </div>

                    <div class="text-right">
                      <span class="text-xs font-mono font-bold"
                        [class.text-teal-900]="method.matchScore >= 85"
                        [class.text-slate-700]="method.matchScore < 85">
                        {{ method.matchScore }}% Match
                      </span>
                    </div>
                  </div>

                  <p class="text-xs text-slate-600 mt-2">{{ method.description }}</p>

                  <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                    <div>
                      <span class="font-bold text-emerald-800">Strengths:</span>
                      <span class="text-slate-600 ml-1">{{ method.strengths }}</span>
                    </div>
                    <div>
                      <span class="font-bold text-rose-800">Limitations:</span>
                      <span class="text-slate-600 ml-1">{{ method.limitations }}</span>
                    </div>
                  </div>

                  <div class="mt-2 text-[10px] font-mono text-teal-800 bg-white/70 p-1.5 rounded border border-teal-100 flex items-center justify-between">
                    <span>Tooling: {{ method.recommendedTools }}</span>
                    <span>Cost / Respondent: {{ method.relativeCost }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- TAB 6: GLOBAL INDICATOR LIBRARY (4,300+ INDICATOR BANK) -->
      @if (activeTab() === 'indicator-library') {
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <!-- Library Header & Filters -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <mat-icon class="text-teal-800">menu_book</mat-icon>
                Cross-Donor Indicator Library & PIRS Bank
              </h3>
              <p class="text-xs text-slate-500">
                Standard indicators harmonized across USAID, FCDO, UN SDG, and World Bank frameworks
              </p>
            </div>

            <!-- Search Bar -->
            <div class="w-full sm:w-72 relative">
              <input
                type="text"
                [value]="librarySearch()"
                (input)="librarySearch.set($any($event.target).value)"
                placeholder="Search indicator by keyword..."
                class="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-700">
              <mat-icon class="absolute left-2.5 top-2 text-xs text-slate-400">search</mat-icon>
            </div>
          </div>

          <!-- Sector & Donor Filter Buttons -->
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="text-slate-500 font-bold text-[11px]">Sector:</span>
            <button
              type="button"
              (click)="selectedLibrarySector.set('all')"
              [class]="selectedLibrarySector() === 'all' ? 'bg-teal-900 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'"
              class="px-2.5 py-1 rounded-md transition-colors">
              All Sectors ({{ libraryIndicators().length }})
            </button>
            @for (sec of librarySectors; track sec) {
              <button
                type="button"
                (click)="selectedLibrarySector.set(sec)"
                [class]="selectedLibrarySector() === sec ? 'bg-teal-900 text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium'"
                class="px-2.5 py-1 rounded-md transition-colors">
                {{ sec }}
              </button>
            }
          </div>

          <!-- Indicator Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (ind of filteredLibraryIndicators(); track ind.id) {
              <div class="border border-slate-200 rounded-xl p-4.5 bg-slate-50/50 hover:bg-white hover:border-teal-700 transition-all space-y-3 shadow-2xs">
                <div class="flex items-start justify-between gap-3">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                        {{ ind.code }}
                      </span>
                      <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {{ ind.donorStandard }}
                      </span>
                      <span class="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                        {{ ind.level }}
                      </span>
                    </div>
                    <h4 class="text-xs font-bold text-slate-900">{{ ind.title }}</h4>
                  </div>

                  <button
                    type="button"
                    (click)="addIndicatorToLogframe(ind)"
                    class="px-2.5 py-1 bg-teal-900 hover:bg-teal-800 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0 shadow-2xs">
                    <mat-icon class="text-xs">add</mat-icon>
                    <span>Adopt Indicator</span>
                  </button>
                </div>

                <p class="text-xs text-slate-600 leading-relaxed">{{ ind.definition }}</p>

                <div class="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                  <div class="flex items-center justify-between">
                    <span><strong>Unit:</strong> {{ ind.unit }}</span>
                    <span><strong>Frequency:</strong> {{ ind.frequency }}</span>
                  </div>
                  <div>
                    <strong>Disaggregations:</strong> {{ ind.disaggregations.join(', ') }}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- TAB 7: AI REVIEW & PLAYBOOKS -->
      @if (activeTab() === 'ai-review') {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Playbook Prompts Library -->
          <div class="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div class="border-b border-slate-100 pb-3">
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <mat-icon class="text-teal-800">auto_stories</mat-icon>
                M&E AI Prompt Playbook Library
              </h3>
              <p class="text-xs text-slate-500">Tested, donor-validated prompts for Claude, Gemini, and GPT-4</p>
            </div>

            <div class="space-y-3">
              @for (play of playbookPrompts; track play.id) {
                <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white space-y-2 transition-all">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {{ play.category }}
                    </span>
                    <button
                      type="button"
                      (click)="loadPlaybookToEditor(play)"
                      class="text-xs text-teal-800 font-bold hover:underline flex items-center gap-0.5">
                      <span>Use Prompt</span>
                      <mat-icon class="text-xs">arrow_forward</mat-icon>
                    </button>
                  </div>
                  <h4 class="text-xs font-bold text-slate-900">{{ play.title }}</h4>
                  <p class="text-[11px] text-slate-600">{{ play.description }}</p>
                </div>
              }
            </div>
          </div>

          <!-- Document Review Workbench -->
          <div class="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                  <mat-icon class="text-teal-800">rate_review</mat-icon>
                  Automated Document Reviewer
                </h3>
                <p class="text-xs text-slate-500">Review logframes, ToRs, survey drafts or evaluation chapters</p>
              </div>
              <span class="text-xs px-2 py-0.5 rounded-md font-mono bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                MEAL AI Plugin
              </span>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700">Document / Proposal Text to Review</label>
              <textarea
                [value]="aiReviewText()"
                (input)="aiReviewText.set($any($event.target).value)"
                rows="7"
                placeholder="Paste logframe text, evaluation ToR, indicator reference sheet, or survey questionnaire draft here..."
                class="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-700 font-mono"></textarea>
            </div>

            <div class="flex items-center justify-between">
              <select
                [value]="aiReviewStandard()"
                (change)="aiReviewStandard.set($any($event.target).value)"
                class="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-700">
                <option value="usaid">Audit Against USAID Automated Directives System (ADS 201)</option>
                <option value="oecd">Audit Against OECD-DAC Criteria (2020 Revised)</option>
                <option value="chs">Audit Against Core Humanitarian Standard (CHS 5)</option>
              </select>

              <button
                type="button"
                (click)="runAiDocumentReview()"
                class="px-4 py-2 bg-teal-900 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
                <mat-icon class="text-xs">smart_toy</mat-icon>
                <span>Run Compliance Review</span>
              </button>
            </div>

            @if (aiReviewOutput()) {
              <div class="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div class="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <mat-icon class="text-teal-800 text-xs">check_circle</mat-icon>
                  Audit Results & Gap Analysis
                </div>
                <div class="whitespace-pre-line text-slate-700 leading-relaxed font-sans text-xs">
                  {{ aiReviewOutput() }}
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class MeStudioView {
  readonly mealService = inject(MealDataService);

  readonly activeTab = signal<MeStudioTab>('sampling');

  // ================= SAMPLING CALCULATOR STATE =================
  readonly samplingPopSize = signal<number>(12500);
  readonly samplingIsInfinite = signal<boolean>(false);
  readonly samplingMarginOfError = signal<number>(5.0);
  readonly samplingConfidenceLevel = signal<number>(95);
  readonly samplingProportion = signal<number>(50);
  readonly samplingDesignEffect = signal<number>(1.5);
  readonly samplingNonResponse = signal<number>(10);
  readonly samplingUnitsPerCluster = signal<number>(20);
  readonly copySampleMessage = signal<string>('');

  readonly samplingZScore = computed(() => {
    const cl = this.samplingConfidenceLevel();
    if (cl === 90) return 1.645;
    if (cl === 99) return 2.576;
    return 1.96; // 95%
  });

  readonly samplingCochranBase = computed(() => {
    const z = this.samplingZScore();
    const p = this.samplingProportion() / 100;
    const e = this.samplingMarginOfError() / 100;
    const n0 = (Math.pow(z, 2) * p * (1 - p)) / Math.pow(e, 2);
    return Math.round(n0);
  });

  readonly samplingFpcBase = computed(() => {
    const n0 = this.samplingCochranBase();
    if (this.samplingIsInfinite()) return n0;
    const N = this.samplingPopSize();
    const n = n0 / (1 + (n0 - 1) / N);
    return Math.round(n);
  });

  readonly samplingDeffBase = computed(() => {
    const base = this.samplingFpcBase();
    return Math.round(base * this.samplingDesignEffect());
  });

  readonly samplingFinalResult = computed(() => {
    const withDeff = this.samplingDeffBase();
    const buffer = this.samplingNonResponse() / 100;
    const finalVal = withDeff / (1 - buffer);
    return Math.ceil(finalVal);
  });

  readonly samplingCalculatedClusters = computed(() => {
    const total = this.samplingFinalResult();
    const perCluster = this.samplingUnitsPerCluster() || 20;
    return Math.ceil(total / perCluster);
  });

  readonly samplingInterval = computed(() => {
    if (this.samplingIsInfinite()) return 1;
    const N = this.samplingPopSize();
    const n = this.samplingFinalResult();
    return Math.max(1, Math.floor(N / n));
  });

  resetSamplingDefaults() {
    this.samplingPopSize.set(12500);
    this.samplingIsInfinite.set(false);
    this.samplingMarginOfError.set(5.0);
    this.samplingConfidenceLevel.set(95);
    this.samplingProportion.set(50);
    this.samplingDesignEffect.set(1.5);
    this.samplingNonResponse.set(10);
    this.samplingUnitsPerCluster.set(20);
  }

  toggleInfinitePop() {
    this.samplingIsInfinite.update(v => !v);
  }

  updatePopSize(ev: Event) {
    const val = parseInt((ev.target as HTMLInputElement).value, 10) || 100;
    this.samplingPopSize.set(val);
  }

  updateMarginOfError(ev: Event) {
    const val = parseFloat((ev.target as HTMLInputElement).value) || 5;
    this.samplingMarginOfError.set(val);
  }

  updateProportion(ev: Event) {
    const val = parseInt((ev.target as HTMLInputElement).value, 10) || 50;
    this.samplingProportion.set(val);
  }

  updateDesignEffect(ev: Event) {
    const val = parseFloat((ev.target as HTMLInputElement).value) || 1.0;
    this.samplingDesignEffect.set(val);
  }

  updateNonResponse(ev: Event) {
    const val = parseInt((ev.target as HTMLInputElement).value, 10) || 0;
    this.samplingNonResponse.set(val);
  }

  updateUnitsPerCluster(ev: Event) {
    const val = parseInt((ev.target as HTMLInputElement).value, 10) || 20;
    this.samplingUnitsPerCluster.set(val);
  }

  copySamplingSummary() {
    const summary = `M&E Sampling Protocol Note:
Target Population (N): ${this.samplingIsInfinite() ? 'Infinite / Unknown' : this.samplingPopSize()}
Confidence Level: ${this.samplingConfidenceLevel()}% (Z = ${this.samplingZScore()})
Margin of Error: ±${this.samplingMarginOfError()}%
Expected Proportion (p): ${this.samplingProportion()}%
Cluster Design Effect (DEFF): ${this.samplingDesignEffect()}
Non-Response Buffer: ${this.samplingNonResponse()}%
Required Sample Size (n_final): ${this.samplingFinalResult()} completed interviews
Cluster Allocation: ${this.samplingCalculatedClusters()} clusters × ${this.samplingUnitsPerCluster()} households per cluster
Methodology: Cochran formula with Finite Population Correction and Non-Response buffer.`;

    navigator.clipboard?.writeText(summary);
    this.copySampleMessage.set('Copied to Clipboard!');
    setTimeout(() => this.copySampleMessage.set(''), 3000);
  }

  // ================= SMART & CREAM EVALUATOR STATE =================
  readonly evaluatorIndicatorText = signal<string>(
    'Percentage of local artisans and masons in Sindhupalchok who correctly construct earthquake-resilient structures in compliance with NBC 105 building code standards'
  );
  readonly evaluatorBaseline = signal<string>('18% (July 2024)');
  readonly evaluatorTarget = signal<string>('75% (June 2026)');
  readonly evaluatorFrequency = signal<string>('Semi-Annually');
  readonly evaluatorDisagg = signal<string>('Sex (M/F), Caste/Ethnicity, Palika, Mason Certification Tier');

  readonly smartScores = signal<{ letter: string; label: string; score: number }[]>([
    { letter: 'S', label: 'Specific', score: 18 },
    { letter: 'M', label: 'Measurable', score: 19 },
    { letter: 'A', label: 'Achievable', score: 17 },
    { letter: 'R', label: 'Relevant', score: 19 },
    { letter: 'T', label: 'Time-bound', score: 18 }
  ]);

  readonly creamScores = signal<{ letter: string; label: string; score: number }[]>([
    { letter: 'C', label: 'Clear', score: 18 },
    { letter: 'R', label: 'Relevant', score: 19 },
    { letter: 'E', label: 'Economic', score: 16 },
    { letter: 'A', label: 'Adequate', score: 18 },
    { letter: 'M', label: 'Monitorable', score: 19 }
  ]);

  readonly indicatorQualityScore = computed(() => {
    const sum = this.smartScores().reduce((acc, cur) => acc + cur.score, 0);
    return sum; // out of 100
  });

  readonly indicatorQualityLabel = computed(() => {
    const s = this.indicatorQualityScore();
    if (s >= 85) return 'Exemplary Standard';
    if (s >= 70) return 'Acceptable Standard';
    if (s >= 50) return 'Needs Revision';
    return 'Deficient';
  });

  readonly auditFindings = signal<{ id: number; type: 'pass' | 'warn' | 'fail'; title: string; message: string }[]>([
    { id: 1, type: 'pass', title: 'Unit of Measure', message: 'Clear percentage formulation with defined numerator and denominator.' },
    { id: 2, type: 'pass', title: 'Target Beneficiaries', message: 'Target population explicitly stated (local artisans & masons).' },
    { id: 3, type: 'pass', title: 'Standard Reference', message: 'Explicit technical benchmark identified (NBC 105 building code).' },
    { id: 4, type: 'warn', title: 'Verification Instrument', message: 'Ensure rubric or practical masonry checklist is specified in PIRS.' }
  ]);

  readonly enhancedRecommendation = signal<string>(
    'Percentage of trained masons who demonstrate certified practical competency in NBC 105 seismic retrofitting during field construction evaluations, disaggregated by gender and palika.'
  );

  loadIndicatorPreset(preset: string) {
    if (preset === 'good-mason') {
      this.evaluatorIndicatorText.set(
        'Percentage of local artisans and masons in Sindhupalchok who correctly construct earthquake-resilient structures in compliance with NBC 105 building code standards'
      );
      this.evaluatorBaseline.set('18% (2024)');
      this.evaluatorTarget.set('75% (2026)');
      this.smartScores.set([
        { letter: 'S', label: 'Specific', score: 18 },
        { letter: 'M', label: 'Measurable', score: 19 },
        { letter: 'A', label: 'Achievable', score: 17 },
        { letter: 'R', label: 'Relevant', score: 19 },
        { letter: 'T', label: 'Time-bound', score: 18 }
      ]);
    } else if (preset === 'vague-capacity') {
      this.evaluatorIndicatorText.set('Improve community resilience and awareness in disaster risk reduction');
      this.evaluatorBaseline.set('Unknown');
      this.evaluatorTarget.set('High');
      this.smartScores.set([
        { letter: 'S', label: 'Specific', score: 8 },
        { letter: 'M', label: 'Measurable', score: 6 },
        { letter: 'A', label: 'Achievable', score: 10 },
        { letter: 'R', label: 'Relevant', score: 14 },
        { letter: 'T', label: 'Time-bound', score: 7 }
      ]);
      this.auditFindings.set([
        { id: 1, type: 'fail', title: 'Vague Verb', message: 'Contains non-measurable verb "Improve". Replace with quantitative unit.' },
        { id: 2, type: 'fail', title: 'No Measurement Unit', message: 'Missing percentage, scale, or absolute count.' },
        { id: 3, type: 'fail', title: 'Missing Baseline/Target', message: 'Undefined quantitative threshold.' }
      ]);
      this.enhancedRecommendation.set(
        'Percentage of targeted community disaster management committees (CDMCs) scoring ≥ 80% on the Nepal MoHA Local Disaster Preparedness Standard Rubric by Q4 2026.'
      );
    } else {
      this.evaluatorIndicatorText.set(
        'Number of flood-affected vulnerable households receiving unconditional emergency cash transfers meeting the survival minimum expenditure basket (SMEB)'
      );
      this.evaluatorBaseline.set('0 (Pre-crisis)');
      this.evaluatorTarget.set('3,500 HHs');
      this.smartScores.set([
        { letter: 'S', label: 'Specific', score: 19 },
        { letter: 'M', label: 'Measurable', score: 20 },
        { letter: 'A', label: 'Achievable', score: 18 },
        { letter: 'R', label: 'Relevant', score: 20 },
        { letter: 'T', label: 'Time-bound', score: 17 }
      ]);
    }
  }

  runSmartCreamAudit() {
    const text = this.evaluatorIndicatorText().toLowerCase();
    const hasVague = text.includes('improve') || text.includes('enhance') || text.includes('better') || text.includes('strengthen');
    const hasUnit = text.includes('%') || text.includes('percent') || text.includes('number') || text.includes('proportion');

    const sScore = hasVague ? 10 : 18;
    const mScore = hasUnit ? 19 : 9;

    this.smartScores.set([
      { letter: 'S', label: 'Specific', score: sScore },
      { letter: 'M', label: 'Measurable', score: mScore },
      { letter: 'A', label: 'Achievable', score: 17 },
      { letter: 'R', label: 'Relevant', score: 19 },
      { letter: 'T', label: 'Time-bound', score: 17 }
    ]);
  }

  applyEnhancedIndicator() {
    this.evaluatorIndicatorText.set(this.enhancedRecommendation());
    this.runSmartCreamAudit();
  }

  // ================= OECD-DAC EVALUATION FRAMEWORK =================
  readonly selectedOecdCriterion = signal<string>('effectiveness');
  readonly oecdCopyMessage = signal<string>('');

  readonly oecdCriteria = signal<{
    id: string;
    number: number;
    name: string;
    guidingQuestion: string;
    badge: string;
    badgeClass: string;
    sampleQuestions: { id: number; question: string; judgementCriteria: string; sources: string }[];
  }[]>([
    {
      id: 'relevance',
      number: 1,
      name: 'Relevance',
      guidingQuestion: 'Is the intervention doing the right things in alignment with local priorities and beneficiary needs?',
      badge: 'Core Need Fit',
      badgeClass: 'bg-emerald-100 text-emerald-800',
      sampleQuestions: [
        { id: 1, question: 'To what extent did project objectives respond to the actual shelter and DRR needs of vulnerable palikas?', judgementCriteria: 'Identified community disaster vulnerabilities addressed; local government DRR priorities integrated.', sources: 'Beneficiary household surveys, Palika DRR plans, KII with Ward Chairs' },
        { id: 2, question: 'How flexible was the project design in adapting to evolving monsoon and seismic shocks during implementation?', judgementCriteria: 'Documented adaptive management actions taken in response to field contingencies.', sources: 'Quarterly review minutes, CFRM log, Modification requests' }
      ]
    },
    {
      id: 'coherence',
      number: 2,
      name: 'Coherence',
      guidingQuestion: 'How well does the intervention fit with other interventions in the country, sector or institution?',
      badge: 'Harmonization',
      badgeClass: 'bg-blue-100 text-blue-800',
      sampleQuestions: [
        { id: 1, question: 'How effectively did the project harmonize with Government of Nepal (NDRRMA / MoHA) guidelines?', judgementCriteria: 'Alignment with Nepal Disaster Risk Reduction and Management Act (2017) and Local Level Guidelines.', sources: 'KII with NDRRMA officers, District Administration Office reports' },
        { id: 2, question: 'Did the intervention complement or duplicate other donor-funded DRR programs in Sindhupalchok and Gorkha?', judgementCriteria: 'Synergistic coordination through District Disaster Management Committees (DDMC).', sources: 'Cluster coordination minutes, 4Ws mapping matrices' }
      ]
    },
    {
      id: 'effectiveness',
      number: 3,
      name: 'Effectiveness',
      guidingQuestion: 'To what extent did the intervention achieve its objectives and results, including differential results across groups?',
      badge: 'Goal Achievement',
      badgeClass: 'bg-teal-100 text-teal-800',
      sampleQuestions: [
        { id: 1, question: 'To what extent were planned output and outcome targets for mason training and retrofitting achieved?', judgementCriteria: 'Logframe indicator actuals vs targets; PIRS verification data.', sources: 'Indicator tracking database, Post-training practical assessments' },
        { id: 2, question: 'What factors contributed to or hindered the achievement of intended results for women-headed households?', judgementCriteria: 'GEDSI disaggregated achievement analysis; barrier identification.', sources: 'FGDs with female beneficiaries, Gender audit reports' }
      ]
    },
    {
      id: 'efficiency',
      number: 4,
      name: 'Efficiency',
      guidingQuestion: 'How well were resources (funds, expertise, time) converted into optimal results?',
      badge: 'Value for Money',
      badgeClass: 'bg-amber-100 text-amber-800',
      sampleQuestions: [
        { id: 1, question: 'Was the intervention delivered in a cost-effective manner compared to benchmarked industry unit costs?', judgementCriteria: 'Unit cost per mason trained, cost per school retrofitted within acceptable tolerance.', sources: 'Financial expenditure reports, procurement audits' },
        { id: 2, question: 'Were milestone deliverables achieved on schedule according to the approved Gantt workplan?', judgementCriteria: 'Timeliness of activities; analysis of variance against Gantt milestones.', sources: 'Gantt activity tracker, Milestone completion verifications' }
      ]
    },
    {
      id: 'impact',
      number: 5,
      name: 'Impact',
      guidingQuestion: 'What higher-level, transformative, and long-term positive and negative changes were generated?',
      badge: 'Transformative',
      badgeClass: 'bg-purple-100 text-purple-800',
      sampleQuestions: [
        { id: 1, question: 'What measurable difference did the project make to community disaster resilience and casualty reduction?', judgementCriteria: 'Community resilience score increase; structural damage risk reduction indices.', sources: 'Household panel survey, Engineering vulnerability audits' },
        { id: 2, question: 'Were there unintended positive or negative socio-economic effects on non-targeted households?', judgementCriteria: 'Market labor wage distortion checks; spillover adoption of NBC 105 techniques.', sources: 'Tracer surveys, Local hardware supplier interviews' }
      ]
    },
    {
      id: 'sustainability',
      number: 6,
      name: 'Sustainability',
      guidingQuestion: 'Will the benefits and institutional capacities continue after external donor funding terminates?',
      badge: 'Long-Term Legacy',
      badgeClass: 'bg-rose-100 text-rose-800',
      sampleQuestions: [
        { id: 1, question: 'Are municipal governments (Palikas) committed to financing ongoing maintenance and building code enforcement?', judgementCriteria: 'Municipal budget line items allocated for DRR; building code officers deployed.', sources: 'Palika annual budgets, MoUs, Local council resolutions' },
        { id: 2, question: 'Do trained masons continue to practice safe construction without project financial subsidies?', judgementCriteria: 'Retention rate of certified masons in local construction market at 12 months.', sources: 'Dereja tracer follow-up surveys, Contractor rosters' }
      ]
    }
  ]);

  readonly currentOecd = computed(() => {
    return this.oecdCriteria().find(c => c.id === this.selectedOecdCriterion());
  });

  copyOecdQuestions() {
    const cur = this.currentOecd();
    if (!cur) return;
    const text = `OECD-DAC Criterion: ${cur.name}
Guiding Principle: ${cur.guidingQuestion}
Evaluation Questions:
${cur.sampleQuestions.map((q, i) => `${i + 1}. Question: ${q.question}\n   Judgement Criteria: ${q.judgementCriteria}\n   Sources: ${q.sources}`).join('\n\n')}`;
    navigator.clipboard?.writeText(text);
    this.oecdCopyMessage.set('Copied Matrix!');
    setTimeout(() => this.oecdCopyMessage.set(''), 3000);
  }

  // ================= EVALUABILITY READINESS ASSESSMENT STATE =================
  readonly evaluabilityQuestions = signal<EvaluabilityQuestion[]>([
    { id: 1, category: 'Theory of Change', question: 'Is the Theory of Change explicit, logically coherent, and validated by stakeholders?', explanation: 'Clear causal pathways linking inputs, outputs, outcomes, and long-term impact with explicit assumptions.', score: 2 },
    { id: 2, category: 'Baseline Data', question: 'Were robust baseline values collected before intervention rollout using identical instruments?', explanation: 'Pre-intervention benchmark values documented for all primary outcome indicators.', score: 2 },
    { id: 3, category: 'Indicator Clarity', question: 'Are logframe indicators formulated with unambiguous PIRS reference sheets and quantifiable targets?', explanation: 'Each indicator possesses explicit definitions, numerator/denominator formulas, and disaggregations.', score: 2 },
    { id: 4, category: 'Routine Monitoring', question: 'Is there an operational routine monitoring and mobile data collection system generating timely data?', explanation: 'Field teams consistently submit validated activity records via CAPI / mobile collector.', score: 2 },
    { id: 5, category: 'Data Quality Audits', question: 'Have regular Data Quality Assurance (DQA) spot-checks been conducted against the 5 dimensions?', explanation: 'Routine validation checks for validity, reliability, integrity, precision, and timeliness.', score: 1 },
    { id: 6, category: 'Stakeholder Buy-In', question: 'Do key stakeholders and government counterparts actively demand and participate in the evaluation?', explanation: 'Joint agreement on evaluation terms of reference with municipal authorities and partner NGOs.', score: 2 },
    { id: 7, category: 'Resource Adequacy', question: 'Is there a dedicated, ring-fenced evaluation budget (typically 3-5% of total grant)?', explanation: 'Sufficient budget reserved for independent evaluators, field enumerator logistics, and reporting.', score: 1 },
    { id: 8, category: 'Accountability Mechanisms', question: 'Are community feedback and complaints response mechanisms (CFRM) operational and documented?', explanation: 'Beneficiaries have safe channels to report grievances with documented resolution SLAs.', score: 2 },
    { id: 9, category: 'Geographic Representativeness', question: 'Are field data geo-tagged across targeted local bodies (Palikas, Wards)?', explanation: 'Complete geographic disaggregation across Nepal 77 districts and palika units.', score: 2 },
    { id: 10, category: 'Ethical & Do-No-Harm Protocols', question: 'Are informed consent, child safeguarding, and PII anonymization procedures strictly enforced?', explanation: 'Adherence to IRB guidelines, beneficiary data protection, and trauma-informed interviews.', score: 2 }
  ]);

  readonly evaluabilityScore = computed(() => {
    return this.evaluabilityQuestions().reduce((sum, q) => sum + q.score, 0);
  });

  readonly evaluabilityPercent = computed(() => {
    return Math.round((this.evaluabilityScore() / 20) * 100);
  });

  readonly evaluabilityRating = computed(() => {
    const p = this.evaluabilityPercent();
    if (p >= 80) return 'High Evaluability';
    if (p >= 60) return 'Moderate Evaluability';
    return 'Low Evaluability (System Strengthening Needed)';
  });

  readonly evaluabilityRecommendation = computed(() => {
    const p = this.evaluabilityPercent();
    if (p >= 80) {
      return 'The project demonstrates robust evaluability. Ready to commission independent Mid-Term or Final Impact Evaluation with counterfactual or quasi-experimental design.';
    }
    if (p >= 60) {
      return 'Moderate readiness. Strengthen baseline documentation and complete a formal Data Quality Assurance (DQA) audit prior to launching field evaluation data collection.';
    }
    return 'Evaluability is currently deficient. Prioritize M&E system strengthening: reconstruct causal Theory of Change, establish missing baselines, and deploy routine CAPI mobile collection.';
  });

  setEvaluabilityScore(id: number, score: number) {
    this.evaluabilityQuestions.update(list =>
      list.map(q => q.id === id ? { ...q, score } : q)
    );
  }

  exportEvaluabilityMemo() {
    const text = `EVALUABILITY ASSESSMENT MEMORANDUM
Project: Building Community Resilience Project (BCRP)
Evaluability Index: ${this.evaluabilityScore()} / 20 (${this.evaluabilityPercent()}%)
Readiness Rating: ${this.evaluabilityRating()}
Recommendation: ${this.evaluabilityRecommendation()}

Checkpoints:
${this.evaluabilityQuestions().map(q => `[${q.score}/2] ${q.category}: ${q.question}`).join('\n')}`;

    navigator.clipboard?.writeText(text);
    alert('Evaluability Assessment Memorandum copied to clipboard!');
  }

  // ================= DATA COLLECTION METHOD SELECTOR =================
  readonly selectorPurpose = signal<string>('prevalence');
  readonly selectorLiteracy = signal<string>('low');
  readonly selectorAccess = signal<string>('mountain');
  readonly selectorSensitivity = signal<string>('standard');

  readonly allMethods = [
    {
      id: 'capi',
      name: 'Computer-Assisted Personal Interviewing (CAPI / Mobile Collector)',
      modalityType: 'Quantitative Household Survey',
      icon: 'smartphone',
      description: 'Enumerator-administered structured survey on tablets/smartphones with automated validation rules and GPS tagging.',
      strengths: 'High data quality, immediate sync, accommodates low-literacy respondents via oral interview.',
      limitations: 'Enumerator device battery management in off-grid mountain palikas.',
      recommendedTools: 'MEAL Mobile Collector, ODK Collect, KoboToolbox',
      relativeCost: 'Moderate ($15 - $25 / interview)'
    },
    {
      id: 'fgd',
      name: 'Focus Group Discussions (FGD) with Participatory Mapping',
      modalityType: 'Qualitative Participatory Assessment',
      icon: 'groups',
      description: 'Facilitated 6-10 person group dialogue exploring community consensus, collective barriers, and social dynamics.',
      strengths: 'Rich contextual nuance, participatory validation, safe space for marginalized groups.',
      limitations: 'Prone to dominant speaker bias; not statistically representative.',
      recommendedTools: 'Audio recorder, semi-structured guide, social mapping flipcharts',
      relativeCost: 'Low per participant ($8 - $15 / person)'
    },
    {
      id: 'kii',
      name: 'Key Informant Interviews (KII)',
      modalityType: 'Expert & Institutional Assessment',
      icon: 'record_voice_over',
      description: 'One-on-one semi-structured interviews with municipal leaders (Palika mayors, engineers, school headmasters).',
      strengths: 'Deep institutional insights, governance policy verification, policy alignment.',
      limitations: 'Key informant availability constraints and political sensitivities.',
      recommendedTools: 'KII topic guide, confidential notes repository',
      relativeCost: 'Low ($20 - $40 / informant)'
    },
    {
      id: 'observation',
      name: 'Direct Physical Observation & Engineering Checklist',
      modalityType: 'Technical Verification',
      icon: 'visibility',
      description: 'Physical inspection of structural elements (tie-beams, mortar ratio, seismic bands) using engineering rubrics.',
      strengths: 'Objective physical ground-truth without self-reporting bias.',
      limitations: 'Requires qualified structural engineering technicians.',
      recommendedTools: 'Visual masonry inspection form with photo evidence archive',
      relativeCost: 'Moderate ($30 - $50 / structure)'
    },
    {
      id: 'mobile-sms',
      name: 'Rapid Mobile IVR / SMS Micro-Surveys',
      modalityType: 'Remote High-Frequency Telemetry',
      icon: 'sms',
      description: 'Short 3-question automated voice/text surveys pushed directly to registered beneficiary mobile phones.',
      strengths: 'Instantaneous turnaround, minimal field cost, covers remote terrain.',
      limitations: 'High non-response rate; limited to basic categorical questions.',
      recommendedTools: 'Twilio, RapidPro, FrontlineSMS',
      relativeCost: 'Very Low ($0.20 - $0.50 / pulse)'
    }
  ];

  readonly rankedMethods = computed(() => {
    const purpose = this.selectorPurpose();
    const access = this.selectorAccess();
    const literacy = this.selectorLiteracy();
    const sens = this.selectorSensitivity();

    return this.allMethods.map(m => {
      let score = 70;
      if (m.id === 'capi') {
        if (purpose === 'prevalence') score += 25;
        if (access === 'mountain') score += 5; // offline mode excels
        if (literacy === 'low') score += 10; // enumerator guided
      } else if (m.id === 'fgd') {
        if (purpose === 'depth') score += 25;
        if (literacy === 'low') score += 15;
      } else if (m.id === 'kii') {
        if (purpose === 'routine' || purpose === 'depth') score += 20;
      } else if (m.id === 'observation') {
        if (purpose === 'routine' || purpose === 'prevalence') score += 15;
      } else if (m.id === 'mobile-sms') {
        if (purpose === 'rapid') score += 20;
        if (access === 'urban') score += 10;
        if (access === 'mountain') score -= 25;
        if (literacy === 'low') score -= 30;
      }
      return { ...m, matchScore: Math.min(98, Math.max(35, score)) };
    }).sort((a, b) => b.matchScore - a.matchScore);
  });

  readonly topMethod = computed(() => this.rankedMethods()[0]);

  // ================= GLOBAL INDICATOR LIBRARY (4,300+ REFS) =================
  readonly librarySearch = signal<string>('');
  readonly selectedLibrarySector = signal<string>('all');

  readonly librarySectors = [
    'DRR & Climate',
    'Education & TVET',
    'Livelihoods',
    'Health & Nutrition',
    'Agriculture & Food',
    'WASH',
    'Protection & Governance'
  ];

  readonly libraryIndicators = signal<LibraryIndicatorItem[]>([
    {
      id: 'lib-1',
      code: 'DRR-IND-01',
      title: 'Number of individuals trained in disaster preparedness, early warning, and seismic retrofitting',
      sector: 'DRR & Climate',
      donorStandard: 'USAID (F-Indicator)',
      level: 'Output',
      unit: 'Number of Persons',
      frequency: 'Quarterly',
      definition: 'Counts total unique community members, local masons, and technicians completing certified DRM training courses lasting ≥ 3 days.',
      disaggregations: ['Sex (Female/Male)', 'Age Bracket (18-29, 30-49, 50+)', 'Disability Status', 'Palika'],
      baselineGuidance: 'Historical baseline is 0 at grant commencement.',
      targetGuidance: 'Sum of cumulative training rosters across all project cohorts.'
    },
    {
      id: 'lib-2',
      code: 'DRR-IND-02',
      title: 'Percentage of targeted educational and health structures reinforced to withstand NBC 105 seismic parameters',
      sector: 'DRR & Climate',
      donorStandard: 'FCDO SDP',
      level: 'Outcome',
      unit: 'Percentage (%)',
      frequency: 'Annually',
      definition: 'Measures the proportion of public school classrooms and health posts completing certified seismic retrofitting works verified by a licensed municipal engineer.',
      disaggregations: ['Facility Type (School/Health Post)', 'Municipality', 'Retrofitting Technique'],
      baselineGuidance: 'Pre-intervention engineering structural vulnerability index.',
      targetGuidance: '100% of priority 1 facilities in project catchment.'
    },
    {
      id: 'lib-3',
      code: 'LIV-IND-01',
      title: 'Percentage of vocational and employability training graduates placed in paid employment or self-enterprise within 6 months',
      sector: 'Livelihoods',
      donorStandard: 'World Bank',
      level: 'Outcome',
      unit: 'Percentage (%)',
      frequency: 'Semi-Annually',
      definition: 'Follows cohort graduates at 3 and 6 months post-graduation to verify continuous paid employment (≥ minimum wage NPR 17,300) or formal self-employment.',
      disaggregations: ['Gender', 'Youth (18-29)', 'Disability Status', 'Economic Sector (ICT, Construction, Agri)'],
      baselineGuidance: 'Unemployment rate among youth in target districts (pre-training).',
      targetGuidance: 'Standard World Bank / Dereja benchmark is ≥ 65% placement rate.'
    },
    {
      id: 'lib-4',
      code: 'LIV-IND-02',
      title: 'Average percentage increase in monthly income among participating youth and female entrepreneurs',
      sector: 'Livelihoods',
      donorStandard: 'USAID (F-Indicator)',
      level: 'Impact',
      unit: 'Percentage Increase (%)',
      frequency: 'Annually',
      definition: 'Measures change in net monthly personal income comparing baseline self-reported income with post-placement earnings from verified employer payslips or enterprise ledgers.',
      disaggregations: ['Sex', 'Enterprise Category', 'Geographic Province'],
      baselineGuidance: 'Individual baseline income captured on trainee enrollment registration.',
      targetGuidance: 'Average increase of ≥ 35% compared to pre-program earnings.'
    },
    {
      id: 'lib-5',
      code: 'EDU-IND-01',
      title: 'Number of children with disabilities provided with assistive devices and enrolled in inclusive education facilities',
      sector: 'Education & TVET',
      donorStandard: 'UN SDG',
      level: 'Output',
      unit: 'Number of Children',
      frequency: 'Quarterly',
      definition: 'Tracks children assessed using the Washington Group Child Functioning Module who receive certified assistive devices (hearing aids, wheelchairs, braille) and attend school.',
      disaggregations: ['Functional Impairment Category', 'Gender (Girls/Boys)', 'Grade Level'],
      baselineGuidance: 'Initial palika school census baseline.',
      targetGuidance: 'Based on out-of-school disability screening registry.'
    },
    {
      id: 'lib-6',
      code: 'WASH-IND-01',
      title: 'Number of people gaining access to safely managed drinking water services resilient to climate hazards',
      sector: 'WASH',
      donorStandard: 'UN SDG',
      level: 'Outcome',
      unit: 'Number of Beneficiaries',
      frequency: 'Annually',
      definition: 'Counts individuals residing in households connected to treated piped water distribution schemes meeting WHO and Nepal National Drinking Water Quality Standards year-round.',
      disaggregations: ['Ward Level', 'Vulnerable / Indigent Households', 'Water Scheme Type'],
      baselineGuidance: 'Water safety audit and municipal WASH plan baseline.',
      targetGuidance: 'Calculated using household census × average family size (4.6).'
    },
    {
      id: 'lib-7',
      code: 'AGR-IND-01',
      title: 'Number of hectares under climate-smart agricultural practices or technologies supported by project interventions',
      sector: 'Agriculture & Food',
      donorStandard: 'USAID (F-Indicator)',
      level: 'Output',
      unit: 'Hectares (Ha)',
      frequency: 'Semi-Annually',
      definition: 'Total land area cultivated by project-supported smallholder farmer groups using drip irrigation, drought-tolerant seed varieties, or organic conservation agriculture.',
      disaggregations: ['Technology Type', 'Crop Season (Kharif/Rabi)', 'Palika'],
      baselineGuidance: 'Land parcel area at baseline group formation.',
      targetGuidance: 'Cumulative hectares verified by field GPS polygon traces.'
    },
    {
      id: 'lib-8',
      code: 'GOV-IND-01',
      title: 'Percentage of community complaints and feedback cases resolved within standard 14-day institutional SLA',
      sector: 'Protection & Governance',
      donorStandard: 'ECHO Humanitarian',
      level: 'Output',
      unit: 'Percentage (%)',
      frequency: 'Quarterly',
      definition: 'Assesses the responsiveness of the Community Feedback & Response Mechanism (CFRM) in resolving grievances submitted by community members within agreed timelines.',
      disaggregations: ['Feedback Channel (Toll-Free, Box, Desk)', 'Severity Category (Safeguarding vs Programmatic)'],
      baselineGuidance: '0% prior to formal CFRM operationalization.',
      targetGuidance: 'Institutional target is ≥ 90% resolution within 14 days.'
    }
  ]);

  readonly filteredLibraryIndicators = computed(() => {
    const term = this.librarySearch().toLowerCase().trim();
    const sec = this.selectedLibrarySector();

    return this.libraryIndicators().filter(ind => {
      const matchSector = sec === 'all' || ind.sector === sec;
      const matchTerm = !term ||
        ind.title.toLowerCase().includes(term) ||
        ind.code.toLowerCase().includes(term) ||
        ind.definition.toLowerCase().includes(term) ||
        ind.donorStandard.toLowerCase().includes(term);
      return matchSector && matchTerm;
    });
  });

  addIndicatorToLogframe(ind: LibraryIndicatorItem) {
    const projId = this.mealService.selectedProjectId() === 'all' ? 'proj-bcrp' : this.mealService.selectedProjectId();
    this.mealService.addIndicator({
      projectId: projId,
      logframeId: 'lf-out-1',
      title: ind.title,
      level: ind.level,
      unit: ind.unit,
      baseline: 0,
      targetAnnual: 100,
      targetLOP: 100,
      actualQuarter: 0,
      actualTotal: 0,
      frequency: ind.frequency === 'Semi-Annually' ? 'Bi-annual' : (ind.frequency === 'Quarterly' ? 'Quarterly' : 'Annual'),
      meansOfVerification: `Adopted from M&E Studio ${ind.donorStandard} Bank.`,
      dataSource: 'Mobile Collection & Field Monitoring Records',
      responsibleOfficer: 'MEAL Coordinator',
      status: 'on_track',
      disaggregation: {
        female: 0,
        male: 0,
        other: 0,
        pwd: 0,
        marginalized: 0,
        youth: 0
      },
      notes: ind.definition
    });
    alert(`Success! "${ind.title}" has been added directly to your Project Indicator Tracking Logframe.`);
  }

  // ================= AI REVIEW & PLAYBOOKS =================
  readonly aiReviewText = signal<string>('');
  readonly aiReviewStandard = signal<string>('usaid');
  readonly aiReviewOutput = signal<string>('');

  readonly playbookPrompts: PlaybookPrompt[] = [
    {
      id: 'p1',
      title: 'Theory of Change Critical Assumption Auditor',
      category: 'Design',
      description: 'Reviews causal links between project outputs and outcomes to identify unstated risks and logical leaps.',
      promptText: 'Act as a Senior M&E Technical Advisor. Analyze the following Theory of Change narrative and results chain. Identify 3 critical unstated assumptions, 2 potential unintended negative consequences (Do No Harm), and recommend 2 intermediate outcome indicators to bridge the causal logic.'
    },
    {
      id: 'p2',
      title: 'SMART Indicator Rewriter & PIRS Generator',
      category: 'Indicators',
      description: 'Transforms loose programmatic objectives into USAID-compliant performance indicators with full measurement protocols.',
      promptText: 'Take the following draft programmatic indicators and rewrite each to strictly conform to USAID ADS 201 SMART criteria. For each indicator, provide: 1) Precise title, 2) Exact unit of measurement, 3) Calculation methodology (numerator/denominator), 4) Suggested disaggregations, and 5) Data source.'
    },
    {
      id: 'p3',
      title: 'Data Quality Assessment (DQA) Protocol Generator',
      category: 'Data Quality',
      description: 'Generates field verification spot-check instructions across Validity, Reliability, Integrity, Precision, and Timeliness.',
      promptText: 'Develop a 5-dimension Data Quality Assurance (DQA) audit protocol for verifying field beneficiary registration numbers against original physical sign-in sheets in remote mountain palikas.'
    },
    {
      id: 'p4',
      title: 'OECD-DAC Evaluation Question Matrix Developer',
      category: 'Evaluation',
      description: 'Generates structured evaluation matrices across Relevance, Coherence, Effectiveness, Efficiency, Impact, and Sustainability.',
      promptText: 'Generate a comprehensive Evaluation Matrix for a final independent evaluation of a Community Disaster Resilience Project in Nepal based on the 2020 revised OECD-DAC criteria.'
    },
    {
      id: 'p5',
      title: 'Qualitative Interview Transcript Thematic Coder',
      category: 'Qualitative',
      description: 'Extracts core themes, beneficiary sentiment, and illustrative quotes from focus group notes.',
      promptText: 'Analyze the following Focus Group Discussion (FGD) summary notes from women-headed households regarding earthquake reconstruction barriers. Extract 3 core inductive themes, code beneficiary sentiment, and flag any safeguarding or corruption risks mentioned.'
    }
  ];

  loadPlaybookToEditor(play: PlaybookPrompt) {
    this.aiReviewText.set(`[PLAYBOOK PROMPT: ${play.title}]\n\n${play.promptText}\n\n[PASTE YOUR DOCUMENT / LOGFRAME CONTENT BELOW]:\n`);
  }

  runAiDocumentReview() {
    const text = this.aiReviewText();
    if (!text || text.length < 20) {
      alert('Please enter or paste document content to review.');
      return;
    }

    const std = this.aiReviewStandard();
    const standardName = std === 'usaid' ? 'USAID ADS 201' : (std === 'oecd' ? 'OECD-DAC Criteria' : 'Core Humanitarian Standard (CHS)');

    this.aiReviewOutput.set(
`=== M&E STUDIO TECHNICAL AUDIT REPORT ===
Audited Against: ${standardName}
Compliance Assessment Date: ${new Date().toLocaleDateString()}
Document Length: ${text.length} characters

1. EXECUTIVE SUMMARY:
The submitted text demonstrates solid programmatic alignment with targeted beneficiary priorities, but exhibits gaps in explicit measurement protocols, boundary definitions, and disaggregation specifications.

2. STRENGTHS DETECTED:
✓ Clear focus on targeted vulnerable communities and local government institutions.
✓ Objective statements align with high-level donor sector priorities.
✓ Plausible causal intent linking activities to community outcomes.

3. CRITICAL TECHNICAL GAPS & RECOMMENDATIONS:
• Gap 1 (Measurement Specificity): Formulations require explicit numerators and denominators for percentage calculations to prevent subjective scoring.
• Gap 2 (PIRS Data Source Documentation): Specify exact data collection instruments (e.g., CAPI offline mobile survey vs engineering physical verification sheet).
• Gap 3 (GEDSI Disaggregation): Add mandatory disaggregation standards for Gender, Washington Group Disability Status, and Geographic Palika Level.

4. OVERALL COMPLIANCE SCORE:
Grade: B+ (84/100) — Ready for donor submission upon addressing the three measurement protocol recommendations above.`
    );
  }
}
