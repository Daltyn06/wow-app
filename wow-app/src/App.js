// import logo from './logo.svg';
import './App.css';
import * as React from 'react'

function App() {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [gear, setGear] = React.useState([]);
  const [score, setScore] = React.useState([]);
  const [topDungeons, setTopDungeons] = React.useState([]);

  React.useEffect(() => {
    fetch("https://raider.io/api/v1/characters/profile?region=us&realm=zuljin&name=orndain&fields=gear%2Cmythic_plus_scores_by_season%3Acurrent%2Cmythic_plus_best_runs%2C%20mythic_plus_weekly_highest_level_runs")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          const data = JSON.parse(JSON.stringify(result));
          setItems(data)
          // console.log(result);
          setGear(data.gear)
          setScore(data.mythic_plus_scores_by_season)
          setTopDungeons(data.mythic_plus_best_runs)
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
  function convertMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
  
    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${padTo2Digits(minutes)}:${padTo2Digits(
      seconds,
    )}`;

  }

  function timerCalc(completed, par) {
    const diff = par - completed;
    const formattedTime = convertMsToTime(diff);
    if (diff < 0) {
      const diffPositive = Math.abs(diff);
      const formattedPositiveTime = convertMsToTime(diffPositive);
      return `Over by ${formattedPositiveTime}`;
    } else {
      return `Under by ${formattedTime}`;
    }
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
      <h1>{items.name} - {items.realm}</h1>
      <h3>{gear.item_level_equipped} - {items.active_spec_name} {items.class}</h3>
      <div style={{color: score[0].segments.all.color}}>{score[0].segments.all.score}</div>
      
      {topDungeons.map(item => (
          <div key={item.index}>
            {item.dungeon} {item.mythic_level} <strong>{item.score}</strong> - {timerCalc(item.clear_time_ms, item.par_time_ms)}
          </div>
        ))}
  
        {/* <pre>{JSON.stringify(topDungeons, null, 2)}</pre> */}
      </>
    );
  }
}

export default App;
