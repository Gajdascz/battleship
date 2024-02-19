export const SettingsDialogModel = () => {
  const p1 = { settings: null };
  const p2 = { settings: null };
  const board = { settings: null };
  return {
    getP1Settings: () => p1.settings,
    getP2Settings: () => p2.settings,
    getBoardSettings: () => board.settings,
    setP1Settings: (settings) => (p1.settings = settings),
    setP2Settings: (settings) => (p2.settings = settings),
    setBoardSettings: (settings) => (board.settings = settings)
  };
};
