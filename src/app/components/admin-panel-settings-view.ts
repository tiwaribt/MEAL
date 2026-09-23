import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from '../services/meal-data.service';
import { RolePermission } from '../models/meal.model';

@Component({
  selector: 'app-admin-panel-settings-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <!-- Admin Header -->
      <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="w-12 h-12 rounded-2xl bg-teal-900 text-white flex items-center justify-center font-bold shadow-xs">
              <mat-icon class="text-2xl">admin_panel_settings</mat-icon>
            </span>
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold uppercase tracking-wider">
                  Admin & Configuration Hub
                </span>
                <span class="text-xs text-slate-400">·</span>
                <span class="text-xs text-slate-500 font-medium">Enterprise NGO / INGO Architecture</span>
              </div>
              <h1 class="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                System Administration & Metadata Designer
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="saveNotification.set('Configuration changes synced successfully across the suite!')"
              class="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2">
              <mat-icon class="text-xs">save</mat-icon>
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        @if (saveNotification()) {
          <div class="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
            <div class="flex items-center gap-2">
              <mat-icon class="text-sm">check_circle</mat-icon>
              <span>{{ saveNotification() }}</span>
            </div>
            <button (click)="saveNotification.set(null)" class="text-emerald-700 hover:text-emerald-900">
              <mat-icon class="text-xs">close</mat-icon>
            </button>
          </div>
        }

        <!-- Admin Navigation Sub-Tabs -->
        <div class="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto no-scrollbar text-xs">
          <button
            type="button"
            (click)="activeAdminTab.set('org')"
            [class]="activeAdminTab() === 'org' ? 'bg-teal-900 text-white font-semibold shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'"
            class="px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap">
            <mat-icon class="text-xs">domain</mat-icon>
            <span>Organization Profile</span>
          </button>

          <button
            type="button"
            (click)="activeAdminTab.set('menus')"
            [class]="activeAdminTab() === 'menus' ? 'bg-teal-900 text-white font-semibold shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'"
            class="px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap">
            <mat-icon class="text-xs">menu_open</mat-icon>
            <span>Navigation Menus ({{ mealService.adminMenuItems().length }})</span>
          </button>

          <button
            type="button"
            (click)="activeAdminTab.set('fields')"
            [class]="activeAdminTab() === 'fields' ? 'bg-teal-900 text-white font-semibold shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'"
            class="px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap">
            <mat-icon class="text-xs">tune</mat-icon>
            <span>Custom Field Designer ({{ mealService.customFields().length }})</span>
          </button>

          <button
            type="button"
            (click)="activeAdminTab.set('indicators')"
            [class]="activeAdminTab() === 'indicators' ? 'bg-teal-900 text-white font-semibold shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'"
            class="px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap">
            <mat-icon class="text-xs">speed</mat-icon>
            <span>Indicator Builder ({{ mealService.customIndicators().length }})</span>
          </button>

          <button
            type="button"
            (click)="activeAdminTab.set('rbac')"
            [class]="activeAdminTab() === 'rbac' ? 'bg-teal-900 text-white font-semibold shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'"
            class="px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap">
            <mat-icon class="text-xs">security</mat-icon>
            <span>RBAC & Permissions ({{ mealService.rolePermissions().length }})</span>
          </button>
        </div>
      </div>

      <!-- TAB 1: Organization Profile & Branding -->
      @if (activeAdminTab() === 'org') {
        <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs text-xs space-y-6">
          <div>
            <h2 class="text-base font-bold text-slate-900 tracking-tight">
              Organization Identity & Sectoral Compliance
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Customize the system branding, legal status, and donor regulatory frameworks to fit any INGO, local NGO, or non-profit entity.
            </p>
          </div>

          <form (submit)="onUpdateOrgProfile($event)" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Organization Full Legal Name *</label>
                <input
                  name="name"
                  type="text"
                  [value]="org().name"
                  required
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Acronym / Short Name *</label>
                <input
                  name="acronym"
                  type="text"
                  [value]="org().acronym"
                  required
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Organization Type *</label>
                <select
                  name="orgType"
                  [value]="org().orgType"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                  <option value="INGO">INGO (International NGO)</option>
                  <option value="National NGO">National NGO (Nepal Registered)</option>
                  <option value="Non-Profit">Non-Profit Technical Foundation</option>
                  <option value="UN Agency">UN Agency / Implementing Partner</option>
                  <option value="Government Department">Government Disaster Authority</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Social Welfare Council (SWC) / Reg. No.</label>
                <input
                  name="registrationNumber"
                  type="text"
                  [value]="org().registrationNumber"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Country Office Headquarters</label>
                <input
                  name="countryOffice"
                  type="text"
                  [value]="org().countryOffice"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Operational Currency</label>
                <select
                  name="currency"
                  [value]="org().currency"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                  <option value="USD ($)">USD ($) - United States Dollar</option>
                  <option value="NPR (रू)">NPR (रू) - Nepalese Rupee</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Fiscal Year Cycle</label>
                <input
                  name="fiscalYear"
                  type="text"
                  [value]="org().fiscalYear"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">MEAL Directorate Focal Email</label>
                <input
                  name="focalEmail"
                  type="email"
                  [value]="org().focalEmail"
                  class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">
                Active Compliance Standards (comma separated)
              </label>
              <input
                name="complianceFrameworks"
                type="text"
                [value]="org().complianceFrameworks.join(', ')"
                class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
              <span class="text-[10px] text-slate-400 mt-1 block">
                Examples: USAID ADS 201, FCDO Smart Rules, Core Humanitarian Standard (CHS), ECHO Quality Benchmarks
              </span>
            </div>

            <div class="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                class="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5">
                <mat-icon class="text-xs">check</mat-icon>
                <span>Save Profile Settings</span>
              </button>
            </div>
          </form>
        </div>
      }

      <!-- TAB 2: Navigation & Custom Menus Designer -->
      @if (activeAdminTab() === 'menus') {
        <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs text-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-base font-bold text-slate-900 tracking-tight">
                Navigation Menu Manager & Custom Tab Builder
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Add custom menus, reorder tabs, or toggle visibility of modules to tailor the suite for field enumerators or executives.
              </p>
            </div>

            <button
              type="button"
              (click)="openAddMenuModal.set(true)"
              class="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start">
              <mat-icon class="text-xs">add</mat-icon>
              <span>Add Custom Menu</span>
            </button>
          </div>

          <!-- Menu Items List Table -->
          <div class="border border-slate-200 rounded-xl overflow-hidden">
            <table class="w-full text-left divide-y divide-slate-200">
              <thead class="bg-slate-50 text-slate-600 font-bold text-[11px]">
                <tr>
                  <th class="px-3 py-2.5 w-12 text-center">Order</th>
                  <th class="px-3 py-2.5">Icon</th>
                  <th class="px-3 py-2.5">Menu Title</th>
                  <th class="px-3 py-2.5">Route / ID</th>
                  <th class="px-3 py-2.5">Badge</th>
                  <th class="px-3 py-2.5 text-center">Status</th>
                  <th class="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white">
                @for (item of mealService.adminMenuItems(); track item.id; let idx = $index) {
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="px-3 py-2.5 text-center font-mono font-bold text-slate-500">
                      {{ item.order }}
                    </td>
                    <td class="px-3 py-2.5">
                      <span class="w-7 h-7 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
                        <mat-icon class="text-xs">{{ item.icon }}</mat-icon>
                      </span>
                    </td>
                    <td class="px-3 py-2.5 font-bold text-slate-800">
                      {{ item.title }}
                      @if (item.isCustom) {
                        <span class="ml-1 px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[9px] font-semibold">Custom</span>
                      }
                    </td>
                    <td class="px-3 py-2.5 font-mono text-slate-500 text-[11px]">
                      {{ item.path }}
                    </td>
                    <td class="px-3 py-2.5">
                      @if (item.badge) {
                        <span class="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold text-[10px]">
                          {{ item.badge }}
                        </span>
                      } @else {
                        <span class="text-slate-300">-</span>
                      }
                    </td>
                    <td class="px-3 py-2.5 text-center">
                      <button
                        type="button"
                        (click)="mealService.toggleAdminMenuItem(item.id)"
                        [class]="item.enabled ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-300'"
                        class="px-2.5 py-0.5 rounded-full border text-[10px] font-bold transition-colors">
                        {{ item.enabled ? 'Active' : 'Disabled' }}
                      </button>
                    </td>
                    <td class="px-3 py-2.5 text-right">
                      <div class="inline-flex items-center gap-1">
                        <button
                          type="button"
                          [disabled]="idx === 0"
                          (click)="mealService.reorderAdminMenuItem(item.id, 'up')"
                          class="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                          title="Move Up">
                          <mat-icon class="text-xs">arrow_upward</mat-icon>
                        </button>
                        <button
                          type="button"
                          [disabled]="idx === mealService.adminMenuItems().length - 1"
                          (click)="mealService.reorderAdminMenuItem(item.id, 'down')"
                          class="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                          title="Move Down">
                          <mat-icon class="text-xs">arrow_downward</mat-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Add Custom Menu Modal -->
          @if (openAddMenuModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-xs">
                <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 class="text-base font-bold text-slate-900">Add New Navigation Menu</h3>
                  <button (click)="openAddMenuModal.set(false)" class="p-1 text-slate-400 hover:text-slate-700">
                    <mat-icon class="text-sm">close</mat-icon>
                  </button>
                </div>

                <form (submit)="onSaveCustomMenu($event)" class="space-y-4">
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Menu Title *</label>
                    <input
                      name="title"
                      type="text"
                      required
                      placeholder="e.g. GIS Spatial Risk Maps"
                      class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Material Icon Name *</label>
                    <input
                      name="icon"
                      type="text"
                      required
                      value="map"
                      placeholder="e.g. map, insights, layers, checklist"
                      class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Route Path / Identifier *</label>
                    <input
                      name="path"
                      type="text"
                      required
                      placeholder="e.g. gis-maps"
                      class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Badge Text (Optional)</label>
                    <input
                      name="badge"
                      type="text"
                      placeholder="e.g. GIS, Beta, 2026"
                      class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                  </div>

                  <div class="pt-3 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      type="button"
                      (click)="openAddMenuModal.set(false)"
                      class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl shadow-xs">
                      Create Menu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          }
        </div>
      }

      <!-- TAB 3: Custom Field Designer -->
      @if (activeAdminTab() === 'fields') {
        <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs text-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-base font-bold text-slate-900 tracking-tight">
                M&E Custom Field Designer
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Extend core schemas with custom variables (e.g., Washington Group disability, vulnerability scoring, environmental checklists).
              </p>
            </div>

            <button
              type="button"
              (click)="openAddFieldModal.set(true)"
              class="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start">
              <mat-icon class="text-xs">add</mat-icon>
              <span>Add Custom Field</span>
            </button>
          </div>

          <!-- Custom Fields Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (field of mealService.customFields(); track field.id) {
              <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-colors flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] uppercase">
                      {{ field.targetModule }}
                    </span>
                    <span class="font-mono text-[10px] text-slate-400">
                      {{ field.fieldType }}
                    </span>
                  </div>

                  <h3 class="font-bold text-slate-800 text-xs sm:text-sm">
                    {{ field.label }}
                  </h3>

                  @if (field.disaggregationDimension) {
                    <p class="text-[11px] text-teal-700 font-medium mt-1">
                      Dim: {{ field.disaggregationDimension }}
                    </p>
                  }

                  @if (field.options) {
                    <div class="mt-2 flex flex-wrap gap-1">
                      @for (opt of field.options; track opt) {
                        <span class="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 text-[10px]">
                          {{ opt }}
                        </span>
                      }
                    </div>
                  }
                </div>

                <div class="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span [class]="field.required ? 'text-rose-600 font-bold' : 'text-slate-400'" class="text-[10px]">
                    {{ field.required ? 'Mandatory Field' : 'Optional' }}
                  </span>
                  <button
                    type="button"
                    (click)="mealService.deleteCustomField(field.id)"
                    class="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                    title="Delete Custom Field">
                    <mat-icon class="text-xs">delete</mat-icon>
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Add Custom Field Modal -->
          @if (openAddFieldModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-xs">
                <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 class="text-base font-bold text-slate-900">Design New Custom Field</h3>
                  <button (click)="openAddFieldModal.set(false)" class="p-1 text-slate-400 hover:text-slate-700">
                    <mat-icon class="text-sm">close</mat-icon>
                  </button>
                </div>

                <form (submit)="onSaveCustomField($event)" class="space-y-4">
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Field Label / Question *</label>
                    <input
                      name="label"
                      type="text"
                      required
                      placeholder="e.g. Household Disaster Vulnerability Score"
                      class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block font-semibold text-slate-700 mb-1">Target Module *</label>
                      <select
                        name="targetModule"
                        class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                        <option value="beneficiaries">Beneficiaries Registry</option>
                        <option value="visits">Field Monitoring Visits</option>
                        <option value="cfrm">CFRM Complaints Log</option>
                        <option value="indicators">Logframe Indicators</option>
                      </select>
                    </div>

                    <div>
                      <label class="block font-semibold text-slate-700 mb-1">Field Type *</label>
                      <select
                        name="fieldType"
                        class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                        <option value="text">Text (Single Line)</option>
                        <option value="number">Number (Integer / Decimal)</option>
                        <option value="select">Dropdown Select (Single choice)</option>
                        <option value="boolean">Boolean (Yes / No toggle)</option>
                        <option value="date">Date Picker</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Options (if dropdown, comma-separated)</label>
                    <input
                      name="options"
                      type="text"
                      placeholder="e.g. Low, Moderate, High, Severe"
                      class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Disaggregation Dimension Tag (Optional)</label>
                    <input
                      name="disaggregationDimension"
                      type="text"
                      placeholder="e.g. Washington Group Short Set"
                      class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                  </div>

                  <div class="flex items-center gap-2">
                    <input
                      name="required"
                      type="checkbox"
                      id="cfRequired"
                      class="rounded text-teal-700 focus:ring-teal-600 h-4 w-4 border-slate-300">
                    <label for="cfRequired" class="font-semibold text-slate-800 cursor-pointer">
                      Mark as Mandatory / Required in entry forms
                    </label>
                  </div>

                  <div class="pt-3 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      type="button"
                      (click)="openAddFieldModal.set(false)"
                      class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl shadow-xs">
                      Save Field
                    </button>
                  </div>
                </form>
              </div>
            </div>
          }
        </div>
      }

      <!-- TAB 4: Indicator Builder -->
      @if (activeAdminTab() === 'indicators') {
        <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs text-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-base font-bold text-slate-900 tracking-tight">
                Sectoral Indicator Builder
              </h2>
              <p class="text-xs text-slate-500 mt-0.5">
                Define customized outcome, output, and impact indicators with explicit donor compliance guidelines and calculation formulas.
              </p>
            </div>

            <button
              type="button"
              (click)="openAddIndicatorModal.set(true)"
              class="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start">
              <mat-icon class="text-xs">add</mat-icon>
              <span>Add Custom Indicator</span>
            </button>
          </div>

          <div class="space-y-4">
            @for (ci of mealService.customIndicators(); track ci.id) {
              <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-colors">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">
                      {{ ci.sector }} · {{ ci.level }}
                    </span>
                    <span class="font-mono text-slate-400 text-[11px]">{{ ci.unit }}</span>
                  </div>

                  <button
                    type="button"
                    (click)="mealService.toggleCustomIndicator(ci.id)"
                    [class]="ci.active ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-500 border-slate-300'"
                    class="px-2.5 py-0.5 rounded-full border text-[10px] font-bold self-start sm:self-auto">
                    {{ ci.active ? 'Active in PIRS' : 'Inactive' }}
                  </button>
                </div>

                <h3 class="font-bold text-slate-800 text-xs sm:text-sm">
                  {{ ci.title }}
                </h3>

                <p class="text-[11px] text-slate-600 mt-1 font-mono bg-white p-2 rounded-lg border border-slate-200">
                  Formula: {{ ci.calculationFormula }}
                </p>

                <div class="mt-3 flex flex-wrap items-center gap-2">
                  <span class="text-[10px] text-slate-500 font-medium">Compliance:</span>
                  @for (rule of ci.donorCompliance; track rule) {
                    <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold text-[10px] border border-blue-200">
                      {{ rule }}
                    </span>
                  }
                  <span class="text-[10px] text-slate-500 font-medium ml-2">Disaggregations:</span>
                  @for (dim of ci.customDisaggregations; track dim) {
                    <span class="px-2 py-0.5 rounded bg-purple-50 text-purple-800 font-semibold text-[10px] border border-purple-200">
                      {{ dim }}
                    </span>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Add Indicator Modal -->
          @if (openAddIndicatorModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <div class="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 text-xs">
                <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 class="text-base font-bold text-slate-900">Define Custom PIRS Indicator</h3>
                  <button (click)="openAddIndicatorModal.set(false)" class="p-1 text-slate-400 hover:text-slate-700">
                    <mat-icon class="text-sm">close</mat-icon>
                  </button>
                </div>

                <form (submit)="onSaveCustomIndicator($event)" class="space-y-4">
                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Indicator Title / Definition *</label>
                    <input
                      name="title"
                      type="text"
                      required
                      placeholder="e.g. Percentage of households with verified seismic disaster survival kits"
                      class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                  </div>

                  <div class="grid grid-cols-3 gap-3">
                    <div>
                      <label class="block font-semibold text-slate-700 mb-1">Sector *</label>
                      <select
                        name="sector"
                        class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                        <option value="Shelter">Shelter & Housing</option>
                        <option value="DRR">Disaster Risk Reduction</option>
                        <option value="Education">Education in Emergencies</option>
                        <option value="Protection">Protection & Safeguarding</option>
                        <option value="WASH">WASH Infrastructure</option>
                        <option value="Livelihoods">Livelihoods & Masons</option>
                      </select>
                    </div>

                    <div>
                      <label class="block font-semibold text-slate-700 mb-1">Result Level *</label>
                      <select
                        name="level"
                        class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                        <option value="Outcome">Outcome</option>
                        <option value="Output">Output</option>
                        <option value="Impact">Impact</option>
                        <option value="Activity">Activity Level</option>
                      </select>
                    </div>

                    <div>
                      <label class="block font-semibold text-slate-700 mb-1">Unit of Measure *</label>
                      <input
                        name="unit"
                        type="text"
                        required
                        value="% of households"
                        class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                    </div>
                  </div>

                  <div>
                    <label class="block font-semibold text-slate-700 mb-1">Calculation Formula *</label>
                    <input
                      name="calculationFormula"
                      type="text"
                      required
                      placeholder="e.g. (Verified kits present / Total target households) * 100"
                      class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block font-semibold text-slate-700 mb-1">Donor Compliance (comma-separated)</label>
                      <input
                        name="donorCompliance"
                        type="text"
                        value="USAID ADS 201, ECHO DRR"
                        class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                    </div>

                    <div>
                      <label class="block font-semibold text-slate-700 mb-1">Disaggregations (comma-separated)</label>
                      <input
                        name="customDisaggregations"
                        type="text"
                        value="Female-Headed, Single-Elderly, Dalit/Marginalized"
                        class="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-teal-700 focus:outline-hidden">
                    </div>
                  </div>

                  <div class="pt-3 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      type="button"
                      (click)="openAddIndicatorModal.set(false)"
                      class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white font-semibold rounded-xl shadow-xs">
                      Register Indicator
                    </button>
                  </div>
                </form>
              </div>
            </div>
          }
        </div>
      }

      <!-- TAB 5: Role-Based Access Control (RBAC) -->
      @if (activeAdminTab() === 'rbac') {
        <div class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs text-xs space-y-6">
          <div>
            <h2 class="text-base font-bold text-slate-900 tracking-tight">
              Role-Based Access Control (RBAC) & Governance Matrix
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Enforce least-privilege security policies across executive leadership, field enumerators, safeguarding officers, and independent donor monitors.
            </p>
          </div>

          <div class="border border-slate-200 rounded-xl overflow-hidden">
            <table class="w-full text-left divide-y divide-slate-200">
              <thead class="bg-slate-50 text-slate-600 font-bold text-[11px]">
                <tr>
                  <th class="px-4 py-3">Role & Responsibility</th>
                  <th class="px-3 py-3 text-center">Active Users</th>
                  <th class="px-3 py-3 text-center">View</th>
                  <th class="px-3 py-3 text-center">Create</th>
                  <th class="px-3 py-3 text-center">Edit</th>
                  <th class="px-3 py-3 text-center">Delete</th>
                  <th class="px-3 py-3 text-center">Export</th>
                  <th class="px-3 py-3 text-center">Approve</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white">
                @for (role of mealService.rolePermissions(); track role.roleId) {
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="px-4 py-3">
                      <span class="font-bold text-slate-800 block">{{ role.roleTitle }}</span>
                      <span class="text-[11px] text-slate-400">{{ role.description }}</span>
                    </td>
                    <td class="px-3 py-3 text-center">
                      <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {{ role.assignedUsersCount }}
                      </span>
                    </td>
                    <td class="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        [checked]="role.canView"
                        (change)="togglePerm(role, 'canView', $any($event.target).checked)"
                        class="rounded text-teal-700 focus:ring-teal-600 h-4 w-4 border-slate-300">
                    </td>
                    <td class="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        [checked]="role.canCreate"
                        (change)="togglePerm(role, 'canCreate', $any($event.target).checked)"
                        class="rounded text-teal-700 focus:ring-teal-600 h-4 w-4 border-slate-300">
                    </td>
                    <td class="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        [checked]="role.canEdit"
                        (change)="togglePerm(role, 'canEdit', $any($event.target).checked)"
                        class="rounded text-teal-700 focus:ring-teal-600 h-4 w-4 border-slate-300">
                    </td>
                    <td class="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        [checked]="role.canDelete"
                        (change)="togglePerm(role, 'canDelete', $any($event.target).checked)"
                        class="rounded text-teal-700 focus:ring-teal-600 h-4 w-4 border-slate-300">
                    </td>
                    <td class="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        [checked]="role.canExport"
                        (change)="togglePerm(role, 'canExport', $any($event.target).checked)"
                        class="rounded text-teal-700 focus:ring-teal-600 h-4 w-4 border-slate-300">
                    </td>
                    <td class="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        [checked]="role.canApprove"
                        (change)="togglePerm(role, 'canApprove', $any($event.target).checked)"
                        class="rounded text-teal-700 focus:ring-teal-600 h-4 w-4 border-slate-300">
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminPanelSettingsView {
  readonly mealService = inject(MealDataService);

  readonly activeAdminTab = signal<'org' | 'menus' | 'fields' | 'indicators' | 'rbac'>('org');
  readonly saveNotification = signal<string | null>(null);

  readonly openAddMenuModal = signal<boolean>(false);
  readonly openAddFieldModal = signal<boolean>(false);
  readonly openAddIndicatorModal = signal<boolean>(false);

  readonly org = this.mealService.orgProfile;

  onUpdateOrgProfile(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const frameworksStr = data.get('complianceFrameworks') as string;
    const frameworks = frameworksStr ? frameworksStr.split(',').map(s => s.trim()).filter(Boolean) : [];

    this.mealService.updateOrgProfile({
      name: data.get('name') as string,
      acronym: data.get('acronym') as string,
      orgType: data.get('orgType') as any,
      registrationNumber: data.get('registrationNumber') as string,
      countryOffice: data.get('countryOffice') as string,
      currency: data.get('currency') as string,
      fiscalYear: data.get('fiscalYear') as string,
      focalEmail: data.get('focalEmail') as string,
      complianceFrameworks: frameworks
    });

    this.saveNotification.set('Organization Profile updated successfully!');
  }

  onSaveCustomMenu(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    this.mealService.addCustomAdminMenuItem({
      title: data.get('title') as string,
      icon: (data.get('icon') as string) || 'menu',
      path: data.get('path') as string,
      badge: (data.get('badge') as string) || undefined,
      enabled: true,
      order: this.mealService.adminMenuItems().length + 1
    });

    this.openAddMenuModal.set(false);
    this.saveNotification.set('New custom menu item created!');
  }

  onSaveCustomField(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const optionsStr = data.get('options') as string;
    const options = optionsStr ? optionsStr.split(',').map(s => s.trim()).filter(Boolean) : undefined;

    this.mealService.addCustomField({
      label: data.get('label') as string,
      targetModule: data.get('targetModule') as any,
      fieldType: data.get('fieldType') as any,
      required: data.get('required') === 'on',
      options,
      disaggregationDimension: (data.get('disaggregationDimension') as string) || undefined
    });

    this.openAddFieldModal.set(false);
    this.saveNotification.set('Custom field saved and added to data schema!');
  }

  onSaveCustomIndicator(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);

    const compStr = data.get('donorCompliance') as string;
    const disaggStr = data.get('customDisaggregations') as string;

    this.mealService.addCustomIndicator({
      title: data.get('title') as string,
      sector: data.get('sector') as any,
      level: data.get('level') as any,
      unit: data.get('unit') as string,
      calculationFormula: data.get('calculationFormula') as string,
      donorCompliance: compStr ? compStr.split(',').map(s => s.trim()).filter(Boolean) : [],
      customDisaggregations: disaggStr ? disaggStr.split(',').map(s => s.trim()).filter(Boolean) : [],
      active: true
    });

    this.openAddIndicatorModal.set(false);
    this.saveNotification.set('Custom indicator registered in PIRS registry!');
  }

  togglePerm(role: RolePermission, key: keyof RolePermission, value: boolean) {
    this.mealService.updateRolePermission(role.roleId, { [key]: value });
  }
}
