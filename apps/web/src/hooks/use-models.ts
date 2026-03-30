import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type Model = {
    id: string;
    name: string;
    description: string;
    context_length: number;
};

const fetchModels = async (): Promise<Model[]> => {
    const res = await fetch("/api/ai/get-models");
    if (!res.ok) {
        if (res.status === 429) {
            toast.error("Too many requests. Please try again later.");
        }
        throw new Error("Failed to fetch models");
    }
    const data = await res.json();
    return data.models;
};

const saveModel = async (payload: { modelId: string; modelName: string }) => {
    const res = await fetch("/api/ai/update-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update model");
    return res.json();
};

export const useModelsQuery = (enabled: boolean) =>
    useQuery({
        queryKey: ["models"],
        queryFn: fetchModels,
        enabled,
        staleTime: 5 * 60 * 1000,
    });

export const useUpdateModel = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveModel,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.success(data?.message || "Model saved successfully");
            onSuccess?.();
        },
        onError: () => {
            toast.error("Failed to save model");
        },
    });
};
