const combatController = {
  hit: () => {
    const result = model.hit();
    if (result === STATUSES.SHIP_SUNK) {
      view.updateSunkStatus(true);
      publisher.execute(PUBLISHER_KEYS.ACTIONS.HIT, { id: model.getScope() });
    }
  },
  handleAttack: ({ data }) => {
    combatController.hit();
  }
};

const enableCombatSettings = () => {};
