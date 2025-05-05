import { randomUUID } from "@/utils/generateUUID";

export enum SimulationLogType {
  WEAPON_LAUNCHED = "WEAPON_LAUNCHED",
  WEAPON_HIT = "WEAPON_HIT",
  WEAPON_MISSED = "WEAPON_MISSED",
  WEAPON_EXPENDED = "WEAPON_EXPENDED",
  WEAPON_CRASHED = "WEAPON_CRASHED",
  STRIKE_MISSION_SUCCESS = "STRIKE_MISSION_SUCCESS",
  STRIKE_MISSION_ABORTED = "STRIKE_MISSION_ABORTED",
  RETURN_TO_BASE = "RETURN_TO_BASE",
  AIRCRAFT_CRASHED = "AIRCRAFT_CRASHED",
  TARGET_DESTROYED = "TARGET_DESTROYED",
  OTHER = "OTHER",
}

export interface SimulationLog {
  id: string;
  timestamp: number;
  type: SimulationLogType;
  sideId: string;
  message: string;
}

export default class SimulationLogs {
  private logs: SimulationLog[] = [];
  private hasNewLogs: boolean = false;

  addLog(
    sideId: string,
    message: string,
    timestamp: number = Date.now(),
    type: SimulationLogType = SimulationLogType.OTHER
  ) {
    const newLog: SimulationLog = {
      id: randomUUID(),
      timestamp,
      type,
      sideId,
      message,
    };
    this.logs.push(newLog);
    this.hasNewLogs = true;
  }

  getHasNewLogs() {
    return this.hasNewLogs;
  }

  setHasNewLogs(hasNewLogs: boolean) {
    this.hasNewLogs = hasNewLogs;
  }

  getLogs(
    sideIds?: string[],
    messageTypes?: SimulationLogType[],
    numMessages?: number,
    orderBy: "asc" | "desc" = "asc"
  ): SimulationLog[] {
    let filteredLogs = this.logs;
    if (sideIds) {
      filteredLogs = filteredLogs.filter((log) => sideIds.includes(log.sideId));
    }
    if (messageTypes) {
      filteredLogs = filteredLogs.filter((log) =>
        messageTypes.includes(log.type)
      );
    }
    if (orderBy === "asc") {
      filteredLogs.sort((a, b) => a.timestamp - b.timestamp);
    } else {
      filteredLogs.sort((a, b) => b.timestamp - a.timestamp);
    }
    if (numMessages) {
      return filteredLogs.slice(0, numMessages);
    }
    return filteredLogs;
  }

  clearLogs() {
    this.logs = [];
    this.hasNewLogs = true;
  }
}
