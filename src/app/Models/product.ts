export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  electric_power: number;
  electrical_installation: string;
  electrical_assembly: boolean;
  electrical_assembly_type?: string;
  heat_production: boolean;
  exchanger_number?: boolean;
  domestic_water_heating: boolean;
  domestic_water_heating_way?: boolean;
  thermal_storage: boolean;
  smart_r: boolean;
  product_image: string;
}
