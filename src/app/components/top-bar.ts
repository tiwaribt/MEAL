import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';

@Component({
  selector: 'app-top-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      <!-- Zone 1, 2, 3 Contract: Single row layout -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        <!-- Zone 1: Single text element wordmark -->
        <a
          href="#"
          (click)="mealService.setActiveTab('dashboard'); $event.preventDefault()"
          class="flex items-center gap-2 text-slate-900 font-bold tracking-tight text-lg hover:text-teal-900 transition-colors shrink-0">
          <span class="w-8 h-8 rounded-lg bg-teal-900 text-white flex items-center justify-center font-black text-sm shadow-xs">
            M
          </span>
          <span class="whitespace-nowrap">MEAL Suite</span>
        </a>

        <!-- Zone 2: Navigation Links (dynamic from adminMenuItems signal) -->
        <nav class="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-medium text-slate-600 overflow-x-auto no-scrollbar">
          @for (item of enabledMenuItems(); track item.id) {
            <button
              type="button"
              (click)="navigateTo(item.path)"
              [class]="isCurrentTab(item.path) ? 'text-teal-900 font-bold border-b-2 border-teal-800' : 'text-slate-600 hover:text-slate-900 border-b-2 border-transparent'"
              class="px-2 xl:px-2.5 py-4 transition-colors whitespace-nowrap flex items-center gap-1.5">
              <span>{{ item.title }}</span>
              @if (item.badge) {
                <span class="px-1.5 py-0.2 rounded-full text-[9px] font-bold"
                  [class]="item.badge === 'Excel/Zip' ? 'bg-indigo-100 text-indigo-800' : (item.badge === 'New' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800')">
                  {{ item.badge }}
                </span>
              }
            </button>
          }
        </nav>

        <!-- Zone 3: Primary Actions (Project Filter & MEAL AI Trigger) -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <!-- Project Filter Dropdown -->
          <div class="relative">
            <select
              [value]="mealService.selectedProjectId()"
              (change)="onProjectChange($event)"
              class="text-xs bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-300/80 rounded-lg py-1.5 pl-2.5 pr-7 font-medium focus:outline-hidden focus:ring-1 focus:ring-teal-700 cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
              aria-label="Filter by Project">
              <option value="all">All Projects Portfolio</option>
              @for (proj of mealService.projects(); track proj.id) {
                <option [value]="proj.id">{{ proj.code }} - {{ proj.name }}</option>
              }
            </select>
          </div>

          <!-- MEAL AI Assistant Action Button -->
          <button
            type="button"
            (click)="openAiAssistant.emit()"
            class="px-3 py-1.5 bg-teal-900 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
            title="Open MEAL AI Technical Assistant">
            <mat-icon class="text-xs">auto_awesome</mat-icon>
            <span class="hidden sm:inline">MEAL AI</span>
          </button>

          <!-- Mobile navigation menu button -->
          <button
            type="button"
            (click)="toggleMobileMenu()"
            class="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
            aria-label="Toggle Navigation">
            <mat-icon class="text-sm">{{ mobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation -->
      @if (mobileMenuOpen) {
        <div class="lg:hidden border-t border-slate-200 bg-slate-50 px-4 py-3 space-y-1">
          @for (item of enabledMenuItems(); track item.id) {
            <button
              (click)="selectTabAndClose(item.path)"
              [class]="isCurrentTab(item.path) ? 'bg-teal-50 text-teal-900 font-bold' : 'text-slate-700 hover:bg-white font-medium'"
              class="flex items-center justify-between w-full text-left px-3 py-2 text-xs rounded-md">
              <span class="flex items-center gap-2">
                <mat-icon class="text-xs text-slate-400">{{ item.icon }}</mat-icon>
                <span>{{ item.title }}</span>
              </span>
              @if (item.badge) {
                <span class="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-teal-100 text-teal-800">
                  {{ item.badge }}
                </span>
              }
            </button>
          }
        </div>
      }
    </header>
  `
})
export class TopBar {
  readonly mealService = inject(MealDataService);
  readonly openAiAssistant = output<void>();

  mobileMenuOpen = false;

  readonly enabledMenuItems = () => {
    return this.mealService.adminMenuItems().filter(i => i.enabled);
  };

  private normalizePath(path: string): string {
    if (path === 'visits') return 'field-visits';
    if (path === 'dqa') return 'verification';
    if (path === 'cfrm') return 'accountability';
    if (path === 'archive') return 'evidence';
    return path;
  }

  isCurrentTab(path: string): boolean {
    const normalized = this.normalizePath(path);
    return this.mealService.activeTab() === normalized;
  }

  navigateTo(path: string) {
    const target = this.normalizePath(path);
    this.mealService.setActiveTab(target);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  selectTabAndClose(path: string) {
    this.navigateTo(path);
    this.mobileMenuOpen = false;
  }

  onProjectChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.mealService.setProjectFilter(val);
  }
}
