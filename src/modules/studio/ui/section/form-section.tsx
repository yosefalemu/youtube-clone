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
  CopyCheckIcon,
  CopyIcon,
  ImagePlayIcon,
  Loader2Icon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparkleIcon,
  Sparkles,
  TrashIcon,
} from "lucide-react";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import CustomInputWithLabel from "@/components/inputs/custom-input";
import CustomTextarea from "@/components/inputs/custom-text-area";
import CustomSelect from "@/components/inputs/custom-select";
import { toast } from "sonner";
import VideoPlayer from "@/modules/videos/components/video-player";
import Link from "next/link";
import { snakeCase } from "@/lib/utils";
import { GlobeIcon, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ThumbnailUploadModal from "../components/thumbnail-upload";
import { Skeleton } from "@/components/ui/skeleton";

interface FormSectionProps {
  videoId: string;
}

export default function FormSection({ videoId }: FormSectionProps) {
  return (
    <Suspense fallback={<LoadingSection />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <FormSectionSuspense videoId={videoId} key={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}

const LoadingSection = () => {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-y-1">
          <Skeleton className="w-56 h-8" />
          <Skeleton className="w-56 h-4" />
        </div>
        <div className="flex items-center gap-x-1">
          <Skeleton className="h-14 w-20" />
          <Skeleton className="h-14 w-4" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="space-y-24 lg:col-span-3">
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="w-56 h-8" />
              <Skeleton className="h-8 w-4" />
            </div>
            <Skeleton className="h-14 w-full" />
            <div className="flex justify-end">
              <Skeleton className="w-14 h-4" />
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="w-56 h-8" />
              <Skeleton className="h-8 w-4" />
            </div>
            <Skeleton className="h-[175px] w-full" />
            <div className="flex justify-end">
              <Skeleton className="w-14 h-4" />
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <Skeleton className="w-56 h-8" />
            <Skeleton className="h-[125px] w-1/2" />
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="w-56 h-8" />
              <Skeleton className="h-8 w-4" />
            </div>
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
        <div className="flex flex-col space-y-8 lg:col-span-2">
          <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
            <div className="aspect-video overflow-hidden relative">
              <Skeleton className="h-[350px] w-full" />
            </div>
            <div className="p-4 flex flex-col gap-y-6">
              <div className="flex justify-between items-center gap-x-2">
                <div className="flex flex-col gap-y-1">
                  <Skeleton className="h-4 w-40" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-[300px]" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-y-2">
                  <Skeleton className="w-36 h-6" />
                  <Skeleton className="w-20 h-4" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-y-2">
                  <Skeleton className="w-36 h-6" />
                  <Skeleton className="w-20 h-4" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="w-56 h-8" />
              <Skeleton className="h-8 w-4" />
            </div>
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const utils = trpc.useUtils();
  const router = useRouter();
  const [openThumbnailModal, setOpenThumbnailModal] = useState<boolean>(false);
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const updateVideo = trpc.video.update.useMutation();
  const deleteVideo = trpc.video.remove.useMutation();
  const restoreThumbnail = trpc.video.restoreThumbnailUrl.useMutation();
  const generateVideoTitle = trpc.video.generateVideoTitle.useMutation();

  const dataForSelect = categories.map((category) => {
    return {
      id: category.id,
      name: category.name,
    };
  });
  const dataForVisibility = [
    { id: "private", name: "Private", icon: LockIcon },
    { id: "public", name: "Public", icon: GlobeIcon },
  ];
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

  const onDelete = (videoId: string) => {
    deleteVideo.mutate(
      { id: videoId },
      {
        onSuccess: () => {
          utils.studio.getMany.invalidate();
          toast.success("Video deleted successfully");
          router.push(`/studio`);
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  const onRestore = (videoId: string) => {
    restoreThumbnail.mutate(
      { id: videoId },
      {
        onSuccess: () => {
          utils.studio.getMany.invalidate();
          utils.studio.getOne.invalidate({ id: videoId });
          toast.success("Thumbnail restored successfully");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  const onGenerateTitle = (videoId: string) => {
    toast.success("Background job started", {
      description: "This may take long time.",
    });
    generateVideoTitle.mutate(
      { id: videoId },
      {
        onSuccess: () => {
          utils.studio.getMany.invalidate();
          utils.studio.getOne.invalidate({ id: videoId });
          toast.success("Title generated successfully");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  //TODO::CHANCE THIS URL WHEN THE PROJECT DEPLOYED
  const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL}/videos/${video.id}`;
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopy(true);
    toast.success("video link copied");
    setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  };

  return (
    <>
      <ThumbnailUploadModal
        open={openThumbnailModal}
        onOpenChange={setOpenThumbnailModal}
        videoId={videoId}
      />
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
                <DropdownMenuTrigger
                  asChild
                  disabled={updateVideo.isPending || deleteVideo.isPending}
                >
                  <Button variant={"ghost"} size={"icon"}>
                    {deleteVideo.isPending ? (
                      <Loader2Icon className="size-4 mr-2 animate-spin" />
                    ) : (
                      <MoreVerticalIcon />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onDelete(video.id)}
                    className="cursor-pointer"
                  >
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
                LabelIcon={Sparkles}
                onClickIcon={() => onGenerateTitle(video.id)}
                isIconLoading={generateVideoTitle.isPending}
              />
              <CustomTextarea
                fieldTitle="Video description"
                nameInSchema="description"
                placeHolder="Add a description to your video"
                maxCharLength={500}
                className="shadow-none resize-none"
                rows={10}
                LabelIcon={Sparkles}
              />
              {/* TODO::ADD THE THUMBNAIL FIELD */}
              <FormField
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="p-0.5 border border-dashed border-neutral-400 relative h-[125px] w-[255px] group">
                        <Image
                          src={video.thumbnailUrl || "/placeholder.png"}
                          alt="thumbnail"
                          layout="fill"
                          objectFit="cover"
                          className="object-cover"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant={"ghost"}
                              size={"icon"}
                              className="bg-black/50 hover:bg-black/50 absolute right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7"
                            >
                              <MoreVerticalIcon className="text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" side="right">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => setOpenThumbnailModal(true)}
                            >
                              <ImagePlayIcon className="mr-1 size-4" />
                              Change
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <SparkleIcon className="mr-1 size-4" />
                              AI-generated
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => onRestore(video.id)}
                            >
                              <RotateCcwIcon className="mr-1 size-4" />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <CustomSelect
                fieldTitle="Video category"
                nameInSchema="categoryId"
                placeHolder={
                  video.categoryId ?? "Select category to your video"
                }
                data={dataForSelect}
                triggerClassName="h-12"
              />
            </div>
            <div className="flex flex-col space-y-8 lg:col-span-2">
              <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
                <div className="aspect-video overflow-hidden relative">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                    autoPlay={false}
                  />
                </div>
                <div className="p-4 flex flex-col gap-y-6">
                  <div className="flex justify-between items-center gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-sm text-muted-foreground">
                        Video link
                      </p>
                      <div className="flex items-center gap-x-1">
                        <Link href={`/videos/${video.id}`}>
                          <p className="line-clamp-1 text-sm text-blue-400">
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={onCopy}
                          disabled={isCopy}
                        >
                          {isCopy ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Video status
                      </p>
                      <p className="text-sm">
                        {snakeCase(video.muxStatus || "Preparing")}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Subtitle status
                      </p>
                      <p className="text-sm">
                        {snakeCase(video.muxTrackStatus || "No subtitles")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-6">
                <CustomSelect
                  fieldTitle="Video viibility"
                  nameInSchema="visibility"
                  data={dataForVisibility}
                  placeHolder={
                    video.visibility ?? "Select visibility to your video"
                  }
                  triggerClassName="h-12"
                />
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
