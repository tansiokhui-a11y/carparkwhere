import { Carpark } from '../types/carpark';

// Realistic 24-hour typical occupancy curve template
const commercialOccupancy = [10, 8, 5, 5, 5, 8, 15, 45, 80, 92, 95, 98, 95, 90, 88, 85, 80, 70, 50, 35, 25, 20, 15, 12];
const mallOccupancy = [5, 5, 5, 5, 5, 5, 10, 20, 35, 55, 75, 90, 95, 92, 88, 85, 88, 92, 90, 80, 60, 40, 20, 10];
const hdbOccupancy = [88, 90, 92, 92, 92, 90, 80, 60, 45, 40, 42, 45, 44, 43, 45, 50, 65, 75, 82, 85, 88, 90, 90, 89];

export const INITIAL_CARPARKS: Carpark[] = [
  // --- Central & CBD ---
  {
    id: 'ACB',
    name: 'Albert Centre Basement (HDB)',
    agency: 'HDB',
    address: '270 Queen Street, Albert Centre',
    postalCode: '180270',
    area: 'Central & CBD',
    coordinates: { lat: 1.3009, lng: 103.8546 },
    carparkType: 'Basement',
    totalLots: 420,
    availableLots: 86,
    vehicleTypes: {
      car: { total: 360, available: 68 },
      motorcycle: { total: 60, available: 18 }
    },
    rates: {
      weekdayDay: '$1.20 / 30 mins (7am - 5pm)',
      weekdayNight: '$0.60 / 30 mins (Max $5.00 10:30pm - 7am)',
      saturday: '$1.20 / 30 mins (7am - 5pm), $0.60 thereafter',
      sundayPH: '$0.60 / 30 mins (Free Parking 7am - 10:30pm)',
      type: 'cbd_hdb',
      baseRatePerHalfHour: 1.20,
      nightFlatRate: 5.00,
      sundayFree: true
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'SP Mobility',
        ports: 4,
        powerKw: 60
      },
      clearanceHeight: '2.0m',
      heightMeters: 2.0,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 15,
      hasNightParking: true,
      freeParkingSunday: true
    },
    typicalOccupancy: hdbOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'BM1',
    name: 'Bras Basah Complex (HDB)',
    agency: 'HDB',
    address: '231 Bain Street, Bras Basah Complex',
    postalCode: '180231',
    area: 'Central & CBD',
    coordinates: { lat: 1.2968, lng: 103.8532 },
    carparkType: 'Multi-Storey',
    totalLots: 310,
    availableLots: 42,
    vehicleTypes: {
      car: { total: 270, available: 32 },
      motorcycle: { total: 40, available: 10 }
    },
    rates: {
      weekdayDay: '$1.20 / 30 mins',
      weekdayNight: '$0.60 / 30 mins (Cap $5)',
      saturday: '$1.20 / 30 mins (7am - 5pm)',
      sundayPH: 'Free Parking (7am - 10:30pm)',
      type: 'cbd_hdb',
      baseRatePerHalfHour: 1.20,
      nightFlatRate: 5.00,
      sundayFree: true
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'CDG ENGIE',
        ports: 2,
        powerKw: 22
      },
      clearanceHeight: '1.9m',
      heightMeters: 1.9,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 15,
      hasNightParking: true,
      freeParkingSunday: true
    },
    typicalOccupancy: hdbOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'TE12',
    name: 'Tanjong Pagar Plaza (HDB)',
    agency: 'HDB',
    address: 'Block 1 Tanjong Pagar Plaza',
    postalCode: '082001',
    area: 'Central & CBD',
    coordinates: { lat: 1.2765, lng: 103.8431 },
    carparkType: 'Multi-Storey',
    totalLots: 480,
    availableLots: 112,
    vehicleTypes: {
      car: { total: 420, available: 95 },
      motorcycle: { total: 60, available: 17 }
    },
    rates: {
      weekdayDay: '$1.20 / 30 mins',
      weekdayNight: '$0.60 / 30 mins (Night cap $5)',
      saturday: '$1.20 / 30 mins',
      sundayPH: 'Free Parking (7am - 10:30pm)',
      type: 'cbd_hdb',
      baseRatePerHalfHour: 1.20,
      nightFlatRate: 5.00,
      sundayFree: true
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'Charge+',
        ports: 4,
        powerKw: 60
      },
      clearanceHeight: '2.1m',
      heightMeters: 2.1,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 15,
      hasNightParking: true,
      freeParkingSunday: true
    },
    typicalOccupancy: commercialOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'K14',
    name: 'Kreta Ayer Complex (HDB Chinatown)',
    agency: 'HDB',
    address: '333 Kreta Ayer Road',
    postalCode: '080333',
    area: 'Central & CBD',
    coordinates: { lat: 1.2818, lng: 103.8427 },
    carparkType: 'Basement',
    totalLots: 350,
    availableLots: 18,
    vehicleTypes: {
      car: { total: 310, available: 12 },
      motorcycle: { total: 40, available: 6 }
    },
    rates: {
      weekdayDay: '$1.20 / 30 mins',
      weekdayNight: '$0.60 / 30 mins',
      saturday: '$1.20 / 30 mins',
      sundayPH: 'Free Parking (7am - 10:30pm)',
      type: 'cbd_hdb',
      baseRatePerHalfHour: 1.20,
      nightFlatRate: 5.00,
      sundayFree: true
    },
    features: {
      hasEVCharging: false,
      clearanceHeight: '1.9m',
      heightMeters: 1.9,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 15,
      hasNightParking: true,
      freeParkingSunday: true
    },
    typicalOccupancy: hdbOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'ORP',
    name: 'One Raffles Place Carpark',
    agency: 'COMMERCIAL',
    address: '1 Raffles Place, Downtown CBD',
    postalCode: '048616',
    area: 'Central & CBD',
    coordinates: { lat: 1.2845, lng: 103.8512 },
    carparkType: 'Basement',
    totalLots: 290,
    availableLots: 28,
    vehicleTypes: {
      car: { total: 270, available: 25 },
      motorcycle: { total: 20, available: 3 }
    },
    rates: {
      weekdayDay: '$3.27 / 30 mins (7am - 5pm)',
      weekdayNight: '$3.82 / entry (after 5pm)',
      saturday: '$3.82 / entry (all day)',
      sundayPH: '$3.82 / entry',
      type: 'mall_hourly',
      baseRatePerHalfHour: 3.27,
      nightFlatRate: 3.82,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'Volt',
        ports: 4,
        powerKw: 50
      },
      clearanceHeight: '2.0m',
      heightMeters: 2.0,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: commercialOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'GCT',
    name: 'Guoco Tower Carpark (Tanjong Pagar)',
    agency: 'COMMERCIAL',
    address: '1 Wallich Street',
    postalCode: '078881',
    area: 'Central & CBD',
    coordinates: { lat: 1.2769, lng: 103.8456 },
    carparkType: 'Basement',
    totalLots: 390,
    availableLots: 64,
    vehicleTypes: {
      car: { total: 360, available: 58 },
      motorcycle: { total: 30, available: 6 }
    },
    rates: {
      weekdayDay: '$3.50 / 30 mins (7am - 6pm)',
      weekdayNight: '$3.50 / entry (after 6pm)',
      saturday: '$3.50 / entry (7am - 1pm)',
      sundayPH: '$3.50 / entry',
      type: 'mall_hourly',
      baseRatePerHalfHour: 3.50,
      nightFlatRate: 3.50,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'Tesla Supercharger',
        ports: 6,
        powerKw: 250
      },
      clearanceHeight: '2.1m',
      heightMeters: 2.1,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: commercialOccupancy,
    lastUpdated: 'Just now'
  },

  // --- Marina Bay & Suntec ---
  {
    id: 'MBS',
    name: 'Marina Bay Sands Integrated Resort',
    agency: 'MALL',
    address: '10 Bayfront Avenue, Marina Bay',
    postalCode: '018956',
    area: 'Marina Bay',
    coordinates: { lat: 1.2834, lng: 103.8607 },
    carparkType: 'Basement',
    totalLots: 2400,
    availableLots: 640,
    vehicleTypes: {
      car: { total: 2200, available: 590 },
      motorcycle: { total: 200, available: 50 }
    },
    rates: {
      weekdayDay: '$14.00 for 1st hr, $1.50 / subseq 30 mins (Max $32.00/day)',
      weekdayNight: '$14.00 flat entry (7pm - 7am)',
      saturday: '$16.00 for 1st hr, $2.00 / subseq 30 mins',
      sundayPH: '$16.00 for 1st hr, $2.00 / subseq 30 mins',
      type: 'mall_hourly',
      firstHour: 14.00,
      subsequentHalfHour: 1.50,
      nightFlatRate: 14.00,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'Shell Recharge',
        ports: 12,
        powerKw: 120
      },
      clearanceHeight: '2.0m',
      heightMeters: 2.0,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'SUNT',
    name: 'Suntec City Mall & Convention Centre',
    agency: 'MALL',
    address: '3 Temasek Boulevard',
    postalCode: '038983',
    area: 'Marina Bay',
    coordinates: { lat: 1.2935, lng: 103.8572 },
    carparkType: 'Basement',
    totalLots: 3100,
    availableLots: 890,
    vehicleTypes: {
      car: { total: 2850, available: 820 },
      motorcycle: { total: 250, available: 70 }
    },
    rates: {
      weekdayDay: '$2.60 for 1st hr, $0.70 / subseq 15 mins (7am - 5pm)',
      weekdayNight: '$3.50 / entry (after 5pm)',
      saturday: '$2.60 for 1st 4 hrs, $0.70 / subseq 15 mins',
      sundayPH: '$2.60 for 1st 4 hrs, $0.70 / subseq 15 mins',
      type: 'mall_hourly',
      firstHour: 2.60,
      subsequentHalfHour: 1.40,
      nightFlatRate: 3.50,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'SP Mobility',
        ports: 8,
        powerKw: 50
      },
      clearanceHeight: '2.0m',
      heightMeters: 2.0,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 15,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'BUGIS',
    name: 'Bugis Junction Carpark',
    agency: 'MALL',
    address: '200 Victoria Street',
    postalCode: '188021',
    area: 'Marina Bay',
    coordinates: { lat: 1.3002, lng: 103.8553 },
    carparkType: 'Basement',
    totalLots: 650,
    availableLots: 74,
    vehicleTypes: {
      car: { total: 600, available: 65 },
      motorcycle: { total: 50, available: 9 }
    },
    rates: {
      weekdayDay: '$2.20 for 1st hr, $0.60 / subseq 15 mins',
      weekdayNight: '$3.30 / entry (after 6pm)',
      saturday: '$2.20 for 1st hr, $0.60 / subseq 15 mins',
      sundayPH: '$2.20 for 1st hr, $0.60 / subseq 15 mins',
      type: 'mall_hourly',
      firstHour: 2.20,
      subsequentHalfHour: 1.20,
      nightFlatRate: 3.30,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'Charge+',
        ports: 4,
        powerKw: 60
      },
      clearanceHeight: '1.9m',
      heightMeters: 1.9,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'MLW',
    name: 'Millenia Walk Carpark',
    agency: 'MALL',
    address: '9 Raffles Boulevard',
    postalCode: '039596',
    area: 'Marina Bay',
    coordinates: { lat: 1.2929, lng: 103.8596 },
    carparkType: 'Basement',
    totalLots: 450,
    availableLots: 135,
    vehicleTypes: {
      car: { total: 420, available: 125 },
      motorcycle: { total: 30, available: 10 }
    },
    rates: {
      weekdayDay: '$3.30 for 1st hr, $1.10 / subseq 30 mins',
      weekdayNight: '$3.30 / entry (after 6pm)',
      saturday: '$3.30 for 1st 2 hrs, $1.10 / subseq 30 mins',
      sundayPH: '$3.30 for 1st 2 hrs, $1.10 / subseq 30 mins',
      type: 'mall_hourly',
      firstHour: 3.30,
      subsequentHalfHour: 1.10,
      nightFlatRate: 3.30,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'Shell Recharge',
        ports: 4,
        powerKw: 50
      },
      clearanceHeight: '2.1m',
      heightMeters: 2.1,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },

  // --- Orchard Road ---
  {
    id: 'ION',
    name: 'ION Orchard Carpark',
    agency: 'MALL',
    address: '2 Orchard Turn, Orchard Road',
    postalCode: '238801',
    area: 'Orchard',
    coordinates: { lat: 1.3040, lng: 103.8318 },
    carparkType: 'Basement',
    totalLots: 650,
    availableLots: 52,
    vehicleTypes: {
      car: { total: 600, available: 45 },
      motorcycle: { total: 50, available: 7 }
    },
    rates: {
      weekdayDay: '$3.00 for 1st hr, $1.50 / subseq 30 mins (8am - 5pm)',
      weekdayNight: '$4.50 / entry (after 5pm)',
      saturday: '$4.00 for 1st 2 hrs, $1.50 / subseq 30 mins',
      sundayPH: '$4.00 for 1st 2 hrs, $1.50 / subseq 30 mins',
      type: 'mall_hourly',
      firstHour: 3.00,
      subsequentHalfHour: 1.50,
      nightFlatRate: 4.50,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'SP Mobility',
        ports: 6,
        powerKw: 60
      },
      clearanceHeight: '2.0m',
      heightMeters: 2.0,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'NAC',
    name: 'Takashimaya / Ngee Ann City',
    agency: 'MALL',
    address: '391 Orchard Road',
    postalCode: '238873',
    area: 'Orchard',
    coordinates: { lat: 1.3025, lng: 103.8344 },
    carparkType: 'Basement',
    totalLots: 880,
    availableLots: 124,
    vehicleTypes: {
      car: { total: 820, available: 110 },
      motorcycle: { total: 60, available: 14 }
    },
    rates: {
      weekdayDay: '$3.00 for 1st hr, $1.50 / subseq 30 mins',
      weekdayNight: '$4.50 / entry (after 5pm)',
      saturday: '$4.00 for 1st 2 hrs, $1.50 / subseq 30 mins',
      sundayPH: '$4.00 for 1st 2 hrs, $1.50 / subseq 30 mins',
      type: 'mall_hourly',
      firstHour: 3.00,
      subsequentHalfHour: 1.50,
      nightFlatRate: 4.50,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'CDG ENGIE',
        ports: 4,
        powerKw: 22
      },
      clearanceHeight: '2.0m',
      heightMeters: 2.0,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: '313S',
    name: '313@Somerset Carpark',
    agency: 'MALL',
    address: '313 Orchard Road',
    postalCode: '238895',
    area: 'Orchard',
    coordinates: { lat: 1.3012, lng: 103.8385 },
    carparkType: 'Basement',
    totalLots: 320,
    availableLots: 22,
    vehicleTypes: {
      car: { total: 290, available: 18 },
      motorcycle: { total: 30, available: 4 }
    },
    rates: {
      weekdayDay: '$2.50 for 1st hr, $1.20 / subseq 30 mins',
      weekdayNight: '$3.50 / entry (after 6pm)',
      saturday: '$3.50 for 1st 2 hrs, $1.20 / subseq 30 mins',
      sundayPH: '$3.50 for 1st 2 hrs, $1.20 / subseq 30 mins',
      type: 'mall_hourly',
      firstHour: 2.50,
      subsequentHalfHour: 1.20,
      nightFlatRate: 3.50,
      sundayFree: false
    },
    features: {
      hasEVCharging: false,
      clearanceHeight: '1.9m',
      heightMeters: 1.9,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'PLSG',
    name: 'Plaza Singapura Carpark',
    agency: 'MALL',
    address: '68 Orchard Road, Dhoby Ghaut',
    postalCode: '238839',
    area: 'Orchard',
    coordinates: { lat: 1.3007, lng: 103.8452 },
    carparkType: 'Multi-Storey',
    totalLots: 720,
    availableLots: 98,
    vehicleTypes: {
      car: { total: 670, available: 88 },
      motorcycle: { total: 50, available: 10 }
    },
    rates: {
      weekdayDay: '$2.40 for 1st hr, $0.60 / subseq 15 mins (8am - 6pm)',
      weekdayNight: '$3.30 / entry (after 6pm)',
      saturday: '$3.30 for 1st 2 hrs, $0.60 / subseq 15 mins',
      sundayPH: '$3.30 for 1st 2 hrs, $0.60 / subseq 15 mins',
      type: 'mall_hourly',
      firstHour: 2.40,
      subsequentHalfHour: 1.20,
      nightFlatRate: 3.30,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'SP Mobility',
        ports: 6,
        powerKw: 50
      },
      clearanceHeight: '2.0m',
      heightMeters: 2.0,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },

  // --- East (Tampines, Bedok, Changi) ---
  {
    id: 'TM1',
    name: 'Our Tampines Hub (OTH)',
    agency: 'HDB',
    address: '1 Tampines Walk, Tampines Central',
    postalCode: '528523',
    area: 'East',
    coordinates: { lat: 1.3532, lng: 103.9401 },
    carparkType: 'Basement',
    totalLots: 1400,
    availableLots: 380,
    vehicleTypes: {
      car: { total: 1250, available: 340 },
      motorcycle: { total: 150, available: 40 }
    },
    rates: {
      weekdayDay: '$0.60 / 30 mins',
      weekdayNight: '$0.60 / 30 mins (Max $5.00 overnight)',
      saturday: '$0.60 / 30 mins',
      sundayPH: 'Free Parking (7am - 10:30pm)',
      type: 'hdb',
      baseRatePerHalfHour: 0.60,
      nightFlatRate: 5.00,
      sundayFree: true
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'SP Mobility',
        ports: 8,
        powerKw: 50
      },
      clearanceHeight: '2.1m',
      heightMeters: 2.1,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 15,
      hasNightParking: true,
      freeParkingSunday: true
    },
    typicalOccupancy: hdbOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'BD2',
    name: 'Bedok Town Centre (HDB Block 218)',
    agency: 'HDB',
    address: 'Block 218 Bedok North Street 1',
    postalCode: '460218',
    area: 'East',
    coordinates: { lat: 1.3255, lng: 103.9312 },
    carparkType: 'Multi-Storey',
    totalLots: 560,
    availableLots: 145,
    vehicleTypes: {
      car: { total: 500, available: 130 },
      motorcycle: { total: 60, available: 15 }
    },
    rates: {
      weekdayDay: '$0.60 / 30 mins',
      weekdayNight: '$0.60 / 30 mins (Cap $5)',
      saturday: '$0.60 / 30 mins',
      sundayPH: 'Free Parking (7am - 10:30pm)',
      type: 'hdb',
      baseRatePerHalfHour: 0.60,
      nightFlatRate: 5.00,
      sundayFree: true
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'CDG ENGIE',
        ports: 4,
        powerKw: 22
      },
      clearanceHeight: '2.15m',
      heightMeters: 2.15,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 15,
      hasNightParking: true,
      freeParkingSunday: true
    },
    typicalOccupancy: hdbOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'JEWEL',
    name: 'Jewel Changi Airport (Terminal 1)',
    agency: 'COMMERCIAL',
    address: '78 Airport Boulevard, Changi Airport',
    postalCode: '819666',
    area: 'East',
    coordinates: { lat: 1.3602, lng: 103.9898 },
    carparkType: 'Basement',
    totalLots: 2500,
    availableLots: 620,
    vehicleTypes: {
      car: { total: 2350, available: 580 },
      motorcycle: { total: 150, available: 40 }
    },
    rates: {
      weekdayDay: '$0.04 / min for 1st 90 mins ($2.40/hr), $5.00 / subseq 30 mins',
      weekdayNight: '$0.04 / min ($2.40/hr)',
      saturday: '$0.04 / min for 1st 90 mins, $5.00 / subseq 30 mins',
      sundayPH: '$0.04 / min for 1st 90 mins, $5.00 / subseq 30 mins',
      type: 'mall_hourly',
      firstHour: 2.40,
      subsequentHalfHour: 5.00,
      nightFlatRate: 0,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'Shell Recharge',
        ports: 10,
        powerKw: 120
      },
      clearanceHeight: '2.1m',
      heightMeters: 2.1,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'PLQ',
    name: 'Paya Lebar Quarter (PLQ Mall)',
    agency: 'MALL',
    address: '10 Paya Lebar Road',
    postalCode: '409057',
    area: 'East',
    coordinates: { lat: 1.3175, lng: 103.8927 },
    carparkType: 'Basement',
    totalLots: 780,
    availableLots: 190,
    vehicleTypes: {
      car: { total: 720, available: 175 },
      motorcycle: { total: 60, available: 15 }
    },
    rates: {
      weekdayDay: '$2.00 for 1st hr, $0.55 / subseq 15 mins (6am - 6pm)',
      weekdayNight: '$3.30 / entry (after 6pm)',
      saturday: '$2.20 for 1st 2 hrs, $0.55 / subseq 15 mins',
      sundayPH: '$2.20 for 1st 2 hrs, $0.55 / subseq 15 mins',
      type: 'mall_hourly',
      firstHour: 2.00,
      subsequentHalfHour: 1.10,
      nightFlatRate: 3.30,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'Tesla Supercharger',
        ports: 6,
        powerKw: 250
      },
      clearanceHeight: '2.0m',
      heightMeters: 2.0,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },

  // --- West (Jurong East, Clementi, One-North) ---
  {
    id: 'JEM',
    name: 'Jem Shopping Mall Carpark',
    agency: 'MALL',
    address: '50 Jurong Gateway Road',
    postalCode: '608549',
    area: 'West',
    coordinates: { lat: 1.3332, lng: 103.7436 },
    carparkType: 'Basement',
    totalLots: 820,
    availableLots: 88,
    vehicleTypes: {
      car: { total: 750, available: 76 },
      motorcycle: { total: 70, available: 12 }
    },
    rates: {
      weekdayDay: '$1.90 for 1st hr, $0.55 / subseq 15 mins (6am - 6pm)',
      weekdayNight: '$3.00 / entry (after 6pm)',
      saturday: '$2.50 for 1st 2 hrs, $0.55 / subseq 15 mins',
      sundayPH: '$2.50 for 1st 2 hrs, $0.55 / subseq 15 mins',
      type: 'mall_hourly',
      firstHour: 1.90,
      subsequentHalfHour: 1.10,
      nightFlatRate: 3.00,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'SP Mobility',
        ports: 6,
        powerKw: 50
      },
      clearanceHeight: '2.1m',
      heightMeters: 2.1,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'JE1',
    name: 'Jurong Gateway MSCP (HDB)',
    agency: 'HDB',
    address: 'Block 132 Jurong Gateway Road',
    postalCode: '600132',
    area: 'West',
    coordinates: { lat: 1.3345, lng: 103.7420 },
    carparkType: 'Multi-Storey',
    totalLots: 640,
    availableLots: 154,
    vehicleTypes: {
      car: { total: 560, available: 138 },
      motorcycle: { total: 80, available: 16 }
    },
    rates: {
      weekdayDay: '$0.60 / 30 mins',
      weekdayNight: '$0.60 / 30 mins (Cap $5)',
      saturday: '$0.60 / 30 mins',
      sundayPH: 'Free Parking (7am - 10:30pm)',
      type: 'hdb',
      baseRatePerHalfHour: 0.60,
      nightFlatRate: 5.00,
      sundayFree: true
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'CDG ENGIE',
        ports: 4,
        powerKw: 22
      },
      clearanceHeight: '2.15m',
      heightMeters: 2.15,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 15,
      hasNightParking: true,
      freeParkingSunday: true
    },
    typicalOccupancy: hdbOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'CL3',
    name: 'Clementi Central MSCP (HDB Block 442)',
    agency: 'HDB',
    address: 'Block 442 Clementi Avenue 3',
    postalCode: '120442',
    area: 'West',
    coordinates: { lat: 1.3149, lng: 103.7651 },
    carparkType: 'Multi-Storey',
    totalLots: 510,
    availableLots: 94,
    vehicleTypes: {
      car: { total: 450, available: 82 },
      motorcycle: { total: 60, available: 12 }
    },
    rates: {
      weekdayDay: '$0.60 / 30 mins',
      weekdayNight: '$0.60 / 30 mins (Cap $5)',
      saturday: '$0.60 / 30 mins',
      sundayPH: 'Free Parking (7am - 10:30pm)',
      type: 'hdb',
      baseRatePerHalfHour: 0.60,
      nightFlatRate: 5.00,
      sundayFree: true
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'Charge+',
        ports: 2,
        powerKw: 60
      },
      clearanceHeight: '2.15m',
      heightMeters: 2.15,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 15,
      hasNightParking: true,
      freeParkingSunday: true
    },
    typicalOccupancy: hdbOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'TSV',
    name: 'The Star Vista Carpark',
    agency: 'MALL',
    address: '1 Vista Exchange Green, Buona Vista',
    postalCode: '138617',
    area: 'West',
    coordinates: { lat: 1.3068, lng: 103.7885 },
    carparkType: 'Basement',
    totalLots: 790,
    availableLots: 210,
    vehicleTypes: {
      car: { total: 730, available: 195 },
      motorcycle: { total: 60, available: 15 }
    },
    rates: {
      weekdayDay: '$1.80 for 1st hr, $0.50 / subseq 15 mins (6am - 6pm)',
      weekdayNight: '$3.00 / entry (after 6pm)',
      saturday: '$2.20 for 1st 2 hrs, $0.50 / subseq 15 mins',
      sundayPH: '$2.20 for 1st 2 hrs, $0.50 / subseq 15 mins',
      type: 'mall_hourly',
      firstHour: 1.80,
      subsequentHalfHour: 1.00,
      nightFlatRate: 3.00,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'SP Mobility',
        ports: 4,
        powerKw: 50
      },
      clearanceHeight: '2.0m',
      heightMeters: 2.0,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },

  // --- North (Woodlands, Yishun) ---
  {
    id: 'WL1',
    name: 'Woodlands Civic Centre (HDB)',
    agency: 'HDB',
    address: '900 South Woodlands Drive',
    postalCode: '730900',
    area: 'North',
    coordinates: { lat: 1.4357, lng: 103.7865 },
    carparkType: 'Basement',
    totalLots: 420,
    availableLots: 120,
    vehicleTypes: {
      car: { total: 370, available: 108 },
      motorcycle: { total: 50, available: 12 }
    },
    rates: {
      weekdayDay: '$0.60 / 30 mins',
      weekdayNight: '$0.60 / 30 mins (Cap $5)',
      saturday: '$0.60 / 30 mins',
      sundayPH: 'Free Parking (7am - 10:30pm)',
      type: 'hdb',
      baseRatePerHalfHour: 0.60,
      nightFlatRate: 5.00,
      sundayFree: true
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'CDG ENGIE',
        ports: 4,
        powerKw: 22
      },
      clearanceHeight: '2.1m',
      heightMeters: 2.1,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 15,
      hasNightParking: true,
      freeParkingSunday: true
    },
    typicalOccupancy: hdbOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'CWP',
    name: 'Causeway Point Carpark',
    agency: 'MALL',
    address: '1 Woodlands Square',
    postalCode: '738099',
    area: 'North',
    coordinates: { lat: 1.4361, lng: 103.7859 },
    carparkType: 'Multi-Storey',
    totalLots: 890,
    availableLots: 145,
    vehicleTypes: {
      car: { total: 810, available: 130 },
      motorcycle: { total: 80, available: 15 }
    },
    rates: {
      weekdayDay: '$1.80 for 1st hr, $0.50 / subseq 15 mins (7am - 5pm)',
      weekdayNight: '$2.80 / entry (after 5pm)',
      saturday: '$2.40 for 1st 2 hrs, $0.50 / subseq 15 mins',
      sundayPH: '$2.40 for 1st 2 hrs, $0.50 / subseq 15 mins',
      type: 'mall_hourly',
      firstHour: 1.80,
      subsequentHalfHour: 1.00,
      nightFlatRate: 2.80,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'Charge+',
        ports: 4,
        powerKw: 60
      },
      clearanceHeight: '2.0m',
      heightMeters: 2.0,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'NPC',
    name: 'Northpoint City (Yishun Central)',
    agency: 'MALL',
    address: '930 Yishun Avenue 2',
    postalCode: '769098',
    area: 'North',
    coordinates: { lat: 1.4295, lng: 103.8360 },
    carparkType: 'Basement',
    totalLots: 1050,
    availableLots: 215,
    vehicleTypes: {
      car: { total: 960, available: 195 },
      motorcycle: { total: 90, available: 20 }
    },
    rates: {
      weekdayDay: '$1.80 for 1st hr, $0.50 / subseq 15 mins',
      weekdayNight: '$2.80 / entry (after 5pm)',
      saturday: '$2.40 for 1st 2 hrs, $0.50 / subseq 15 mins',
      sundayPH: '$2.40 for 1st 2 hrs, $0.50 / subseq 15 mins',
      type: 'mall_hourly',
      firstHour: 1.80,
      subsequentHalfHour: 1.00,
      nightFlatRate: 2.80,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'SP Mobility',
        ports: 6,
        powerKw: 50
      },
      clearanceHeight: '2.1m',
      heightMeters: 2.1,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },

  // --- North-East (Punggol, Sengkang, Bishan, Toa Payoh) ---
  {
    id: 'WWP',
    name: 'Waterway Point (Punggol Central)',
    agency: 'MALL',
    address: '83 Punggol Central',
    postalCode: '828761',
    area: 'North-East',
    coordinates: { lat: 1.4067, lng: 103.9022 },
    carparkType: 'Basement',
    totalLots: 1200,
    availableLots: 310,
    vehicleTypes: {
      car: { total: 1100, available: 285 },
      motorcycle: { total: 100, available: 25 }
    },
    rates: {
      weekdayDay: '$1.80 for 1st hr, $0.50 / subseq 15 mins',
      weekdayNight: '$2.80 / entry (after 6pm)',
      saturday: '$2.40 for 1st 2 hrs, $0.50 / subseq 15 mins',
      sundayPH: '$2.40 for 1st 2 hrs, $0.50 / subseq 15 mins',
      type: 'mall_hourly',
      firstHour: 1.80,
      subsequentHalfHour: 1.00,
      nightFlatRate: 2.80,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'SP Mobility',
        ports: 8,
        powerKw: 60
      },
      clearanceHeight: '2.1m',
      heightMeters: 2.1,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'BJ22',
    name: 'Bishan Street 22 MSCP (HDB)',
    agency: 'HDB',
    address: 'Block 283 Bishan Street 22',
    postalCode: '570283',
    area: 'North-East',
    coordinates: { lat: 1.3588, lng: 103.8447 },
    carparkType: 'Multi-Storey',
    totalLots: 480,
    availableLots: 110,
    vehicleTypes: {
      car: { total: 420, available: 96 },
      motorcycle: { total: 60, available: 14 }
    },
    rates: {
      weekdayDay: '$0.60 / 30 mins',
      weekdayNight: '$0.60 / 30 mins (Cap $5)',
      saturday: '$0.60 / 30 mins',
      sundayPH: 'Free Parking (7am - 10:30pm)',
      type: 'hdb',
      baseRatePerHalfHour: 0.60,
      nightFlatRate: 5.00,
      sundayFree: true
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'CDG ENGIE',
        ports: 4,
        powerKw: 22
      },
      clearanceHeight: '2.15m',
      heightMeters: 2.15,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 15,
      hasNightParking: true,
      freeParkingSunday: true
    },
    typicalOccupancy: hdbOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'TP1',
    name: 'Toa Payoh Central MSCP (HDB Block 178)',
    agency: 'HDB',
    address: 'Block 178 Toa Payoh Central',
    postalCode: '310178',
    area: 'North-East',
    coordinates: { lat: 1.3328, lng: 103.8502 },
    carparkType: 'Multi-Storey',
    totalLots: 520,
    availableLots: 78,
    vehicleTypes: {
      car: { total: 460, available: 68 },
      motorcycle: { total: 60, available: 10 }
    },
    rates: {
      weekdayDay: '$0.60 / 30 mins',
      weekdayNight: '$0.60 / 30 mins (Cap $5)',
      saturday: '$0.60 / 30 mins',
      sundayPH: 'Free Parking (7am - 10:30pm)',
      type: 'hdb',
      baseRatePerHalfHour: 0.60,
      nightFlatRate: 5.00,
      sundayFree: true
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'Charge+',
        ports: 2,
        powerKw: 60
      },
      clearanceHeight: '2.1m',
      heightMeters: 2.1,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 15,
      hasNightParking: true,
      freeParkingSunday: true
    },
    typicalOccupancy: hdbOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'NEX',
    name: 'NEX Shopping Mall (Serangoon)',
    agency: 'MALL',
    address: '23 Serangoon Central',
    postalCode: '556083',
    area: 'North-East',
    coordinates: { lat: 1.3508, lng: 103.8727 },
    carparkType: 'Multi-Storey',
    totalLots: 920,
    availableLots: 82,
    vehicleTypes: {
      car: { total: 840, available: 72 },
      motorcycle: { total: 80, available: 10 }
    },
    rates: {
      weekdayDay: '$1.90 for 1st hr, $0.55 / subseq 15 mins (7am - 5pm)',
      weekdayNight: '$2.80 / entry (after 5pm)',
      saturday: '$2.40 for 1st 2 hrs, $0.55 / subseq 15 mins',
      sundayPH: '$2.40 for 1st 2 hrs, $0.55 / subseq 15 mins',
      type: 'mall_hourly',
      firstHour: 1.90,
      subsequentHalfHour: 1.10,
      nightFlatRate: 2.80,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'SP Mobility',
        ports: 4,
        powerKw: 50
      },
      clearanceHeight: '2.0m',
      heightMeters: 2.0,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },

  // --- South & HarbourFront & Sentosa ---
  {
    id: 'VIVO',
    name: 'VivoCity Shopping Mall',
    agency: 'MALL',
    address: '1 HarbourFront Walk',
    postalCode: '098585',
    area: 'South & HarbourFront',
    coordinates: { lat: 1.2644, lng: 103.8222 },
    carparkType: 'Basement',
    totalLots: 2100,
    availableLots: 420,
    vehicleTypes: {
      car: { total: 1950, available: 390 },
      motorcycle: { total: 150, available: 30 }
    },
    rates: {
      weekdayDay: '$1.80 for 1st hr, $0.60 / subseq 15 mins (7am - 6pm)',
      weekdayNight: '$3.50 / entry (after 6pm)',
      saturday: '$2.40 for 1st hr, $0.70 / subseq 15 mins',
      sundayPH: '$2.40 for 1st hr, $0.70 / subseq 15 mins',
      type: 'mall_hourly',
      firstHour: 1.80,
      subsequentHalfHour: 1.20,
      nightFlatRate: 3.50,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'Shell Recharge',
        ports: 8,
        powerKw: 120
      },
      clearanceHeight: '2.0m',
      heightMeters: 2.0,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'RWS',
    name: 'Resorts World Sentosa (B1 Carpark)',
    agency: 'COMMERCIAL',
    address: '8 Sentosa Gateway, Sentosa Island',
    postalCode: '098269',
    area: 'South & HarbourFront',
    coordinates: { lat: 1.2568, lng: 103.8208 },
    carparkType: 'Basement',
    totalLots: 3500,
    availableLots: 1250,
    vehicleTypes: {
      car: { total: 3200, available: 1150 },
      motorcycle: { total: 300, available: 100 }
    },
    rates: {
      weekdayDay: '$7.00 for 1st hr, $1.50 / subseq 30 mins (Max $28/day)',
      weekdayNight: '$7.00 flat entry (after 7pm)',
      saturday: '$10.00 for 1st hr, $2.00 / subseq 30 mins',
      sundayPH: '$10.00 for 1st hr, $2.00 / subseq 30 mins',
      type: 'mall_hourly',
      firstHour: 7.00,
      subsequentHalfHour: 1.50,
      nightFlatRate: 7.00,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'Tesla Supercharger',
        ports: 8,
        powerKw: 250
      },
      clearanceHeight: '2.1m',
      heightMeters: 2.1,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  },
  {
    id: 'HFC',
    name: 'HarbourFront Centre Carpark',
    agency: 'MALL',
    address: '1 Maritime Square',
    postalCode: '099253',
    area: 'South & HarbourFront',
    coordinates: { lat: 1.2647, lng: 103.8198 },
    carparkType: 'Multi-Storey',
    totalLots: 750,
    availableLots: 180,
    vehicleTypes: {
      car: { total: 690, available: 165 },
      motorcycle: { total: 60, available: 15 }
    },
    rates: {
      weekdayDay: '$1.80 for 1st hr, $0.55 / subseq 15 mins (7am - 6pm)',
      weekdayNight: '$3.20 / entry (after 6pm)',
      saturday: '$2.20 for 1st 2 hrs, $0.55 / subseq 15 mins',
      sundayPH: '$2.20 for 1st 2 hrs, $0.55 / subseq 15 mins',
      type: 'mall_hourly',
      firstHour: 1.80,
      subsequentHalfHour: 1.10,
      nightFlatRate: 3.20,
      sundayFree: false
    },
    features: {
      hasEVCharging: true,
      evDetails: {
        available: true,
        operator: 'CDG ENGIE',
        ports: 4,
        powerKw: 22
      },
      clearanceHeight: '2.0m',
      heightMeters: 2.0,
      isSheltered: true,
      hasDisabledLots: true,
      gracePeriodMins: 10,
      hasNightParking: true,
      freeParkingSunday: false
    },
    typicalOccupancy: mallOccupancy,
    lastUpdated: 'Just now'
  }
];
