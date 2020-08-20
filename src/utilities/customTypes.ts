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
    productionCompanyName?: string,
    countryId?: number,
    countryName?: string,
    pictureId?: number
};