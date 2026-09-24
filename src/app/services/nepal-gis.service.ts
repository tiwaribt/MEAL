import { Injectable, computed, inject, signal } from '@angular/core';
import { MealDataService } from './meal-data.service';
import { NepalGeoService } from './nepal-geo.service';
import { BeneficiaryRecord } from '../models/meal.model';
import { NepalMunicipality } from '../models/nepal-geo.model';
import {
  PROVINCE_MAP_BOUNDS,
  NEPAL_COUNTRY_VIEW,
  getPalikaCoordinates
} from '../data/nepal-geo-coordinates.data';
import { SEED_NEPAL_BENEFICIARIES } from '../data/nepal-gis-beneficiaries.data';

export interface PalikaGisFeature {
  palikaId: string;
  name: string;
  nepaliName?: string;
  type: NepalMunicipality['type'];
  districtId: string;
  districtName: string;
  provinceId: number;
  provinceName: string;
  totalWards: number;
  lat: number;
  lng: number;
  beneficiaryCount: number;
  femaleCount: number;
  maleCount: number;
  pwdCount: number;
  marginalizedCount: number;
  youthCount: number;
  verifiedCount: number;
  flaggedCount: number;
  pendingCount: number;
  projectIds: string[];
  interventions: string[];
  beneficiaries: BeneficiaryRecord[];
  coverageLevel: 'none' | 'low' | 'medium' | 'high';
}

export interface ProvinceOutreachStat {
  provinceId: number;
  provinceName: string;
  totalPalikas: number;
  palikasReached: number;
  beneficiariesCount: number;
  coveragePercent: number;
  pwdCount: number;
  femalePercent: number;
}

export interface RegionalOutreachAnalysis {
  totalBeneficiaries: number;
  totalPalikasCovered: number;
  totalDistrictsCovered: number;
  nationalPalikaPenetrationPct: number;
  provinces: ProvinceOutreachStat[];
  genderSplit: { female: number; male: number; other: number; femalePct: number };
  vulnerabilityCounts: { pwd: number; marginalized: number; femaleHeaded: number; youth: number };
  verificationSplit: { verified: number; pending: number; flagged: number };
  topReachedPalikas: PalikaGisFeature[];
  unreachedCriticalDistricts: { districtName: string; provinceName: string; palikaCount: number }[];
}

export type GisMapLayerType = 'osm-bright' | 'carto-light' | 'humanitarian' | 'topo';
export type GisVisualizationMode = 'bubbles' | 'pins' | 'heat-density' | 'choropleth';

@Injectable({
  providedIn: 'root'
})
export class NepalGisService {
  private readonly mealService = inject(MealDataService);
  private readonly geoService = inject(NepalGeoService);

  // Active Map Controls
  readonly activeBaseLayer = signal<GisMapLayerType>('carto-light');
  readonly visualizationMode = signal<GisVisualizationMode>('bubbles');
  readonly showAll753Palikas = signal<boolean>(true); // Show zero-reach palikas as gray/gap dots
  readonly selectedPalikaId = signal<string | null>(null);

  // Filter Signals
  readonly selectedProjectFilter = signal<string>('all');
  readonly selectedProvinceFilter = signal<number | null>(null);
  readonly selectedDistrictFilter = signal<string | null>(null);
  readonly selectedPalikaTypeFilter = signal<string>('all');
  readonly selectedVerificationFilter = signal<string>('all');
  readonly selectedVulnerabilityFilter = signal<string>('all');
  readonly palikaSearchQuery = signal<string>('');

  constructor() {
    // Ensure mealService has our rich seed beneficiaries if empty or minimal
    if (this.mealService.beneficiaries().length <= 8) {
      this.mealService.beneficiaries.set(SEED_NEPAL_BENEFICIARIES);
    }
  }

