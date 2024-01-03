import { gameInitializers } from './initializer';

export default function gameController({
  playerOneInformation = { type: 'human', name: '', difficulty: '' },
  playerTwoInformation = { type: 'ai', name: '', difficulty: 0 },
  boardOptions = { rows: 10, cols: 10, letterAxis: 'row' },
  fleetType = 'default'
} = {}) {
  const initializer = gameInitializers();
  let _playerOne = initializer.player(playerOneInformation);
  let _playerTwo = initializer.player(playerTwoInformation);
  let _boardOptions = initializer.playerBoards(_playerOne, _playerTwo, boardOptions);
  let _fleet = initializer.playerFleets(_playerOne, _playerTwo, fleetType);
  let _currentPlayer = _playerOne;

  const switchCurrentPlayer = () => (_currentPlayer = _currentPlayer === _playerOne ? _playerTwo : _playerOne);

  return {
    get playerOneName() {
      return _playerOne.name;
    },
    set playerOne(playerInformation) {
      _playerOne = initializer.player(playerInformation);
    },
    get playerTwoName() {
      return _playerTwo.name;
    },
    set playerTwo(playerInformation) {
      _playerTwo = initializer.player(playerInformation);
    },
    get boardOptions() {
      return _boardOptions;
    },
    set boardOptions(boardOptions) {
      _boardOptions = initializer.playerBoards(_playerOne, _playerTwo, boardOptions);
    },
    get gameFleet() {
      return _fleet;
    },
    set gameFleet(fleetType) {
      _fleet = initializer.playerFleets(_playerOne, _playerTwo, fleetType);
    },
    get currentPlayer() {
      return _currentPlayer.name;
    },
    switchCurrentPlayer
  };
}
