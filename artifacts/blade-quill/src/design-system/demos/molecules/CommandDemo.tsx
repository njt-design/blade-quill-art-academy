import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export default function CommandDemo() {
  return (
    <Command className="max-w-sm rounded-lg border border-border">
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Gallery</CommandItem>
          <CommandItem>Shop</CommandItem>
          <CommandItem>Tutorials</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
