import { useState, useEffect } from 'react'
import { getMedecins } from './api/public.api'

function App() {
  const [medecins, setMedecins] = useState([]);

  useEffect(() => {
    getMedecins()
      .then((res) => {
        // console.log("API:", res.data.data.data);
        setMedecins(res.data.data.data);
      })
      .catch(console.log);
  }, []);
  return (
    <div>
      <h1>Medecins List</h1>

      {medecins?.length > 0 ? (
        medecins.map((m) => (
          <div key={m.id}>
            <p>{m.user?.name}</p>
            <p>{m.specialite?.name}</p>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;