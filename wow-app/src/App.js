// import logo from './logo.svg';
import './App.css';
import * as React from 'react'

function App() {
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState([]);
  const [gear, setGear] = React.useState([]);
  const [score, setScore] = React.useState([]);
  const [topDungeons, setTopDungeons] = React.useState([]);
  const [name, setName] = React.useState([]);
  const [server, setServer] = React.useState([]);
  const url = `https://raider.io/api/v1/characters/profile?region=us&realm=${server}&name=${name}&fields=gear%2Cmythic_plus_scores_by_season%3Acurrent%2Cmythic_plus_best_runs%2C%20mythic_plus_weekly_highest_level_runs`;


  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();
        setData(actualData);
        setItems(actualData)
        setGear(actualData.gear)
        setScore(actualData.mythic_plus_scores_by_season)
        setTopDungeons(actualData.mythic_plus_best_runs)
        setError(null);
      } catch(err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }  
    }
    getData()
  }, [url])

  const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

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

  function CharacterForm() {
    function handleSubmit(event) {
      event.preventDefault()
      setName(event.currentTarget.elements.characterInput.value)
      setServer(slugify(event.currentTarget.elements.characterServer.value))
    }
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="characterServer">Realm</label>
          <input id="characterServer" type="text" />
          <label htmlFor="characterInput">Name</label>
          <input id="characterInput" type="text" />
        </div>
        <button type="submit">Submit</button>
      </form>
    )
  }

  function CharacterDetails() {
    return (
      <>
      <h1>{items.name} - {items.realm}</h1>
      <h3>{gear.item_level_equipped} - {items.active_spec_name} {items.class}</h3>
      <div style={{color: score[0].segments.all.color}}>{score[0].segments.all.score}</div>
      <img alt="" src={items.thumbnail_url}/>
      {topDungeons.map(item => (
          <div key={item.index}>
            {item.dungeon} {item.mythic_level} <strong>{item.score}</strong> - {timerCalc(item.clear_time_ms, item.par_time_ms)}
          </div>
        ))}

        <pre>{JSON.stringify(items, null, 2)}</pre>
        </>
      );
    }

    return (
      <>
      {loading && <div>A moment please...</div>}
      {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}
      <div className='container mx-auto'>
        <CharacterForm></CharacterForm>
        {data && (
          <CharacterDetails></CharacterDetails>
        )}
      </div>
      </>
    );
}

export default App;
