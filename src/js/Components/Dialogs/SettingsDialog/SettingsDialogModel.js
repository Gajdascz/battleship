export const SettingsDialogModel = () => {
  const p1 = { settings: null };
  const p2 = { settings: null };
  const board = { settings: null };
  return {
    getSettings: () => ({
      p1Settings: p1.settings,
      p2Settings: p2.settings,
      boardSettings: board.settings
    }),
    updateSettings: ({ p1Settings, p2Settings, boardSettings }) => {
      p1.settings = p1Settings;
      p2.settings = p2Settings;
      board.settings = boardSettings;
    }
  };
};
