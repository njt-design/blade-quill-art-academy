import { InputGroup, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Search } from "lucide-react";

export default function InputGroupDemo() {
  return (
    <div className="max-w-sm">
      <InputGroup>
        <InputGroupText>
          <Search className="w-4 h-4" />
        </InputGroupText>
        <InputGroupInput placeholder="Search products..." />
      </InputGroup>
    </div>
  );
}
