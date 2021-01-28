import { useMutation, useQuery, gql } from '@apollo/client';

import './App.css';
import WorkoutForm from './screens/Workout/WorkoutForm';

const GET_ACTIVE_WORKOUTS = gql`
  query GetActiveWorkouts {
    activeWorkouts: workouts(isActive: true) {
      id
    }
  }
`;
const COMPLETE_WORKOUT = gql`
  mutation CompleteWorkout($input: CompleteWorkoutInput!) {
    completeWorkout(input: $input) {
      workout {
        id
      }
    }
  }
`;

function App() {
  const { data, error, loading } = useQuery(GET_ACTIVE_WORKOUTS);
  const firstActiveWorkout = data?.activeWorkouts[0];

  const [completeWorkout] = useMutation(COMPLETE_WORKOUT, {
    variables: { input: { id: firstActiveWorkout?.id } },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :( {JSON.stringify(error)}</p>;

  return (
    <div className="App">
      {!firstActiveWorkout ? (
        <div>No Active Workouts</div>
      ) : (
        <>
          <WorkoutForm workoutId={firstActiveWorkout?.id} />
          <button onClick={completeWorkout}>Complete Workout</button>
        </>
      )}
    </div>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
