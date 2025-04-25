import { IAirbaseModel } from "@/game/db/models/Airbase";
import { IAircraftModel } from "@/game/db/models/Aircraft";
import { IFacilityModel } from "@/game/db/models/Facility";
import { IShipModel } from "@/game/db/models/Ship";
import { IWeaponModel } from "@/game/db/models/Weapon";

export const AircraftDb: IAircraftModel[] = [
  // fuel rates are generated with AI - use with a grain of salt.
  {
    className: "F-35A Lightning II",
    speed: 1200,
    maxFuel: 18498,
    fuelRate: 1000,
    range: 1350,
    dataSource: {
      speedSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/478441/f-35a-lightning-ii/",
      maxFuelSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/478441/f-35a-lightning-ii/",
      fuelRateSrc: "missing",
      rangeSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/478441/f-35a-lightning-ii/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "KC-135R Stratotanker",
    speed: 530,
    maxFuel: 200000,
    fuelRate: 5000,
    range: 1303,
    dataSource: {
      speedSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/174560/kc-135r-stratotanker/",
      maxFuelSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/174560/kc-135r-stratotanker/",
      fuelRateSrc: "missing",
      rangeSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/174560/kc-135r-stratotanker/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "A-10C Thunderbolt II",
    speed: 420,
    maxFuel: 11000,
    fuelRate: 1000,
    range: 695,
    dataSource: {
      speedSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104490/a-10c-thunderbolt-ii/",
      maxFuelSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104490/a-10c-thunderbolt-ii/",
      fuelRateSrc: "missing",
      rangeSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104490/a-10c-thunderbolt-ii/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "B-2 Spirit",
    speed: 650,
    maxFuel: 166999,
    fuelRate: 5000,
    range: 6000,
    dataSource: {
      speedSrc:
        "high subsonic, https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104481/b-2-spirit/",
      maxFuelSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104481/b-2-spirit/",
      fuelRateSrc: "missing",
      rangeSrc:
        "intercontinental, https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104481/b-2-spirit/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "F-22 Raptor",
    speed: 1500,
    maxFuel: 18000,
    fuelRate: 1000,
    range: 1600,
    dataSource: {
      speedSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104506/f-22-raptor/",
      maxFuelSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104506/f-22-raptor/",
      fuelRateSrc: "missing",
      rangeSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104506/f-22-raptor/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "C-130 Hercules",
    speed: 350,
    maxFuel: 61360,
    fuelRate: 5000,
    range: 1700,
    dataSource: {
      speedSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/1555054/c-130-hercules/",
      maxFuelSrc: "missing",
      fuelRateSrc: "missing",
      rangeSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/1555054/c-130-hercules/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "C-17 Globemaster III",
    speed: 570,
    maxFuel: 181054,
    fuelRate: 5000,
    range: 2785,
    dataSource: {
      speedSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/1529726/c-17-globemaster-iii/",
      maxFuelSrc: "missing",
      fuelRateSrc: "missing",
      rangeSrc:
        "Global with in-flight refueling, https://www.af.mil/About-Us/Fact-Sheets/Display/Article/478441/f-35a-lightning-ii/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "F-16 Fighting Falcon",
    speed: 1500,
    maxFuel: 12000,
    fuelRate: 1000,
    range: 1740,
    dataSource: {
      speedSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104505/f-16-fighting-falcon/",
      maxFuelSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104505/f-16-fighting-falcon/",
      fuelRateSrc: "missing",
      rangeSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104505/f-16-fighting-falcon/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "F-15 Eagle",
    speed: 1875,
    maxFuel: 36200,
    fuelRate: 1000,
    range: 3000,
    dataSource: {
      speedSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104501/f-15-eagle/",
      maxFuelSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104501/f-15-eagle/",
      fuelRateSrc: "missing",
      rangeSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104501/f-15-eagle/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "F/A-18 Hornet",
    speed: 1381,
    maxFuel: 14400,
    fuelRate: 1000,
    range: 1275,
    dataSource: {
      speedSrc:
        "https://www.navy.mil/Resources/Fact-Files/Display-FactFiles/Article/2383479/fa-18a-d-hornet-and-fa-18ef-super-hornet-strike-fighter/",
      maxFuelSrc: "missing",
      fuelRateSrc: "missing",
      rangeSrc:
        "https://www.navy.mil/Resources/Fact-Files/Display-FactFiles/Article/2383479/fa-18a-d-hornet-and-fa-18ef-super-hornet-strike-fighter/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "B-52 Stratofortress",
    speed: 650,
    maxFuel: 312197,
    fuelRate: 5000,
    range: 8800,
    dataSource: {
      speedSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104465/b-52h-stratofortress/",
      maxFuelSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104465/b-52h-stratofortress/",
      fuelRateSrc: "missing",
      rangeSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104465/b-52h-stratofortress/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "F-4 Phantom II",
    speed: 1400,
    maxFuel: 13890,
    fuelRate: 1000,
    range: 1750,
    dataSource: {
      speedSrc:
        "https://www.holloman.af.mil/About/Fact-Sheets/Display/Article/317295/f-4-phantom-ii/",
      maxFuelSrc: "missing",
      fuelRateSrc: "missing",
      rangeSrc:
        "https://www.holloman.af.mil/About/Fact-Sheets/Display/Article/317295/f-4-phantom-ii/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "B-1B Lancer",
    speed: 900,
    maxFuel: 265274,
    fuelRate: 5000,
    range: 5100,
    dataSource: {
      speedSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104500/b-1b-lancer/",
      maxFuelSrc:
        "https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104500/b-1b-lancer/",
      fuelRateSrc: "missing",
      rangeSrc:
        "intercontinental, https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104500/b-1b-lancer/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "C-12 Huron",
    speed: 284,
    maxFuel: 4502,
    fuelRate: 300,
    range: 1450,
    dataSource: {
      speedSrc:
        "https://www.5af.pacaf.af.mil/About-Us/Fact-Sheets/Display/Article/1482851/c-12-huron/",
      maxFuelSrc:
        "https://www.5af.pacaf.af.mil/About-Us/Fact-Sheets/Display/Article/1482851/c-12-huron/",
      fuelRateSrc: "missing",
      rangeSrc:
        "https://www.5af.pacaf.af.mil/About-Us/Fact-Sheets/Display/Article/1482851/c-12-huron/",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
  {
    className: "F-14 Tomcat",
    speed: 1544,
    maxFuel: 16200,
    fuelRate: 1000,
    range: 2085,
    dataSource: {
      speedSrc:
        "https://www.history.navy.mil/content/history/museums/nnam/explore/collections/aircraft/f/f-14a-tomcat.html",
      maxFuelSrc: "missing",
      fuelRateSrc: "missing",
      rangeSrc:
        "https://www.history.navy.mil/content/history/museums/nnam/explore/collections/aircraft/f/f-14a-tomcat.html",
    },
    units: {
      speedUnit: "mph",
      maxFuelUnit: "lbs",
      fuelRateUnit: "gallons/hour",
      rangeUnit: "nm",
    },
  },
];

export const AirbaseDb: IAirbaseModel[] = [
  {
    name: "Al Udeid Air Base",
    latitude: 25.1175,
    longitude: 51.315,
    country: "Qatar",
  },
  {
    name: "Andersen Air Force Base",
    latitude: 13.5841,
    longitude: 144.9245,
    country: "Guam",
  },
  {
    name: "Andrews Air Force Base",
    latitude: 38.8108,
    longitude: -76.866,
    country: "USA",
  },
  {
    name: "Aviano Air Base",
    latitude: 46.0319,
    longitude: 12.5965,
    country: "Italy",
  },
  {
    name: "Beale Air Force Base",
    latitude: 39.1236,
    longitude: -121.4368,
    country: "USA",
  },
  {
    name: "Creech Air Force Base",
    latitude: 36.5822,
    longitude: -115.6711,
    country: "USA",
  },
  {
    name: "Davis-Monthan Air Force Base",
    latitude: 32.1665,
    longitude: -110.883,
    country: "USA",
  },
  {
    name: "Eglin Air Force Base",
    latitude: 30.4833,
    longitude: -86.5254,
    country: "USA",
  },
  {
    name: "Edwards Air Force Base",
    latitude: 34.9054,
    longitude: -117.8839,
    country: "USA",
  },
  {
    name: "Elmendorf Air Force Base",
    latitude: 61.25,
    longitude: -149.8,
    country: "USA",
  },
  {
    name: "Incirlik Air Base",
    latitude: 37.0017,
    longitude: 35.4251,
    country: "Turkey",
  },
  {
    name: "Joint Base Pearl Harbor-Hickam",
    latitude: 21.3469,
    longitude: -157.9397,
    country: "USA",
  },
  {
    name: "Kadena Air Base",
    latitude: 26.3516,
    longitude: 127.7692,
    country: "Japan",
  },
  {
    name: "Kunsan Air Base",
    latitude: 35.9023,
    longitude: 126.615,
    country: "South Korea",
  },
  {
    name: "Lackland Air Force Base",
    latitude: 29.3842,
    longitude: -98.5811,
    country: "USA",
  },
  {
    name: "Luke Air Force Base",
    latitude: 33.5386,
    longitude: -112.358,
    country: "USA",
  },
  {
    name: "Marine Corps Air Station Cherry Point",
    latitude: 34.9008,
    longitude: -76.88,
    country: "USA",
  },
  {
    name: "Marine Corps Air Station Iwakuni",
    latitude: 34.1463,
    longitude: 132.2365,
    country: "Japan",
  },
  {
    name: "Marine Corps Air Station Miramar",
    latitude: 32.8683,
    longitude: -117.1424,
    country: "USA",
  },
  {
    name: "Marine Corps Base Camp Pendleton",
    latitude: 33.3852,
    longitude: -117.565,
    country: "USA",
  },
  {
    name: "McChord Air Force Base",
    latitude: 47.137,
    longitude: -122.4745,
    country: "USA",
  },
  {
    name: "Minot Air Force Base",
    latitude: 48.4159,
    longitude: -101.3306,
    country: "USA",
  },
  {
    name: "Misawa Air Base",
    latitude: 40.7032,
    longitude: 141.3686,
    country: "Japan",
  },
  {
    name: "Moody Air Force Base",
    latitude: 30.9674,
    longitude: -83.193,
    country: "USA",
  },
  {
    name: "Nellis Air Force Base",
    latitude: 36.236,
    longitude: -115.034,
    country: "USA",
  },
  {
    name: "Naval Air Facility Atsugi",
    latitude: 35.4542,
    longitude: 139.4493,
    country: "Japan",
  },
  {
    name: "Naval Air Station Fallon",
    latitude: 39.4169,
    longitude: -118.7002,
    country: "USA",
  },
  {
    name: "Naval Air Station Jacksonville",
    latitude: 30.2358,
    longitude: -81.6806,
    country: "USA",
  },
  {
    name: "Naval Air Station Oceana",
    latitude: 36.8206,
    longitude: -76.0331,
    country: "USA",
  },
  {
    name: "Naval Air Station Patuxent River",
    latitude: 38.2851,
    longitude: -76.4112,
    country: "USA",
  },
  {
    name: "Naval Air Station Pensacola",
    latitude: 30.3501,
    longitude: -87.3095,
    country: "USA",
  },
  {
    name: "Naval Air Station Sigonella",
    latitude: 37.4017,
    longitude: 14.9222,
    country: "Italy",
  },
  {
    name: "Naval Air Station Whidbey Island",
    latitude: 48.3516,
    longitude: -122.6551,
    country: "USA",
  },
  {
    name: "Naval Station Rota",
    latitude: 36.6414,
    longitude: -6.3497,
    country: "Spain",
  },
  {
    name: "Osan Air Base",
    latitude: 37.0901,
    longitude: 127.0305,
    country: "South Korea",
  },
  {
    name: "Patrick Air Force Base",
    latitude: 28.2346,
    longitude: -80.6101,
    country: "USA",
  },
  {
    name: "RAF Fairford",
    latitude: 51.682,
    longitude: -1.79,
    country: "United Kingdom",
  },
  {
    name: "RAF Lakenheath",
    latitude: 52.4093,
    longitude: 0.5616,
    country: "United Kingdom",
  },
  {
    name: "RAF Mildenhall",
    latitude: 52.3611,
    longitude: 0.4864,
    country: "United Kingdom",
  },
  {
    name: "Ramstein Air Base",
    latitude: 49.4369,
    longitude: 7.6003,
    country: "Germany",
  },
  {
    name: "Royal Australian Air Force Base Amberley",
    latitude: -27.637,
    longitude: 152.711,
    country: "Australia",
  },
  {
    name: "Seymour Johnson Air Force Base",
    latitude: 35.3394,
    longitude: -77.9606,
    country: "USA",
  },
  {
    name: "Spangdahlem Air Base",
    latitude: 49.9725,
    longitude: 6.6925,
    country: "Germany",
  },
  {
    name: "Thule Air Base",
    latitude: 76.5312,
    longitude: -68.7031,
    country: "Greenland",
  },
  {
    name: "Travis Air Force Base",
    latitude: 38.2626,
    longitude: -121.9275,
    country: "USA",
  },
  {
    name: "Tyndall Air Force Base",
    latitude: 30.0696,
    longitude: -85.6069,
    country: "USA",
  },
  {
    name: "Whiteman Air Force Base",
    latitude: 38.7267,
    longitude: -93.5479,
    country: "USA",
  },
];

export const FacilityDb: IFacilityModel[] = [
  {
    className: "S-400 Triumf",
    range: 200, // No official source available, using 200 as the range
  },
  {
    className: "S-300V4",
    range: 200, // No official source available, using 200 as the range
  },
  {
    className: "S-500 Prometey",
    range: 200, // No official source available, using 200 as the range
  },
  {
    className: "Buk-M3",
    range: 50, // No official source available, using 50 as the range
  },
  {
    className: "Tor-M2",
    range: 10, // No official source available, using 10 as the range
  },
  {
    className: "Pantsir-S1",
    range: 10, // No official source available, using 10 as the range
  },
  {
    className: "HQ-9",
    range: 200, // No official source available, using 200 as the range
  },
  {
    className: "HQ-19",
    range: 200, // No official source available, using 200 as the range
  },
  {
    className: "HQ-16",
    range: 50, // No official source available, using 50 as the range
  },
  {
    className: "HQ-17",
    range: 10, // No official source available, using 10 as the range
  },
  {
    className: "HQ-7",
    range: 10, // No official source available, using 10 as the range
  },
  {
    className: "MIM-104 Patriot",
    range: 200, // No official source available, using 200 as the range
  },
  {
    className: "THAAD",
    range: 200, // No official source available, using 200 as the range
  },
  {
    className: "Aster 30",
    range: 50, // No official source available, using 50 as the range
  },
  {
    className: "Barak 8",
    range: 50, // No official source available, using 50 as the range
  },
  {
    className: "NASAMS",
    range: 50, // No official source available, using 50 as the range
  },
];

export const ShipDb: IShipModel[] = [
  // all values notional
  // TODO: Add additional data fields for Ships in the database (e.g dataSource: {...}, units: {...})
  {
    className: "Aircraft Carrier",
    speed: 35, // mph
    maxFuel: 25200000, // lbs
    fuelRate: 1000000, // lbs/hr
    range: 8000, // NM
  },
  {
    className: "Destroyer",
    speed: 40, // mph
    maxFuel: 3500000, // lbs
    fuelRate: 100000, // lbs/hr
    range: 5000, // NM
  },
  {
    className: "Frigate",
    speed: 35, // mph
    maxFuel: 2800000, // lbs
    fuelRate: 80000, // lbs/hr
    range: 4500, // NM
  },
  {
    className: "Corvette",
    speed: 32, // mph
    maxFuel: 1400000, // lbs
    fuelRate: 60000, // lbs/hr
    range: 3500, // NM
  },
  {
    className: "Amphibious Assault Ship",
    speed: 25, // mph
    maxFuel: 8400000, // lbs
    fuelRate: 200000, // lbs/hr
    range: 6000, // NM
  },
  {
    className: "Patrol Boat",
    speed: 40, // mph
    maxFuel: 350000, // lbs
    fuelRate: 30000, // lbs/hr
    range: 1500, // NM
  },
];

export const WeaponDb: IWeaponModel[] = [
  // Air-to-Air / Air-to-Ground Missiles and Cruise Missiles
  {
    className: "AIM-120 AMRAAM",
    speed: 2600,
    maxFuel: 480,
    fuelRate: 350,
    lethality: 0.65,
  },
  {
    className: "AIM-9 Sidewinder",
    speed: 1500,
    maxFuel: 100,
    fuelRate: 80,
    lethality: 0.6,
  },
  {
    className: "AIM-54 Phoenix",
    speed: 3500,
    maxFuel: 1000,
    fuelRate: 300,
    lethality: 0.85,
  },
  {
    className: "AGM-65 Maverick",
    speed: 600,
    maxFuel: 200,
    fuelRate: 120,
    lethality: 0.7,
  },
  {
    className: "AGM-84 Harpoon",
    speed: 475,
    maxFuel: 700,
    fuelRate: 150,
    lethality: 0.8,
  },
  {
    className: "AGM-86 ALCM",
    speed: 490,
    maxFuel: 9000,
    fuelRate: 600,
    lethality: 0.75,
  },
  {
    className: "AGM-158 JASSM",
    speed: 1200,
    maxFuel: 18498,
    fuelRate: 1000,
    lethality: 0.8,
  },
  {
    className: "BGM-109 Tomahawk",
    speed: 490,
    maxFuel: 10600,
    fuelRate: 850,
    lethality: 0.75,
  },

  // Ship-Launched and Fleet Air Defense Missiles
  {
    className: "RIM-66 Standard SM-2",
    speed: 1983,
    maxFuel: 500,
    fuelRate: 200,
    lethality: 0.85,
  },
  {
    className: "RIM-174 Standard SM-6",
    speed: 2313,
    maxFuel: 1100,
    fuelRate: 300,
    lethality: 0.9,
  },
  {
    className: "RGM-84 Harpoon",
    speed: 475,
    maxFuel: 700,
    fuelRate: 150,
    lethality: 0.8,
  },
  {
    className: "RIM-116 RAM",
    speed: 1653,
    maxFuel: 250,
    fuelRate: 100,
    lethality: 0.8,
  },

  // Surface-to-Air (SAM) Missiles
  {
    className: "48N6 (S-400 Triumf)",
    speed: 3966,
    maxFuel: 1543,
    fuelRate: 300,
    lethality: 0.9,
  },
  {
    className: "9M96 (S-300V4)",
    speed: 2644,
    maxFuel: 1000,
    fuelRate: 200,
    lethality: 0.85,
  },
  {
    className: "77N6 (S-500 Prometey)",
    speed: 4627,
    maxFuel: 2000,
    fuelRate: 500,
    lethality: 0.9,
  },
  {
    className: "9M317 (Buk-M3)",
    speed: 1322,
    maxFuel: 700,
    fuelRate: 150,
    lethality: 0.8,
  },
  {
    className: "9M331 (Tor-M2)",
    speed: 1851,
    maxFuel: 300,
    fuelRate: 100,
    lethality: 0.75,
  },
  {
    className: "57E6E (Pantsir-S1)",
    speed: 2313,
    maxFuel: 250,
    fuelRate: 80,
    lethality: 0.7,
  },
  {
    className: "HQ-9",
    speed: 2644,
    maxFuel: 2000,
    fuelRate: 400,
    lethality: 0.85,
  },
  {
    className: "HQ-19",
    speed: 5949,
    maxFuel: 3000,
    fuelRate: 600,
    lethality: 0.9,
  },
  {
    className: "HQ-16",
    speed: 1983,
    maxFuel: 600,
    fuelRate: 150,
    lethality: 0.8,
  },
  {
    className: "HQ-17",
    speed: 1511,
    maxFuel: 400,
    fuelRate: 120,
    lethality: 0.75,
  },
  {
    className: "HQ-7",
    speed: 2313,
    maxFuel: 200,
    fuelRate: 70,
    lethality: 0.7,
  },
  {
    className: "Aster 30",
    speed: 2975,
    maxFuel: 1600,
    fuelRate: 350,
    lethality: 0.85,
  },
  {
    className: "Barak 8",
    speed: 1851,
    maxFuel: 200,
    fuelRate: 150,
    lethality: 0.8,
  },
];
