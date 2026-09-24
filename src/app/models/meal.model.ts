export interface MealProject {
  id: string;
  code: string;
  name: string;
  donor: string;
  budget: string;
  startDate: string;
  endDate: string;
  focusAreas: string[];
  status: 'Active' | 'Closing' | 'Planning';
  districts: string[];
  targetBeneficiaries: number;
  reachedBeneficiaries: number;
  manager: string;
}

export interface LogframeItem {
  id: string;
  projectId: string;
  type: 'impact' | 'outcome' | 'output' | 'activity';
  code: string;
  title: string;
  description: string;
  indicatorsCount: number;
  status: 'on_track' | 'needs_attention' | 'delayed' | 'completed';
}

export interface MealIndicator {
  id: string;
  projectId: string;
  logframeId: string;
  code: string;
  title: string;
  level: 'Outcome' | 'Output' | 'Impact';
  unit: string;
  baseline: number;
  targetAnnual: number;
  targetLOP: number;
  actualQuarter: number;
  actualTotal: number;
  progressPercent: number;
  frequency: 'Monthly' | 'Quarterly' | 'Bi-annual' | 'Annual';
  meansOfVerification: string;
  dataSource: string;
  responsibleOfficer: string;
  status: 'on_track' | 'warning' | 'off_track';
  disaggregation: {
    female: number;
    male: number;
    other: number;
    pwd: number;
    marginalized: number;
    youth: number;
  };
  notes: string;
}

export interface QualityCheckItem {
  id: string;
  title: string;
  category: string;
  passed: boolean;
  observation: string;
}

export interface ActionPoint {
  id: string;
  action: string;
  assignee: string;
  deadline: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface FieldVisit {
  id: string;
  projectId: string;
  visitCode: string;
  visitDate: string;
  location: {
    province: string;
    district: string;
    municipality: string;
    ward: number;
    latitude?: number;
    longitude?: number;
  };
  monitorName: string;
  role: string;
  objectives: string;
  qualityScorePercent: number;
  checklists: QualityCheckItem[];
  actionPoints: ActionPoint[];
  photoUrl?: string;
  evidenceTitle?: string;
  status: 'Completed' | 'Planned' | 'Under Review';
}

export interface BeneficiaryRecord {
  id: string;
  beneficiaryCode: string;
  fullName: string;
  gender: 'Female' | 'Male' | 'Other';
  age: number;
  vulnerabilities: string[];
  citizenshipNumber: string;
  phoneNumber: string;
  projectId: string;
  district: string;
  municipality: string;
  ward: number;
  intervention: string;
  verificationStatus: 'Verified' | 'Pending DQA' | 'Flagged Duplicate' | 'Ineligible';
  verifiedDate?: string;
  verifiedBy?: string;
  dqaNotes?: string;
  latitude?: number;
  longitude?: number;
  palikaId?: string;
}

export interface DqaAssessment {
  id: string;
  projectId: string;
  indicatorCode: string;
  indicatorTitle: string;
  assessmentDate: string;
  evaluator: string;
  validityScore: number;
  reliabilityScore: number;
  precisionScore: number;
  integrityScore: number;
  timelinessScore: number;
  overallScore: number;
  status: 'Passed' | 'Action Needed' | 'Critical Failure';
  sampleSize: number;
  recordsVerified: number;
  discrepancyCount: number;
  recommendations: string;
}

export interface FormFieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select_one' | 'select_multiple' | 'geopoint' | 'image' | 'date';
  required: boolean;
  options?: string[];
}

export interface DigitalForm {
  id: string;
  projectId: string;
  title: string;
  toolType: 'KoboToolbox' | 'ODK Collect' | 'Google Forms' | 'Excel Batch';
  formCategory: 'Baseline' | 'Endline' | 'PDM' | 'Needs Assessment' | 'Rapid Damage';
  version: string;
  submissionsCount: number;
  status: 'Active' | 'Draft' | 'Archived';
  fields: FormFieldDefinition[];
  lastSyncDate: string;
}

export interface CfrmComplaint {
  id: string;
  ticketNumber: string;
  projectId: string;
  submissionDate: string;
  channel: 'Toll-Free Hotline 1660' | 'Ward Suggestion Box' | 'Field Help Desk' | 'Community Meeting' | 'Staff Direct';
  complainantName?: string;
  isAnonymous: boolean;
  contactNumber?: string;
  district: string;
  municipality: string;
  ward: number;
  category: 'Quality of Construction' | 'Training Selection Dispute' | 'Delays in Grant/Kit' | 'Staff Conduct / Ethics' | 'Safeguarding / Protection' | 'General DRR Inquiry';
  urgency: 'Low' | 'Medium' | 'High' | 'Critical Safeguarding';
  description: string;
  investigationNotes?: string;
  resolutionSummary?: string;
  feedbackGivenToComplainant: boolean;
  status: 'New' | 'Under Investigation' | 'Corrective Action Taken' | 'Closed';
  slaDaysRemaining: number;
}

