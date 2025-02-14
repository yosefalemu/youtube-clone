"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { videoUpdateSchema } from "@/db/schema/videos";
import { trpc } from "@/trpc/client";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  Loader2Icon,
  MoreVerticalIcon,
  Paperclip,
  TrashIcon,
} from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomInputWithLabel from "@/components/inputs/custom-input";
import CustomTextarea from "@/components/inputs/custom-text-area";
import CustomSelect from "@/components/inputs/custom-select";
import { toast } from "sonner";

interface FormSectionProps {
  videoId: string;
}

export default function FormSection({ videoId }: FormSectionProps) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <FormSectionSuspense videoId={videoId} key={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}
const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const utils = trpc.useUtils();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const updateVideo = trpc.video.update.useMutation();

  const dataForSelect = categories.map((category) => {
    return {
      id: category.id,
      name: category.name,
    };
  });
  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });
  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    updateVideo.mutate(data, {
      onSuccess: () => {
        utils.studio.getMany.invalidate();
        utils.studio.getOne.invalidate({ id: videoId });
        toast.success("Video updated successfully");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Video details</h1>
            <p className="text-xs text-muted-foreground">
              Manage your video details
            </p>
          </div>
          <div className="flex items-center gap-x-1">
            <Button
              type="submit"
              disabled={updateVideo.isPending}
              onClick={() => {}}
            >
              {updateVideo.isPending ? (
                <Loader2Icon className="size-5 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={updateVideo.isPending}>
                <Button variant={"ghost"} size={"icon"}>
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {}}>
                  <TrashIcon className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="space-y-8 lg:col-span-3">
            <CustomInputWithLabel
              fieldTitle="Video Title"
              nameInSchema="title"
              placeHolder="Add a title to your video"
              maxCharLength={45}
              className="shadow-none focus:ring-0"
              LabelIcon={Paperclip}
            />
            <CustomTextarea
              fieldTitle="Video description"
              nameInSchema="description"
              placeHolder="Add a description to your video"
              maxCharLength={500}
              className="shadow-none resize-none"
              rows={10}
            />
            {/* TODO::ADD THE THUMBNAIL FIELD */}
            <CustomSelect
              fieldTitle="Video category"
              nameInSchema="categoryId"
              placeHolder={video.categoryId ?? "Select category to your video"}
              data={dataForSelect}
              triggerClassName="h-12"
            />
          </div>
          <div className="flex flex-col space-y-8 lg:col-span-2">
            COLUMN TWO
          </div>
        </div>
      </form>
    </Form>
  );
};
