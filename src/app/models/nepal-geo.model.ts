export interface NepalMunicipality {
  id: string;
  name: string;
  nepaliName?: string;
  type: 'Metropolitan City' | 'Sub-Metropolitan City' | 'Municipality' | 'Rural Municipality';
  districtId: string;
  provinceId?: number;
  totalWards: number;
}

export interface NepalDistrict {
  id: string;
  name: string;
  provinceId: number;
  headquarter: string;
}

export interface NepalProvince {
  id: number;
  name: string;
  capital: string;
  districtsCount: number;
}

export interface GeoCascadeSelection {
  provinceId?: number | null;
  provinceName?: string | null;
  districtId?: string | null;
  districtName?: string | null;
  municipalityId?: string | null;
  municipalityName?: string | null;
  ward?: number | null;
}
