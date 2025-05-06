import { useContext, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { SimulationLogsContext } from "@/gui/contextProviders/contexts/SimulationLogsContext";
import { colorPalette } from "@/utils/constants";
import {
  CardHeader,
  FormControl,
  IconButton,
  Paper,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { unixToLocalTime } from "@/utils/dateTimeFunctions";
import { ScenarioSidesContext } from "@/gui/contextProviders/contexts/ScenarioSidesContext";
import Side from "@/game/Side";
import { SIDE_COLOR } from "@/utils/colors";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SelectField from "@/gui/shared/ui/SelectField";
import { SimulationLog, SimulationLogType } from "@/game/log/SimulationLogs";

const cardStyle = {
  minWidth: "400px",
  maxWidth: "400px",
  minHeight: "200px",
  backgroundColor: colorPalette.lightGray,
  boxShadow: "none",
  borderRadius: "10px",
};

const closeButtonStyle = {
  bottom: 0,
};

const cardHeaderStyle = {
  backgroundColor: colorPalette.white,
  color: "black",
};

const logsContainerStyle = {
  height: "300px",
  overflowY: "auto" as const,
  padding: "1em",
  backgroundColor: colorPalette.lightGray,
};

interface SimulationLogsProps {
  handleCloseOnMap: () => void;
}

export default function SimulationLogs(props: SimulationLogsProps) {
  const nodeRef = useRef(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const lastRenderedLogIdRef = useRef<string | null>(null);
  const simulationLogs = useContext(SimulationLogsContext);
  const [simulationLogElements, setSimulationLogElements] = useState<
    JSX.Element[]
  >([]);
  const scenarioSides = useContext(ScenarioSidesContext);
  const getScenarioSidesMap = () => {
    const sidesMap: Record<string, Side> = {};
    scenarioSides.forEach((side) => {
      sidesMap[side.id] = side;
    });
    return sidesMap;
  };
  const [scenarioSidesMap, setScenarioSidesMap] = useState<
    Record<string, Side>
  >(getScenarioSidesMap());
  const [openFilterMenuAnchorEl, setOpenFilterMenuAnchorEl] =
    useState<boolean>(false);
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const [sideFilterSelections, setSideFilterSelections] = useState<string[]>(
    []
  );
  const [messageTypeFilterSelections, setMessageTypeFilterSelections] =
    useState<SimulationLogType[]>([]);

  const handleClose = () => {
    props.handleCloseOnMap();
  };

  const scrollToBottom = () => {
    const container = logsContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    setScenarioSidesMap(getScenarioSidesMap());
  }, [scenarioSides]);

  useEffect(() => {
    if (simulationLogs.length === 0) {
      lastRenderedLogIdRef.current = null;
      setSimulationLogElements([]);
      return;
    } else if (simulationLogs.length > simulationLogElements.length) {
      const lastIndex = simulationLogs.findIndex(
        (log) => log.id === lastRenderedLogIdRef.current
      );
      const newSimulationLogElements: JSX.Element[] = simulationLogs
        .slice(lastIndex + 1, simulationLogs.length)
        .filter((log) => {
          if (filterSimulationLogs([log]).length > 0) {
            lastRenderedLogIdRef.current = log.id;
            return true;
          }
          return false;
        })
        .map((log) => {
          return createMessageLogComponent(log);
        });
      setSimulationLogElements((prev) => [
        ...prev,
        ...newSimulationLogElements,
      ]);
      scrollToBottom();
      return;
    } else if (simulationLogs.length < simulationLogElements.length) {
      const newSimulationLogElements: JSX.Element[] = simulationLogs.map(
        (log) => {
          return createMessageLogComponent(log);
        }
      );
      lastRenderedLogIdRef.current =
        simulationLogs[simulationLogs.length - 1]?.id;
      setSimulationLogElements(newSimulationLogElements);
      scrollToBottom();
      return;
    } else {
      return;
    }
  }, [simulationLogs]);

  useEffect(() => {
    const filteredLogs = filterSimulationLogs(simulationLogs);
    lastRenderedLogIdRef.current = filteredLogs[filteredLogs.length - 1]?.id;
    setSimulationLogElements(
      filteredLogs.map((log) => createMessageLogComponent(log))
    );
    scrollToBottom();
  }, [sideFilterSelections, messageTypeFilterSelections]);

  const filterSimulationLogs = (simulationLogs: SimulationLog[]) => {
    if (
      sideFilterSelections.length === 0 &&
      messageTypeFilterSelections.length === 0
    ) {
      return simulationLogs;
    }

    return simulationLogs.filter((log) => {
      const sideMatch =
        sideFilterSelections.length === 0 ||
        sideFilterSelections.includes(log.sideId);
      const messageTypeMatch =
        messageTypeFilterSelections.length === 0 ||
        messageTypeFilterSelections.includes(log.type);
      return sideMatch && messageTypeMatch;
    });
  };

  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterMenuAnchorEl(event.currentTarget);
    setOpenFilterMenuAnchorEl(true);
  };

  const handleCloseFilterMenu = () => {
    setFilterMenuAnchorEl(null);
    setOpenFilterMenuAnchorEl(false);
  };

  const filterMenu = () => {
    const cardContentStyle = {
      display: "flex",
      flexDirection: "column",
      rowGap: "10px",
      width: "300px",
    };

    const cardStyle = {
      backgroundColor: colorPalette.lightGray,
      color: "white",
    };

    const bottomButtonsStackStyle = {
      display: "flex",
      justifyContent: "center",
    };

    const cardContent = () => {
      return (
        <CardContent sx={cardContentStyle}>
          <Stack sx={bottomButtonsStackStyle} direction="row" spacing={2}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <SelectField
                id="sides-selector"
                labelId="sides-selector-label"
                label="Sides"
                selectItems={scenarioSides.map((side: Side) => {
                  return {
                    name: side.name,
                    value: side.id,
                  };
                })}
                value={sideFilterSelections}
                onChange={(value) => {
                  setSideFilterSelections(value as string[]);
                }}
                multiple
              />
            </FormControl>
          </Stack>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <SelectField
              id="message-types-selector"
              labelId="message-types-selector-label"
              label="Message Types"
              selectItems={Object.values(SimulationLogType).map((type) => {
                return {
                  name: type.toString().replace(/_/g, " "),
                  value: type,
                };
              })}
              value={messageTypeFilterSelections}
              onChange={(value) => {
                setMessageTypeFilterSelections(value as SimulationLogType[]);
              }}
              multiple
            />
          </FormControl>
        </CardContent>
      );
    };

    return (
      <Popover
        open={openFilterMenuAnchorEl}
        anchorEl={filterMenuAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={handleCloseFilterMenu}
        component={Paper}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <Box>
          <Card sx={cardStyle}>{cardContent()}</Card>
        </Box>
      </Popover>
    );
  };

  const createMessageLogComponent = (log: SimulationLog) => {
    const side = scenarioSidesMap[log.sideId];
    const sideName = side?.name ?? "UNKNOWN";
    const sideColor = side?.color ?? SIDE_COLOR.BLACK;
    return (
      <Typography
        key={log.id}
        variant="body2"
        sx={{
          whiteSpace: "pre-wrap",
          mb: 0.5,
        }}
      >
        [
        <Typography
          component="span"
          sx={{ color: "black", fontSize: "inherit" }}
        >
          {unixToLocalTime(log.timestamp)}
        </Typography>
        ][
        <Typography
          component="span"
          sx={{ color: sideColor, fontSize: "inherit" }}
        >
          {sideName}
        </Typography>
        ] {log.message}
      </Typography>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        right: "1em",
        bottom: "5em",
        zIndex: 1005,
      }}
    >
      <Draggable nodeRef={nodeRef}>
        <Card ref={nodeRef} sx={cardStyle}>
          <CardHeader
            sx={cardHeaderStyle}
            action={
              <>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Filter Logs" placement="top" arrow>
                    <IconButton
                      id="filter-button"
                      aria-controls={
                        filterMenuAnchorEl ? "filter-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={filterMenuAnchorEl ? "true" : undefined}
                      onClick={handleOpenFilterMenu}
                      sx={{ minWidth: "unset", mr: 2, p: 0.5, m: 0 }}
                    >
                      <FilterAltIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    sx={closeButtonStyle}
                    onClick={handleClose}
                    aria-label="close"
                  >
                    <CloseIcon color="error" />
                  </IconButton>
                </Stack>
                {filterMenu()}
              </>
            }
            title={
              <Typography variant="body1" component="h1" sx={{ pl: 1 }}>
                Simulation Logs
              </Typography>
            }
          />
          <CardContent sx={{ p: 0 }}>
            <Box ref={logsContainerRef} sx={logsContainerStyle}>
              {simulationLogElements.length === 0 ? (
                <Typography variant="body2" color="textSecondary">
                  No logs yet.
                </Typography>
              ) : (
                simulationLogElements
              )}
            </Box>
          </CardContent>
        </Card>
      </Draggable>
    </div>
  );
}
