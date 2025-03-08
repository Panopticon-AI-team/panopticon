import { GameStatusProvider } from "@/gui/providers/GameStatusProvider";
import { MouseMapCoordinatesProvider } from "@/gui/providers/MouseMapCoordinatesProvider";
import { ScenarioTimeProvider } from "@/gui/providers/ScenarioTimeProvider";
import { ToastProvider } from "@/gui/providers/ToastProvider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProvider>
      <ScenarioTimeProvider>
        <GameStatusProvider>
          <MouseMapCoordinatesProvider>{children}</MouseMapCoordinatesProvider>
        </GameStatusProvider>
      </ScenarioTimeProvider>
    </ToastProvider>
  );
};
