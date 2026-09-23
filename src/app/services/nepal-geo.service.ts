import { Injectable, signal, computed } from '@angular/core';
import { NepalProvince, NepalDistrict, NepalMunicipality, GeoCascadeSelection } from '../models/nepal-geo.model';
import { ALL_NEPAL_753_PALIKAS } from '../data/nepal-753-palikas.data';

@Injectable({
  providedIn: 'root'
})
export class NepalGeoService {
  // 7 Federal Provinces of Nepal
  readonly provinces = signal<NepalProvince[]>([
    { id: 1, name: 'Koshi Province', capital: 'Biratnagar', districtsCount: 14 },
    { id: 2, name: 'Madhesh Province', capital: 'Janakpurdham', districtsCount: 8 },
    { id: 3, name: 'Bagmati Province', capital: 'Hetauda', districtsCount: 13 },
    { id: 4, name: 'Gandaki Province', capital: 'Pokhara', districtsCount: 11 },
    { id: 5, name: 'Lumbini Province', capital: 'Deukhuri', districtsCount: 12 },
    { id: 6, name: 'Karnali Province', capital: 'Birendranagar', districtsCount: 10 },
    { id: 7, name: 'Sudurpashchim Province', capital: 'Godawari', districtsCount: 9 }
  ]);

  // Complete 77 Districts of Nepal
  readonly districts = signal<NepalDistrict[]>([
    // Province 1: Koshi (14)
    { id: 'bhojpur', name: 'Bhojpur', provinceId: 1, headquarter: 'Bhojpur' },
    { id: 'dhankuta', name: 'Dhankuta', provinceId: 1, headquarter: 'Dhankuta' },
    { id: 'ilam', name: 'Ilam', provinceId: 1, headquarter: 'Ilam' },
    { id: 'jhapa', name: 'Jhapa', provinceId: 1, headquarter: 'Bhadrapur' },
    { id: 'khotang', name: 'Khotang', provinceId: 1, headquarter: 'Diktel' },
    { id: 'morang', name: 'Morang', provinceId: 1, headquarter: 'Biratnagar' },
    { id: 'okhaldhunga', name: 'Okhaldhunga', provinceId: 1, headquarter: 'Siddhicharan' },
    { id: 'panchthar', name: 'Panchthar', provinceId: 1, headquarter: 'Phidim' },
    { id: 'sankhuwasabha', name: 'Sankhuwasabha', provinceId: 1, headquarter: 'Khandbari' },
    { id: 'solukhumbu', name: 'Solukhumbu', provinceId: 1, headquarter: 'Salleri' },
    { id: 'sunsari', name: 'Sunsari', provinceId: 1, headquarter: 'Inaruwa' },
    { id: 'taplejung', name: 'Taplejung', provinceId: 1, headquarter: 'Phungling' },
    { id: 'terhathum', name: 'Terhathum', provinceId: 1, headquarter: 'Myanglung' },
    { id: 'udayapur', name: 'Udayapur', provinceId: 1, headquarter: 'Gaighat' },

    // Province 2: Madhesh (8)
    { id: 'saptari', name: 'Saptari', provinceId: 2, headquarter: 'Rajbiraj' },
    { id: 'siraha', name: 'Siraha', provinceId: 2, headquarter: 'Siraha' },
    { id: 'dhanusha', name: 'Dhanusha', provinceId: 2, headquarter: 'Janakpur' },
    { id: 'mahottari', name: 'Mahottari', provinceId: 2, headquarter: 'Jaleshwar' },
    { id: 'sarlahi', name: 'Sarlahi', provinceId: 2, headquarter: 'Malangwa' },
    { id: 'rautahat', name: 'Rautahat', provinceId: 2, headquarter: 'Gaur' },
    { id: 'bara', name: 'Bara', provinceId: 2, headquarter: 'Kalaiya' },
    { id: 'parsa', name: 'Parsa', provinceId: 2, headquarter: 'Birgunj' },

    // Province 3: Bagmati (13)
    { id: 'sindhuli', name: 'Sindhuli', provinceId: 3, headquarter: 'Kamalamai' },
    { id: 'ramechhap', name: 'Ramechhap', provinceId: 3, headquarter: 'Manthali' },
    { id: 'dolakha', name: 'Dolakha', provinceId: 3, headquarter: 'Charikot' },
    { id: 'sindhupalchok', name: 'Sindhupalchok', provinceId: 3, headquarter: 'Chautara' },
    { id: 'kavrepalanchok', name: 'Kavrepalanchok', provinceId: 3, headquarter: 'Dhulikhel' },
    { id: 'lalitpur', name: 'Lalitpur', provinceId: 3, headquarter: 'Patan' },
    { id: 'bhaktapur', name: 'Bhaktapur', provinceId: 3, headquarter: 'Bhaktapur' },
    { id: 'kathmandu', name: 'Kathmandu', provinceId: 3, headquarter: 'Kathmandu' },
    { id: 'nuwakot', name: 'Nuwakot', provinceId: 3, headquarter: 'Bidur' },
    { id: 'rasuwa', name: 'Rasuwa', provinceId: 3, headquarter: 'Dhunche' },
    { id: 'dhading', name: 'Dhading', provinceId: 3, headquarter: 'Nilkantha' },
    { id: 'makwanpur', name: 'Makwanpur', provinceId: 3, headquarter: 'Hetauda' },
    { id: 'chitwan', name: 'Chitwan', provinceId: 3, headquarter: 'Bharatpur' },

    // Province 4: Gandaki (11)
    { id: 'gorkha', name: 'Gorkha', provinceId: 4, headquarter: 'Gorkha' },
    { id: 'manang', name: 'Manang', provinceId: 4, headquarter: 'Chame' },
    { id: 'mustang', name: 'Mustang', provinceId: 4, headquarter: 'Jomsom' },
    { id: 'myagdi', name: 'Myagdi', provinceId: 4, headquarter: 'Beni' },
    { id: 'kaski', name: 'Kaski', provinceId: 4, headquarter: 'Pokhara' },
    { id: 'lamjung', name: 'Lamjung', provinceId: 4, headquarter: 'Besisahar' },
    { id: 'tanahun', name: 'Tanahun', provinceId: 4, headquarter: 'Damauli' },
    { id: 'nawalpur', name: 'Nawalpur', provinceId: 4, headquarter: 'Kawasoti' },
    { id: 'syangja', name: 'Syangja', provinceId: 4, headquarter: 'Putalibazar' },
    { id: 'parbat', name: 'Parbat', provinceId: 4, headquarter: 'Kusma' },
    { id: 'baglung', name: 'Baglung', provinceId: 4, headquarter: 'Baglung' },

    // Province 5: Lumbini (12)
    { id: 'parasi', name: 'Parasi', provinceId: 5, headquarter: 'Ramgram' },
    { id: 'rupandehi', name: 'Rupandehi', provinceId: 5, headquarter: 'Siddharthanagar' },
    { id: 'kapilvastu', name: 'Kapilvastu', provinceId: 5, headquarter: 'Taulihawa' },
    { id: 'palpa', name: 'Palpa', provinceId: 5, headquarter: 'Tansen' },
    { id: 'arghakhanchi', name: 'Arghakhanchi', provinceId: 5, headquarter: 'Sandhikharka' },
    { id: 'gulmi', name: 'Gulmi', provinceId: 5, headquarter: 'Tamghas' },
    { id: 'pyuthan', name: 'Pyuthan', provinceId: 5, headquarter: 'Pyuthan' },
    { id: 'rolpa', name: 'Rolpa', provinceId: 5, headquarter: 'Liwang' },
    { id: 'eastern-rukum', name: 'Eastern Rukum', provinceId: 5, headquarter: 'Rukumkot' },
    { id: 'banke', name: 'Banke', provinceId: 5, headquarter: 'Nepalgunj' },
    { id: 'bardiya', name: 'Bardiya', provinceId: 5, headquarter: 'Gulariya' },
    { id: 'dang', name: 'Dang', provinceId: 5, headquarter: 'Ghorahi' },

    // Province 6: Karnali (10)
    { id: 'western-rukum', name: 'Western Rukum', provinceId: 6, headquarter: 'Musikot' },
    { id: 'salyan', name: 'Salyan', provinceId: 6, headquarter: 'Salyan' },
    { id: 'dolpa', name: 'Dolpa', provinceId: 6, headquarter: 'Dunai' },
    { id: 'jumla', name: 'Jumla', provinceId: 6, headquarter: 'Khalanga' },
    { id: 'mugu', name: 'Mugu', provinceId: 6, headquarter: 'Gamgadhi' },
    { id: 'humla', name: 'Humla', provinceId: 6, headquarter: 'Simikot' },
    { id: 'kalikot', name: 'Kalikot', provinceId: 6, headquarter: 'Manma' },
    { id: 'jajarkot', name: 'Jajarkot', provinceId: 6, headquarter: 'Khalanga' },
    { id: 'dailekh', name: 'Dailekh', provinceId: 6, headquarter: 'Narayan' },
    { id: 'surkhet', name: 'Surkhet', provinceId: 6, headquarter: 'Birendranagar' },

    // Province 7: Sudurpashchim (9)
    { id: 'bajura', name: 'Bajura', provinceId: 7, headquarter: 'Martadi' },
    { id: 'bajhang', name: 'Bajhang', provinceId: 7, headquarter: 'Chainpur' },
    { id: 'achham', name: 'Achham', provinceId: 7, headquarter: 'Mangalsen' },
    { id: 'doti', name: 'Doti', provinceId: 7, headquarter: 'Dipayal Silgadhi' },
    { id: 'kailali', name: 'Kailali', provinceId: 7, headquarter: 'Dhangadhi' },
    { id: 'kanchanpur', name: 'Kanchanpur', provinceId: 7, headquarter: 'Bhimdatta' },
    { id: 'dadeldhura', name: 'Dadeldhura', provinceId: 7, headquarter: 'Amargadhi' },
    { id: 'baitadi', name: 'Baitadi', provinceId: 7, headquarter: 'Dasharathchand' },
    { id: 'darchula', name: 'Darchula', provinceId: 7, headquarter: 'Darchula' }
  ]);

