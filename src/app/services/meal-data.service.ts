import { Injectable, signal, computed, inject } from '@angular/core';
import {
  MealProject,
  LogframeItem,
  MealIndicator,
  ExtendedMealIndicator,
  CustomFormDef,
  FormQuestion,
  MobileSubmission,
  DashboardWidgetConfig,
  DashboardWidgetId,
  FieldVisit,
  BeneficiaryRecord,
  DqaAssessment,
  DigitalForm,
  CfrmComplaint,
  LessonLearned,
  CaseStudy,
  ReviewMeeting,
  VisibilityAsset,
  EvidenceDocument,
  GanttActivity,
  AdminMenuItem,
  CustomFieldDefinition,
  CustomIndicatorConfig,
  OrganizationProfile,
  RolePermission
} from '../models/meal.model';
import { NepalGeoService } from './nepal-geo.service';
import { SEED_NEPAL_BENEFICIARIES } from '../data/nepal-gis-beneficiaries.data';

@Injectable({
  providedIn: 'root'
})
export class MealDataService {
  private readonly geoService = inject(NepalGeoService);

  // Selected Project Filter ('all' or specific project ID)
  readonly selectedProjectId = signal<string>('all');

  // Search Query across the active view
  readonly searchQuery = signal<string>('');

  // Active Main Navigation Tab
  readonly activeTab = signal<string>('dashboard');

  // Organization Profile for INGO / NGO / Non-Profit Customization
  readonly orgProfile = signal<OrganizationProfile>({
    name: 'Integrated Disaster Resilience & Community Empowerment Foundation',
    acronym: 'IDRCEF',
    orgType: 'INGO',
    registrationNumber: 'SWC-NP-49120',
    countryOffice: 'Kathmandu / Lalitpur, Nepal',
    currency: 'USD ($)',
    fiscalYear: 'FY 2026/2027 (Oct - Sep)',
    complianceFrameworks: ['USAID ADS 201', 'FCDO Smart Rules', 'DG ECHO Quality Benchmarks', 'Core Humanitarian Standard (CHS)'],
    brandPrimaryColor: '#0f766e',
    focalEmail: 'meal-director@idrcef.org',
    focalPhone: '+977-1-5534820'
  });

  // Dynamic Navigation Menus with Ordering & Toggle Controls (LogAlto Full Feature Suite)
  readonly adminMenuItems = signal<AdminMenuItem[]>([
    { id: 'dashboard', title: 'MEAL Dashboard', icon: 'dashboard', path: 'dashboard', enabled: true, order: 1 },
    { id: 'gis-map', title: 'GIS Outreach Map', icon: 'travel_explore', path: 'gis-map', enabled: true, order: 2, badge: '753 GIS' },
    { id: 'logframe', title: 'Indicator Tracking', icon: 'tune', path: 'logframe', enabled: true, order: 3, badge: 'PIRS' },
    { id: 'form-builder', title: 'M&E Form Builder', icon: 'dynamic_form', path: 'form-builder', enabled: true, order: 4, badge: 'Builder' },
    { id: 'mobile-collection', title: 'Mobile Collector', icon: 'cell_tower', path: 'mobile-collection', enabled: true, order: 5, badge: 'Offline' },
    { id: 'data-viz', title: 'Data Visualization', icon: 'insights', path: 'data-viz', enabled: true, order: 6, badge: 'Pivot/Charts' },
    { id: 'gantt', title: 'Gantt Workplan', icon: 'view_timeline', path: 'gantt', enabled: true, order: 7 },
    { id: 'visits', title: 'Field Monitoring', icon: 'fact_check', path: 'visits', enabled: true, order: 8 },
    { id: 'dqa', title: 'Beneficiaries & DQA', icon: 'people', path: 'dqa', enabled: true, order: 9, badge: '94%' },
    { id: 'cfrm', title: 'CFRM & Safeguarding', icon: 'support_agent', path: 'cfrm', enabled: true, order: 10 },
    { id: 'learning', title: 'Learning & Cases', icon: 'auto_stories', path: 'learning', enabled: true, order: 11 },
    { id: 'digital-tools', title: 'Digital Tools (ODK/Kobo)', icon: 'devices', path: 'digital-tools', enabled: true, order: 12 },
    { id: 'visibility', title: 'Visibility Studio', icon: 'palette', path: 'visibility', enabled: true, order: 13 },
    { id: 'archive', title: 'Evidence MoV', icon: 'folder', path: 'archive', enabled: true, order: 14 },
    { id: 'reporting', title: 'Donor Reports', icon: 'summarize', path: 'reporting', enabled: true, order: 15 },
    { id: 'export', title: 'System Export Hub', icon: 'cloud_download', path: 'export', enabled: true, order: 16, badge: 'Excel/Zip' },
    { id: 'admin', title: 'Admin & System Config', icon: 'admin_panel_settings', path: 'admin', enabled: true, order: 17 }
  ]);

  // Gantt Chart Activities & Workplan
  readonly ganttActivities = signal<GanttActivity[]>([
    {
      id: 'gantt-1',
      projectId: 'proj-bcrp',
      code: 'ACT-BCRP-1.1',
      name: '7-Day Mason Seismic Retrofitting Practical Cohort 1',
      component: 'Technical Capacity & Masonry',
      startDate: '2026-07-01',
      endDate: '2026-07-28',
      progressPercent: 100,
      status: 'Completed',
      assignee: 'Bikram Lead Instructor',
      budgetAllocated: 24000,
      isMilestone: true,
      deliverableTarget: '24 Masons Certified in Sindhupalchok'
    },
    {
      id: 'gantt-2',
      projectId: 'proj-bcrp',
      code: 'ACT-BCRP-1.2',
      name: 'Ward-Level Hazard Mapping & Vulnerability Prioritization',
      component: 'Community DRM & Preparedness',
      startDate: '2026-07-15',
      endDate: '2026-08-15',
      progressPercent: 100,
      status: 'Completed',
      assignee: 'Dev Raj CDMC Officer',
      budgetAllocated: 18500,
      isMilestone: false,
      dependencies: ['gantt-1'],
      deliverableTarget: 'Approved DRM Maps in 12 Wards'
    },
    {
      id: 'gantt-3',
      projectId: 'proj-bcrp',
      code: 'ACT-BCRP-2.1',
      name: 'Residential Structural Retrofitting Demonstration Units (Batch 1)',
      component: 'Structural Retrofitting & Engineering',
      startDate: '2026-08-01',
      endDate: '2026-09-30',
      progressPercent: 85,
      status: 'In Progress',
      assignee: 'Er. Sujata Shrestha',
      budgetAllocated: 75000,
      isMilestone: false,
      deliverableTarget: '6 Houses retrofitted & signed off'
    },
    {
      id: 'gantt-4',
      projectId: 'proj-bcrp',
      code: 'ACT-BCRP-M1',
      name: 'CTEVT National Skill Testing & Practical Certification Exam',
      component: 'Quality Assurance & Accreditation',
      startDate: '2026-09-15',
      endDate: '2026-09-22',
      progressPercent: 95,
      status: 'In Progress',
      assignee: 'Anil Maharjan (MEAL)',
      budgetAllocated: 12000,
      isMilestone: true,
      deliverableTarget: 'CTEVT Level-1 Certificates Issued'
    },
    {
      id: 'gantt-5',
      projectId: 'proj-ssep',
      code: 'ACT-SSEP-1.1',
      name: 'Bal Kalyan Secondary School Structural Steel Bracing Retrofitting',
      component: 'School Safety Infrastructure',
      startDate: '2026-06-15',
      endDate: '2026-08-30',
      progressPercent: 100,
      status: 'Completed',
      assignee: 'Er. Rajesh Koirala',
      budgetAllocated: 62000,
      isMilestone: true,
      deliverableTarget: 'Structural Engineer Safety Certificate'
    },
    {
      id: 'gantt-6',
      projectId: 'proj-ssep',
      code: 'ACT-SSEP-1.2',
      name: 'School Earthquake Simulation Drill & Stop-Watch Evacuation Audit',
      component: 'Child-Centered Preparedness',
      startDate: '2026-09-01',
      endDate: '2026-09-25',
      progressPercent: 90,
      status: 'In Progress',
      assignee: 'Maya Tamang (Field MEAL)',
      budgetAllocated: 9500,
      isMilestone: false,
      dependencies: ['gantt-5'],
      deliverableTarget: 'Under 2-min Evacuation Benchmark'
    },
    {
      id: 'gantt-7',
      projectId: 'proj-bcrp',
      code: 'ACT-BCRP-Q3',
      name: 'Q3 Independent Data Quality Assessment (DQA) & Beneficiary Recount',
      component: 'MEAL & Compliance',
      startDate: '2026-09-10',
      endDate: '2026-09-30',
      progressPercent: 78,
      status: 'In Progress',
      assignee: 'Anil Maharjan (MEAL)',
      budgetAllocated: 8000,
      isMilestone: true,
      deliverableTarget: 'Verified 94%+ DQA Score Report'
    },
    {
      id: 'gantt-8',
      projectId: 'proj-surp',
      code: 'ACT-SURP-1.1',
      name: 'Municipal Building Code (NBC 105:2020) Compliance Audits',
      component: 'Urban Policy & Municipal Systems',
      startDate: '2026-09-01',
      endDate: '2026-11-15',
      progressPercent: 40,
      status: 'In Progress',
      assignee: 'Er. Rameshwor Sharma',
      budgetAllocated: 34000,
      isMilestone: false,
      deliverableTarget: 'Municipal Permit Registry Audit'
    },
    {
      id: 'gantt-9',
      projectId: 'proj-bcrp',
      code: 'ACT-BCRP-2.2',
      name: 'Mason Training Cohort 2 (Chautara Ward 7 & 9)',
      component: 'Technical Capacity & Masonry',
      startDate: '2026-10-15',
      endDate: '2026-11-20',
      progressPercent: 0,
      status: 'Scheduled',
      assignee: 'Bikram Lead Instructor',
      budgetAllocated: 26000,
      isMilestone: false,
      dependencies: ['gantt-4'],
      deliverableTarget: '25 Additional Masons Trained'
    },
    {
      id: 'gantt-10',
      projectId: 'proj-tdart',
      code: 'ACT-TDART-1.1',
      name: 'Rapid Disaster Assessment Roster Deployment Simulation with NDRRMA',
      component: 'Rapid Response & Emergency MEAL',
      startDate: '2026-10-01',
      endDate: '2026-10-10',
      progressPercent: 15,
      status: 'Delayed',
      assignee: 'Santosh Neupane (TDART)',
      budgetAllocated: 15000,
      isMilestone: true,
      deliverableTarget: 'ODK Mobile Sync in 4hr SLA'
    },
    {
      id: 'gantt-11',
      projectId: 'proj-ssep',
      code: 'ACT-SSEP-AAR',
      name: 'Annual School Safety Reflection & After-Action Review (AAR)',
      component: 'Learning & Accountability',
      startDate: '2026-11-01',
      endDate: '2026-11-15',
      progressPercent: 0,
      status: 'Scheduled',
      assignee: 'MEAL Directorate',
      budgetAllocated: 11000,
      isMilestone: true,
      deliverableTarget: 'Published AAR Policy Brief'
    },
    {
      id: 'gantt-12',
      projectId: 'proj-bcrp',
      code: 'ACT-BCRP-DON',
      name: 'USAID / BHA Joint Field Monitoring & Donor Verification Mission',
      component: 'Donor Relations & Accountability',
      startDate: '2026-11-10',
      endDate: '2026-11-18',
      progressPercent: 0,
      status: 'Scheduled',
      assignee: 'Surya Narayan Shrestha',
      budgetAllocated: 7500,
      isMilestone: true,
      deliverableTarget: 'Formal Donor Acceptance Signoff'
    }
  ]);

  // Custom Field Definitions (Designer for Non-Profit M&E)
  readonly customFields = signal<CustomFieldDefinition[]>([
    {
      id: 'cf-1',
      label: 'Household Vulnerability Score (1-5)',
      fieldType: 'number',
      targetModule: 'beneficiaries',
      required: true,
      disaggregationDimension: 'Vulnerability Index',
      defaultValue: 3
    },
    {
      id: 'cf-2',
      label: 'Disability Severity Level (Washington Group Short Set)',
      fieldType: 'select',
      targetModule: 'beneficiaries',
      options: ['No Difficulty', 'Some Difficulty', 'A Lot of Difficulty', 'Cannot Do At All'],
      required: false,
      disaggregationDimension: 'Disability Severity'
    },
    {
      id: 'cf-3',
      label: 'Indigenous / Mother Tongue Language',
      fieldType: 'select',
      targetModule: 'beneficiaries',
      options: ['Nepali', 'Tamang', 'Newari', 'Maithili', 'Gurung', 'Magar', 'Other'],
      required: false,
      disaggregationDimension: 'Linguistic Group'
    },
    {
      id: 'cf-4',
      label: 'Palika Recommendation Letter Attached',
      fieldType: 'boolean',
      targetModule: 'beneficiaries',
      required: true,
      defaultValue: true
    },
    {
      id: 'cf-5',
      label: 'Environmental Compliance Checklist Rating',
      fieldType: 'select',
      targetModule: 'visits',
      options: ['Full Compliance', 'Minor Debris/Waste Issue', 'Critical Hazard'],
      required: true
    },
    {
      id: 'cf-6',
      label: 'Complainant Protection Vulnerability Flag',
      fieldType: 'boolean',
      targetModule: 'cfrm',
      required: true,
      defaultValue: false
    }
  ]);

  // Custom Indicators Config
  readonly customIndicators = signal<CustomIndicatorConfig[]>([
    {
      id: 'ci-1',
      title: 'Percentage of vulnerable female-headed households with confirmed seismic-safe shelters',
      sector: 'Shelter',
      level: 'Outcome',
      donorCompliance: ['USAID ADS 201', 'ECHO Shelter'],
      unit: '% of households',
      customDisaggregations: ['Female-Headed', 'Single-Elderly', 'Dalit/Marginalized'],
      calculationFormula: '(Numerator: Verified Retrofitted Female-Headed HHs / Denominator: Total Target Beneficiary HHs) * 100',
      active: true
    },
    {
      id: 'ci-2',
      title: 'Average evacuation drill time achieved in target educational institutions',
      sector: 'Education',
      level: 'Outcome',
      donorCompliance: ['UNICEF Child Protection', 'FCDO Smart Rules'],
      unit: 'Minutes & Seconds',
      customDisaggregations: ['Primary School', 'Secondary School', 'Disabled Accessible'],
      calculationFormula: 'Total drill seconds measured across audits / Total school drills conducted',
      active: true
    }
  ]);