export interface LessonLearned {
  id: string;
  projectId: string;
  title: string;
  thematicArea: 'Mason Certification' | 'Retrofitting Engineering' | 'Municipal DRR Policy' | 'Community Inclusion' | 'School Safety';
  context: string;
  challengeFaced: string;
  lessonDiscovered: string;
  actionableRecommendation: string;
  author: string;
  dateLogged: string;
}

export interface CaseStudy {
  id: string;
  projectId: string;
  title: string;
  heroImage: string;
  beneficiaryName: string;
  location: string;
  theChallenge: string;
  theIntervention: string;
  measurableImpact: string;
  directQuote: string;
  quoteAuthor: string;
  publishedDate: string;
  author: string;
  donorVisibility: string;
}

export interface ReviewMeeting {
  id: string;
  projectId: string;
  meetingTitle: string;
  meetingType: 'Quarterly Review & Reflection' | 'After-Action Review (AAR)' | 'Annual MEAL Coordination' | 'Municipal DRR Steering';
  date: string;
  participantsCount: number;
  keyDecisions: string[];
  actionItems: { action: string; owner: string; dueDate: string; done: boolean }[];
}

export interface VisibilityAsset {
  id: string;
  projectId: string;
  type: 'Factsheet' | 'Poster' | 'Banner' | 'Infographic' | 'Social Card';
  title: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  primaryColor: string;
  orgLogo: boolean;
  donorLogo: string;
  highlightText: string;
  imageUrl: string;
  targetAudience: string;
}

export interface EvidenceDocument {
  id: string;
  projectId: string;
  title: string;
  docType: 'Attendance Sheet' | 'Certificate Roster' | 'Engineer Sign-off' | 'MoU with Palika' | 'DQA Report' | 'Photographic Evidence';
  fileName: string;
  fileSize: string;
  uploadedDate: string;
  verified: boolean;
  tags: string[];
}

export interface GanttActivity {
  id: string;
  projectId: string;
  code: string;
  name: string;
  component: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  progressPercent: number; // 0-100
  status: 'Completed' | 'In Progress' | 'Delayed' | 'Scheduled';
  assignee: string;
  budgetAllocated: number;
  isMilestone?: boolean;
  dependencies?: string[]; // IDs of predecessor activities
  deliverableTarget?: string;
}

export interface AdminMenuItem {
  id: string;
  title: string;
  icon: string;
  path: string;
  enabled: boolean;
  order: number;
  badge?: string;
  isCustom?: boolean;
}

export interface CustomFieldDefinition {
  id: string;
  label: string;
  fieldType: 'text' | 'number' | 'select' | 'date' | 'gps' | 'boolean' | 'textarea';
  targetModule: 'beneficiaries' | 'indicators' | 'visits' | 'cfrm';
  options?: string[]; // For select type
  required: boolean;
  disaggregationDimension?: string;
  defaultValue?: string | number | boolean;
}

export interface CustomIndicatorConfig {
  id: string;
  title: string;
  sector: 'Disaster Risk Reduction' | 'WASH' | 'Education' | 'Livelihoods' | 'Protection' | 'Health' | 'Shelter';
  level: 'Outcome' | 'Output' | 'Impact';
  donorCompliance: string[];
  unit: string;
  customDisaggregations: string[];
  calculationFormula: string;
  active: boolean;
}

export interface OrganizationProfile {
  name: string;
  acronym: string;
  orgType: 'INGO' | 'National NGO' | 'Non-Profit Organization' | 'Foundation' | 'UN Agency';
  registrationNumber: string;
  countryOffice: string;
  currency: string;
  fiscalYear: string;
  complianceFrameworks: string[];
  brandPrimaryColor: string;
  focalEmail: string;
  focalPhone: string;
}

export interface RolePermission {
  roleId: string;
  roleTitle: string;
  description: string;
  assignedUsersCount: number;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  canApprove: boolean;
}

export interface ReportSignatory {
  id: string;
  roleLabel: string; // e.g. 'Prepared by:', 'Verified by:', 'Approved by:', 'Reviewed by:'
  name: string;      // e.g. 'Anil Maharjan'
  title: string;     // e.g. 'Senior MEAL Officer'
  department: string;// e.g. 'MEAL & DQA Unit'
  date?: string;
}

export interface ReportDisaggregationRow {
  id: string;
  category: string;
  female: string;
  male: string;
  pwd: string;
  marginalized: string;
  total: string;
}

export interface CustomReportConfig {
  format: 'usaid' | 'fcdo' | 'ndrrma' | 'custom';
  letterheadOrg: string;
  letterheadBureau: string;
  reportClassification: string;
  reportRef: string;
  reportDate: string;
  reportTitle: string;
  reportSubtitle: string;
  reportingPeriod: string;
  targetPopulation: string;
  verifiedReach: string;
  dqaScore: string;
  executiveSummary: string;
  cfrmSynthesis: string;
  dqaSynthesis: string;
  keyChallenges: string;
  recommendations: string;
  signatories: ReportSignatory[];
  disaggregations: ReportDisaggregationRow[];
}

