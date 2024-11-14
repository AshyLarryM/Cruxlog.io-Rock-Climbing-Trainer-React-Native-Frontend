import { Climb } from "@/lib/utils/models/climbModels";
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ClimbState {
    currentClimb: Climb | null;
}

const initialState: ClimbState = {
    currentClimb: null,
};

const climbSlice = createSlice({
    name: 'climb',
    initialState,
    reducers: {
        setCurrentClimb: (state, action: PayloadAction<Climb>) => {
            state.currentClimb = action.payload;
        },
        clearCurrentClimb: (state) => {
            state.currentClimb = null;
        },
    },
});

export const { setCurrentClimb, clearCurrentClimb } = climbSlice.actions;
export default climbSlice.reducer;