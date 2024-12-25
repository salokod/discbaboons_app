const skinCalc = (roundData, betData) => {
  let skinCount = 1;
  const skinCounter = {};

  // Initialize skinCounter for each baboon
  skinCounter[roundData.baboonid] = 0;
  skinCounter[`${roundData.baboonid}_money`] = 0;
  roundData.otherBaboons.forEach((otherBaboon) => {
    skinCounter[otherBaboon.baboonFriendId] = 0;
    skinCounter[`${otherBaboon.baboonFriendId}_money`] = 0;
  });

  // Process each hole
  roundData.holeData.forEach((hole, index) => {
    const {
      par, distance, holeNumber, ...scores
    } = hole;
    const allBaboons = [roundData.baboonid, ...roundData.otherBaboons.map((baboon) => baboon.baboonFriendId)];
    const allZero = Object.values(scores).every((score) => score === 0);

    if (!allZero) {
      const values = Object.values(scores);
      const min = Math.min(...values);
      const isLow = values.filter((score) => score === min).length;

      if (isLow === 1) {
        const awardSkinCheck = Object.keys(scores).reduce((key, v) => (scores[v] < scores[key] ? v : key));
        skinCounter[awardSkinCheck] += skinCount;
        skinCounter[`${awardSkinCheck}_money`] += roundData.otherBaboons.length * betData.skinsAmount * skinCount;

        const findBaboon = allBaboons.indexOf(awardSkinCheck);
        if (findBaboon > -1) {
          allBaboons.splice(findBaboon, 1);
        }

        allBaboons.forEach((baboon) => {
          skinCounter[`${baboon}_money`] -= betData.skinsAmount * skinCount;
        });

        skinCount = 1;
      } else if (index < roundData.holeData.length - 1) {
        skinCount += 1;
      }
    }
  });

  return {
    skinCounter,
    skinCount,
  };
};

export default skinCalc;
