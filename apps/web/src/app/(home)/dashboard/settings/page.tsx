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
} from "@repo/ui";
import { CheckIcon, BotIcon, Settings2Icon } from "lucide-react";

export default function SettingsPage() {
    const { data: me } = useMeQuery();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Model | null>(null);

    const { data: models = [], isLoading } = useModelsQuery(open);

    const { mutate: updateModel, isPending } = useUpdateModel(() => {
        setOpen(false);
        setSelected(null);
    });

    const handleSave = () => {
        if (!selected) return;
        updateModel({ modelId: selected.id, modelName: selected.name });
    };

    return (
        <div className="p-6 max-w-2xl space-y-6">
            <div>
                <h1 className="text-xl font-semibold">Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your preferences.</p>
            </div>

            <Separator />

            {/* AI Model row */}
            <div className="flex items-center justify-between rounded-xl border p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                        <BotIcon className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">AI Model</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {me?.modelName ?? "No model selected"}
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                    <Settings2Icon className="size-3.5 mr-1.5" />
                    Change
                </Button>
            </div>

            {/* Non-closing model picker dialog */}
            <Dialog
                open={open}
                onOpenChange={(v) => {
                    if (!isPending) setOpen(v);
                }}
            >
                <DialogContent
                    className="p-0 gap-0 max-w-lg"
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                >
                    <DialogHeader className="px-4 pt-4 pb-2">
                        <DialogTitle>Choose AI Model</DialogTitle>
                        <DialogDescription>
                            Currently: <span className="text-foreground font-medium">{me?.modelName ?? "—"}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <Command className="border-t rounded-none">
                        <CommandInput placeholder="Search models..." />
                        <CommandList className="max-h-72">
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
                        <div className="flex gap-2 shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setOpen(false); setSelected(null); }}
                                disabled={isPending}
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
                </DialogContent>
            </Dialog>
        </div>
    );
}