  // Role-Based Access Control (RBAC)
  readonly rolePermissions = signal<RolePermission[]>([
    {
      roleId: 'meal_director',
      roleTitle: 'MEAL Director / Senior M&E Lead',
      description: 'Full executive oversight, indicator configuration, approval authority, and system export access.',
      assignedUsersCount: 2,
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canExport: true,
      canApprove: true
    },
    {
      roleId: 'project_manager',
      roleTitle: 'Project Manager / Component Lead',
      description: 'Manages project-specific activities, reviews field visit observations, and updates milestone status.',
      assignedUsersCount: 5,
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canExport: true,
      canApprove: true
    },
    {
      roleId: 'field_officer',
      roleTitle: 'Field MEAL Officer / Enumerator',
      description: 'Enters beneficiary data, conducts checklists, uploads MoVs, and registers CFRM tickets from wards.',
      assignedUsersCount: 14,
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canExport: true,
      canApprove: false
    },
    {
      roleId: 'safeguarding_officer',
      roleTitle: 'Protection & PSEA Focal Point',
      description: 'Exclusive access to high-severity CFRM complaints, safeguarding audits, and sensitive case notes.',
      assignedUsersCount: 2,
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canExport: true,
      canApprove: true
    },
    {
      roleId: 'external_auditor',
      roleTitle: 'External Auditor / Donor Monitor',
      description: 'Read-only access to all verified indicators, DQA records, and means of verification archives.',
      assignedUsersCount: 4,
      canView: true,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canExport: true,
      canApprove: false
    }
  ]);


  // Core Data Signals
  readonly projects = signal<MealProject[]>([
    {
      id: 'proj-bcrp',
      code: 'BCRP',
      name: 'Building Community Resilience Program',
      donor: 'USAID / Bureau for Humanitarian Assistance (BHA)',
      budget: '$2,850,000',
      startDate: '2024-10-01',
      endDate: '2027-09-30',
      focusAreas: ['Earthquake Preparedness', 'Mason Training', 'Community DRM', 'Retrofitting'],
      status: 'Active',
      districts: ['Sindhupalchok', 'Gorkha', 'Dhading', 'Dolakha'],
      targetBeneficiaries: 45000,
      reachedBeneficiaries: 28400,
      manager: 'Er. Rameshwor Sharma'
    },
    {
      id: 'proj-ssep',
      code: 'SSEP',
      name: 'Safer Schools & Educational Infrastructure Program',
      donor: 'FCDO / UNICEF Nepal',
      budget: '£1,450,000',
      startDate: '2025-01-01',
      endDate: '2026-12-31',
      focusAreas: ['School Retrofitting', 'Safety Drills', 'Child-Centered DRR', 'Teacher Capacity'],
      status: 'Active',
      districts: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kavre'],
      targetBeneficiaries: 30000,
      reachedBeneficiaries: 21650,
      manager: 'Sujata Shrestha'
    },
    {
      id: 'proj-surp',
      code: 'SURP',
      name: 'Strengthening Urban Resilience Project',
      donor: 'UNDP Nepal / ECHO',
      budget: '€920,000',
      startDate: '2025-04-01',
      endDate: '2026-10-31',
      focusAreas: ['Urban Risk Assessment', 'Municipal EOC', 'Building Code NBC 105', 'Open Spaces'],
      status: 'Active',
      districts: ['Kathmandu Valley', 'Pokhara', 'Bharatpur'],
      targetBeneficiaries: 65000,
      reachedBeneficiaries: 34800,
      manager: 'Bikash Adhikari'
    },
    {
      id: 'proj-tdart',
      code: 'TDART',
      name: 'Technical Disaster Assessment & Rapid Response',
      donor: 'Government of Nepal / NDRRMA',
      budget: 'NPR 85,000,000',
      startDate: '2025-07-01',
      endDate: '2027-06-30',
      focusAreas: ['Damage Assessment', 'Post-Disaster Engineering', 'Drone Mapping', 'Kobo Toolkits'],
      status: 'Active',
      districts: ['Jajarkot', 'Rukum West', 'Bajhang', 'Doti'],
      targetBeneficiaries: 25000,
      reachedBeneficiaries: 12100,
      manager: 'Er. Dipendra Gautam'
    }
  ]);

  readonly logframeItems = signal<LogframeItem[]>([
    {
      id: 'lf-1',
      projectId: 'proj-bcrp',
      type: 'impact',
      code: 'BCRP-IMP-1',
      title: 'Enhanced seismic resilience and disaster survival of vulnerable mountain communities in Nepal',
      description: 'Reduced casualties, structural failure, and economic losses during high-intensity seismic events.',
      indicatorsCount: 2,
      status: 'on_track'
    },
    {
      id: 'lf-2',
      projectId: 'proj-bcrp',
      type: 'outcome',
      code: 'BCRP-OC-1',
      title: 'Target municipalities enforce earthquake-resilient building codes and maintain certified local artisan registries',
      description: 'Institutionalization of building permit verifications and regular technical compliance spot checks.',
      indicatorsCount: 3,
      status: 'on_track'
    },
    {
      id: 'lf-3',
      projectId: 'proj-bcrp',
      type: 'output',
      code: 'BCRP-OP-1.1',
      title: 'Local masons, bar-benders, and construction workers certified in earthquake-resistant building techniques',
      description: 'Conduct 7-day CTEVT-accredited practical training including retrofitting demonstration models.',
      indicatorsCount: 3,
      status: 'on_track'
    },
    {
      id: 'lf-4',
      projectId: 'proj-ssep',
      type: 'outcome',
      code: 'SSEP-OC-1',
      title: 'Public schools in target valley zones achieve seismic structural safety certifications and emergency contingency readiness',
      description: 'Engineering retrofitting verification and school disaster management plans.',
      indicatorsCount: 2,
      status: 'on_track'
    },
    {
      id: 'lf-5',
      projectId: 'proj-ssep',
      type: 'output',
      code: 'SSEP-OP-1.2',
      title: 'School safety drills and evacuation simulations conducted with disaggregated participation tracking',
      description: 'Regular earthquake simulation drills covering Drop, Cover, Hold On and disabled-inclusive evacuation.',
      indicatorsCount: 2,
      status: 'needs_attention'
    }
  ]);

