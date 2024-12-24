export const AircraftDb = [
  // fuel rates are generated with AI - use with a grain of salt.
  {
    className: "F-35A Lightning II",
    speed: 1200, // mph https://www.af.mil/About-Us/Fact-Sheets/Display/Article/478441/f-35a-lightning-ii/
    maxFuel: 18498, // lbs https://www.af.mil/About-Us/Fact-Sheets/Display/Article/478441/f-35a-lightning-ii/
    fuelRate: 1000, // missing
    range: 1200, // nm https://www.af.mil/About-Us/Fact-Sheets/Display/Article/478441/f-35a-lightning-ii/ 
  },
  {
    className: "KC-135R Stratotanker",
    speed: 530, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/174560/kc-135r-stratotanker/
    maxFuel: 200000, // lbs https://www.af.mil/About-Us/Fact-Sheets/Display/Article/174560/kc-135r-stratotanker/
    fuelRate: 15000, // missing 
    range: 1303, // 1303 NM, 1500 mi https://www.af.mil/About-Us/Fact-Sheets/Display/Article/174560/kc-135r-stratotanker/
  },
  {
    className: "A-10C Thunderbolt II",
    speed: 420, // mph https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104490/a-10c-thunderbolt-ii/ 
    maxFuel: 11000, // missing 
    fuelRate: 800, // missing
    range: 695, // nm https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104490/a-10c-thunderbolt-ii/ 
  },
  {
    className: "B-2 Spirit",
    speed: 650, // missing "high subsonic" 
    maxFuel: 167000, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104482/b-2-spirit/
    fuelRate: 10000, // missing
    range: 6000, // missing "intercontinental"
  },
  {
    className: "F-22 Raptor",
    speed: 1500, // mph https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104506/f-22-raptor/
    maxFuel: 18000, // lbs internal https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104506/f-22-raptor/
    fuelRate: 1000,
    range: 1600, // nm https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104506/f-22-raptor/ 
  },
  {
    className: "C-130 Hercules",
    speed: 350, // mph, range from 350-410 https://www.af.mil/About-Us/Fact-Sheets/Display/Article/1555054/c-130-hercules/
    maxFuel: 61360, // missing
    fuelRate: 1100, // missing
    range: 1700, // has range https://www.af.mil/About-Us/Fact-Sheets/Display/Article/1555054/c-130-hercules/
  },
  {
    className: "C-17 Globemaster III",
    speed: 570, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/1529726/c-17-globemaster-iii/
    maxFuel: 181054, // missing
    fuelRate: 20000, // missing
    range: 2785, // "Global with in-flight refueling" missing
  },
  {
    className: "F-16 Fighting Falcon",
    speed: 1500, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104505/f-16-fighting-falcon/
    maxFuel: 12000, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104505/f-16-fighting-falcon/
    fuelRate: 800, // missing
    range: 1740, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104505/f-16-fighting-falcon/
  },
  {
    className: "F-15 Eagle",
    speed: 1875, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104501/f-15-eagle/
    maxFuel: 36200, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104501/f-15-eagle/
    fuelRate: 1200, // missing
    range: 3000, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104501/f-15-eagle/
  },
  {
    className: "F/A-18 Hornet",
    speed: 1381, // https://www.navy.mil/Resources/Fact-Files/Display-FactFiles/Article/2383479/fa-18a-d-hornet-and-fa-18ef-super-hornet-strike-fighter/ 
    maxFuel: 14400, // missing
    fuelRate: 1250, // missing
    range: 1275, // https://www.navy.mil/Resources/Fact-Files/Display-FactFiles/Article/2383479/fa-18a-d-hornet-and-fa-18ef-super-hornet-strike-fighter/
  },
  {
    className: "B-52 Stratofortress",
    speed: 650, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104465/b-52h-stratofortress/
    maxFuel: 312197, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104465/b-52h-stratofortress/
    fuelRate: 15000, // missing
    range: 8800, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104465/b-52h-stratofortress/
  },
  {
    className: "F-4 Phantom II",
    speed: 1400, // https://www.holloman.af.mil/About/Fact-Sheets/Display/Article/317295/f-4-phantom-ii/
    maxFuel: 13890, // missing
    fuelRate: 1200, // missing
    range: 1750, // https://www.holloman.af.mil/About/Fact-Sheets/Display/Article/317295/f-4-phantom-ii/
  },
  {
    className: "B-1B Lancer",
    speed: 900, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104500/b-1b-lancer/
    maxFuel: 265274, // https://www.af.mil/About-Us/Fact-Sheets/Display/Article/104500/b-1b-lancer/
    fuelRate: 18000, // missing
    range: 5100, // "intercontinental" missing 
  },
  {
    className: "C-12 Huron",
    speed: 284, // https://www.5af.pacaf.af.mil/About-Us/Fact-Sheets/Display/Article/1482851/c-12-huron/
    maxFuel: 4502, // https://www.5af.pacaf.af.mil/About-Us/Fact-Sheets/Display/Article/1482851/c-12-huron/
    fuelRate: 300, // missing
    range: 1450, // https://www.5af.pacaf.af.mil/About-Us/Fact-Sheets/Display/Article/1482851/c-12-huron/
  },
  {
    className: "F-14 Tomcat",
    speed: 1544, // https://www.history.navy.mil/content/history/museums/nnam/explore/collections/aircraft/f/f-14a-tomcat.html
    maxFuel: 16200, // missing
    fuelRate: 1800, // missing
    range: 2085, // https://www.history.navy.mil/content/history/museums/nnam/explore/collections/aircraft/f/f-14a-tomcat.html
  },
];