  // Precomputed match lookup helper
  private normalizeName(name: string): string {
    return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // Map each of the 753 palikas with coordinate positioning and beneficiary associations
  readonly allPalikaGisFeatures = computed<PalikaGisFeature[]>(() => {
    const palikas = this.geoService.municipalities();
    const beneficiaries = this.mealService.beneficiaries();
    const districts = this.geoService.districts();
    const provinces = this.geoService.provinces();

    // Map for fast district name lookup
    const districtMap = new Map<string, { name: string; provinceId: number }>();
    for (const d of districts) {
      districtMap.set(d.id.toLowerCase(), { name: d.name, provinceId: d.provinceId });
    }

    const provinceMap = new Map<number, string>();
    for (const p of provinces) {
      provinceMap.set(p.id, p.name);
    }

    // Group beneficiaries by palika match
    return palikas.map(palika => {
      const distInfo = districtMap.get(palika.districtId.toLowerCase());
      const districtName = distInfo ? distInfo.name : palika.districtId;
      const provinceId = palika.provinceId ?? distInfo?.provinceId ?? 3;
      const provinceName = provinceMap.get(provinceId) ?? `Province ${provinceId}`;

      const coords = getPalikaCoordinates(palika.id, palika.districtId);

      // Match beneficiaries to this palika
      const normPalikaName = this.normalizeName(palika.name);
      const normDistName = this.normalizeName(districtName);

      const matchedBens = beneficiaries.filter(b => {
        const bMun = this.normalizeName(b.municipality);
        const bDist = this.normalizeName(b.district);

        // Check exact palika ID match if tagged
        if (b.palikaId && b.palikaId === palika.id) return true;

        // Check municipality name contains / matches and district matches
        const districtMatches = bDist.includes(normDistName) || normDistName.includes(bDist);
        if (!districtMatches) return false;

        return bMun.includes(normPalikaName) || normPalikaName.includes(bMun);
      });

      const count = matchedBens.length;
      const femaleCount = matchedBens.filter(b => b.gender === 'Female').length;
      const maleCount = matchedBens.filter(b => b.gender === 'Male').length;
      const pwdCount = matchedBens.filter(b => b.vulnerabilities.some(v => v.toLowerCase().includes('pwd') || v.toLowerCase().includes('disability'))).length;
      const marginalizedCount = matchedBens.filter(b => b.vulnerabilities.some(v => v.toLowerCase().includes('marginalized') || v.toLowerCase().includes('dalit') || v.toLowerCase().includes('janajati'))).length;
      const youthCount = matchedBens.filter(b => b.age <= 29 || b.vulnerabilities.some(v => v.toLowerCase().includes('youth'))).length;
      const verifiedCount = matchedBens.filter(b => b.verificationStatus === 'Verified').length;
      const flaggedCount = matchedBens.filter(b => b.verificationStatus === 'Flagged Duplicate').length;
      const pendingCount = matchedBens.filter(b => b.verificationStatus === 'Pending DQA').length;

      const projectIds = Array.from(new Set(matchedBens.map(b => b.projectId)));
      const interventions = Array.from(new Set(matchedBens.map(b => b.intervention)));

      let coverageLevel: PalikaGisFeature['coverageLevel'] = 'none';
      if (count >= 5) coverageLevel = 'high';
      else if (count >= 2) coverageLevel = 'medium';
      else if (count >= 1) coverageLevel = 'low';

      return {
        palikaId: palika.id,
        name: palika.name,
        nepaliName: palika.nepaliName,
        type: palika.type,
        districtId: palika.districtId,
        districtName,
        provinceId,
        provinceName,
        totalWards: palika.totalWards,
        lat: coords.lat,
        lng: coords.lng,
        beneficiaryCount: count,
        femaleCount,
        maleCount,
        pwdCount,
        marginalizedCount,
        youthCount,
        verifiedCount,
        flaggedCount,
        pendingCount,
        projectIds,
        interventions,
        beneficiaries: matchedBens,
        coverageLevel
      };
    });
  });

  // Filtered Palikas for Map Display
  readonly filteredPalikaFeatures = computed<PalikaGisFeature[]>(() => {
    let list = this.allPalikaGisFeatures();
    const projFilter = this.selectedProjectFilter();
    const provFilter = this.selectedProvinceFilter();
    const distFilter = this.selectedDistrictFilter();
    const typeFilter = this.selectedPalikaTypeFilter();
    const verifFilter = this.selectedVerificationFilter();
    const vulnFilter = this.selectedVulnerabilityFilter();
    const search = this.palikaSearchQuery().trim().toLowerCase();
    const showAll = this.showAll753Palikas();

    if (projFilter !== 'all') {
      list = list.filter(p => p.projectIds.includes(projFilter));
    }

    if (provFilter !== null) {
      list = list.filter(p => p.provinceId === provFilter);
    }

    if (distFilter !== null) {
      list = list.filter(p => p.districtId.toLowerCase() === distFilter.toLowerCase());
    }

    if (typeFilter !== 'all') {
      list = list.filter(p => p.type === typeFilter);
    }

    if (verifFilter !== 'all') {
      if (verifFilter === 'verified') list = list.filter(p => p.verifiedCount > 0);
      else if (verifFilter === 'flagged') list = list.filter(p => p.flaggedCount > 0);
      else if (verifFilter === 'pending') list = list.filter(p => p.pendingCount > 0);
    }

    if (vulnFilter !== 'all') {
      if (vulnFilter === 'female') list = list.filter(p => p.femaleCount > 0);
      else if (vulnFilter === 'pwd') list = list.filter(p => p.pwdCount > 0);
      else if (vulnFilter === 'marginalized') list = list.filter(p => p.marginalizedCount > 0);
      else if (vulnFilter === 'youth') list = list.filter(p => p.youthCount > 0);
    }

    if (search) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(search) ||
        (p.nepaliName && p.nepaliName.includes(search)) ||
        p.districtName.toLowerCase().includes(search) ||
        p.provinceName.toLowerCase().includes(search)
      );
    }

    if (!showAll) {
      list = list.filter(p => p.beneficiaryCount > 0);
    }

    return list;
  });

  // Selected Palika Detail
  readonly selectedPalika = computed<PalikaGisFeature | null>(() => {
    const id = this.selectedPalikaId();
    if (!id) return null;
    return this.allPalikaGisFeatures().find(p => p.palikaId === id) || null;
  });

  // Comprehensive Regional Outreach Analysis & Coverage Breakdown
  readonly regionalAnalysis = computed<RegionalOutreachAnalysis>(() => {
    const allFeatures = this.allPalikaGisFeatures();
    const reachedFeatures = allFeatures.filter(p => p.beneficiaryCount > 0);
    const provinces = this.geoService.provinces();

    const totalBeneficiaries = reachedFeatures.reduce((acc, p) => acc + p.beneficiaryCount, 0);
    const totalPalikasCovered = reachedFeatures.length;
    const nationalPalikaPenetrationPct = Number(((totalPalikasCovered / 753) * 100).toFixed(1));

    // Unique districts reached
    const reachedDistricts = new Set(reachedFeatures.map(p => p.districtId));
    const totalDistrictsCovered = reachedDistricts.size;

    // Provincial Breakdown
    const provinceStats: ProvinceOutreachStat[] = provinces.map(prov => {
      const palikasInProv = allFeatures.filter(p => p.provinceId === prov.id);
      const reachedInProv = palikasInProv.filter(p => p.beneficiaryCount > 0);
      const totalBens = reachedInProv.reduce((acc, p) => acc + p.beneficiaryCount, 0);
      const totalFem = reachedInProv.reduce((acc, p) => acc + p.femaleCount, 0);
      const pwd = reachedInProv.reduce((acc, p) => acc + p.pwdCount, 0);
      const covPct = palikasInProv.length > 0 ? Number(((reachedInProv.length / palikasInProv.length) * 100).toFixed(1)) : 0;
      const femPct = totalBens > 0 ? Number(((totalFem / totalBens) * 100).toFixed(1)) : 0;

      return {
        provinceId: prov.id,
        provinceName: prov.name,
        totalPalikas: palikasInProv.length,
        palikasReached: reachedInProv.length,
        beneficiariesCount: totalBens,
        coveragePercent: covPct,
        pwdCount: pwd,
        femalePercent: femPct
      };
    });

    // Gender Split
    const female = reachedFeatures.reduce((acc, p) => acc + p.femaleCount, 0);
    const male = reachedFeatures.reduce((acc, p) => acc + p.maleCount, 0);
    const other = totalBeneficiaries - (female + male);
    const femalePct = totalBeneficiaries > 0 ? Number(((female / totalBeneficiaries) * 100).toFixed(1)) : 0;

    // Vulnerability
    const pwd = reachedFeatures.reduce((acc, p) => acc + p.pwdCount, 0);
    const marginalized = reachedFeatures.reduce((acc, p) => acc + p.marginalizedCount, 0);
    const femaleHeaded = female;
    const youth = reachedFeatures.reduce((acc, p) => acc + p.youthCount, 0);

    // Verification
    const verified = reachedFeatures.reduce((acc, p) => acc + p.verifiedCount, 0);
    const pending = reachedFeatures.reduce((acc, p) => acc + p.pendingCount, 0);
    const flagged = reachedFeatures.reduce((acc, p) => acc + p.flaggedCount, 0);

    // Top Reached Palikas
    const topReachedPalikas = [...reachedFeatures]
      .sort((a, b) => b.beneficiaryCount - a.beneficiaryCount)
      .slice(0, 10);

    // Unreached Critical Districts (Outreach Gaps)
    const districts = this.geoService.districts();
    const unreachedCriticalDistricts = districts
      .filter(d => !reachedDistricts.has(d.id))
      .slice(0, 8)
      .map(d => ({
        districtName: d.name,
        provinceName: provinces.find(p => p.id === d.provinceId)?.name || 'Unknown',
        palikaCount: allFeatures.filter(p => p.districtId === d.id).length
      }));

    return {
      totalBeneficiaries,
      totalPalikasCovered,
      totalDistrictsCovered,
      nationalPalikaPenetrationPct,
      provinces: provinceStats,
      genderSplit: { female, male, other, femalePct },
      vulnerabilityCounts: { pwd, marginalized, femaleHeaded, youth },
      verificationSplit: { verified, pending, flagged },
      topReachedPalikas,
      unreachedCriticalDistricts
    };
  });

  // Action: Select a Palika
  selectPalika(palikaId: string | null) {
    this.selectedPalikaId.set(palikaId);
  }

  // Action: Quick filter by province
  filterByProvince(provinceId: number | null) {
    this.selectedProvinceFilter.set(provinceId);
    this.selectedDistrictFilter.set(null);
  }

  // Action: Reset all filters
  resetFilters() {
    this.selectedProjectFilter.set('all');
    this.selectedProvinceFilter.set(null);
    this.selectedDistrictFilter.set(null);
    this.selectedPalikaTypeFilter.set('all');
    this.selectedVerificationFilter.set('all');
    this.selectedVulnerabilityFilter.set('all');
    this.palikaSearchQuery.set('');
  }

  // Action: Batch Ingest Sample Survey Cohort (Simulate 50+ additional palikas outreach)
  ingestNationalSurveyBatch() {
    const current = this.mealService.beneficiaries();
    const allPalikas = this.geoService.municipalities();

    // Select 25 unreached palikas across Karnali, Sudurpashchim, Koshi, Madhesh
    const reachedIds = new Set(this.allPalikaGisFeatures().filter(p => p.beneficiaryCount > 0).map(p => p.palikaId));
    const candidatePalikas = allPalikas.filter(p => !reachedIds.has(p.id)).slice(0, 25);

    const newRecords: BeneficiaryRecord[] = candidatePalikas.map((palika, index) => {
      const code = `BEN-SURVEY-${1000 + index}`;
      const isFemale = index % 2 === 0;
      const coords = getPalikaCoordinates(palika.id, palika.districtId);

      return {
        id: 'ben-sim-' + Date.now() + '-' + index,
        beneficiaryCode: code,
        fullName: isFemale ? `Shanti ${palika.name} Beneficiary` : `Khem Bahadur ${palika.name}`,
        gender: isFemale ? 'Female' : 'Male',
        age: 22 + (index * 3) % 45,
        vulnerabilities: index % 3 === 0 ? ['Marginalized Dalit/Janajati'] : (index % 5 === 0 ? ['PWD'] : ['None']),
        citizenshipNumber: `24-01-72-0${index}98`,
        phoneNumber: `984${index}12903`,
        projectId: index % 2 === 0 ? 'proj-bcrp' : 'proj-surp',
        district: palika.districtId.charAt(0).toUpperCase() + palika.districtId.slice(1),
        municipality: palika.name,
        palikaId: palika.id,
        ward: (index % 5) + 1,
        intervention: index % 2 === 0 ? 'Community Early Warning & DRR Committee' : '7-Day Mason Retrofitting & Seismic Training',
        verificationStatus: 'Verified',
        verifiedDate: new Date().toISOString().split('T')[0],
        verifiedBy: 'GIS Mobile Survey Team',
        dqaNotes: 'Batch ingested from GIS field enumeration roster.',
        latitude: coords.lat,
        longitude: coords.lng
      };
    });

    this.mealService.beneficiaries.set([...current, ...newRecords]);
  }

  // Export GeoJSON format for QGIS, ArcGIS, Mapbox, or HDX
  exportGeoJson(): string {
    const features = this.filteredPalikaFeatures().map(palika => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [palika.lng, palika.lat]
      },
      properties: {
        palikaId: palika.palikaId,
        name: palika.name,
        nepaliName: palika.nepaliName,
        type: palika.type,
        district: palika.districtName,
        province: palika.provinceName,
        wards: palika.totalWards,
        beneficiaryCount: palika.beneficiaryCount,
        femaleCount: palika.femaleCount,
        maleCount: palika.maleCount,
        pwdCount: palika.pwdCount,
        marginalizedCount: palika.marginalizedCount,
        youthCount: palika.youthCount,
        verifiedCount: palika.verifiedCount,
        coverageLevel: palika.coverageLevel,
        projects: palika.projectIds.join('; '),
        interventions: palika.interventions.join('; ')
      }
    }));

    const geoJson = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' }
      },
      features
    };

    return JSON.stringify(geoJson, null, 2);
  }

  // Export CSV format for Excel analysis
  exportCsv(): string {
    const headers = [
      'Palika ID',
      'Palika Name',
      'Nepali Name',
      'Type',
      'District',
      'Province',
      'Latitude',
      'Longitude',
      'Total Beneficiaries',
      'Female Beneficiaries',
      'Male Beneficiaries',
      'PWD Count',
      'Marginalized Count',
      'Youth Count',
      'Verified Count',
      'Coverage Level',
      'Active Projects'
    ];

    const rows = this.filteredPalikaFeatures().map(p => [
      `"${p.palikaId}"`,
      `"${p.name}"`,
      `"${p.nepaliName || ''}"`,
      `"${p.type}"`,
      `"${p.districtName}"`,
      `"${p.provinceName}"`,
      p.lat,
      p.lng,
      p.beneficiaryCount,
      p.femaleCount,
      p.maleCount,
      p.pwdCount,
      p.marginalizedCount,
      p.youthCount,
      p.verifiedCount,
      `"${p.coverageLevel}"`,
      `"${p.projectIds.join(', ')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // Quick lookup helper for province bounds
  getProvinceBound(provinceId: number) {
    return PROVINCE_MAP_BOUNDS[provinceId] || NEPAL_COUNTRY_VIEW;
  }
}
