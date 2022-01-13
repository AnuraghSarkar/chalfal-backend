const pointsCalculator = (upvotes, downvotes, createdDate) => {
  const result = {};
  const points = upvotes - downvotes;

  if (points <= 0) {
    result.pointsCount = 0;
  } else {
    result.pointsCount = points;
    }
    
    const voteRatio = (upvotes / downvotes);
    if (!isFinite(voteRatio)) {
        result.voteRatio = 1;
    } else { 
        results.voteRatio = voteRatio;
    }
    result.hotAlgorithm = Math.log(Math.max(Math.abs(points), 1)) + createdDate / 4500;
    result.controversialAlgorithm = (upvotes + downvotes) / Math.max(Math.abs(points), 1);
    return result;
};

module.exports = pointsCalculator;