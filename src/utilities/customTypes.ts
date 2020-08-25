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
    email: string,
    password: string,
     name?: string,
    dateOfBirth?: string,
    confirmPassword?: string,
    bearerToken?: string,
    passwordResetToken?: string
};

export interface Food{
    id?: number,
    name: string,
    caloriesPer100Grams: number,
    proteinPer100Grams: number,
    carbohydratesPer100Grams: number,
    fatPer100Grams: number,
    fiberPer100Grams: number,
    grams?: number,
    calories?: number,
    protein?: number,
    carbohydrates?: number,
    fat?: number,
    fiber?: number
};