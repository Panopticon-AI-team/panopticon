import { GameStatusProvider } from "@/gui/contextProviders/providers/GameStatusProvider";
import { MouseMapCoordinatesProvider } from "@/gui/contextProviders/providers/MouseMapCoordinatesProvider";
import { ScenarioTimeProvider } from "@/gui/contextProviders/providers/ScenarioTimeProvider";
import { ToastProvider } from "@/gui/contextProviders/providers/ToastProvider";
import { RecordingStepProvider } from "@/gui/contextProviders/providers/RecordingStepProvider";
import { Auth0Provider } from "@auth0/auth0-react";
import { UnitDbProvider } from "@/gui/contextProviders/providers/UnitDbProvider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const env_mode = import.meta.env.VITE_ENV;

  const BaseProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <ToastProvider>
        <UnitDbProvider>
          <ScenarioTimeProvider>
            <RecordingStepProvider>
              <GameStatusProvider>
                <MouseMapCoordinatesProvider>
                  {children}
                </MouseMapCoordinatesProvider>
              </GameStatusProvider>
            </RecordingStepProvider>
          </ScenarioTimeProvider>
        </UnitDbProvider>
      </ToastProvider>
    );
  };

  if (
    !(domain && clientId && redirectUri && audience && env_mode) ||
    env_mode === "standalone"
  ) {
    return BaseProviders({ children });
  } else {
    return (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          audience: audience,
          redirect_uri: redirectUri ?? window.location.origin,
        }}
      >
        {BaseProviders({ children })}
      </Auth0Provider>
    );
  }
};
