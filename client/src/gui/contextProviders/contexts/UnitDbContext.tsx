import Dba from "@/game/db/Dba";
import { createContext } from "react";

type UnitDbContextType = Dba;
type SetUnitDbContext = (dba: Dba) => void;

const UnitDbContext = createContext<UnitDbContextType>(new Dba());
const SetUnitDbContext = createContext<SetUnitDbContext>((_dba: Dba) => {});

export { UnitDbContext, SetUnitDbContext };
