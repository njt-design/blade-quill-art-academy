import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarDemo() {
  return (
    <div className="flex gap-3 items-center">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/80?img=1" alt="User" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>BQ</AvatarFallback>
      </Avatar>
    </div>
  );
}
