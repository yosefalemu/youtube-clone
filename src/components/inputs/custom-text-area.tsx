import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { LucideIcon } from "lucide-react";

interface CustomInputProps {
  fieldTitle: string;
  nameInSchema: string;
  placeHolder: string;
  className?: string;
  maxCharLength?: number;
  rows?: number;
  LabelIcon?: LucideIcon;
}

export default function CustomTextarea({
  fieldTitle,
  nameInSchema,
  placeHolder,
  className,
  maxCharLength,
  rows,
  LabelIcon,
  ...props
}: CustomInputProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          if (
            maxCharLength === undefined ||
            e.target.value.length <= maxCharLength
          ) {
            field.onChange(e);
          }
        };

        return (
          <FormItem>
            {fieldTitle && (
              <div className="flex items-center gap-x-4">
                <FormLabel>{fieldTitle}</FormLabel>
                {LabelIcon && (
                  <LabelIcon className="size-4 text-black/80 hover:text-gray-500 cursor-pointer" />
                )}
              </div>
            )}

            <FormControl>
              <Textarea
                id={nameInSchema}
                className={cn(
                  "w-full max-w-xl disabled:cursor-not-allowed overflow-auto",
                  className
                )}
                placeholder={placeHolder}
                rows={rows}
                {...props}
                {...field}
                onChange={handleChange}
                value={field.value ?? ""}
              />
            </FormControl>
            {maxCharLength && (
              <p className="text-xs text-neutral-500 max-w-xl text-right">
                {field.value ? field.value.length : 0}/{maxCharLength}
              </p>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
