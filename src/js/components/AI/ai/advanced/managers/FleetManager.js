export const FleetManager = (gameFleet, getLastOpponentShipSunkFn) => {
  const getFleetMap = (fleet) => new Map(fleet.map((ship) => [ship.id, ship.length]));
  const _fleetList = getFleetMap(gameFleet);
  const _liveOpponentShips = getFleetMap(gameFleet);
  return {
    opponentShipSunk: () => _liveOpponentShips.delete(getLastOpponentShipSunkFn()),
    getLastSunkLength: () => _fleetList.get(getLastOpponentShipSunkFn()),
    getSmallestAliveOpponentShipLength: () =>
      [..._liveOpponentShips.values()].reduce(
        (acc, value) => (value < acc ? value : acc),
        Number.MAX_SAFE_INTEGER
      ),
    getTotalFleetLength: () => [..._fleetList].reduce((acc, value) => acc + value, 0),
    getLiveOpponentShipLengths: () => [..._liveOpponentShips.values()],
    getNumberOfOpponentShipsLeft: () => _liveOpponentShips.size
  };
};