  readonly indicators = signal<ExtendedMealIndicator[]>([
    {
      id: 'ind-1',
      projectId: 'proj-bcrp',
      logframeId: 'lf-3',
      code: 'IND-BCRP-01',
      title: 'Number of local masons and construction artisans certified in earthquake-resilient construction (NBC 105)',
      level: 'Output',
      indicatorType: 'quantitative',
      unit: 'Masons certified',
      baseline: 0,
      targetAnnual: 600,
      targetLOP: 1500,
      actualQuarter: 185,
      actualTotal: 620,
      progressPercent: 103.3,
      frequency: 'Quarterly',
      meansOfVerification: 'CTEVT/National certification exams, attendance registers, national ID verified records',
      dataSource: 'Training Event Roster & Assessment Scorecards',
      responsibleOfficer: 'Anil Maharjan (MEAL Officer)',
      status: 'on_track',
      disaggregation: {
        female: 198,
        male: 422,
        other: 0,
        pwd: 18,
        marginalized: 284,
        youth: 345
      },
      periodsProgress: [
        { period: 'Baseline', target: 0, actual: 0, variancePercent: 0, notes: 'Zero certified masons at project inception' },
        { period: 'Q1-2026', target: 120, actual: 135, variancePercent: 12.5, notes: 'Chautara cohort launched with CTEVT', verifiedBy: 'Anil Maharjan' },
        { period: 'Q2-2026', target: 150, actual: 148, variancePercent: -1.3, notes: 'Gorkha practical testing cohort', verifiedBy: 'Sujata Shrestha' },
        { period: 'Q3-2026', target: 180, actual: 185, variancePercent: 2.8, notes: 'Sindhupalchok batch 14 finalized', verifiedBy: 'Pradeep Bhattarai' },
        { period: 'Q4-2026', target: 150, actual: 152, variancePercent: 1.3, notes: 'Projected Nilkantha batch completion', verifiedBy: 'Anil Maharjan' },
        { period: 'Annual Target', target: 600, actual: 620, variancePercent: 3.3, notes: 'Surpassed annual milestone', verifiedBy: 'MEAL Lead' },
        { period: 'LOP Target', target: 1500, actual: 620, variancePercent: 41.3, notes: 'Life of Project cumulative target' }
      ],
      disaggregationMatrix: [
        { dimension: 'Gender', category: 'Female', target: 180, actual: 198, variancePercent: 10.0 },
        { dimension: 'Gender', category: 'Male', target: 420, actual: 422, variancePercent: 0.5 },
        { dimension: 'Vulnerability', category: 'PWD / Persons with Disabilities', target: 15, actual: 18, variancePercent: 20.0 },
        { dimension: 'Vulnerability', category: 'Marginalized / Janajati / Dalit', target: 250, actual: 284, variancePercent: 13.6 },
        { dimension: 'Age Group', category: 'Youth (18-29 yrs)', target: 300, actual: 345, variancePercent: 15.0 },
        { dimension: 'Geography', category: 'Sindhupalchok District', target: 250, actual: 268, variancePercent: 7.2 },
        { dimension: 'Geography', category: 'Gorkha District', target: 200, actual: 212, variancePercent: 6.0 },
        { dimension: 'Geography', category: 'Dhading District', target: 150, actual: 140, variancePercent: -6.7 }
      ],
      collectionSchedule: {
        frequency: 'Quarterly',
        nextDueDate: '2026-10-15',
        assignee: 'Anil Maharjan',
        overdue: false
      },
      notes: 'Exceeded annual target in Gorkha and Sindhupalchok; high participation of female mason apprentices.'
    },
    {
      id: 'ind-2',
      projectId: 'proj-bcrp',
      logframeId: 'lf-2',
      code: 'IND-BCRP-02',
      title: 'Number of community disaster management committees (CDMCs) operational with verified emergency action plans',
      level: 'Outcome',
      indicatorType: 'quantitative',
      unit: 'Committees verified',
      baseline: 12,
      targetAnnual: 45,
      targetLOP: 75,
      actualQuarter: 11,
      actualTotal: 39,
      progressPercent: 86.6,
      frequency: 'Quarterly',
      meansOfVerification: 'Palika endorsed CDMC minute sheets, hazard risk maps, municipal approval letters',
      dataSource: 'Palika Disaster Management Records & DQA spot-checks',
      responsibleOfficer: 'Pradeep Bhattarai (Field MEAL Coordinator)',
      status: 'on_track',
      disaggregation: {
        female: 410,
        male: 485,
        other: 0,
        pwd: 42,
        marginalized: 395,
        youth: 260
      },
      periodsProgress: [
        { period: 'Baseline', target: 12, actual: 12, variancePercent: 0, notes: 'Existing non-active committees' },
        { period: 'Q1-2026', target: 10, actual: 8, variancePercent: -20.0, notes: 'Palika coordination kickoff' },
        { period: 'Q2-2026', target: 12, actual: 10, variancePercent: -16.7, notes: 'Ward risk mapping finalized' },
        { period: 'Q3-2026', target: 12, actual: 11, variancePercent: -8.3, notes: 'Formal municipal endorsements' },
        { period: 'Q4-2026', target: 11, actual: 10, variancePercent: -9.1, notes: 'Scheduled for Nilkantha Wards 1-6' },
        { period: 'Annual Target', target: 45, actual: 39, variancePercent: -13.3, notes: '86.6% target achieved' },
        { period: 'LOP Target', target: 75, actual: 39, variancePercent: 52.0, notes: 'Overall 3-year LOP target' }
      ],
      disaggregationMatrix: [
        { dimension: 'Gender Leadership', category: 'Female Committee Members', target: 400, actual: 410, variancePercent: 2.5 },
        { dimension: 'Gender Leadership', category: 'Male Committee Members', target: 450, actual: 485, variancePercent: 7.8 },
        { dimension: 'Social Inclusion', category: 'Dalit / Marginalized Representation', target: 350, actual: 395, variancePercent: 12.8 },
        { dimension: 'Disability Focus', category: 'Persons with Disabilities in CDMC', target: 40, actual: 42, variancePercent: 5.0 }
      ],
      collectionSchedule: {
        frequency: 'Quarterly',
        nextDueDate: '2026-10-20',
        assignee: 'Pradeep Bhattarai',
        overdue: false
      },
      notes: '6 remaining committees scheduled for endorsement in Nilkantha municipality in Q4.'
    },
    {
      id: 'ind-3',
      projectId: 'proj-ssep',
      logframeId: 'lf-4',
      code: 'IND-SSEP-01',
      title: 'Number of vulnerable school buildings retrofitted and certified compliant with seismic safety guidelines',
      level: 'Outcome',
      indicatorType: 'quantitative',
      unit: 'School blocks retrofitted',
      baseline: 0,
      targetAnnual: 24,
      targetLOP: 50,
      actualQuarter: 5,
      actualTotal: 18,
      progressPercent: 75.0,
      frequency: 'Bi-annual',
      meansOfVerification: 'Structural engineer completion sign-offs, municipal building permits, MEAL QA inspection checklists',
      dataSource: 'Engineering Field Audit Archive',
      responsibleOfficer: 'Sujata Shrestha (Project Manager)',
      status: 'warning',
      disaggregation: {
        female: 4200,
        male: 3890,
        other: 0,
        pwd: 145,
        marginalized: 3100,
        youth: 7800
      },
      periodsProgress: [
        { period: 'Baseline', target: 0, actual: 0, variancePercent: 0, notes: 'Pre-intervention baseline' },
        { period: 'Q1-2026', target: 6, actual: 5, variancePercent: -16.7, notes: 'Design signoffs in Lalitpur' },
        { period: 'Q2-2026', target: 6, actual: 4, variancePercent: -33.3, notes: 'Monsoon mudslide delays' },
        { period: 'Q3-2026', target: 6, actual: 5, variancePercent: -16.7, notes: 'Catch-up acceleration' },
        { period: 'Q4-2026', target: 6, actual: 4, variancePercent: -33.3, notes: 'Bal Kalyan & Kavre schools' },
        { period: 'Annual Target', target: 24, actual: 18, variancePercent: -25.0, notes: 'Under monitoring watchlist' },
        { period: 'LOP Target', target: 50, actual: 18, variancePercent: 36.0, notes: 'Target for 2-year duration' }
      ],
      disaggregationMatrix: [
        { dimension: 'Geography', category: 'Kathmandu Valley Schools', target: 12, actual: 10, variancePercent: -16.7 },
        { dimension: 'Geography', category: 'Kavrepalanchok Rural Schools', target: 12, actual: 8, variancePercent: -33.3 },
        { dimension: 'Beneficiaries', category: 'Girls Protected', target: 4500, actual: 4200, variancePercent: -6.7 },
        { dimension: 'Beneficiaries', category: 'Boys Protected', target: 4000, actual: 3890, variancePercent: -2.8 },
        { dimension: 'Disability', category: 'Disabled Children Accessible', target: 150, actual: 145, variancePercent: -3.3 }
      ],
      collectionSchedule: {
        frequency: 'Bi-annual',
        nextDueDate: '2026-10-01',
        assignee: 'Sujata Shrestha',
        overdue: true
      },
      notes: 'Monsoon delays in Kavre caused 3-week construction stoppage; catch-up plan initiated with additional mason gangs.'
    },
    {
      id: 'ind-4',
      projectId: 'proj-ssep',
      logframeId: 'lf-5',
      code: 'IND-SSEP-02',
      title: 'Number of students and teachers participating in simulated earthquake evacuation drills',
      level: 'Output',
      indicatorType: 'quantitative',
      unit: 'Individuals participated',
      baseline: 1200,
      targetAnnual: 18000,
      targetLOP: 36000,
      actualQuarter: 4850,
      actualTotal: 16900,
      progressPercent: 93.8,
      frequency: 'Monthly',
      meansOfVerification: 'School attendance logs, drill evaluation rubrics, time-to-evacuate stopwatch logs',
      dataSource: 'KoboToolbox School Drill Monitoring Form',
      responsibleOfficer: 'Maya Tamang (MEAL Associate)',
      status: 'on_track',
      disaggregation: {
        female: 9120,
        male: 7780,
        other: 0,
        pwd: 210,
        marginalized: 6450,
        youth: 16200
      },
      periodsProgress: [
        { period: 'Baseline', target: 1200, actual: 1200, variancePercent: 0, notes: 'Pre-existing drill counts' },
        { period: 'Q1-2026', target: 4000, actual: 3950, variancePercent: -1.2, notes: 'Kathmandu central drills' },
        { period: 'Q2-2026', target: 4500, actual: 4100, variancePercent: -8.9, notes: 'Lalitpur primary schools' },
        { period: 'Q3-2026', target: 5000, actual: 4850, variancePercent: -3.0, notes: 'Comprehensive evacuation tests' },
        { period: 'Q4-2026', target: 4500, actual: 4000, variancePercent: -11.1, notes: 'Scheduled for Bhaktapur' },
        { period: 'Annual Target', target: 18000, actual: 16900, variancePercent: -6.1, notes: '93.8% milestone reach' },
        { period: 'LOP Target', target: 36000, actual: 16900, variancePercent: 46.9, notes: 'LOP benchmark' }
      ],
      disaggregationMatrix: [
        { dimension: 'Participant', category: 'Female Students & Teachers', target: 9500, actual: 9120, variancePercent: -4.0 },
        { dimension: 'Participant', category: 'Male Students & Teachers', target: 8500, actual: 7780, variancePercent: -8.5 },
        { dimension: 'Vulnerability', category: 'Students with Disabilities (PWD)', target: 200, actual: 210, variancePercent: 5.0 },
        { dimension: 'Vulnerability', category: 'Dalit & Indigenous Marginalized', target: 6000, actual: 6450, variancePercent: 7.5 }
      ],
      collectionSchedule: {
        frequency: 'Monthly',
        nextDueDate: '2026-09-30',
        assignee: 'Maya Tamang',
        overdue: false
      },
      notes: 'Drill evaluation recorded average evacuation duration drop from 4m 15s to 1m 48s across target schools.'
    },
    {
      id: 'ind-5',
      projectId: 'proj-surp',
      logframeId: 'lf-2',
      code: 'IND-SURP-01',
      title: 'Number of municipal engineers trained in electronic building permit systems (EBPS) & NBC 105 implementation',
      level: 'Output',
      indicatorType: 'quantitative',
      unit: 'Municipal engineers',
      baseline: 15,
      targetAnnual: 90,
      targetLOP: 180,
      actualQuarter: 28,
      actualTotal: 84,
      progressPercent: 93.3,
      frequency: 'Quarterly',
      meansOfVerification: 'Pre/Post training test scores, municipal deputation orders, software login audit logs',
      dataSource: 'Training Management Information System (TMIS)',
      responsibleOfficer: 'Bikash Adhikari (Surp Lead)',
      status: 'on_track',
      disaggregation: {
        female: 32,
        male: 52,
        other: 0,
        pwd: 2,
        marginalized: 28,
        youth: 61
      },
      periodsProgress: [
        { period: 'Baseline', target: 15, actual: 15, variancePercent: 0, notes: 'Engineers with basic training' },
        { period: 'Q1-2026', target: 20, actual: 22, variancePercent: 10.0, notes: 'Kathmandu Met pilot' },
        { period: 'Q2-2026', target: 25, actual: 24, variancePercent: -4.0, notes: 'Pokhara municipal cohort' },
        { period: 'Q3-2026', target: 25, actual: 28, variancePercent: 12.0, notes: 'Bharatpur intensive training' },
        { period: 'Q4-2026', target: 20, actual: 10, variancePercent: -50.0, notes: 'Advanced structural audit module' },
        { period: 'Annual Target', target: 90, actual: 84, variancePercent: -6.7, notes: '93.3% achieved' },
        { period: 'LOP Target', target: 180, actual: 84, variancePercent: 46.7, notes: 'LOP Target' }
      ],
      disaggregationMatrix: [
        { dimension: 'Gender', category: 'Female Engineers', target: 30, actual: 32, variancePercent: 6.7 },
        { dimension: 'Gender', category: 'Male Engineers', target: 60, actual: 52, variancePercent: -13.3 },
        { dimension: 'Municipality', category: 'Kathmandu Metro', target: 35, actual: 36, variancePercent: 2.9 },
        { dimension: 'Municipality', category: 'Pokhara Metro', target: 30, actual: 28, variancePercent: -6.7 },
        { dimension: 'Municipality', category: 'Bharatpur Metro', target: 25, actual: 20, variancePercent: -20.0 }
      ],
      collectionSchedule: {
        frequency: 'Quarterly',
        nextDueDate: '2026-10-10',
        assignee: 'Bikash Adhikari',
        overdue: false
      },
      notes: 'Average post-test score improved by 41% compared to baseline assessment.'
    },
    {
      id: 'ind-6',
      projectId: 'proj-tdart',
      logframeId: 'lf-3',
      code: 'IND-TDART-01',
      title: 'Number of rapid post-earthquake damage assessments completed within 72 hours of seismic event',
      level: 'Output',
      indicatorType: 'quantitative',
      unit: 'Assessments finalized',
      baseline: 0,
      targetAnnual: 200,
      targetLOP: 600,
      actualQuarter: 45,
      actualTotal: 180,
      progressPercent: 90.0,
      frequency: 'Quarterly',
      meansOfVerification: 'ODK / KoboToolbox centralized database exports, NDRRMA official transmission receipts',
      dataSource: 'Kobo Disaster Server & Field Tablets',
      responsibleOfficer: 'Er. Dipendra Gautam',
      status: 'on_track',
      disaggregation: {
        female: 98,
        male: 82,
        other: 0,
        pwd: 12,
        marginalized: 95,
        youth: 110
      },
      periodsProgress: [
        { period: 'Baseline', target: 0, actual: 0, variancePercent: 0, notes: 'Pre-disaster readiness baseline' },
        { period: 'Q1-2026', target: 50, actual: 48, variancePercent: -4.0, notes: 'Jajarkot simulation tests' },
        { period: 'Q2-2026', target: 50, actual: 52, variancePercent: 4.0, notes: 'Rukum West rapid deployment' },
        { period: 'Q3-2026', target: 50, actual: 45, variancePercent: -10.0, notes: 'Bajhang seismic tremor response' },
        { period: 'Q4-2026', target: 50, actual: 35, variancePercent: -30.0, notes: 'Scheduled joint simulation with NDRRMA' },
        { period: 'Annual Target', target: 200, actual: 180, variancePercent: -10.0, notes: '90.0% benchmark' },
        { period: 'LOP Target', target: 600, actual: 180, variancePercent: 30.0, notes: '3-year disaster contingency pool' }
      ],
      disaggregationMatrix: [
        { dimension: 'Building Type', category: 'Stone in Mud Mortar (SMM)', target: 100, actual: 95, variancePercent: -5.0 },
        { dimension: 'Building Type', category: 'Brick in Cement Mortar (BCM)', target: 60, actual: 55, variancePercent: -8.3 },
        { dimension: 'Building Type', category: 'RCC Framed Structures', target: 40, actual: 30, variancePercent: -25.0 },
        { dimension: 'Geography', category: 'Karnali Province (Jajarkot/Rukum)', target: 120, actual: 110, variancePercent: -8.3 },
        { dimension: 'Geography', category: 'Sudurpashchim (Bajhang/Doti)', target: 80, actual: 70, variancePercent: -12.5 }
      ],
      collectionSchedule: {
        frequency: 'Quarterly',
        nextDueDate: '2026-10-18',
        assignee: 'Er. Dipendra Gautam',
        overdue: false
      },
      notes: 'High geolocation accuracy: 98.4% of submitted records contained GPS coordinates with <5m error margin.'
    },
    // LogAlto Extended Indicator 7: Percentage / Ratio (Numerator & Denominator tracking)
    {
      id: 'ind-7',
      projectId: 'proj-bcrp',
      logframeId: 'lf-1',
      code: 'IND-BCRP-RATIO',
      title: 'Percentage of vulnerable target households residing in verified seismic-safe retrofitted shelters',
      level: 'Outcome',
      indicatorType: 'percentage',
      unit: '% of households',
      numerator: 3420,
      denominator: 4500,
      baseline: 12.0,
      targetAnnual: 75.0,
      targetLOP: 85.0,
      actualQuarter: 76.0,
      actualTotal: 3420,
      progressPercent: 101.3,
      frequency: 'Quarterly',
      meansOfVerification: 'Household verification roster, engineer sign-off certs, municipal housing audit',
      dataSource: 'Field Verification Roster & Municipal Housing Registry',
      responsibleOfficer: 'Anil Maharjan (MEAL Officer)',
      status: 'on_track',
      disaggregation: {
        female: 1850,
        male: 1570,
        other: 0,
        pwd: 185,
        marginalized: 2100,
        youth: 1400
      },
      periodsProgress: [
        { period: 'Baseline', target: 12.0, actual: 12.0, variancePercent: 0, notes: 'Baseline: 540 / 4500 HHs' },
        { period: 'Q1-2026', target: 35.0, actual: 38.0, variancePercent: 8.6, notes: 'Q1: 1710 / 4500 HHs verified' },
        { period: 'Q2-2026', target: 55.0, actual: 56.5, variancePercent: 2.7, notes: 'Q2: 2542 / 4500 HHs verified' },
        { period: 'Q3-2026', target: 75.0, actual: 76.0, variancePercent: 1.3, notes: 'Q3: 3420 / 4500 HHs verified' },
        { period: 'Q4-2026', target: 80.0, actual: 76.0, variancePercent: -5.0, notes: 'Targeting 3600 HHs by year end' },
        { period: 'Annual Target', target: 75.0, actual: 76.0, variancePercent: 1.3, notes: 'Exceeded annual milestone' },
        { period: 'LOP Target', target: 85.0, actual: 76.0, variancePercent: 89.4, notes: 'Life of project target' }
      ],
      disaggregationMatrix: [
        { dimension: 'Household Head', category: 'Female-Headed Households', target: 1800, actual: 1850, variancePercent: 2.8 },
        { dimension: 'Household Head', category: 'Male-Headed Households', target: 1620, actual: 1570, variancePercent: -3.1 },
        { dimension: 'Vulnerability', category: 'Single Elderly / Widows', target: 600, actual: 640, variancePercent: 6.7 },
        { dimension: 'Social Inclusion', category: 'Dalit & Indigenous Households', target: 2000, actual: 2100, variancePercent: 5.0 }
      ],
      collectionSchedule: {
        frequency: 'Quarterly',
        nextDueDate: '2026-10-25',
        assignee: 'Anil Maharjan',
        overdue: false
      },
      notes: 'Ratio tracking automatically computes percentage: 3,420 / 4,500 = 76.0% verified coverage.'
    },
    // LogAlto Extended Indicator 8: Qualitative / Milestone Stages Rubric
    {
      id: 'ind-8',
      projectId: 'proj-surp',
      logframeId: 'lf-2',
      code: 'IND-SURP-STAGE',
      title: 'Institutionalization stage of National Building Code NBC 105:2020 enforcement in municipal governance',
      level: 'Outcome',
      indicatorType: 'qualitative',
      qualitativeStage: 'Validation',
      unit: 'Stage (1-5 Rubric)',
      baseline: 1,
      targetAnnual: 4,
      targetLOP: 5,
      actualQuarter: 4,
      actualTotal: 4,
      progressPercent: 100.0,
      frequency: 'Bi-annual',
      meansOfVerification: 'Municipal council gazette notices, EBPS automated enforcement logs, DQA review',
      dataSource: 'Municipal Council Minutes & EBPS System Audit',
      responsibleOfficer: 'Bikash Adhikari (Surp Lead)',
      status: 'on_track',
      disaggregation: {
        female: 18,
        male: 26,
        other: 0,
        pwd: 1,
        marginalized: 14,
        youth: 22
      },
      periodsProgress: [
        { period: 'Baseline', target: 1, actual: 1, variancePercent: 0, notes: 'Stage 1: Informal awareness' },
        { period: 'Q1-2026', target: 2, actual: 2, variancePercent: 0, notes: 'Stage 2: Municipal drafting committee established' },
        { period: 'Q2-2026', target: 3, actual: 3, variancePercent: 0, notes: 'Stage 3: Field pilot & bylaws enacted' },
        { period: 'Q3-2026', target: 4, actual: 4, variancePercent: 0, notes: 'Stage 4: Validation & electronic permit integration' },
        { period: 'Q4-2026', target: 5, actual: 4, variancePercent: -20.0, notes: 'Stage 5: Full institutionalization & handover' },
        { period: 'Annual Target', target: 4, actual: 4, variancePercent: 0, notes: 'Met target milestone' },
        { period: 'LOP Target', target: 5, actual: 4, variancePercent: 80.0, notes: 'Sustained municipal handover' }
      ],
      disaggregationMatrix: [
        { dimension: 'Municipality', category: 'Kathmandu Metro (Stage 4 Validation)', target: 4, actual: 4, variancePercent: 0 },
        { dimension: 'Municipality', category: 'Pokhara Metro (Stage 4 Validation)', target: 4, actual: 4, variancePercent: 0 },
        { dimension: 'Municipality', category: 'Bharatpur Metro (Stage 3 Implementation)', target: 4, actual: 3, variancePercent: -25.0 }
      ],
      collectionSchedule: {
        frequency: 'Bi-annual',
        nextDueDate: '2026-11-15',
        assignee: 'Bikash Adhikari',
        overdue: false
      },
      notes: 'Qualitative Rubric: Stage 4 achieved. Municipal building permit software now automatically rejects non-compliant blueprints.'
    },
    // LogAlto Extended Indicator 9: Calculated / Composite Formula Indicator
    {
      id: 'ind-9',
      projectId: 'proj-bcrp',
      logframeId: 'lf-1',
      code: 'IND-COMPOSITE-01',
      title: 'Composite Disaster Preparedness & Seismic Safety Index (CDP-SSI)',
      level: 'Impact',
      indicatorType: 'calculated',
      calculatedFormula: '(([IND-BCRP-01] / 600) * 35) + (([IND-BCRP-02] / 45) * 35) + (([IND-BCRP-RATIO] / 75) * 30)',
      unit: 'Index Score (0-100)',
      baseline: 28.4,
      targetAnnual: 85.0,
      targetLOP: 95.0,
      actualQuarter: 89.2,
      actualTotal: 89.2,
      progressPercent: 104.9,
      frequency: 'Quarterly',
      meansOfVerification: 'LogAlto automated calculated formula model combining artisan certifications, committee resilience, and housing safety',
      dataSource: 'MEAL Central Database Engine & Multi-Indicator Aggregator',
      responsibleOfficer: 'Anil Maharjan & MEAL Director',
      status: 'on_track',
      disaggregation: {
        female: 1420,
        male: 1650,
        other: 0,
        pwd: 120,
        marginalized: 1850,
        youth: 1200
      },
      periodsProgress: [
        { period: 'Baseline', target: 28.4, actual: 28.4, variancePercent: 0, notes: 'Composite index baseline' },
        { period: 'Q1-2026', target: 50.0, actual: 52.8, variancePercent: 5.6, notes: 'Initial mason cohort progress' },
        { period: 'Q2-2026', target: 68.0, actual: 70.4, variancePercent: 3.5, notes: 'CDMC expansion in wards' },
        { period: 'Q3-2026', target: 85.0, actual: 89.2, variancePercent: 4.9, notes: 'High housing certification numbers' },
        { period: 'Q4-2026', target: 90.0, actual: 89.2, variancePercent: -0.9, notes: 'Projected Q4 synthesis' },
        { period: 'Annual Target', target: 85.0, actual: 89.2, variancePercent: 4.9, notes: 'Exceeded annual milestone' },
        { period: 'LOP Target', target: 95.0, actual: 89.2, variancePercent: 93.9, notes: 'LOP Target' }
      ],
      disaggregationMatrix: [
        { dimension: 'Sub-Component', category: 'Artisan Capacity Component (35% weight)', target: 35.0, actual: 36.2, variancePercent: 3.4 },
        { dimension: 'Sub-Component', category: 'Community Governance Component (35% weight)', target: 35.0, actual: 30.3, variancePercent: -13.4 },
        { dimension: 'Sub-Component', category: 'Shelter Retrofitting Component (30% weight)', target: 30.0, actual: 30.4, variancePercent: 1.3 }
      ],
      collectionSchedule: {
        frequency: 'Quarterly',
        nextDueDate: '2026-10-30',
        assignee: 'Anil Maharjan',
        overdue: false
      },
      notes: 'Calculated dynamically using formula: (([IND-BCRP-01] / 600) * 35) + (([IND-BCRP-02] / 45) * 35) + (([IND-BCRP-RATIO] / 75) * 30) = 89.2 / 100.'
    }
  ]);

