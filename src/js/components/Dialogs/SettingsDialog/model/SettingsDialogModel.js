export const SettingsDialogModel = () => {
  const p1 = { settings: null };
  const p2 = { settings: null };
  const board = { settings: null };
  return {
    getSettings: () => ({
      p1: p1.settings,
      p2: p2.settings,
      board: board.settings
    }),
    updateSettings: ({ p1, p2, board }) => {
      p1.settings = p1;
      p2.settings = p2;
      board.setBoardSettings = board;
    }
  };
};
