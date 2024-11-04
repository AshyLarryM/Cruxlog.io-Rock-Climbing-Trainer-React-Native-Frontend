import { useAuth } from "@clerk/clerk-expo";
import { baseUrl } from "@/constants/apiRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/lib/utils/types";

interface ApiResponse {
    message: string;
    user?: Partial<User>;
}

