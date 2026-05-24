import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsDemo() {
  return (
    <Tabs defaultValue="tab1" className="max-w-sm">
      <TabsList>
        <TabsTrigger value="tab1">Account</TabsTrigger>
        <TabsTrigger value="tab2">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm p-2">Account settings go here.</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm p-2">Password settings go here.</p>
      </TabsContent>
    </Tabs>
  );
}
