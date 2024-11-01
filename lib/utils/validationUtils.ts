import { ClimbTypeEnum } from "./types";

function isValidClimbType(type: string): type is ClimbTypeEnum {
    return Object.values(ClimbTypeEnum).includes(type as ClimbTypeEnum);
}