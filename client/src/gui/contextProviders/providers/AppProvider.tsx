import { GameStatusProvider } from "@/gui/contextProviders/providers/GameStatusProvider";
import { MouseMapCoordinatesProvider } from "@/gui/contextProviders/providers/MouseMapCoordinatesProvider";
import { ScenarioTimeProvider } from "@/gui/contextProviders/providers/ScenarioTimeProvider";
import { ToastProvider } from "@/gui/contextProviders/providers/ToastProvider";
import { RecordingStepProvider } from "./RecordingStepProvider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProvider>
      <ScenarioTimeProvider>
        <RecordingStepProvider>
          <GameStatusProvider>
            <MouseMapCoordinatesProvider>
              {children}
            </MouseMapCoordinatesProvider>
          </GameStatusProvider>
        </RecordingStepProvider>
      </ScenarioTimeProvider>
    </ToastProvider>
  );
};
