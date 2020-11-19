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
  const [isGameOver, setIsGameOver] = useState(true);
  const [platforms, setPlatforms] = useState([{ bottom: 50, left: 50 }]);
  const [doodler, setDoodler] = useState({});
  const [score, setScore] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [direction, setDirection] = useState('none');
  const platformCount = 5;
  const startPoint = 150;
  const doodlerBottomSpace = startPoint;

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
  // function for movement

  function moveStraight() {
    setDoodler({ ...doodler, direction: 'none' });
  }
  function moveLeft() {
    setDoodler({ ...doodler, direction: 'left' });
  }
  function moveRight() {
    setDoodler({ ...doodler, direction: 'right' });
  }

  function gameOver() {
    setIsGameOver(true);
    setDisplayScore(true);
  }
  function fall(doodler) {
    let newLeft = doodler.left;
    if (direction === 'left' && doodler.left >= 0) {
      newLeft = doodler.left - 5;
    }
    if (direction === 'right' && doodler.left <= 340) {
      newLeft = doodler.left + 5;
    }
    if (direction === 'none') {
      newLeft = doodler.left;
    }
    setDoodler({ ...doodler, bottom: doodler.bottom - 5, left: newLeft });
    if (doodler.bottom <= 0) {
      gameOver();
    }
  }
  function jump(doodler) {
    let newLeft = doodler.left;
    if (direction === 'left' && doodler.left >= 0) {
      newLeft = doodler.left - 5;
    }
    if (direction === 'right' && doodler.left <= 340) {
      newLeft = doodler.left + 5;
    }
    if (direction === 'none') {
      newLeft = doodler.left;
    }
    setDoodler({ ...doodler, bottom: doodler.bottom + 20, left: newLeft });
    if (doodler.bottom > doodler.startPoint + 200) {
      setDoodler({ ...doodler, isJumping: false });
    }
  }

  // if the doodler hits a wall, reverse direction
  function checkCollision(doodler) {
    if (doodler.left <= 0) {
      setDirection('right');
    }
    if (doodler.left >= 340) {
      setDirection('left');
    }
  }
  // as long as the game is running, check for collision, move the platforms, move the doodler (jump or fall), check if the doodler has landed on a platform
  useEffect(() => {
    if (!isGameOver) {
      const Interval = setInterval(() => {
        checkCollision(doodler);
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
    setIsGameOver(false);
    setScore(0);
    setPlatforms(platforms);
    setDoodler(createDoodler(doodlerBottomSpace, doodlerLeft));
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && isGameOver) {
      start();
    }
    console.log('A key was pressed', event.key);
    if (event.key === 'ArrowLeft') {
      setDirection('left');
      moveLeft();
    }
    if (event.key === 'ArrowRight') {
      setDirection('right');
      moveRight();
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      setDirection('none');
      moveStraight();
    }
  };
  //listen to key events
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // cleanup this component
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <>
      <div className="grid">
        {!isGameOver && (
          <>
            <div className="score">{score}</div>
            <Doodler doodler={doodler} />
            <Platforms platforms={platforms} />{' '}
          </>
        )}
        {isGameOver && (
          <>
            <div className="score">{score}</div>
            <div className="instructions">
              {' '}
              DoodleJump <br /> Press Enter to start and navigate with the arrow
              keys
            </div>
          </>
        )}
      </div>
      <div className="flex">
        <a href="https://github.com/thorinaboenke/doodlejump-react">
          <img className="github" src="/github.svg" alt="github" />
        </a>
        <a href="https://twitter.com/ThorinaBoenke">
          <img className="twitter" src="/twitter.svg" alt="twitter" />
        </a>
      </div>
    </>
  );
}

export default App;
