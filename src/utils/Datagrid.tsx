import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import { Typography } from "@mui/material";

interface Column {
  field: string;
  headerName: string;
  align?: "left" | "right" | "center";
  renderCell?: (params: { row: any; value: any }) => React.ReactNode;
}

interface DataGridProps {
  columns: Column[];
  rows: any[];
  getRowId?: (row: any) => string | number;
  paginationModel?: { page: number; pageSize: number };
  onPaginationModelChange?: (model: { page: number; pageSize: number }) => void;
}

export const DataGrid = ({ rows, columns, getRowId }: DataGridProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="dynamic table">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.field}
                align={col.align || "left"}
                sx={{ fontWeight: "bold" }}
              >
                {col.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {
          rows?.length > 0 ? (
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow
                  key={getRowId ? getRowId(row) : row.id || rowIndex}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {columns.map((col) => {
                    const value = row[col.field];

                    // If renderCell is provided
                    if (col.renderCell) {
                      return (
                        <TableCell key={col.field} align={col.align || "left"}>
                          {col.renderCell({ row, value })}
                        </TableCell>
                      );
                    }

                    // Default rendering with truncation + tooltip
                    const text = value?.toString() || "";
                    const isLong = text.length > 25;
                    const displayText = isLong ? text.slice(0, 25) + "..." : text;

                    return (
                      <TableCell key={col.field} align={col.align || "left"}>
                        {isLong ? (
                          <Tooltip title={text}>
                            <span>{displayText}</span>
                          </Tooltip>
                        ) : (
                          text
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ height: 200 }}
                >
                  <Typography sx={{ fontSize: 18, fontWeight: "bold", color: "GrayText" }}>
                    No Data
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          )
        }

      </Table>
    </TableContainer>
  );
};
