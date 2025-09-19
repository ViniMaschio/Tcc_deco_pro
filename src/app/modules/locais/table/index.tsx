"use cliente";

import { twMerge } from "tailwind-merge";

import SortableIcon from "@/components/sort-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useTabelaLocais } from "./use-index";

export const TabelaLocais = () => {
  const { headCells, handleRequestSort, strings } = useTabelaLocais();

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="w-full">
              {headCells.map((e, index) => (
                <TableHead
                  key={index}
                  className={twMerge(
                    "font-medium text-gray-600",
                    e.id === "actions" &&
                      "sticky top-0 right-0 z-10 bg-white text-right",
                  )}
                >
                  <div
                    className={twMerge(
                      "flex items-center gap-2",
                      e.id === "actions" && "justify-end text-right",
                    )}
                  >
                    {e.label}
                    <div className="flex items-center">
                      {e.sort && (
                        <SortableIcon
                          field={e.sort}
                          strings={strings}
                          handleRequestSort={handleRequestSort}
                        />
                      )}
                    </div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium">Fulano de Tal</div>
                <div className="text-muted-foreground hidden text-sm md:inline">
                  fulano.de.tal@gmail.com
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`text-xs`} variant="outline">
                  Pendente
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2024-01-01</TableCell>
              <TableCell className="text-right">R$100,00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Ciclana de Tal</div>
                <div className="text-muted-foreground text-sm">
                  ciclana.de.tal@gmail.com
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`text-xs`} variant="outline">
                  Completo
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">2023-01-01</TableCell>
              <TableCell className="text-right">R$500,00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
