import { cva, VariantProps } from "class-variance-authority";
import { Avatar, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

const avatarVariants = cva("", {
  variants: {
    size: {
      defult: "h-9 w-9",
      xs: "h-4 w-4",
      sm: "h-6 w-6",
      xl: "h-[160px] w-[160px]",
    },
  },
  defaultVariants: {
    size: "defult",
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
  imageUrl: string;
  name?: string;
  className?: string;
  onClick?: () => void;
}

export default function UserAvatar({
  imageUrl,
  name,
  className,
  size,
  onClick,
}: UserAvatarProps) {
  return (
    <Avatar
      className={cn(avatarVariants({ size, className }))}
      onClick={onClick}
    >
      <AvatarImage src={imageUrl} alt={name} />
    </Avatar>
  );
}
