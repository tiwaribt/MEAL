import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MealDataService } from './services/meal-data.service';
import { TopBar } from './components/top-bar';
import { DashboardView } from './components/dashboard-view';
import { LogframeView } from './components/logframe-view';
import { FieldVisitsView } from './components/field-visits-view';
import { DqaVerificationView } from './components/dqa-verification-view';
import { DigitalToolsView } from './components/digital-tools-view';
import { CfrmView } from './components/cfrm-view';
import { LearningView } from './components/learning-view';
import { ReportingView } from './components/reporting-view';
import { VisibilityStudioView } from './components/visibility-studio-view';
import { EvidenceArchiveView } from './components/evidence-archive-view';
import { GanttWorkplanView } from './components/gantt-workplan-view';
import { SystemExportHubView } from './components/system-export-hub-view';
import { AdminPanelSettingsView } from './components/admin-panel-settings-view';
import { FormBuilderView } from './components/form-builder-view';
import { MobileCollectorView } from './components/mobile-collector-view';
import { DataVisualizationView } from './components/data-visualization-view';
import { AiAssistModal } from './components/ai-assist-modal';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    TopBar,
    DashboardView,
    LogframeView,
    FormBuilderView,
    MobileCollectorView,
    DataVisualizationView,
    FieldVisitsView,
    DqaVerificationView,
    DigitalToolsView,
    CfrmView,
    LearningView,
    ReportingView,
    VisibilityStudioView,
    EvidenceArchiveView,
    GanttWorkplanView,
    SystemExportHubView,
    AdminPanelSettingsView,
    AiAssistModal
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly mealService = inject(MealDataService);
  readonly aiModal = viewChild(AiAssistModal);

  openAiAssistant(task: 'generate-indicator' | 'draft-case-study' | 'analyze-cfrm' | 'generate-donor-summary' = 'generate-indicator', defaultPrompt = '') {
    this.aiModal()?.open(task, defaultPrompt);
  }
}
