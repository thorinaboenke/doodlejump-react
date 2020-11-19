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
  const [doodler, setDoodler] = useState({});
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);

  const platformCount = 5;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;

  function makeOneNewPlatform(bottom) {
    const left = Math.random() * 315;
    return { bottom: bottom, left: left };
  }
  function movePlatforms(platforms, doodler) {
    if (doodler.bottom > 200) {
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

      return platforms;
    }
  }
  function gameOver() {
    setIsGameOver(true);
    setDisplayScore(true);
  }
  function fall(doodler) {
    setDoodler({ ...doodler, bottom: doodler.bottom - 5 });
    if (doodler.bottom <= 0) {
      gameOver();
    }
  }
  function jump(doodler) {
    setDoodler({ ...doodler, bottom: doodler.bottom + 20 });
    if (doodler.bottom > doodler.startPoint + 200) {
      setDoodler({ ...doodler, isJumping: false });
    }
  }

  useEffect(() => {
    if (!isGameOver) {
      const Interval = setInterval(() => {
        movePlatforms(platforms, doodler);
        if (doodler.isJumping) {
          jump(doodler);
        }
        if (!doodler.isJumping) {
          fall(doodler);
        }
        // check for landing on a platform
        platforms.forEach((platform) => {
          if (
            doodler.bottom >= platform.bottom &&
            doodler.bottom <= platform.bottom + 15 &&
            doodler.left + 60 >= platform.left &&
            doodler.left <= platform.left + 85 &&
            !doodler.isJumping
          ) {
            setDoodler({
              ...doodler,
              isJumping: true,
              startPoint: doodler.bottom,
            });
          }
        });
      }, 30);
      return () => clearInterval(Interval);
    }
  }, [platforms, doodler]);

  function createPlatforms() {
    const plat = [];
    for (let i = 0; i < platformCount; i++) {
      const platGap = 600 / platformCount;
      const newPlatBottom = 100 + i * platGap;
      const newPlatform = makeOneNewPlatform(newPlatBottom);
      plat.push(newPlatform);
    }
    console.log({ plat });
    return [plat, plat[0].left];
  }

  function createDoodler(doodlerBottomSpace, doodlerLeft) {
    const doodlerLeftSpace = platforms[0].left;
    console.log(platforms[0].left); // ensures that the doodler starts directly above the lowest platform

    return {
      bottom: doodlerBottomSpace,
      left: doodlerLeft,
      isJumping: true,
      direction: 'none',
      startPoint: 150,
    };
  }

  function start() {
    const [platforms, doodlerLeft] = createPlatforms();
    setPlatforms(platforms);
    setDoodler(createDoodler(doodlerBottomSpace, doodlerLeft));
    setIsGameOver(false);
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
