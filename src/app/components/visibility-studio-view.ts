import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { VisibilityAsset } from '../models/meal.model';

@Component({
  selector: 'app-visibility-studio-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Communication & Visibility Studio</span>
            <span aria-hidden="true">·</span>
            <span>Canva-Style Design Toolkit</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            MEAL Visibility & Graphic Asset Studio
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">
            Design donor-compliant project factsheets, safety campaign posters, social cards, and infographics grounded in verified MEAL metrics.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            (click)="printCanvas()"
            class="px-3.5 py-2 bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs">
            <mat-icon class="text-xs">file_download</mat-icon>
            <span>Export / Print Graphic</span>
          </button>
        </div>
      </div>

      <!-- Studio Layout: Controls (Left) and Live Visual Canvas (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Controls & Customizer Panel (4 Cols) -->
        <div class="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-5">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Graphic Format & Branding Controls
          </h2>

          <!-- Template Presets -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-2">Select Design Template</label>
            <div class="grid grid-cols-2 gap-2">
              @for (asset of mealService.visibilityAssets(); track asset.id) {
                <button
                  type="button"
                  (click)="loadTemplate(asset)"
                  [class]="selectedAsset().id === asset.id ? 'border-teal-800 bg-teal-50/40 text-teal-950 font-bold' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'"
                  class="p-2 border rounded-lg text-left text-xs transition-colors">
                  <span class="block text-[11px] text-slate-400 font-mono">{{ asset.type }}</span>
                  <span class="truncate block">{{ asset.title }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Color Theme Picker -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-2">Palette Theme</label>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="setColor('#0f766e')"
                [class.ring-2]="selectedColor() === '#0f766e'"
                class="w-7 h-7 rounded-full bg-teal-700 ring-offset-2 ring-teal-700 transition-all"></button>
              <button
                type="button"
                (click)="setColor('#b91c1c')"
                [class.ring-2]="selectedColor() === '#b91c1c'"
                class="w-7 h-7 rounded-full bg-red-700 ring-offset-2 ring-red-700 transition-all"></button>
              <button
                type="button"
                (click)="setColor('#1e3a8a')"
                [class.ring-2]="selectedColor() === '#1e3a8a'"
                class="w-7 h-7 rounded-full bg-blue-900 ring-offset-2 ring-blue-900 transition-all"></button>
              <button
                type="button"
                (click)="setColor('#065f46')"
                [class.ring-2]="selectedColor() === '#065f46'"
                class="w-7 h-7 rounded-full bg-emerald-800 ring-offset-2 ring-emerald-800 transition-all"></button>
              <button
                type="button"
                (click)="setColor('#312e81')"
                [class.ring-2]="selectedColor() === '#312e81'"
                class="w-7 h-7 rounded-full bg-indigo-900 ring-offset-2 ring-indigo-900 transition-all"></button>
            </div>
          </div>

          <!-- Image Asset Selector -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-2">Featured Photography</label>
            <div class="grid grid-cols-3 gap-2">
              <div
                (click)="setImage('/assets/images/drr_mason_training_1790145551465.jpg')"
                [class.ring-2]="selectedImage() === '/assets/images/drr_mason_training_1790145551465.jpg'"
                class="h-16 rounded-lg overflow-hidden border border-slate-200 cursor-pointer ring-teal-700">
                <img src="/assets/images/drr_mason_training_1790145551465.jpg" alt="Masons" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
              </div>
              <div
                (click)="setImage('/assets/images/drr_school_safety_drill_1790145563154.jpg')"
                [class.ring-2]="selectedImage() === '/assets/images/drr_school_safety_drill_1790145563154.jpg'"
                class="h-16 rounded-lg overflow-hidden border border-slate-200 cursor-pointer ring-teal-700">
                <img src="/assets/images/drr_school_safety_drill_1790145563154.jpg" alt="School Drill" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
              </div>
              <div
                (click)="setImage('/assets/images/drr_community_resilience_meeting_1790145573971.jpg')"
                [class.ring-2]="selectedImage() === '/assets/images/drr_community_resilience_meeting_1790145573971.jpg'"
                class="h-16 rounded-lg overflow-hidden border border-slate-200 cursor-pointer ring-teal-700">
                <img src="/assets/images/drr_community_resilience_meeting_1790145573971.jpg" alt="Community" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
              </div>
            </div>
          </div>

          <!-- Live Text Modifiers -->
          <form [formGroup]="studioForm" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Headline</label>
              <input
                type="text"
                formControlName="headline"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Sub-Headline</label>
              <input
                type="text"
                formControlName="subtitle"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Highlight Callout Text</label>
              <textarea
                formControlName="highlight"
                rows="2"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700"></textarea>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Donor Co-Branding</label>
              <input
                type="text"
                formControlName="donorLogo"
                placeholder="e.g. USAID / BHA, FCDO, UNICEF, ECHO"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-700" />
            </div>
          </form>
        </div>

        <!-- Live Visual Canvas Area (8 Cols) -->
        <div class="lg:col-span-8 space-y-4">
          <div class="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>CANVAS PREVIEW · 300 DPI VECTOR READY</span>
            <span>FORMAT: {{ selectedAsset().type | uppercase }}</span>
          </div>

          <!-- Graphic Poster / Factsheet Layout Box -->
          <div
            id="visibility-print-target"
            class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col transition-all text-slate-900">
            
            <!-- Graphic Top Header with Palette Accent -->
            <div
              [style.backgroundColor]="selectedColor()"
              class="p-6 sm:p-8 text-white flex flex-col justify-between gap-4">
              <div class="flex items-center justify-between border-b border-white/20 pb-4">
                <div class="flex items-center gap-2">
                  <span class="w-8 h-8 rounded bg-white text-slate-900 flex items-center justify-center font-black text-sm">
                    M
                  </span>
                  <div>
                    <span class="font-black tracking-tight text-sm uppercase block">MEAL Suite Platform</span>
                    <span class="text-[11px] text-white/80 block">Disaster Risk Reduction & MEAL Portfolio</span>
                  </div>
                </div>

                <div class="text-right text-xs bg-white/10 px-3 py-1 rounded border border-white/20 font-medium">
                  {{ studioForm.value.donorLogo || 'USAID / BHA Partner' }}
                </div>
              </div>

              <div class="pt-2">
                <span class="text-xs font-mono uppercase tracking-widest text-white/80 block mb-1">Verified Impact Factsheet</span>
                <h1 class="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  {{ studioForm.value.headline }}
                </h1>
                <p class="text-sm text-white/90 mt-1 max-w-xl leading-relaxed">
                  {{ studioForm.value.subtitle }}
                </p>
              </div>
            </div>

            <!-- Visual Hero Imagery -->
            <div class="relative h-64 sm:h-72 w-full bg-slate-900">
              <img
                [src]="selectedImage()"
                alt="Visibility graphic photography"
                class="w-full h-full object-cover opacity-95"
                referrerpolicy="no-referrer" />
              <div class="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded font-mono">
                Field Evidence: Certified Seismic Intervention
              </div>
            </div>

            <!-- Stats Ribbon (Tabular Numerals) -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-50 border-y border-slate-200 text-center">
              @for (st of selectedAsset().stats; track st.label) {
                <div class="space-y-0.5">
                  <span class="text-xl sm:text-2xl font-mono font-black text-slate-900 tabular-nums">
                    {{ st.value }}
                  </span>
                  <span class="text-[11px] text-slate-500 uppercase tracking-wider block font-medium">
                    {{ st.label }}
                  </span>
                </div>
              }
            </div>

            <!-- Highlight Quote / Body Callout -->
            <div class="p-6 sm:p-8 space-y-4">
              <div class="border-l-4 p-4 rounded-r-xl" [style.borderColor]="selectedColor()" [style.backgroundColor]="selectedColor() + '10'">
                <p class="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed italic">
                  "{{ studioForm.value.highlight }}"
                </p>
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 gap-2">
                <span>Contact: MEAL Directorate · meal&#64;mealsuite.org · www.mealsuite.org</span>
                <span class="font-mono">Verified Baseline & DQA Audit Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VisibilityStudioView {
  readonly mealService = inject(MealDataService);

  readonly selectedAsset = signal<VisibilityAsset>(this.mealService.visibilityAssets()[0]);
  readonly selectedColor = signal<string>('#0f766e');
  readonly selectedImage = signal<string>('/assets/images/drr_mason_training_1790145551465.jpg');

  readonly studioForm = new FormGroup({
    headline: new FormControl(this.selectedAsset().title, [Validators.required]),
    subtitle: new FormControl(this.selectedAsset().subtitle, [Validators.required]),
    highlight: new FormControl(this.selectedAsset().highlightText, [Validators.required]),
    donorLogo: new FormControl(this.selectedAsset().donorLogo)
  });

  loadTemplate(asset: VisibilityAsset) {
    this.selectedAsset.set(asset);
    this.selectedColor.set(asset.primaryColor);
    this.selectedImage.set(asset.imageUrl);
    this.studioForm.patchValue({
      headline: asset.title,
      subtitle: asset.subtitle,
      highlight: asset.highlightText,
      donorLogo: asset.donorLogo
    });
  }

  setColor(c: string) {
    this.selectedColor.set(c);
  }

  setImage(img: string) {
    this.selectedImage.set(img);
  }

  printCanvas() {
    window.print();
  }
}
