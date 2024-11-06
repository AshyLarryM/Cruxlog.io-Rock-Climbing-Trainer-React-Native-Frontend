export interface User {
    email: string,
    fullName?: string,
    age?: number,
    height?: number,
    weight?: number,
    apeIndex?: number,
    gradingPreference: boolean,
    measurementSystem: boolean,
}

export enum ClimbTypeEnum  {
    TOP_ROPE = 'top rope',
    LEAD = 'lead',
    BOULDER = 'boulder',
}

export enum ClimbStyleEnum {
    SLAB = 'slab',
    VERTICAL= 'verical',
    OVERHANG = 'overhang',
    CAVE = 'cave',
}