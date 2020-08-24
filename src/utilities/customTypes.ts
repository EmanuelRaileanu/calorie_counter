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

export interface ProductionCompany{
    id?: number,
    name: string
};

export interface User{
    id?: number,
    name?: string,
    email: string,
    dateOfBirth?: string,
    password: string,
    confirmPassword?: string,
    bearerToken?: string,
    passwordResetToken?: string
};