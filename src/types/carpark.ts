export type VehicleType = 'C' | 'Y' | 'H'; // Car, Motorcycle, Heavy Vehicle

export type AgencyType = 'HDB' | 'URA' | 'MALL' | 'COMMERCIAL';

export type RegionType = 
  | 'All' 
  | 'Central & CBD' 
  | 'Orchard' 
  | 'Marina Bay' 
  | 'East' 
  | 'West' 
  | 'North' 
  | 'North-East' 
  | 'South & HarbourFront';

export type AvailabilityTier = 'all' | 'high' | 'medium' | 'low';

export interface VehicleLotInfo {
  total: number;
  available: number;
}

export interface CarparkRates {
  weekdayDay: string;
  weekdayNight: string;
  saturday: string;
  sundayPH: string;
  type: 'hdb' | 'cbd_hdb' | 'mall_hourly' | 'flat_entry';
  baseRatePerHalfHour?: number;
  firstHour?: number;
  subsequentHalfHour?: number;
  nightFlatRate?: number;
  sundayFree?: boolean;
}

export interface EVStation {
  available: boolean;
  operator?: 'SP Mobility' | 'CDG ENGIE' | 'Charge+' | 'Shell Recharge' | 'Tesla Supercharger' | 'Volt';
  ports?: number;
  powerKw?: number;
}

export interface Carpark {
  id: string; // e.g. "ACB", "ION", "MBS"
  name: string;
  agency: AgencyType;
  address: string;
  postalCode: string;
  area: RegionType;
  coordinates: {
    lat: number;
    lng: number;
  };
  carparkType: 'Multi-Storey' | 'Basement' | 'Surface' | 'Mechanized';
  totalLots: number;
  availableLots: number;
  vehicleTypes: {
    car: VehicleLotInfo;
    motorcycle?: VehicleLotInfo;
    heavyVehicle?: VehicleLotInfo;
  };
  rates: CarparkRates;
  features: {
    hasEVCharging: boolean;
    evDetails?: EVStation;
    clearanceHeight: string; // e.g. "2.1m"
    heightMeters: number; // numeric for filtering e.g. 2.1
    isSheltered: boolean;
    hasDisabledLots: boolean;
    gracePeriodMins: number; // usually 10 or 15 mins in SG
    hasNightParking: boolean;
    freeParkingSunday: boolean;
  };
  typicalOccupancy: number[]; // 24-hour typical occupancy % (0-23 hours)
  lastUpdated: string;
}

export interface CarparkFilter {
  searchQuery: string;
  region: RegionType;
  availabilityTier: AvailabilityTier;
  vehicleType: VehicleType;
  evOnly: boolean;
  shelteredOnly: boolean;
  minClearance: number; // 0 for any, 2.0, 2.1, etc.
  freeSundayOnly: boolean;
  sortBy: 'availability' | 'distance' | 'rates' | 'name';
}
