export interface Session {
    id: number,
    userId: string,
    sessionName?: string,
    intensity: number,
    notes?: string,
    createdAt: Date,
    completed: boolean,
    sessionStats: SessionStats,
}

export interface SessionStats {
    highestBoulderGrade: string | null;
    highestRouteGrade: string | null;
    totalClimbs: number;
    totalAttempts: number;
    completedBoulders: number;
    completedRoutes: number;
    totalSends: number;
    totalFlashes: number;
}