  // LogAlto Form Builder Custom Forms
  readonly customForms = signal<CustomFormDef[]>([
    {
      id: 'form-pdm-1',
      projectId: 'proj-bcrp',
      title: 'Post-Distribution Monitoring (PDM) & Mason Toolset Verification',
      category: 'PDM',
      version: 'v2.4',
      status: 'Active',
      description: 'Collect post-distribution feedback from mason trainees, verifying toolkit completeness, tool condition, usage on sites, and GPS location.',
      linkedIndicatorId: 'ind-1',
      submissionsCount: 428,
      createdAt: '2026-06-15',
      lastUpdated: '2026-09-21',
      questions: [
        { id: 'q1', name: 'enumerator_name', label: 'Enumerator / MEAL Officer Name', type: 'text', required: true, hint: 'Full official name of surveyor' },
        { id: 'q2', name: 'interview_date', label: 'Date of Household / Site Interview', type: 'date', required: true },
        { id: 'q3', name: 'gps_point', label: 'GPS Geopoint of Interview Location', type: 'geopoint', required: true, hint: 'Acquire high accuracy GPS fix (<5m error)' },
        { id: 'q4', name: 'mason_name', label: 'Trained Mason Full Name', type: 'text', required: true },
        { id: 'q5', name: 'mason_gender', label: 'Gender of Beneficiary', type: 'select_one', required: true, options: ['Female', 'Male', 'Other'] },
        { id: 'q6', name: 'received_complete_kit', label: 'Did you receive the official CTEVT-approved mason toolkit?', type: 'select_one', required: true, options: ['Yes, complete set', 'Partial set only', 'No, not received'] },
        { id: 'q7', name: 'toolkit_items_missing', label: 'Which items were missing or defective?', type: 'select_multiple', required: false, options: ['Plumb bob', 'Spirit level', 'Mason trowel', 'Steel chisel', 'Measuring tape', 'Safety goggles'], skipLogic: { questionName: 'received_complete_kit', operator: 'equals', value: 'Partial set only' } },
        { id: 'q8', name: 'actively_employed', label: 'Are you currently employing seismic retrofitting techniques in masonry contracts?', type: 'select_one', required: true, options: ['Yes, actively building', 'Seeking new contracts', 'Employed elsewhere', 'Not working'] },
        { id: 'q9', name: 'average_monthly_income_npr', label: 'Current Average Monthly Earnings (NPR)', type: 'number', required: false, min: 5000, max: 200000, skipLogic: { questionName: 'actively_employed', operator: 'equals', value: 'Yes, actively building' } },
        { id: 'q10', name: 'satisfaction_rating', label: 'Overall training and toolkit satisfaction rating', type: 'rating', required: true, hint: '1 (Very Dissatisfied) to 5 (Exceeded Expectations)' },
        { id: 'q11', name: 'photo_voucher', label: 'Photo of Mason with Toolset and ID Card', type: 'image', required: false },
        { id: 'q12', name: 'mason_signature', label: 'Digital Sign-off / Signature of Mason', type: 'signature', required: true }
      ]
    },
    {
      id: 'form-school-2',
      projectId: 'proj-ssep',
      title: 'School Earthquake Evacuation & Child Safeguarding Audit Form',
      category: 'Routine Monitoring',
      version: 'v3.1',
      status: 'Active',
      description: 'Assess primary and secondary schools for structural stability, accessibility for disabled children, and time-to-evacuate stopwatch metrics during drills.',
      linkedIndicatorId: 'ind-4',
      submissionsCount: 165,
      createdAt: '2026-07-01',
      lastUpdated: '2026-09-22',
      questions: [
        { id: 'sq1', name: 'school_name', label: 'School Name & Official EMIS Code', type: 'text', required: true },
        { id: 'sq2', name: 'district_name', label: 'District', type: 'dropdown', required: true, options: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kavrepalanchok'] },
        { id: 'sq3', name: 'school_gps', label: 'GPS Geopoint of School Compound', type: 'geopoint', required: true },
        { id: 'sq4', name: 'enrolled_students', label: 'Total Enrolled Students', type: 'number', required: true, min: 10, max: 3000 },
        { id: 'sq5', name: 'pwd_students_count', label: 'Number of Students with Disabilities (PWD)', type: 'number', required: true, min: 0 },
        { id: 'sq6', name: 'drill_conducted_today', label: 'Was a simulation drill observed during this audit?', type: 'select_one', required: true, options: ['Yes', 'No, reviewing records only'] },
        { id: 'sq7', name: 'evacuation_time_seconds', label: 'Measured Time to Clear Building (Stopwatch Seconds)', type: 'number', required: true, min: 10, max: 900, skipLogic: { questionName: 'drill_conducted_today', operator: 'equals', value: 'Yes' } },
        { id: 'sq8', name: 'disabled_wheelchair_ramp_exists', label: 'Are classroom corridors and evacuation exits wheelchair accessible?', type: 'select_one', required: true, options: ['Fully accessible', 'Partial with steps', 'Inaccessible'] },
        { id: 'sq9', name: 'cracks_in_loadbearing_walls', label: 'Observable structural cracking in load-bearing walls?', type: 'select_one', required: true, options: ['None observed', 'Hairline plaster cracks (<1mm)', 'Significant diagonal shear cracks (>3mm)'] },
        { id: 'sq10', name: 'photo_drill', label: 'Photo of Evacuation Assembly Point', type: 'image', required: false },
        { id: 'sq11', name: 'headmaster_signature', label: 'Headmaster / Safety Focal Signature', type: 'signature', required: true }
      ]
    },
    {
      id: 'form-damage-3',
      projectId: 'proj-tdart',
      title: 'Rapid Post-Earthquake Building Damage Assessment (NDRRMA Level-1)',
      category: 'Rapid Damage',
      version: 'v4.0',
      status: 'Active',
      description: 'Used by structural engineers and rapid responders in field tablets within 72 hours of an earthquake to categorize building habitability.',
      linkedIndicatorId: 'ind-6',
      submissionsCount: 1850,
      createdAt: '2026-08-10',
      lastUpdated: '2026-09-22',
      questions: [
        { id: 'dq1', name: 'inspector_code', label: 'Rapid Assessment Team / Engineer ID', type: 'text', required: true },
        { id: 'dq2', name: 'inspection_gps', label: 'Building GPS Coordinates', type: 'geopoint', required: true },
        { id: 'dq3', name: 'building_typology', label: 'Structural Typology', type: 'select_one', required: true, options: ['Stone in Mud Mortar (SMM)', 'Brick in Mud Mortar (BMM)', 'Brick in Cement Mortar (BCM)', 'RCC Framed Structure', 'Timber/Lightweight'] },
        { id: 'dq4', name: 'damage_grade', label: 'EMS-98 Damage Grade', type: 'select_one', required: true, options: ['Grade 1 (Negligible)', 'Grade 2 (Moderate)', 'Grade 3 (Substantial)', 'Grade 4 (Very Heavy)', 'Grade 5 (Total Collapse)'] },
        { id: 'dq5', name: 'safety_placard', label: 'Safety Placard Assigned', type: 'select_one', required: true, options: ['Green (Inspected - Safe to Enter)', 'Yellow (Restricted Use)', 'Red (Unsafe - Keep Out)'] },
        { id: 'dq6', name: 'demolition_recommended', label: 'Immediate controlled demolition recommended?', type: 'select_one', required: true, options: ['Yes, imminent hazard', 'No, repairable', 'No, undamaged'] },
        { id: 'dq7', name: 'photo_building_damage', label: 'Photo of Structural Wall / Facade', type: 'image', required: true },
        { id: 'dq8', name: 'engineer_signature', label: 'Assessor Digital Signature', type: 'signature', required: true }
      ]
    }
  ]);

  // LogAlto Mobile Data Collection Submissions & Offline Sync Queue
  readonly mobileSubmissions = signal<MobileSubmission[]>([
    {
      id: 'sub-001',
      formId: 'form-pdm-1',
      formTitle: 'Post-Distribution Monitoring (PDM) & Mason Toolset Verification',
      enumeratorName: 'Maya Tamang (Field MEAL)',
      deviceId: 'SAMSUNG-SM-T500-MEAL-04',
      timestamp: '2026-09-22 14:32',
      isOfflineDraft: false,
      gps: { latitude: 27.7738, longitude: 85.7196, accuracy: 3.2, locationName: 'Chautara Sangachokgadhi, Ward 4' },
      photoAttached: true,
      photoUrl: '/assets/images/drr_mason_training_1790145551465.jpg',
      signatureCaptured: true,
      data: {
        enumerator_name: 'Maya Tamang',
        interview_date: '2026-09-22',
        mason_name: 'Bikram Thapa',
        mason_gender: 'Male',
        received_complete_kit: 'Yes, complete set',
        actively_employed: 'Yes, actively building',
        average_monthly_income_npr: 42000,
        satisfaction_rating: 5
      },
      syncStatus: 'synced',
      batteryLevel: 88,
      syncTimestamp: '2026-09-22 15:00'
    },
    {
      id: 'sub-002',
      formId: 'form-school-2',
      formTitle: 'School Earthquake Evacuation & Child Safeguarding Audit Form',
      enumeratorName: 'Ramesh Koirala (QA Officer)',
      deviceId: 'XIAOMI-PAD-MEAL-09',
      timestamp: '2026-09-22 11:15',
      isOfflineDraft: false,
      gps: { latitude: 27.6710, longitude: 85.3210, accuracy: 4.1, locationName: 'Lalitpur Ward 9, Patan' },
      photoAttached: true,
      signatureCaptured: true,
      data: {
        school_name: 'Shree Shanti Niketan Secondary School',
        district_name: 'Lalitpur',
        enrolled_students: 580,
        pwd_students_count: 14,
        drill_conducted_today: 'Yes',
        evacuation_time_seconds: 104,
        disabled_wheelchair_ramp_exists: 'Fully accessible',
        cracks_in_loadbearing_walls: 'None observed'
      },
      syncStatus: 'synced',
      batteryLevel: 74,
      syncTimestamp: '2026-09-22 12:30'
    },
    {
      id: 'sub-003',
      formId: 'form-pdm-1',
      formTitle: 'Post-Distribution Monitoring (PDM) & Mason Toolset Verification',
      enumeratorName: 'Santosh Neupane (TDART Officer)',
      deviceId: 'LENOVO-TAB-MEAL-02',
      timestamp: '2026-09-23 09:45',
      isOfflineDraft: true,
      gps: { latitude: 27.9541, longitude: 85.9452, accuracy: 4.8, locationName: 'Tatopani High Mountain Ridge, Sindhupalchok' },
      photoAttached: true,
      signatureCaptured: true,
      data: {
        enumerator_name: 'Santosh Neupane',
        interview_date: '2026-09-23',
        mason_name: 'Devaki Tamang',
        mason_gender: 'Female',
        received_complete_kit: 'Yes, complete set',
        actively_employed: 'Yes, actively building',
        average_monthly_income_npr: 38000,
        satisfaction_rating: 5
      },
      syncStatus: 'pending_sync',
      batteryLevel: 62
    },
    {
      id: 'sub-004',
      formId: 'form-damage-3',
      formTitle: 'Rapid Post-Earthquake Building Damage Assessment (NDRRMA Level-1)',
      enumeratorName: 'Er. Dipendra Gautam',
      deviceId: 'PANASONIC-TOUGHBOOK-MEAL-01',
      timestamp: '2026-09-23 10:20',
      isOfflineDraft: true,
      gps: { latitude: 28.7042, longitude: 82.2038, accuracy: 2.8, locationName: 'Bheri Municipality, Jajarkot' },
      photoAttached: true,
      signatureCaptured: true,
      data: {
        inspector_code: 'ENG-JAJ-04',
        building_typology: 'Stone in Mud Mortar (SMM)',
        damage_grade: 'Grade 3 (Substantial)',
        safety_placard: 'Yellow (Restricted Use)',
        demolition_recommended: 'No, repairable'
      },
      syncStatus: 'pending_sync',
      batteryLevel: 51
    }
  ]);

  // Offline Simulator Toggle for Mobile Collection
  readonly isSimulatedOffline = signal<boolean>(false);

  // LogAlto Customizable Dashboard Widgets Configuration
  readonly dashboardWidgets = signal<DashboardWidgetConfig[]>([
    { id: 'indicators_traffic', title: 'Indicator Traffic Light Snapshot', description: 'Real-time On Track, At Risk, Delayed & Exceeded indicators', icon: 'traffic', enabled: true, order: 1, width: 'half' },
    { id: 'achievement_chart', title: 'Quarterly Trajectory vs Target', description: 'Progress line across Q1-Q4 against annual milestone benchmarks', icon: 'trending_up', enabled: true, order: 2, width: 'half' },
    { id: 'gedsi_disaggregation', title: 'Gender & Social Inclusion (GEDSI)', description: 'Disaggregation reach by Gender, PWD, and Marginalized groups', icon: 'donut_large', enabled: true, order: 3, width: 'half' },
    { id: 'mobile_sync_feed', title: 'Mobile Data Collection & Offline Sync', description: 'Field submissions, GPS telemetry, and pending offline sync queue', icon: 'cell_tower', enabled: true, order: 4, width: 'half' },
    { id: 'cfrm_resolution', title: 'CFRM Accountability & Safeguarding SLA', description: 'Complaint resolution rates, average turnaround days, and channels', icon: 'support_agent', enabled: true, order: 5, width: 'half' },
    { id: 'geo_footprint', title: 'Nepal District Reach Map', description: 'Geospatial distribution of interventions across 14 target districts', icon: 'map', enabled: true, order: 6, width: 'half' },
    { id: 'dqa_radar', title: 'Data Quality Audit (DQA) Health Index', description: 'Assessment scores on Validity, Reliability, Precision, Integrity, Timeliness', icon: 'shield', enabled: true, order: 7, width: 'half' },
    { id: 'action_items', title: 'Critical Attention & Overdue Action Items', description: 'Immediate corrective measures flagged from field visits and audits', icon: 'warning', enabled: true, order: 8, width: 'half' }
  ]);

  // Dashboard View Level: Global Portfolio | Project-Specific | Field Operations
  readonly dashboardLevel = signal<'global' | 'project' | 'operations'>('global');

  readonly fieldVisits = signal<FieldVisit[]>([
    {
      id: 'fv-1',
      projectId: 'proj-bcrp',
      visitCode: 'FV-2026-042',
      visitDate: '2026-09-18',
      location: {
        province: 'Bagmati Province',
        district: 'Sindhupalchok',
        municipality: 'Chautara Sangachokgadhi Municipality',
        ward: 4,
        latitude: 27.7812,
        longitude: 85.7145
      },
      monitorName: 'Anil Maharjan',
      role: 'Senior MEAL Officer',
      objectives: 'Conduct unannounced quality benchmark monitoring on 7-day mason retrofitting training cohort and audit trainee attendance documentation.',
      qualityScorePercent: 94,
      checklists: [
        { id: 'c1', title: 'Trainer adherence to CTEVT accredited 7-day masonry curriculum', category: 'Training Quality', passed: true, observation: 'Theoretical safety module followed by full-scale 1:1 rebar bend test.' },
        { id: 'c2', title: 'Personal Protective Equipment (PPE) compliance for all trainees', category: 'Safeguarding & Safety', passed: true, observation: 'All 24 masons wearing hard hats, gloves, and steel-toe boots.' },
        { id: 'c3', title: 'Beneficiary attendance signed daily with national ID matches', category: 'Data Verification & Compliance', passed: true, observation: '24/24 signed rosters matched citizenship ID cards.' },
        { id: 'c4', title: 'Mortar batch ratio testing (1:4 cement:sand) strictly observed', category: 'Technical Standards', passed: false, observation: 'Batch 3 had minor moisture variation; corrective demonstration given immediately.' }
      ],
      actionPoints: [
        { id: 'ap-1', action: 'Calibrate sand moisture gauge for batching mortar in wet conditions', assignee: 'Lead Instructor Bikram', deadline: '2026-09-24', status: 'Resolved' },
        { id: 'ap-2', action: 'Upload final trainee practical examination sheets to digital archive', assignee: 'Anil Maharjan', deadline: '2026-09-28', status: 'In Progress' }
      ],
      photoUrl: '/assets/images/drr_mason_training_1790145551465.jpg',
      evidenceTitle: 'Mason retrofitting practical beam-joint reinforcement inspection at Chautara Ward 4',
      status: 'Completed'
    },
    {
      id: 'fv-2',
      projectId: 'proj-ssep',
      visitCode: 'FV-2026-043',
      visitDate: '2026-09-12',
      location: {
        province: 'Bagmati Province',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward: 16,
        latitude: 27.7214,
        longitude: 85.3092
      },
      monitorName: 'Maya Tamang',
      role: 'MEAL Field Officer',
      objectives: 'Verify school disaster simulation drill, evaluate student evacuation times, and audit school emergency kit contents.',
      qualityScorePercent: 88,
      checklists: [
        { id: 'c5', title: 'Drop, Cover, and Hold On executed within 15 seconds of siren', category: 'Drill Execution', passed: true, observation: '380 students took immediate cover under reinforced desks.' },
        { id: 'c6', title: 'Wheelchair-accessible ramp clear of obstacles during evacuation', category: 'Inclusion & Accessibility', passed: true, observation: 'Two students with mobility aids escorted safely by assigned buddies.' },
        { id: 'c7', title: 'Emergency first aid kit replenishment log updated', category: 'Compliance', passed: false, observation: 'Antiseptic solution expired 2 months ago; immediate restock requested.' }
      ],
      actionPoints: [
        { id: 'ap-3', action: 'Procure replacement medical consumables for school kit', assignee: 'Headmaster Gurung', deadline: '2026-09-20', status: 'Resolved' }
      ],
      photoUrl: '/assets/images/drr_school_safety_drill_1790145563154.jpg',
      evidenceTitle: 'Earthquake evacuation simulation drill at Bal Kalyan Secondary School',
      status: 'Completed'
    },
    {
      id: 'fv-3',
      projectId: 'proj-bcrp',
      visitCode: 'FV-2026-044',
      visitDate: '2026-09-20',
      location: {
        province: 'Gandaki Province',
        district: 'Gorkha',
        municipality: 'Gorkha Municipality',
        ward: 7,
        latitude: 28.0056,
        longitude: 84.6298
      },
      monitorName: 'Pradeep Bhattarai',
      role: 'Field MEAL Coordinator',
      objectives: 'Spot-check Community Disaster Risk Management Committee (CDMC) action plan documentation and inspect Ward Emergency Storehouse inventory.',
      qualityScorePercent: 91,
      checklists: [
        { id: 'c8', title: 'CDMC executive committee quorum includes at least 40% women', category: 'Gender & Inclusion', passed: true, observation: '8 women out of 15 executive members present (53%).' },
        { id: 'c9', title: 'Hazard vulnerability and capacity assessment (HVCA) map displayed', category: 'Visibility & Community Ownership', passed: true, observation: 'Map updated in August 2026 showing landslide and seismic fault lines.' },
        { id: 'c10', title: 'Search and rescue gear tested and functional', category: 'Readiness', passed: true, observation: 'Stretchers, ropes, generator, and megaphones inspected and working.' }
      ],
      actionPoints: [
        { id: 'ap-4', action: 'Submit signed CDMC meeting minutes to municipal ward secretary', assignee: 'Chairperson Karki', deadline: '2026-09-30', status: 'Open' }
      ],
      photoUrl: '/assets/images/drr_community_resilience_meeting_1790145573971.jpg',
      evidenceTitle: 'Community DRM committee quarterly review and hazard map reflection',
      status: 'Completed'
    }
  ]);

  readonly beneficiaries = signal<BeneficiaryRecord[]>(SEED_NEPAL_BENEFICIARIES);

  readonly dqaAssessments = signal<DqaAssessment[]>([
    {
      id: 'dqa-1',
      projectId: 'proj-bcrp',
      indicatorCode: 'IND-BCRP-01',
      indicatorTitle: 'Number of local masons certified in earthquake-resilient construction',
      assessmentDate: '2026-09-15',
      evaluator: 'Dr. Hari Krishna Shrestha (Lead DQA Assessor)',
      validityScore: 96,
      reliabilityScore: 92,
      precisionScore: 94,
      integrityScore: 98,
      timelinessScore: 90,
      overallScore: 94.0,
      status: 'Passed',
      sampleSize: 60,
      recordsVerified: 58,
      discrepancyCount: 2,
      recommendations: 'Data integrity is exemplary. Ensure telephone spot-checks verify masons currently working on active sites.'
    },
    {
      id: 'dqa-2',
      projectId: 'proj-ssep',
      indicatorCode: 'IND-SSEP-02',
      indicatorTitle: 'Number of students and teachers participating in simulated earthquake evacuation drills',
      assessmentDate: '2026-08-28',
      evaluator: 'Pratima Joshi (DQA Specialist)',
      validityScore: 88,
      reliabilityScore: 86,
      precisionScore: 90,
      integrityScore: 95,
      timelinessScore: 84,
      overallScore: 88.6,
      status: 'Passed',
      sampleSize: 120,
      recordsVerified: 114,
      discrepancyCount: 6,
      recommendations: 'Standardize school roster format across private and community schools to avoid headcount rounding.'
    }
  ]);

  readonly digitalForms = signal<DigitalForm[]>([
    {
      id: 'form-kobo-1',
      projectId: 'proj-bcrp',
      title: 'Post-Distribution Monitoring (PDM) - Mason Toolkits & Retrofitting Voucher',
      toolType: 'KoboToolbox',
      formCategory: 'PDM',
      version: 'v2.4 (2026)',
      submissionsCount: 412,
      status: 'Active',
      lastSyncDate: '2026-09-22 14:30',
      fields: [
        { name: 'beneficiary_id', label: 'Beneficiary National ID / Reg Number', type: 'text', required: true },
        { name: 'municipality', label: 'Municipality Name', type: 'select_one', required: true, options: ['Chautara Sangachokgadhi', 'Gorkha', 'Nilkantha', 'Melamchi'] },
        { name: 'ward', label: 'Ward Number', type: 'number', required: true },
        { name: 'toolkit_received', label: 'Did you receive all items in the mason toolkit?', type: 'select_one', required: true, options: ['Yes, complete set', 'Partial set', 'Damaged items', 'No, not received'] },
        { name: 'quality_rating', label: 'How would you rate the quality and usability of tools?', type: 'select_one', required: true, options: ['Excellent', 'Good', 'Adequate', 'Poor'] },
        { name: 'active_retrofitting', label: 'Are you currently employing seismic techniques on housing construction?', type: 'select_one', required: true, options: ['Yes, actively building', 'No, looking for contracts', 'Employed elsewhere'] },
        { name: 'gps_location', label: 'GPS Geopoint of interview', type: 'geopoint', required: true },
        { name: 'photo_toolkit', label: 'Photo of mason with toolkit voucher', type: 'image', required: false }
      ]
    },
    {
      id: 'form-odk-2',
      projectId: 'proj-tdart',
      title: 'Rapid Building Seismic Vulnerability & Damage Assessment (Level-1)',
      toolType: 'ODK Collect',
      formCategory: 'Rapid Damage',
      version: 'v4.1-NDRRMA',
      submissionsCount: 1850,
      status: 'Active',
      lastSyncDate: '2026-09-22 18:15',
      fields: [
        { name: 'building_code', label: 'Building ID / QR Code', type: 'text', required: true },
        { name: 'structure_type', label: 'Structural Typology', type: 'select_one', required: true, options: ['Stone in Mud Mortar (SMM)', 'Brick in Mud Mortar (BMM)', 'Brick in Cement Mortar (BCM)', 'RCC Framed Structure', 'Timber/Lightweight'] },
        { name: 'damage_grade', label: 'EMS-98 Damage Grade', type: 'select_one', required: true, options: ['Grade 1 (Negligible)', 'Grade 2 (Moderate)', 'Grade 3 (Substantial)', 'Grade 4 (Very Heavy)', 'Grade 5 (Destruction)'] },
        { name: 'placard_status', label: 'Safety Tag Assigned', type: 'select_one', required: true, options: ['Green (Inspected - Safe)', 'Yellow (Restricted Use)', 'Red (Unsafe)'] },
        { name: 'gps_coords', label: 'GPS Geopoint of building', type: 'geopoint', required: true }
      ]
    },
    {
      id: 'form-gform-3',
      projectId: 'proj-ssep',
      title: 'Baseline School Safety & Disaster Readiness Survey',
      toolType: 'Google Forms',
      formCategory: 'Baseline',
      version: 'v1.2',
      submissionsCount: 88,
      status: 'Active',
      lastSyncDate: '2026-09-21 09:00',
      fields: [
        { name: 'school_name', label: 'School Name & EMIS Code', type: 'text', required: true },
        { name: 'student_count', label: 'Total Enrolled Students', type: 'number', required: true },
        { name: 'emergency_plan_exists', label: 'Does the school have an approved School Disaster Management Plan?', type: 'select_one', required: true, options: ['Yes', 'Drafted', 'No'] },
        { name: 'drill_frequency', label: 'Frequency of evacuation drills conducted', type: 'select_one', required: true, options: ['Quarterly', 'Twice a year', 'Annually', 'Never'] }
      ]
    }
  ]);

  readonly complaints = signal<CfrmComplaint[]>([
    {
      id: 'cfrm-101',
      ticketNumber: 'CFRM-2026-089',
      projectId: 'proj-bcrp',
      submissionDate: '2026-09-17',
      channel: 'Toll-Free Hotline 1660',
      complainantName: 'Devaki Adhikari',
      isAnonymous: false,
      contactNumber: '9841890214',
      district: 'Sindhupalchok',
      municipality: 'Chautara Sangachokgadhi',
      ward: 4,
      category: 'Training Selection Dispute',
      urgency: 'Medium',
      description: 'Inquired why her ward neighbor was selected for mason training while her application was kept on waitlist despite submitting before the announced deadline.',
      investigationNotes: 'MEAL officer audited the selection score sheet. Devaki had tied in points with another applicant; however, preference was given to female-headed households per USAID inclusion criteria. Devaki was placed 1st on the waitlist for Cohort 2.',
      resolutionSummary: 'Contacted Devaki via phone and in person at Ward Office. Explained inclusion scoring transparently; confirmed her enrollment in Cohort 2 starting October 15.',
      feedbackGivenToComplainant: true,
      status: 'Closed',
      slaDaysRemaining: 0
    },
    {
      id: 'cfrm-102',
      ticketNumber: 'CFRM-2026-090',
      projectId: 'proj-bcrp',
      submissionDate: '2026-09-19',
      channel: 'Ward Suggestion Box',
      complainantName: undefined,
      isAnonymous: true,
      contactNumber: undefined,
      district: 'Gorkha',
      municipality: 'Gorkha Municipality',
      ward: 7,
      category: 'Quality of Construction',
      urgency: 'High',
      description: 'Reported that during foundation excavation for the community evacuation shelter demonstration model, local river sand appeared to have silt content exceeding standard specifications.',
      investigationNotes: 'Field Engineer and MEAL Assistant conducted a silt jar test on the sand stockpile on Sept 20. Silt content measured 7.8% (standard limit is <=6%). Stockpile quarantined.',
      resolutionSummary: 'Contractor instructed to wash and screen sand or replace with certified quarry river sand. Notice posted on community board with test results.',
      feedbackGivenToComplainant: true,
      status: 'Corrective Action Taken',
      slaDaysRemaining: 3
    },
    {
      id: 'cfrm-103',
      ticketNumber: 'CFRM-2026-091',
      projectId: 'proj-ssep',
      submissionDate: '2026-09-21',
      channel: 'Field Help Desk',
      complainantName: 'Rameshwor Kandel',
      isAnonymous: false,
      contactNumber: '9801237890',
      district: 'Kathmandu',
      municipality: 'Kathmandu Met',
      ward: 16,
      category: 'General DRR Inquiry',
      urgency: 'Low',
      description: 'Requested digital copies of Earthquake Safety Day posters and retrofitting brochures to share with the neighborhood youth club.',
      investigationNotes: 'Request verified as a public awareness outreach opportunity.',
      resolutionSummary: 'Digital PDF bundle emailed, and 50 printed brochures and posters dispatched to his address.',
      feedbackGivenToComplainant: true,
      status: 'Closed',
      slaDaysRemaining: 0
    },
    {
      id: 'cfrm-104',
      ticketNumber: 'CFRM-2026-092',
      projectId: 'proj-bcrp',
      submissionDate: '2026-09-22',
      channel: 'Toll-Free Hotline 1660',
      complainantName: 'Confidential Caller',
      isAnonymous: true,
      contactNumber: undefined,
      district: 'Sindhupalchok',
      municipality: 'Melamchi',
      ward: 2,
      category: 'Safeguarding / Protection',
      urgency: 'Critical Safeguarding',
      description: 'Reported concern regarding inappropriate informal language used by a sub-contractor transport driver towards female community volunteers during material unloading.',
      investigationNotes: 'Transferred immediately to Executive Safeguarding and PSEA Focal Point under strict confidentiality protocols. Inquiry initiated within 6 hours.',
      resolutionSummary: undefined,
      feedbackGivenToComplainant: false,
      status: 'Under Investigation',
      slaDaysRemaining: 1
    }
  ]);

  readonly lessonsLearned = signal<LessonLearned[]>([
    {
      id: 'll-1',
      projectId: 'proj-bcrp',
      title: 'Pairing Female Mason Apprentices with Master Technicians Accelerates Community Trust & Acceptance',
      thematicArea: 'Mason Certification',
      context: 'In rural hills of Sindhupalchok and Gorkha, traditional patriarchal norms initially questioned women masons performing heavy structural tasks.',
      challengeFaced: 'Initial drop-out risk of 15% among women trainees during physical stone dressing and heavy rebar bending modules.',
      lessonDiscovered: 'Pairing female trainees with certified senior women master masons and providing childcare stipends increased graduation rate from 78% to 96%. Furthermore, homeowners reported higher satisfaction with female masons due to attention to mortar joint cleanliness and punctual working hours.',
      actionableRecommendation: 'Mandate a 1:4 mentor-to-apprentice ratio for women in all future mason training projects and include safe transit/childcare support in the MEAL operational plan.',
      author: 'Anil Maharjan (MEAL Officer)',
      dateLogged: '2026-09-15'
    },
    {
      id: 'll-2',
      projectId: 'proj-ssep',
      title: 'Unannounced Mini-Drills Yield 3x More Accurate Emergency Evacuation Baselines than Pre-Announced Drills',
      thematicArea: 'School Safety',
      context: 'School disaster drills have traditionally been scheduled with days of advance notice to teachers and student leaders.',
      challengeFaced: 'Pre-announced drills resulted in artificially low evacuation times (1m 10s), while observation during actual minor tremors showed students hesitant and panic-prone.',
      lessonDiscovered: 'Conducting unscheduled flash simulation drills with MEAL stopwatch timers revealed realistic bottlenecks (narrow stairways, locked back exits, and blocked corridors).',
      actionableRecommendation: 'Transition MEAL indicator verification protocol to 50% scheduled and 50% random unannounced drills across all retrofitted schools.',
      author: 'Maya Tamang (MEAL Field Officer)',
      dateLogged: '2026-08-30'
    },
    {
      id: 'll-3',
      projectId: 'proj-surp',
      title: 'Municipal Building Permit Verification Requires On-Site Mobile Audits, Not Just Paper Submissions',
      thematicArea: 'Municipal DRR Policy',
      context: 'Municipalities in Kathmandu Valley rely on Electronic Building Permit Systems (EBPS) for drawing approvals.',
      challengeFaced: 'Homebuilders frequently received approved drawings with NBC 105 seismic bands, but deviated on-site during actual rebar casting.',
      lessonDiscovered: 'Providing municipal sub-engineers with Kobo-based 4-stage mobile inspection forms (Plinth, Lintel, Roof, Finishing) increased structural compliance from 54% to 89%.',
      actionableRecommendation: 'Tie municipal property occupancy certificates directly to digital MEAL inspection sign-offs.',
      author: 'Er. Dipendra Gautam',
      dateLogged: '2026-07-22'
    }
  ]);

  readonly caseStudies = signal<CaseStudy[]>([
    {
      id: 'cs-1',
      projectId: 'proj-bcrp',
      title: 'From Devastation to Master Mason: Sunita Thapa Rebuilds Her Community with Seismic Steel',
      heroImage: '/assets/images/drr_mason_training_1790145551465.jpg',
      beneficiaryName: 'Sunita Thapa (Age 34, Lead Certified Mason)',
      location: 'Chautara Sangachokgadhi Municipality, Ward 4, Sindhupalchok',
      theChallenge: 'When the devastating 2015 earthquake struck, Sunita watched her ancestral stone-and-mud house collapse into rubble. As a single mother in a remote mountain hamlet, she spent years relying on ad-hoc repairs that remained vulnerable to recurring tremors.',
      theIntervention: 'Through the USAID-funded Building Community Resilience Program (BCRP), Sunita enrolled in an intensive 7-day CTEVT-accredited seismic retrofitting course. Over 56 hours of rigorous practical instruction, she mastered rebar detailing, 135-degree seismic hooks, lintel band casting, and mortar batch control under close MEAL monitoring.',
      measurableImpact: 'Certified as a Level-1 Construction Artisan, Sunita has already led the retrofitting of 6 residential homes and a community childcare center, safeguarding over 42 family members. She now earns NPR 1,200 per day—triple her previous income—and mentors 18 young women apprentices in her ward.',
      directQuote: 'Before this training, people in our village believed only men could build walls that stand against earthquakes. Today, when neighbors want a house that will protect their children, they call our women’s masonry group. The steel bands we tie aren’t just holding bricks together; they are holding our future together.',
      quoteAuthor: 'Sunita Thapa, Lead Certified Mason',
      publishedDate: '2026-09-18',
      author: 'Anil Maharjan (MEAL) & Communication Desk',
      donorVisibility: 'Funded by the American People through USAID/BHA · Implemented by MEAL Operations'
    },
    {
      id: 'cs-2',
      projectId: 'proj-ssep',
      title: 'Two Minutes to Safety: How Bal Kalyan Secondary School Turned Panic into Precision',
      heroImage: '/assets/images/drr_school_safety_drill_1790145563154.jpg',
      beneficiaryName: 'Headmaster D.B. Gurung & Student DRR Brigade',
      location: 'Bal Kalyan Secondary School, Kathmandu Metropolitan City, Ward 16',
      theChallenge: 'With 380 energetic students housed in a dense three-story urban brick masonry wing, an unannounced seismic event posed immense danger of stampede and structural entrapment.',
      theIntervention: 'The Safer Schools Program retrofitted the primary building with external steel bracing and installed a comprehensive School Disaster Management Plan. MEAL officers established bi-monthly simulation drills with real-time stopwatch metrics and buddy systems for students with physical disabilities.',
      measurableImpact: 'Evacuation time from top-floor classrooms to designated open-ground safe zones plummeted from 4 minutes 15 seconds to an astonishing 1 minute 48 seconds, with zero stumble injuries recorded across five consecutive monitoring audits.',
      directQuote: 'When the alarm sounds now, there is no screaming or pushing. Every child instinctively takes cover under their desk, protects their head with a schoolbag, and follows their designated buddy out into the courtyard. The program has replaced dread with discipline and confidence.',
      quoteAuthor: 'D.B. Gurung, Headmaster',
      publishedDate: '2026-09-14',
      author: 'Maya Tamang (MEAL Field Officer)',
      donorVisibility: 'Supported by FCDO & UNICEF Nepal · Technical Leadership by MEAL Directorate'
    }
  ]);

  readonly reviewMeetings = signal<ReviewMeeting[]>([
    {
      id: 'rm-1',
      projectId: 'proj-bcrp',
      meetingTitle: 'Q3 FY2026 MEAL Quarterly Review & Reflection Meeting',
      meetingType: 'Quarterly Review & Reflection',
      date: '2026-09-16',
      participantsCount: 26,
      keyDecisions: [
        'Reprogram 15% surplus budget from logistics into additional mason toolkits for female graduates in Gorkha.',
        'Adopt revised Kobo PDM survey with simplified vernacular Nepali questions.',
        'Accelerate municipal CDMC endorsements ahead of the local government fiscal deadline.'
      ],
      actionItems: [
        { action: 'Submit updated PDM survey tool to USAID AOR for concurrence', owner: 'MEAL Lead Anil Maharjan', dueDate: '2026-09-25', done: true },
        { action: 'Coordinate with Gorkha Municipality Ward 7 for mason toolkit handover event', owner: 'Pradeep Bhattarai', dueDate: '2026-09-30', done: false },
        { action: 'Compile Q3 MEAL evidence dossier and DQA audit certificate', owner: 'Data Specialist Ritu', dueDate: '2026-10-05', done: false }
      ]
    },
    {
      id: 'rm-2',
      projectId: 'proj-ssep',
      meetingTitle: 'After-Action Review (AAR): Valley-Wide School Safety Simulation Drills',
      meetingType: 'After-Action Review (AAR)',
      date: '2026-09-08',
      participantsCount: 34,
      keyDecisions: [
        'All schools must replace expired first-aid consumables within 14 days of inspection.',
        'Introduce braille exit signage in public secondary schools with visually impaired students.'
      ],
      actionItems: [
        { action: 'Dispatch 80 first-aid refill packs to target schools', owner: 'Logistics Desk', dueDate: '2026-09-22', done: true },
        { action: 'Publish AAR brief on portal and distribute to education cluster', owner: 'Communications Officer', dueDate: '2026-09-26', done: false }
      ]
    }
  ]);

  readonly visibilityAssets = signal<VisibilityAsset[]>([
    {
      id: 'vis-1',
      projectId: 'proj-bcrp',
      type: 'Factsheet',
      title: 'Building Community Resilience Program (BCRP)',
      subtitle: 'Seismic Safety, Mason Empowerment & Community Preparedness in Mountain Nepal',
      stats: [
        { label: 'Direct Beneficiaries Reached', value: '28,400+' },
        { label: 'Certified Earthquake Masons', value: '620 Artisans' },
        { label: 'Community DRM Plans Endorsed', value: '39 Palikas' },
        { label: 'DQA Accuracy Verification', value: '94.0%' }
      ],
      primaryColor: '#0f766e', // Teal 700
      orgLogo: true,
      donorLogo: 'USAID / BHA',
      highlightText: 'Over 32% of certified earthquake-resistant masons are women breaking traditional barriers in post-disaster Nepal.',
      imageUrl: '/assets/images/drr_mason_training_1790145551465.jpg',
      targetAudience: 'Donors, Municipal Mayors, DRR Cluster, Humanitarian Partners'
    },
    {
      id: 'vis-2',
      projectId: 'proj-ssep',
      type: 'Poster',
      title: 'Earthquake Safety in Our Schools: Drop, Cover, Hold On!',
      subtitle: 'National Earthquake Safety Campaign · Institutional Safety Standards',
      stats: [
        { label: 'Schools Certified Resilient', value: '18 Blocks' },
        { label: 'Students & Teachers Drilled', value: '16,900' },
        { label: 'Avg Evacuation Time', value: '1m 48s' },
        { label: 'Safety Kits Deployed', value: '80 Schools' }
      ],
      primaryColor: '#b91c1c', // Red 700
      orgLogo: true,
      donorLogo: 'FCDO / UNICEF',
      highlightText: 'Practice makes safe: unannounced simulation drills empower our children with lifesaving instincts.',
      imageUrl: '/assets/images/drr_school_safety_drill_1790145563154.jpg',
      targetAudience: 'Schools, Parent-Teacher Associations, Municipal Education Departments'
    },
    {
      id: 'vis-3',
      projectId: 'proj-bcrp',
      type: 'Infographic',
      title: 'Accountability & Feedback Loop (CFRM) 2026 Snapshot',
      subtitle: 'Transparent, Community-Authoritative Disaster Resilience Monitoring',
      stats: [
        { label: 'Total Feedback Logged', value: '92 Cases' },
        { label: 'Resolution Rate', value: '94.2%' },
        { label: 'Avg Resolution SLA', value: '2.1 Days' },
        { label: 'Safeguarding Audit Status', value: '100% Closed' }
      ],
      primaryColor: '#1e3a8a', // Blue 900
      orgLogo: true,
      donorLogo: 'CHS Alliance / USAID',
      highlightText: 'Zero-tolerance for safeguarding violations with confidential toll-free hotline and community-level feedback boxes.',
      imageUrl: '/assets/images/drr_community_resilience_meeting_1790145573971.jpg',
      targetAudience: 'Beneficiaries, Community Leaders, Auditor Panels'
    }
  ]);

  readonly evidenceDocuments = signal<EvidenceDocument[]>([
    {
      id: 'doc-1',
      projectId: 'proj-bcrp',
      title: 'CTEVT Mason Training Practical Exam & Certification Attendance Sheets (Batch 14)',
      docType: 'Attendance Sheet',
      fileName: 'BCRP_Mason_Batch14_Attendance_Verified.pdf',
      fileSize: '4.8 MB',
      uploadedDate: '2026-09-18',
      verified: true,
      tags: ['Chautara', 'Mason Certification', 'CTEVT', 'MoV']
    },
    {
      id: 'doc-2',
      projectId: 'proj-bcrp',
      title: 'Data Quality Assessment (DQA) Independent Audit Certificate & Report',
      docType: 'DQA Report',
      fileName: 'USAID_BHA_DQA_Audit_Synthesis_Q3_2026.pdf',
      fileSize: '2.4 MB',
      uploadedDate: '2026-09-16',
      verified: true,
      tags: ['DQA', 'Audit', 'USAID', 'Compliance']
    },
    {
      id: 'doc-3',
      projectId: 'proj-ssep',
      title: 'Structural Engineer Retrofitting Completion Sign-off & Certificate (Bal Kalyan School)',
      docType: 'Engineer Sign-off',
      fileName: 'Bal_Kalyan_Retrofitting_Structural_Signoff.pdf',
      fileSize: '8.1 MB',
      uploadedDate: '2026-09-12',
      verified: true,
      tags: ['School Retrofitting', 'Structural Certificate', 'Kathmandu']
    },
    {
      id: 'doc-4',
      projectId: 'proj-bcrp',
      title: 'Memorandum of Understanding (MoU) with Gorkha Municipality on Local DRR Fund',
      docType: 'MoU with Palika',
      fileName: 'MoU_Gorkha_Municipality_BCRP_2026.pdf',
      fileSize: '1.9 MB',
      uploadedDate: '2026-08-20',
      verified: true,
      tags: ['MoU', 'Gorkha', 'Local Government', 'Governance']
    },
    {
      id: 'doc-5',
      projectId: 'proj-tdart',
      title: 'Post-Earthquake Rapid Damage Assessment (Level-1) Kobo Database Export',
      docType: 'DQA Report',
      fileName: 'Kobo_TDART_Damage_Assessment_Export_Verified.xlsx',
      fileSize: '12.6 MB',
      uploadedDate: '2026-09-22',
      verified: true,
      tags: ['KoboToolbox', 'Damage Assessment', 'NDRRMA', 'Raw Data']
    }
  ]);

  // Computed Portfolio Metrics
  readonly activeProject = computed(() => {
    const pId = this.selectedProjectId();
    if (pId === 'all') return null;
    return this.projects().find(p => p.id === pId) || null;
  });

  readonly filteredIndicators = computed(() => {
    const pId = this.selectedProjectId();
    const q = this.searchQuery().toLowerCase().trim();
    let list = this.indicators();
    if (pId !== 'all') {
      list = list.filter(i => i.projectId === pId);
    }
    if (q) {
      list = list.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q) ||
        i.dataSource.toLowerCase().includes(q)
      );
    }
    return list;
  });

  readonly filteredBeneficiaries = computed(() => {
    const pId = this.selectedProjectId();
    const q = this.searchQuery().toLowerCase().trim();
    const geo = this.geoService.geoFilter();
    let list = this.beneficiaries();
    if (pId !== 'all') {
      list = list.filter(b => b.projectId === pId);
    }
    if (geo.districtName) {
      list = list.filter(b => b.district.toLowerCase() === geo.districtName!.toLowerCase());
    }
    if (geo.municipalityName) {
      list = list.filter(b => b.municipality.toLowerCase().includes(geo.municipalityName!.toLowerCase()));
    }
    if (geo.ward) {
      list = list.filter(b => b.ward === geo.ward);
    }
    if (q) {
      list = list.filter(b =>
        b.fullName.toLowerCase().includes(q) ||
        b.beneficiaryCode.toLowerCase().includes(q) ||
        b.citizenshipNumber.toLowerCase().includes(q) ||
        b.municipality.toLowerCase().includes(q) ||
        b.intervention.toLowerCase().includes(q)
      );
    }
    return list;
  });

  readonly filteredFieldVisits = computed(() => {
    const pId = this.selectedProjectId();
    const q = this.searchQuery().toLowerCase().trim();
    const geo = this.geoService.geoFilter();
    let list = this.fieldVisits();
    if (pId !== 'all') {
      list = list.filter(f => f.projectId === pId);
    }
    if (geo.districtName) {
      list = list.filter(f => f.location.district.toLowerCase() === geo.districtName!.toLowerCase());
    }
    if (geo.municipalityName) {
      list = list.filter(f => f.location.municipality.toLowerCase().includes(geo.municipalityName!.toLowerCase()));
    }
    if (geo.ward) {
      list = list.filter(f => f.location.ward === geo.ward);
    }
    if (q) {
      list = list.filter(f =>
        f.visitCode.toLowerCase().includes(q) ||
        f.location.municipality.toLowerCase().includes(q) ||
        f.monitorName.toLowerCase().includes(q) ||
        f.objectives.toLowerCase().includes(q)
      );
    }
    return list;
  });

  readonly filteredComplaints = computed(() => {
    const pId = this.selectedProjectId();
    const q = this.searchQuery().toLowerCase().trim();
    const geo = this.geoService.geoFilter();
    let list = this.complaints();
    if (pId !== 'all') {
      list = list.filter(c => c.projectId === pId);
    }
    if (geo.districtName) {
      list = list.filter(c => c.district.toLowerCase() === geo.districtName!.toLowerCase());
    }
    if (geo.municipalityName) {
      list = list.filter(c => c.municipality.toLowerCase().includes(geo.municipalityName!.toLowerCase()));
    }
    if (geo.ward) {
      list = list.filter(c => c.ward === geo.ward);
    }
    if (q) {
      list = list.filter(c =>
        c.ticketNumber.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.complainantName && c.complainantName.toLowerCase().includes(q))
      );
    }
    return list;
  });

  readonly filteredGanttActivities = computed(() => {
    const pId = this.selectedProjectId();
    const q = this.searchQuery().toLowerCase().trim();
    let list = this.ganttActivities();
    if (pId !== 'all') {
      list = list.filter(g => g.projectId === pId);
    }
    if (q) {
      list = list.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.code.toLowerCase().includes(q) ||
        g.component.toLowerCase().includes(q) ||
        g.assignee.toLowerCase().includes(q)
      );
    }
    return list;
  });

  readonly summaryStats = computed(() => {
    const pId = this.selectedProjectId();
    const indList = pId === 'all' ? this.indicators() : this.indicators().filter(i => i.projectId === pId);
    const benList = pId === 'all' ? this.beneficiaries() : this.beneficiaries().filter(b => b.projectId === pId);
    const fvList = pId === 'all' ? this.fieldVisits() : this.fieldVisits().filter(f => f.projectId === pId);
    const cfrmList = pId === 'all' ? this.complaints() : this.complaints().filter(c => c.projectId === pId);

    const totalBeneficiaries = benList.length;
    const verifiedBeneficiaries = benList.filter(b => b.verificationStatus === 'Verified').length;
    const flaggedDuplicates = benList.filter(b => b.verificationStatus === 'Flagged Duplicate').length;
    const onTrackIndicators = indList.filter(i => i.status === 'on_track').length;
    const warningIndicators = indList.filter(i => i.status === 'warning').length;
    const totalIndicators = indList.length;

    const avgQualityScore = fvList.length > 0
      ? Math.round(fvList.reduce((acc, f) => acc + f.qualityScorePercent, 0) / fvList.length)
      : 0;

    const totalComplaints = cfrmList.length;
    const resolvedComplaints = cfrmList.filter(c => c.status === 'Closed' || c.status === 'Corrective Action Taken').length;
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 100;

    // Disaggregation totals from indicators
    const femaleReach = indList.reduce((acc, i) => acc + i.disaggregation.female, 0);
    const maleReach = indList.reduce((acc, i) => acc + i.disaggregation.male, 0);
    const marginalizedReach = indList.reduce((acc, i) => acc + i.disaggregation.marginalized, 0);
    const pwdReach = indList.reduce((acc, i) => acc + i.disaggregation.pwd, 0);

    return {
      totalBeneficiaries,
      verifiedBeneficiaries,
      flaggedDuplicates,
      onTrackIndicators,
      warningIndicators,
      totalIndicators,
      avgQualityScore,
      totalComplaints,
      resolvedComplaints,
      resolutionRate,
      femaleReach,
      maleReach,
      marginalizedReach,
      pwdReach
    };
  });

  // Action methods
  setProjectFilter(projectId: string) {
    this.selectedProjectId.set(projectId);
  }

  setSearchQuery(q: string) {
    this.searchQuery.set(q);
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  // Beneficiary verification methods
  verifyBeneficiary(id: string, verifiedBy = 'MEAL Officer') {
    this.beneficiaries.update(list =>
      list.map(b => b.id === id ? {
        ...b,
        verificationStatus: 'Verified' as const,
        verifiedDate: new Date().toISOString().split('T')[0],
        verifiedBy,
        dqaNotes: 'Verified via spot check and documentation matching.'
      } : b)
    );
  }

  flagDuplicate(id: string, reason: string) {
    this.beneficiaries.update(list =>
      list.map(b => b.id === id ? {
        ...b,
        verificationStatus: 'Flagged Duplicate' as const,
        dqaNotes: reason
      } : b)
    );
  }

  addBeneficiary(ben: Omit<BeneficiaryRecord, 'id' | 'beneficiaryCode'>) {
    const newId = 'ben-' + Date.now();
    const newCode = `BEN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: BeneficiaryRecord = {
      ...ben,
      id: newId,
      beneficiaryCode: newCode
    };
    this.beneficiaries.update(list => [newRecord, ...list]);
  }

  // CFRM complaint management
  addComplaint(comp: Omit<CfrmComplaint, 'id' | 'ticketNumber' | 'submissionDate' | 'status' | 'feedbackGivenToComplainant' | 'slaDaysRemaining'>) {
    const newId = 'cfrm-' + Date.now();
    const newTicket = `CFRM-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: CfrmComplaint = {
      ...comp,
      id: newId,
      ticketNumber: newTicket,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'New',
      feedbackGivenToComplainant: false,
      slaDaysRemaining: comp.urgency === 'Critical Safeguarding' ? 1 : (comp.urgency === 'High' ? 3 : 7)
    };
    this.complaints.update(list => [newRecord, ...list]);
  }

  updateComplaintStatus(id: string, status: CfrmComplaint['status'], resolutionSummary?: string) {
    this.complaints.update(list =>
      list.map(c => c.id === id ? {
        ...c,
        status,
        resolutionSummary: resolutionSummary || c.resolutionSummary,
        feedbackGivenToComplainant: status === 'Closed' ? true : c.feedbackGivenToComplainant
      } : c)
    );
  }

  // Field visit actions
  addFieldVisit(fv: Omit<FieldVisit, 'id' | 'visitCode'>) {
    const newId = 'fv-' + Date.now();
    const newCode = `FV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: FieldVisit = {
      ...fv,
      id: newId,
      visitCode: newCode
    };
    this.fieldVisits.update(list => [newRecord, ...list]);
  }

  // Indicator actions
  addIndicator(ind: Omit<MealIndicator, 'id' | 'code' | 'progressPercent'>) {
    const newId = 'ind-' + Date.now();
    const pCode = this.projects().find(p => p.id === ind.projectId)?.code || 'IND';
    const newCode = `${pCode}-IND-${Math.floor(10 + Math.random() * 90)}`;
    const progress = ind.targetAnnual > 0 ? Math.round((ind.actualTotal / ind.targetAnnual) * 1000) / 10 : 0;
    const newRecord: MealIndicator = {
      ...ind,
      id: newId,
      code: newCode,
      progressPercent: progress,
      status: progress >= 90 ? 'on_track' : (progress >= 70 ? 'warning' : 'off_track')
    };
    this.indicators.update(list => [newRecord, ...list]);
  }

  updateIndicatorActuals(id: string, actualQuarter: number, actualTotal: number) {
    this.indicators.update(list =>
      list.map(i => {
        if (i.id !== id) return i;
        const progress = i.targetAnnual > 0 ? Math.round((actualTotal / i.targetAnnual) * 1000) / 10 : 0;
        return {
          ...i,
          actualQuarter,
          actualTotal,
          progressPercent: progress,
          status: progress >= 90 ? 'on_track' : (progress >= 70 ? 'warning' : 'off_track')
        };
      })
    );
  }

  // Lessons learned & case studies
  addLessonLearned(lesson: Omit<LessonLearned, 'id' | 'dateLogged'>) {
    const newId = 'll-' + Date.now();
    const newRecord: LessonLearned = {
      ...lesson,
      id: newId,
      dateLogged: new Date().toISOString().split('T')[0]
    };
    this.lessonsLearned.update(list => [newRecord, ...list]);
  }

  addCaseStudy(cs: Omit<CaseStudy, 'id' | 'publishedDate'>) {
    const newId = 'cs-' + Date.now();
    const newRecord: CaseStudy = {
      ...cs,
      id: newId,
      publishedDate: new Date().toISOString().split('T')[0]
    };
    this.caseStudies.update(list => [newRecord, ...list]);
  }

  // Gantt Chart Actions
  addGanttActivity(activity: Omit<GanttActivity, 'id'>) {
    const newId = 'gantt-' + Date.now();
    const newAct: GanttActivity = {
      ...activity,
      id: newId
    };
    this.ganttActivities.update(list => [...list, newAct]);
  }

  updateGanttProgress(id: string, progress: number, status?: GanttActivity['status']) {
    this.ganttActivities.update(list =>
      list.map(act => {
        if (act.id !== id) return act;
        const newProgress = Math.max(0, Math.min(100, progress));
        const derivedStatus = status || (newProgress >= 100 ? 'Completed' : (newProgress > 0 ? 'In Progress' : 'Scheduled'));
        return {
          ...act,
          progressPercent: newProgress,
          status: derivedStatus
        };
      })
    );
  }

  deleteGanttActivity(id: string) {
    this.ganttActivities.update(list => list.filter(act => act.id !== id));
  }

  // Admin Custom Menu Manager Actions
  toggleAdminMenuItem(id: string) {
    this.adminMenuItems.update(items =>
      items.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item)
    );
  }

  reorderAdminMenuItem(id: string, direction: 'up' | 'down') {
    this.adminMenuItems.update(items => {
      const idx = items.findIndex(item => item.id === id);
      if (idx === -1) return items;
      if (direction === 'up' && idx > 0) {
        const copy = [...items];
        const temp = copy[idx];
        copy[idx] = copy[idx - 1];
        copy[idx - 1] = temp;
        return copy.map((item, i) => ({ ...item, order: i + 1 }));
      }
      if (direction === 'down' && idx < items.length - 1) {
        const copy = [...items];
        const temp = copy[idx];
        copy[idx] = copy[idx + 1];
        copy[idx + 1] = temp;
        return copy.map((item, i) => ({ ...item, order: i + 1 }));
      }
      return items;
    });
  }

  addCustomAdminMenuItem(item: Omit<AdminMenuItem, 'id'>) {
    const newId = 'custom-menu-' + Date.now();
    const newItem: AdminMenuItem = {
      ...item,
      id: newId,
      isCustom: true,
      order: this.adminMenuItems().length + 1
    };
    this.adminMenuItems.update(list => [...list, newItem]);
  }

  // Custom Fields & Indicator Designer Actions
  addCustomField(field: Omit<CustomFieldDefinition, 'id'>) {
    const newId = 'cf-' + Date.now();
    const newField: CustomFieldDefinition = {
      ...field,
      id: newId
    };
    this.customFields.update(list => [...list, newField]);
  }

  deleteCustomField(id: string) {
    this.customFields.update(list => list.filter(f => f.id !== id));
  }

  addCustomIndicator(ind: Omit<CustomIndicatorConfig, 'id'>) {
    const newId = 'ci-' + Date.now();
    const newInd: CustomIndicatorConfig = {
      ...ind,
      id: newId
    };
    this.customIndicators.update(list => [...list, newInd]);
  }

  toggleCustomIndicator(id: string) {
    this.customIndicators.update(list =>
      list.map(i => i.id === id ? { ...i, active: !i.active } : i)
    );
  }

  // Organization Profile & RBAC Settings
  updateOrgProfile(profileUpdate: Partial<OrganizationProfile>) {
    this.orgProfile.update(current => ({ ...current, ...profileUpdate }));
  }

  updateRolePermission(roleId: string, perms: Partial<RolePermission>) {
    this.rolePermissions.update(list =>
      list.map(r => r.roleId === roleId ? { ...r, ...perms } : r)
    );
  }

  // Form submission simulation
  simulateKoboSubmission(formId: string, count = 1) {
    this.digitalForms.update(list =>
      list.map(f => f.id === formId ? {
        ...f,
        submissionsCount: f.submissionsCount + count,
        lastSyncDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
      } : f)
    );
  }

  // LogAlto Indicator Tracking Actions
  updatePeriodicActual(indicatorId: string, periodName: string, actualValue: number, notes?: string, verifiedBy?: string) {
    this.indicators.update(list =>
      list.map(ind => {
        if (ind.id !== indicatorId) return ind;
        const periods = ind.periodsProgress || [];
        const updatedPeriods = periods.map(p => {
          if (p.period !== periodName) return p;
          const variance = p.target > 0 ? Math.round(((actualValue - p.target) / p.target) * 1000) / 10 : 0;
          return {
            ...p,
            actual: actualValue,
            variancePercent: variance,
            notes: notes || p.notes,
            verifiedBy: verifiedBy || p.verifiedBy || 'MEAL Officer',
            updatedAt: new Date().toISOString().split('T')[0]
          };
        });

        // Compute updated actual total if updating quarter or annual period
        let total = ind.actualTotal;
        if (periodName.includes('Q') || periodName.includes('Annual')) {
          total = updatedPeriods
            .filter(p => p.period.startsWith('Q'))
            .reduce((sum, curr) => sum + curr.actual, 0) || actualValue;
        }

        const progress = ind.targetAnnual > 0 ? Math.round((total / ind.targetAnnual) * 1000) / 10 : 0;
        return {
          ...ind,
          actualTotal: total,
          progressPercent: progress,
          status: progress >= 90 ? 'on_track' : (progress >= 70 ? 'warning' : 'off_track'),
          periodsProgress: updatedPeriods
        };
      })
    );
  }

  updateRatioIndicator(indicatorId: string, numerator: number, denominator: number) {
    this.indicators.update(list =>
      list.map(ind => {
        if (ind.id !== indicatorId) return ind;
        const ratioPercent = denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : 0;
        const progress = ind.targetAnnual > 0 ? Math.round((ratioPercent / ind.targetAnnual) * 1000) / 10 : 0;
        return {
          ...ind,
          numerator,
          denominator,
          actualTotal: numerator,
          actualQuarter: ratioPercent,
          progressPercent: progress,
          status: progress >= 90 ? 'on_track' : (progress >= 70 ? 'warning' : 'off_track')
        };
      })
    );
  }

  updateQualitativeStage(indicatorId: string, stage: 'Inception' | 'Implementation' | 'Validation' | 'Handover' | 'Sustained') {
    const stageMap: Record<string, number> = {
      'Inception': 1,
      'Implementation': 2,
      'Validation': 3,
      'Handover': 4,
      'Sustained': 5
    };
    const stageNum = stageMap[stage] || 1;
    this.indicators.update(list =>
      list.map(ind => {
        if (ind.id !== indicatorId) return ind;
        const progress = ind.targetAnnual > 0 ? Math.round((stageNum / ind.targetAnnual) * 1000) / 10 : 0;
        return {
          ...ind,
          qualitativeStage: stage,
          actualTotal: stageNum,
          actualQuarter: stageNum,
          progressPercent: progress,
          status: progress >= 90 ? 'on_track' : (progress >= 70 ? 'warning' : 'off_track')
        };
      })
    );
  }

  updateDisaggregationMatrix(indicatorId: string, dimension: string, category: string, actual: number) {
    this.indicators.update(list =>
      list.map(ind => {
        if (ind.id !== indicatorId) return ind;
        const matrix = ind.disaggregationMatrix || [];
        const updatedMatrix = matrix.map(item => {
          if (item.dimension === dimension && item.category === category) {
            const variance = item.target > 0 ? Math.round(((actual - item.target) / item.target) * 1000) / 10 : 0;
            return { ...item, actual, variancePercent: variance };
          }
          return item;
        });
        return { ...ind, disaggregationMatrix: updatedMatrix };
      })
    );
  }

  // LogAlto Form Builder Actions
  saveFormDef(form: CustomFormDef) {
    this.customForms.update(list => {
      const exists = list.some(f => f.id === form.id);
      if (exists) {
        return list.map(f => f.id === form.id ? { ...form, lastUpdated: new Date().toISOString().split('T')[0] } : f);
      }
      return [form, ...list];
    });
  }

  addQuestionToForm(formId: string, question: FormQuestion) {
    this.customForms.update(list =>
      list.map(f => {
        if (f.id !== formId) return f;
        return {
          ...f,
          questions: [...f.questions, question],
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      })
    );
  }

  updateQuestionInForm(formId: string, question: FormQuestion) {
    this.customForms.update(list =>
      list.map(f => {
        if (f.id !== formId) return f;
        return {
          ...f,
          questions: f.questions.map(q => q.id === question.id ? question : q),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      })
    );
  }

  deleteQuestionFromForm(formId: string, questionId: string) {
    this.customForms.update(list =>
      list.map(f => {
        if (f.id !== formId) return f;
        return {
          ...f,
          questions: f.questions.filter(q => q.id !== questionId),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      })
    );
  }

  duplicateFormDef(formId: string) {
    const orig = this.customForms().find(f => f.id === formId);
    if (!orig) return;
    const cloned: CustomFormDef = {
      ...orig,
      id: 'form-' + Date.now(),
      title: `${orig.title} (Copy)`,
      version: 'v1.0-clone',
      submissionsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    this.customForms.update(list => [cloned, ...list]);
  }

  deleteFormDef(formId: string) {
    this.customForms.update(list => list.filter(f => f.id !== formId));
  }

  // LogAlto Mobile Collection & Offline Sync Actions
  toggleSimulatedOffline() {
    this.isSimulatedOffline.update(v => !v);
  }

  submitMobileRecord(record: Omit<MobileSubmission, 'id' | 'timestamp' | 'syncStatus'>) {
    const isOffline = this.isSimulatedOffline();
    const newSubmission: MobileSubmission = {
      ...record,
      id: 'sub-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isOfflineDraft: isOffline,
      syncStatus: isOffline ? 'pending_sync' : 'synced',
      syncTimestamp: isOffline ? undefined : new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    this.mobileSubmissions.update(list => [newSubmission, ...list]);

    // If online, increment form counter & linked indicator
    if (!isOffline) {
      this.incrementFormSubmission(newSubmission.formId);
    }
  }

  private incrementFormSubmission(formId: string) {
    this.customForms.update(list =>
      list.map(f => {
        if (f.id !== formId) return f;
        const newCount = f.submissionsCount + 1;
        if (f.linkedIndicatorId) {
          const currentTotal = this.indicators().find(i => i.id === f.linkedIndicatorId)?.actualTotal ?? 0;
          this.updateIndicatorActuals(f.linkedIndicatorId, 1, currentTotal + 1);
        }
        return { ...f, submissionsCount: newCount };
      })
    );
  }

  syncOfflineQueue() {
    const pendingCount = this.mobileSubmissions().filter(s => s.syncStatus === 'pending_sync').length;
    if (pendingCount === 0) return 0;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    this.mobileSubmissions.update(list =>
      list.map(s => {
        if (s.syncStatus === 'pending_sync') {
          this.incrementFormSubmission(s.formId);
          return {
            ...s,
            syncStatus: 'synced',
            isOfflineDraft: false,
            syncTimestamp: now
          };
        }
        return s;
      })
    );
    return pendingCount;
  }

  clearSyncedSubmissions() {
    this.mobileSubmissions.update(list => list.filter(s => s.syncStatus === 'pending_sync'));
  }

  // LogAlto Dashboard Customization Actions
  setDashboardLevel(level: 'global' | 'project' | 'operations') {
    this.dashboardLevel.set(level);
  }

  toggleWidget(widgetId: DashboardWidgetId) {
    this.dashboardWidgets.update(list =>
      list.map(w => w.id === widgetId ? { ...w, enabled: !w.enabled } : w)
    );
  }

  reorderWidget(widgetId: DashboardWidgetId, direction: 'up' | 'down') {
    this.dashboardWidgets.update(list => {
      const index = list.findIndex(w => w.id === widgetId);
      if (index === -1) return list;
      if (direction === 'up' && index === 0) return list;
      if (direction === 'down' && index === list.length - 1) return list;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const newList = [...list];
      const temp = newList[index];
      newList[index] = newList[targetIndex];
      newList[targetIndex] = temp;
      return newList.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  }

  setWidgetWidth(widgetId: DashboardWidgetId, width: 'full' | 'half') {
    this.dashboardWidgets.update(list =>
      list.map(w => w.id === widgetId ? { ...w, width } : w)
    );
  }

  // Reset demo data to factory defaults
  resetToDefaults() {
    // Allows user to restore fresh realistic dataset if desired
    localStorage.removeItem('meal_suite_state');
    window.location.reload();
  }
}
