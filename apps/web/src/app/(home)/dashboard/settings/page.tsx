"use client";

import { useState } from "react";
import { useMeQuery } from "@/hooks/use-me-query";
import { useModelsQuery, useUpdateModel } from "@/hooks/use-models";
import type { Model } from "@/hooks/use-models";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    Button,
    Badge,
    Separator,
    Skeleton,
} from "@repo/ui";
import { CheckIcon, BotIcon, Settings2Icon } from "lucide-react";

export default function SettingsPage() {
    const { data: me } = useMeQuery();
    const [selected, setSelected] = useState<Model | null>(null);

    const { data: models = [], isLoading } = useModelsQuery();

    const { mutate: updateModel, isPending } = useUpdateModel(() => {
        setSelected(null);
    });

    const handleSave = () => {
        if (!selected) return;
        updateModel({ modelId: selected.id, modelName: selected.name });
    };

    return (
        <div className="p-6 w-full space-y-6 font-sans">
            <div>
                <h1 className="text-2xl font-semibold">Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your preferences. Choose your preferred AI model.
                </p>
            </div>

            <Separator />

            {/* 👇 THIS is your model selector section */}
            {isLoading ? (
                <ModelSelectorSkeleton />
            ) : (
                <div className="border rounded-lg bg-background max-w-full">
                    <div className="px-4 pt-4 pb-2">
                        <h2 className="text-lg font-medium">Choose AI Model</h2>
                        <p className="text-sm text-muted-foreground">
                            Currently: <span className="text-foreground font-medium">
                                {me?.modelName ?? "—"}
                            </span>
                        </p>
                    </div>

                    <Command className="border-t">
                        <CommandInput placeholder="Search models..." />
                        <CommandList className="min-h-96 overflow-y-auto">
                            {isLoading && (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    Loading models...
                                </div>
                            )}
                            <CommandEmpty>No models found.</CommandEmpty>
                            <CommandGroup heading="Free models">
                                {models.map((model) => {
                                    const isActive = model.id === me?.modelId;
                                    const isSelected = selected?.id === model.id;
                                    return (
                                        <CommandItem
                                            key={model.id}
                                            value={`${model.name} ${model.id}`}
                                            onSelect={() => setSelected(model)}
                                            className="flex items-start gap-2 py-2"
                                        >
                                            <CheckIcon
                                                className={`size-4 mt-0.5 shrink-0 ${isSelected ? "opacity-100" : "opacity-0"}`}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium truncate">{model.name}</span>
                                                    {isActive && (
                                                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                                                            current
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                    {model.context_length?.toLocaleString()} ctx
                                                    {model.description ? ` · ${model.description}` : ""}
                                                </p>
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>


                    <div className="flex items-center justify-between gap-2 border-t px-4 py-3">
                        <p className="text-xs text-muted-foreground truncate">
                            {selected ? selected.name : "No model selected"}
                        </p>

                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelected(null)}
                            >
                                Cancel
                            </Button>

                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={!selected || isPending}
                            >
                                {isPending ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function ModelSelectorSkeleton() {
    return (
        <div className="border rounded-lg bg-background max-w-full">

            {/* Header */}
            <div className="px-4 pt-4 pb-2 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-52" />
            </div>

            {/* Command Section */}
            <div className="border-t">

                {/* Search */}
                <div className="p-2">
                    <Skeleton className="h-9 w-full rounded-md" />
                </div>

                {/* List */}
                <div className="min-h-96 space-y-3 px-2 pb-3">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-2 py-2 px-2"
                        >
                            <Skeleton className="size-4 mt-1 shrink-0 rounded-sm" />

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-14 rounded-full" />
                                </div>

                                <Skeleton className="h-3 w-64" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 border-t px-4 py-3">
                <Skeleton className="h-4 w-40" />

                <div className="flex gap-2">
                    <Skeleton className="h-8 w-16 rounded-md" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                </div>
            </div>
        </div>
    );
}