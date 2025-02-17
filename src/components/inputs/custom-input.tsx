import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import { Loader2Icon, LucideIcon } from "lucide-react";

interface CustomInputProps {
  fieldTitle?: string;
  nameInSchema: string;
  placeHolder: string;
  className?: string;
  maxCharLength?: number;
  LabelIcon?: LucideIcon;
  onClickIcon?: () => void;
  isIconLoading?: boolean;
}
export default function CustomInput({
  fieldTitle,
  nameInSchema,
  placeHolder,
  className,
  maxCharLength,
  LabelIcon,
  isIconLoading,
  onClickIcon,
  ...props
}: CustomInputProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (maxCharLength && e.target.value.length <= maxCharLength) {
            field.onChange(e);
          }
        };
        return (
          <FormItem>
            {fieldTitle && (
              <div className="flex items-center gap-x-4">
                <FormLabel>{fieldTitle}</FormLabel>
                {LabelIcon && !isIconLoading ? (
                  <LabelIcon
                    className="size-4 text-black/80 hover:text-gray-500 cursor-pointer"
                    onClick={onClickIcon}
                  />
                ) : (
                  <Loader2Icon className="size-4 animate-spin" />
                )}
              </div>
            )}
            <FormControl>
              <Input
                id={nameInSchema}
                className={cn(
                  "h-12 w-full max-w-xl disabled:cursor-not-allowed",
                  className
                )}
                placeholder={placeHolder}
                {...props}
                {...field}
                value={field.value ?? ""}
                onChange={handleChange}
              />
            </FormControl>
            {maxCharLength && (
              <p className="text-xs text-neutral-500 max-w-xl text-right">
                {field.value.length}/{maxCharLength}
              </p>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
