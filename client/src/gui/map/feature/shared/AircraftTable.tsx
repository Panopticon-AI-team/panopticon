import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import Aircraft from "@/game/units/Aircraft";
import { Add, Delete, Flight } from "@mui/icons-material";
import { UnitDbContext } from "@/gui/contextProviders/contexts/UnitDbContext";
import { Menu } from "@/gui/shared/ui/MuiComponents";
import { MenuItem, Stack } from "@mui/material";
import Airbase from "@/game/units/Airbase";
import Ship from "@/game/units/Ship";

interface AircraftData {
  id: string;
  name: string;
  className: string;
  currentFuel: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof AircraftData;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "className",
    numeric: false,
    disablePadding: false,
    label: "Class",
  },
  {
    id: "currentFuel",
    numeric: true,
    disablePadding: false,
    label: "Fuel (lbs)",
  },
];

interface AircraftTableHeadProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof AircraftData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function AircraftTableHead(props: AircraftTableHeadProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof AircraftData) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            slotProps={{
              input: {
                "aria-label": "select all aircraft",
              },
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id === "name" ? "left" : "right"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface AircraftTableToolbarProps {
  numSelected: number;
  handleAddAircraft: (aircraftClassName: string) => void;
}
function AircraftTableToolbar(props: AircraftTableToolbarProps) {
  const { numSelected } = props;
  const unitDbContext = React.useContext(UnitDbContext);

  const [addAircraftMenuAnchorEl, setAddAircraftMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const openAddWeaponMenu = Boolean(addAircraftMenuAnchorEl);
  const handleClickAddAircraftButton = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAddAircraftMenuAnchorEl(event.currentTarget);
  };
  const handleCloseAddAircraftMenu = () => {
    setAddAircraftMenuAnchorEl(null);
  };

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} aircraft selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Aircraft
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          <Tooltip title={`Launch Aircraft`}>
            <IconButton onClick={() => {}}>
              <Flight sx={{ color: "black" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Delete Aircraft`}>
            <IconButton onClick={() => {}}>
              <Delete sx={{ color: "red" }} />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title={`Add Aircraft`}>
          <IconButton
            id={"add-aircraft-button"}
            onClick={handleClickAddAircraftButton}
          >
            <Add sx={{ color: "black" }} />
          </IconButton>
        </Tooltip>
      )}
      <Menu
        id="add-aircraft-menu"
        anchorEl={addAircraftMenuAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        open={openAddWeaponMenu}
        onClose={handleCloseAddAircraftMenu}
        slotProps={{
          root: { sx: { ".MuiList-root": { padding: 0 } } },
          list: {
            "aria-labelledby": "add-aircraft-button",
          },
        }}
      >
        {unitDbContext.getAircraftDb().map((aircraft) => (
          <Tooltip
            key={aircraft.className}
            placement="right"
            arrow
            title={
              <Stack direction={"column"} spacing={0.1}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Speed: {aircraft.speed.toFixed(0)} kts
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Max Fuel: {aircraft.maxFuel.toFixed(2)} lbs
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Fuel Consumption: {aircraft.fuelRate.toFixed(2)} lbs/hr
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Detection Range: {aircraft.range.toFixed(0)} nm
                </Typography>
              </Stack>
            }
          >
            <MenuItem
              onClick={() => {
                props.handleAddAircraft(aircraft.className);
                handleCloseAddAircraftMenu();
              }}
              sx={{ borderRadius: 1 }}
            >
              {aircraft.className}
            </MenuItem>
          </Tooltip>
        ))}
      </Menu>
    </Toolbar>
  );
}

interface AircraftTableProps {
  unitWithAircraft: Airbase | Ship;
  handleAddAircraft: (baseId: string, aircraftClassName: string) => Aircraft[];
  handleDeleteAircraft: (baseId: string, aircraftId: string) => Aircraft[];
  handleLaunchAircraft: (baseId: string, aircraftId: string) => Aircraft[];
}

const getDataRows = (aircraft: Aircraft[]) => {
  return aircraft.map((aircraft) => ({
    id: aircraft.id,
    name: aircraft.name,
    className: aircraft.className,
    currentFuel: aircraft.currentFuel,
  }));
};

export default function AircraftTable(props: AircraftTableProps) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof AircraftData>("name");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState<AircraftData[]>(
    getDataRows(props.unitWithAircraft.aircraft)
  );

  React.useEffect(() => {
    setRows(getDataRows(props.unitWithAircraft.aircraft));
  }, []);

  const _handleAddAircraft = (aircraftClassName: string) => {
    const baseAircraft = props.handleAddAircraft(
      props.unitWithAircraft.id,
      aircraftClassName
    );
    setRows(getDataRows(baseAircraft));
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof AircraftData
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <AircraftTableToolbar
          numSelected={selected.length}
          handleAddAircraft={_handleAddAircraft}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 500 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <AircraftTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `aircraft-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        slotProps={{
                          input: {
                            "aria-labelledby": labelId,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.className}</TableCell>
                    <TableCell align="right">{row.currentFuel}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
