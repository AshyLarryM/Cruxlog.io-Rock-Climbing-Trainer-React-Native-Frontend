export interface User {
    email: string,
    fullName?: string | null,
    age?: number | null,
    height?: number | null,
    weight?: number | null,
    apeIndex?: number | null,
    gradingPreference: boolean,
    measurementSystem: boolean,
    profileImage?: string | null;
}