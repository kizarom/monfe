export interface Need {

    id?: number;
    electric_power: number,
    electric_setup: string,
    electric_collection?: boolean,
    collection_type?: string ,
    heating_production?: boolean,
    heating_number_bouche?: number,
    water_heating?: boolean,
    water_heating_way?: string,
    thermic_storage?: boolean,
    smart_r?: boolean,

}
