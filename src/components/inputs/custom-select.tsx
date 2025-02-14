import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

interface CustomSelectProps {
  fieldTitle?: string;
  nameInSchema: string;
  placeHolder: string;
  className?: string;
  triggerClassName?: string;
  data: { id: string; name: string; image?: string }[];
}
export default function CustomSelect({
  fieldTitle,
  nameInSchema,
  placeHolder,
  className,
  triggerClassName,
  data,
}: CustomSelectProps) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          {fieldTitle && <FormLabel>{fieldTitle}</FormLabel>}
          <Select onValueChange={field.onChange} value={field.value ?? ""}>
            <FormControl>
              <SelectTrigger className={cn("", triggerClassName)}>
                <SelectValue placeholder={placeHolder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={cn("", className)}>
              {data.map((item) => (
                <SelectItem value={item.id} key={item.id}>
                  <div className="flex items-center gap-x-2">
                    {item.image && <div>ITEM IMAGE</div>}
                    {item.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}
