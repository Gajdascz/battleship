export const AdvancedGridHelpers = ({
  trackingGrid,
  getCellInADirection: _getCellInADirection,
  getValueAt: _getValueAt,
  getCellsInAllDirections: _getCellsInAllDirections,
  getOpenMovesAround: _getOpenMovesAround,
  getOpenMovesInADirection: _getOpenMovesInADirection,
  getHitsAround: _getHitsAround,
  getConsecutiveHitsInADirection: _getConsecutiveHitsInADirection,
  isHitResolved: _isHitResolved,
  removeDuplicates: _removeDuplicates,
  copyGrid: _copyGrid,
  isAtEdge: _isAtEdge
}) => ({
  getValueAt: (coordinates) => _getValueAt(trackingGrid, coordinates),
  getCellInADirection: (coordinates, direction) =>
    _getCellInADirection(trackingGrid, coordinates, direction),
  getOpenMovesAround: (coordinates) => _getOpenMovesAround(trackingGrid, coordinates),
  getHitsAround: (coordinates) => _getHitsAround(trackingGrid, coordinates),
  getCellsInAllDirections: (coordinates) => _getCellsInAllDirections(trackingGrid, coordinates),
  getOpenMovesInADirection: (coordinates, direction) =>
    _getOpenMovesInADirection(trackingGrid, coordinates, direction),
  getConsecutiveHitsInADirection: (start, direction) =>
    _getConsecutiveHitsInADirection(trackingGrid, start, direction),

  copyGrid: () => _copyGrid(trackingGrid),
  isAtEdge: (coordinates) => _isAtEdge(trackingGrid, coordinates),

  getUniqueOpenMovesAroundHits: (hits) => {
    const openAround = [];
    hits.forEach((hit) => {
      openAround.push(..._getOpenMovesAround(trackingGrid, hit));
    });
    return _removeDuplicates(openAround);
  },
  getTotalConsecutiveUnresolvedHitsInADirection: (start, direction) => {
    const adjacentUnresolved = [];
    const consecutiveHits = _getConsecutiveHitsInADirection(trackingGrid, start, direction);
    for (const hit of consecutiveHits) {
      if (!_isHitResolved(hit)) adjacentUnresolved.push(hit);
      else break;
    }
    return adjacentUnresolved.length;
  }
});
