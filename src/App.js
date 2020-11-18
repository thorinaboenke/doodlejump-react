import { useState, useEffect } from 'react';
import './App.css';

function Platforms(props) {
  return props?.platforms?.map((platform) => {
    return (
      <div
        key={Math.random()}
        className="platform"
        style={{ left: `${platform.left}px`, bottom: `${platform.bottom}px` }}
      ></div>
    );
  });
}
function Doodler(props) {
  return (
    <div
      className="doodler"
      style={{
        left: `${props.doodler.left}px`,
        bottom: `${props.doodler.bottom}px`,
      }}
    ></div>
  );
}

function App() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [platforms, setPlatforms] = useState([{ bottom: 50, left: 50 }]);
  const [doodler, setDoodler] = useState([]);
  const [score, setScore] = useState(0);
  const [isGoingLeft, setIsGoingLeft] = useState(false);
  const [isGoingRight, setIsGoingRight] = useState(false);
  const [isJumping, setIsJumping] = useState(true);
  const platformCount = 5;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;

  function makeOneNewPlatform(bottom) {
    const left = Math.random() * 315;
    return { bottom: bottom, left: left };
  }
  function movePlatforms(platforms, doodler) {
    if (doodler.bottom < 200) {
      if (platforms[0].bottom < 10) {
        platforms.shift();
        setScore(score + 1);
        platforms.push(makeOneNewPlatform(600));
      }
      setPlatforms(
        platforms.map((platform) => {
          return { ...platform, bottom: platform.bottom - 4 };
        }),
      );
      console.log(platforms);

      return platforms;

      // if the platform is lower than 10 px, remove it from the array (shift) and increase the score by 1. Create a new platform, push it to the platform array, passing the constructor a height of 600 px
      //setPlatforms(newPlatforms);
    }
  }

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setPlatforms(movePlatforms(platforms, doodler));
  //   }, 100);
  //   return () => clearInterval(interval);
  // }, [platforms, doodler]);

  function createPlatforms() {
    const plat = [];
    for (let i = 0; i < platformCount; i++) {
      let platGap = 600 / platformCount;
      let newPlatBottom = 100 + i * platGap;
      let newPlatform = makeOneNewPlatform(newPlatBottom);
      plat.push(newPlatform);
    }
    console.log({ plat });
    return [plat, plat[0].left];
  }

  function createDoodler(doodlerBottomSpace, doodlerLeft) {
    const doodlerLeftSpace = platforms[0].left;
    console.log(platforms[0].left); // (this line ensures that the doodler start on the lowest platform)

    return { bottom: doodlerBottomSpace, left: doodlerLeft };
  }

  function start() {
    const [platforms, doodlerLeft] = createPlatforms();
    setPlatforms(platforms);
    setDoodler(createDoodler(doodlerBottomSpace, doodlerLeft));
  }

  return (
    <div className="grid">
      <Doodler doodler={doodler} />
      <Platforms platforms={platforms} />
      <button onClick={() => start()}>Start Game</button>
      <button onClick={() => movePlatforms(platforms, doodler)}>eMov</button>
    </div>
  );
}

export default App;
