export interface Food{
    id?: number,
    name: string,
    caloriesPer100Grams: number,
    proteinPer100Grams: number,
    carbohydratesPer100Grams: number,
    fatPer100Grams: number,
    fiberPer100Grams: number,
    categories?: string[],
    productionCompanyId?: number,
    productionCompany?: string,
    countryId?: number,
    country?: string,
    pictureId?: number
};