// ==========================================
// LogAlto Extended Features: Indicator Tracking
// ==========================================
export type IndicatorType = 'quantitative' | 'percentage' | 'qualitative' | 'calculated';

export interface IndicatorPeriodProgress {
  period: string; // e.g., 'Baseline', 'Q1-2026', 'Q2-2026', 'Q3-2026', 'Q4-2026', 'Target-Annual', 'Target-LOP'
  target: number;
  actual: number;
  variancePercent: number;
  notes?: string;
  verifiedBy?: string;
  updatedAt?: string;
}

export interface IndicatorDisaggregationItem {
  dimension: string; // e.g., 'Gender', 'Age Bracket', 'Disability', 'District'
  category: string;  // e.g., 'Female', 'Youth (15-29)', 'PWD', 'Sindhupalchok'
  target: number;
  actual: number;
  variancePercent: number;
}

export interface ExtendedMealIndicator extends MealIndicator {
  indicatorType?: IndicatorType;
  numerator?: number;
  denominator?: number;
  calculatedFormula?: string; // e.g., '([IND-BCRP-02] / [IND-BCRP-01]) * 100'
  qualitativeStage?: 'Inception' | 'Implementation' | 'Validation' | 'Handover' | 'Sustained';
  periodsProgress?: IndicatorPeriodProgress[];
  disaggregationMatrix?: IndicatorDisaggregationItem[];
  collectionSchedule?: {
    frequency: 'Monthly' | 'Quarterly' | 'Bi-annual' | 'Annual';
    nextDueDate: string;
    assignee: string;
    overdue: boolean;
  };
}

// ==========================================
// LogAlto Extended Features: Form Builder
// ==========================================
export type FormQuestionType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'decimal'
  | 'select_one'
  | 'select_multiple'
  | 'dropdown'
  | 'date'
  | 'time'
  | 'geopoint'
  | 'image'
  | 'signature'
  | 'rating'
  | 'calculation'
  | 'repeat_group';

export interface FormSkipLogicRule {
  questionName: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number;
}

export interface FormQuestion {
  id: string;
  name: string;
  label: string;
  type: FormQuestionType;
  required: boolean;
  hint?: string;
  options?: string[];
  min?: number;
  max?: number;
  skipLogic?: FormSkipLogicRule;
  linkedIndicatorId?: string;
  calculationFormula?: string;
  repeatFields?: string[];
  defaultValue?: string | number | boolean;
}

export interface CustomFormDef {
  id: string;
  projectId: string;
  title: string;
  category: 'Baseline' | 'Endline' | 'PDM' | 'Needs Assessment' | 'Rapid Damage' | 'Routine Monitoring';
  version: string;
  status: 'Draft' | 'Active' | 'Archived';
  description: string;
  questions: FormQuestion[];
  linkedIndicatorId?: string;
  submissionsCount: number;
  createdAt: string;
  lastUpdated: string;
}

// ==========================================
// LogAlto Extended Features: Mobile Data Collection
// ==========================================
export interface MobileSubmission {
  id: string;
  formId: string;
  formTitle: string;
  enumeratorName: string;
  deviceId: string;
  timestamp: string;
  isOfflineDraft: boolean;
  gps: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude?: number;
    locationName?: string;
  };
  photoAttached?: boolean;
  photoUrl?: string;
  signatureCaptured?: boolean;
  data: Record<string, string | number | boolean | string[]>;
  syncStatus: 'synced' | 'pending_sync' | 'conflict';
  batteryLevel?: number;
  syncTimestamp?: string;
}

// ==========================================
// LogAlto Extended Features: Dashboard Widgets
// ==========================================
export type DashboardWidgetId =
  | 'indicators_traffic'
  | 'achievement_chart'
  | 'gedsi_disaggregation'
  | 'mobile_sync_feed'
  | 'cfrm_resolution'
  | 'geo_footprint'
  | 'dqa_radar'
  | 'action_items'
  | 'gantt_milestones';

export interface DashboardWidgetConfig {
  id: DashboardWidgetId;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  order: number;
  width: 'full' | 'half';
}

// ==========================================
// LogAlto Extended Features: Data Visualization
// ==========================================
export interface PivotConfig {
  rowDim: 'project' | 'district' | 'gender' | 'vulnerability' | 'intervention' | 'status';
  colDim: 'status' | 'gender' | 'quarter' | 'urgency' | 'verification';
  metric: 'count' | 'reach' | 'quality_avg' | 'cfrm_rate';
  filterProject: string;
}

export interface ChartConfig {
  chartType: 'bar' | 'stacked_bar' | 'line' | 'donut' | 'radar' | 'gauge';
  title: string;
  dimension: string;
  metric: string;
}