  // Complete official database of all 753 Local Levels (Palikas) in Nepal
  readonly municipalities = signal<NepalMunicipality[]>(ALL_NEPAL_753_PALIKAS);

  // Geographic statistics
  readonly geoStats = computed(() => {
    const palikas = this.municipalities();
    const metros = palikas.filter(p => p.type === 'Metropolitan City').length;
    const subMetros = palikas.filter(p => p.type === 'Sub-Metropolitan City').length;
    const munis = palikas.filter(p => p.type === 'Municipality').length;
    const ruralMunis = palikas.filter(p => p.type === 'Rural Municipality').length;
    return {
      provinces: this.provinces().length,
      districts: this.districts().length,
      totalPalikas: palikas.length,
      metros,
      subMetros,
      munis,
      ruralMunis
    };
  });

  // Global Geographic Cascade Filter Signal
  readonly geoFilter = signal<GeoCascadeSelection>({
    provinceId: null,
    provinceName: null,
    districtId: null,
    districtName: null,
    municipalityId: null,
    municipalityName: null,
    ward: null
  });

  readonly isGeoFilterActive = computed(() => {
    const f = this.geoFilter();
    return !!(f.provinceId || f.districtId || f.municipalityId || f.ward);
  });

  // Filtered dropdown lists based on cascade state
  getDistrictsForProvince(provinceId?: number | null): NepalDistrict[] {
    if (!provinceId) return this.districts();
    return this.districts().filter(d => d.provinceId === Number(provinceId));
  }

