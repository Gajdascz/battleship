import { DIRECTIONS, RESULTS } from '../../../../utility/constants';
export const analyzeClustersForGaps = ({ gridHelpers, validateFn, sumCoordinates }) => {
  const findClusters = () => {
    const grid = gridHelpers.copyGrid();
    const visited = grid.map((row) => row.map(() => false));
    const clusters = [];

    const exploreCluster = (coordinates, clusterArray) => {
      if (
        !coordinates ||
        !validateFn(coordinates) ||
        visited[coordinates[0]][coordinates[1]] ||
        gridHelpers.getValueAt(coordinates) !== RESULTS.HIT
      ) {
        return;
      }
      visited[coordinates[0]][coordinates[1]] = true;
      clusterArray.push(coordinates);
      Object.values(DIRECTIONS).forEach((direction) => {
        const nextCell = sumCoordinates(direction, coordinates);
        exploreCluster(nextCell, clusterArray);
      });
    };

    grid.forEach((row, rowIndex) => {
      row.forEach((cellValue, colIndex) => {
        const coordinates = [rowIndex, colIndex];
        if (!visited[rowIndex][colIndex] && cellValue === RESULTS.HIT) {
          const cluster = [];
          exploreCluster(coordinates, cluster);
          if (cluster.length > 0) clusters.push(cluster);
        }
      });
    });
    return clusters;
  };

  const findGaps = (clusters) => {
    const gaps = [];
    clusters.forEach((cluster) => {
      const clusterGapCells = [];
      cluster.forEach((cell) => {
        const totalHitsAround = gridHelpers.getHitsAround(cell).length;
        if (totalHitsAround === 3 || (totalHitsAround === 2 && gridHelpers.isAtEdge(cell))) {
          if (validateFn(cell)) clusterGapCells.push(cell);
        }
      });
      gaps.push(clusterGapCells);
    });
    return gaps;
  };

  const clusters = findClusters();
  return clusters.length > 0 ? findGaps(clusters) : [];
};
