import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Chibi Pack</TableCell>
          <TableCell>Digital</TableCell>
          <TableCell className="text-right">$12.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Ink Brushes</TableCell>
          <TableCell>Digital</TableCell>
          <TableCell className="text-right">$8.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