  getMunicipalitiesForDistrict(districtId?: string | null): NepalMunicipality[] {
    if (!districtId) return this.municipalities();
    return this.municipalities().filter(m => m.districtId.toLowerCase() === districtId.toLowerCase());
  }

  getWardsForMunicipality(municipalityId?: string | null): number[] {
    if (!municipalityId) return Array.from({ length: 15 }, (_, i) => i + 1);
    const m = this.municipalities().find(item => item.id === municipalityId || item.name.toLowerCase() === municipalityId.toLowerCase());
    const count = m ? m.totalWards : 12;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  setProvince(provinceId: number | null) {
    if (provinceId === null) {
      this.geoFilter.set({
        provinceId: null,
        provinceName: null,
        districtId: null,
        districtName: null,
        municipalityId: null,
        municipalityName: null,
        ward: null
      });
      return;
    }
    const p = this.provinces().find(item => item.id === Number(provinceId));
    this.geoFilter.update(current => ({
      ...current,
      provinceId: Number(provinceId),
      provinceName: p ? p.name : null,
      districtId: null,
      districtName: null,
      municipalityId: null,
      municipalityName: null,
      ward: null
    }));
  }

  setDistrict(districtId: string | null) {
    if (districtId === null) {
      this.geoFilter.update(current => ({
        ...current,
        districtId: null,
        districtName: null,
        municipalityId: null,
        municipalityName: null,
        ward: null
      }));
      return;
    }
    const d = this.districts().find(item => item.id === districtId);
    this.geoFilter.update(current => ({
      ...current,
      districtId: districtId,
      districtName: d ? d.name : null,
      provinceId: d ? d.provinceId : current.provinceId,
      provinceName: d ? (this.provinces().find(p => p.id === d.provinceId)?.name || current.provinceName) : current.provinceName,
      municipalityId: null,
      municipalityName: null,
      ward: null
    }));
  }

  setMunicipality(municipalityId: string | null) {
    if (municipalityId === null) {
      this.geoFilter.update(current => ({
        ...current,
        municipalityId: null,
        municipalityName: null,
        ward: null
      }));
      return;
    }
    const m = this.municipalities().find(item => item.id === municipalityId || item.name === municipalityId);
    this.geoFilter.update(current => ({
      ...current,
      municipalityId: m ? m.id : municipalityId,
      municipalityName: m ? m.name : municipalityId,
      ward: null
    }));
  }

  setWard(ward: number | null) {
    this.geoFilter.update(current => ({
      ...current,
      ward: ward ? Number(ward) : null
    }));
  }

  setGeoFilter(filter: Partial<GeoCascadeSelection>) {
    this.geoFilter.update(current => ({
      ...current,
      ...filter
    }));
  }

  resetGeoFilter() {
    this.geoFilter.set({
      provinceId: null,
      provinceName: null,
      districtId: null,
      districtName: null,
      municipalityId: null,
      municipalityName: null,
      ward: null
    });
  }

  searchPalikas(keyword: string, districtId?: string | null, provinceId?: number | null): NepalMunicipality[] {
    const term = (keyword || '').toLowerCase().trim();
    let list = this.municipalities();
    if (provinceId) {
      list = list.filter(m => m.provinceId === Number(provinceId));
    }
    if (districtId) {
      list = list.filter(m => m.districtId.toLowerCase() === districtId.toLowerCase());
    }
    if (!term) return list.slice(0, 50);
    return list.filter(m => 
      m.name.toLowerCase().includes(term) || 
      (m.nepaliName && m.nepaliName.includes(term)) ||
      m.type.toLowerCase().includes(term)
    );
  }
}
