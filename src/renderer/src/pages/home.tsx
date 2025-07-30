import { SettingsDialog } from "@renderer/components/settings-dialog";
import { useState } from "react";

function Home(): React.JSX.Element {
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  return (
    <main className="">
      <SettingsDialog
        onOpenChange={setSettingsDialogOpen}
        open={settingsDialogOpen}
      />
      <button onClick={() => setSettingsDialogOpen(true)} type="button">
        Test
      </button>
    </main>
  );
}

export default Home;
