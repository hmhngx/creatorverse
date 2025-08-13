// src/App.jsx
import './App.css';
import React from 'react';
import { useRoutes, Link } from 'react-router-dom';
import ShowCreators from './pages/ShowCreators';
import AddCreator from './pages/AddCreator';
import EditCreator from './pages/EditCreator';
import ViewCreator from './pages/ViewCreator';

const App = () => {
  // Sets up routing
  let element = useRoutes([
    {
      path: "/",
      element: <ShowCreators />
    },
    {
      path: "/new",
      element: <AddCreator />
    },
    {
      path:"/edit/:id",
      element: <EditCreator />
    },
    {
      path:"/:id",
      element: <ViewCreator />
    }
  ]);

  return (
    <div className="App">
      <header>
        <h1>Creatorverse <span className="emoji">🧑‍🚀</span></h1>
        <nav>
          <Link to="/"><button className="secondary">View All Creators</button></Link>
          <Link to="/new"><button>Add a Creator</button></Link>
        </nav>
      </header>
      <main className="container">
        {element}
      </main>
    </div>
  );
}

export default App;