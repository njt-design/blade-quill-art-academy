import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function ResizableDemo() {
  return (
    <ResizablePanelGroup direction="horizontal" className="max-w-md rounded-lg border border-border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-24 items-center justify-center p-4">
          <span className="text-sm">Panel A</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-24 items-center justify-center p-4">
          <span className="text-sm">Panel B</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
