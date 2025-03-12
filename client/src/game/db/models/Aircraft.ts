export interface IAircraftModel {
  className: string;
  speed: number;
  maxFuel: number;
  fuelRate: number;
  range: number;
  dataSource: {
    speedSrc: string;
    maxFuelSrc: string;
    fuelRateSrc: string;
    rangeSrc: string;
  };
  units: {
    speedUnit: string;
    maxFuelUnit: string;
    fuelRateUnit: string;
    rangeUnit: string;
  };
}