export const AirbaseDb = [
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

export const FacilityDb = [
  {
    className: "S-400 Triumf",
    range: 200 // No official source available, using 200 as the range
  },
  {
    className: "S-300V4",
    range: 200 // No official source available, using 200 as the range
  },
  {
    className: "S-500 Prometey",
    range: 200 // No official source available, using 200 as the range
  },
  {
    className: "Buk-M3",
    range: 50 // No official source available, using 50 as the range
  },
  {
    className: "Tor-M2",
    range: 10 // No official source available, using 10 as the range
  },
  {
    className: "Pantsir-S1",
    range: 10 // No official source available, using 10 as the range
  },
  {
    className: "HQ-9",
    range: 200 // No official source available, using 200 as the range
  },
  {
    className: "HQ-19",
    range: 200 // No official source available, using 200 as the range
  },
  {
    className: "HQ-16",
    range: 50 // No official source available, using 50 as the range
  },
  {
    className: "HQ-17",
    range: 10 // No official source available, using 10 as the range
  },
  {
    className: "HQ-7",
    range: 10 // No official source available, using 10 as the range
  },
  {
    className: "MIM-104 Patriot",
    range: 200 // No official source available, using 200 as the range
  },
  {
    className: "THAAD",
    range: 200 // No official source available, using 200 as the range
  },
  {
    className: "Aster 30",
    range: 50 // No official source available, using 50 as the range
  },
  {
    className: "Barak 8",
    range: 50 // No official source available, using 50 as the range
  },
  {
    className: "NASAMS",
    range: 50 // No official source available, using 50 as the range
  }
];

export const ShipDb = [

  // all values notional
  {
    className: "Aircraft Carrier",
    speed: 35, // mph
    maxFuel: 25200000, // lbs
    fuelRate: 1000000, // lbs/hr
    range: 8000 // NM
  },
  {
    className: "Destroyer",
    speed: 40, // mph
    maxFuel: 3500000, // lbs
    fuelRate: 100000, // lbs/hr
    range: 5000 // NM
  },
  {
    className: "Frigate",
    speed: 35, // mph
    maxFuel: 2800000, // lbs
    fuelRate: 80000, // lbs/hr
    range: 4500 // NM
  },
  {
    className: "Corvette",
    speed: 32, // mph
    maxFuel: 1400000, // lbs
    fuelRate: 60000, // lbs/hr
    range: 3500 // NM
  },
  {
    className: "Amphibious Assault Ship",
    speed: 25, // mph
    maxFuel: 8400000, // lbs
    fuelRate: 200000, // lbs/hr
    range: 6000 // NM
  },
  {
    className: "Patrol Boat",
    speed: 40, // mph
    maxFuel: 350000, // lbs
    fuelRate: 30000, // lbs/hr
    range: 1500 // NM
  },
];
