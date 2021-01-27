import { useMutation, useQuery, gql } from '@apollo/client';

import './App.css';
import WorkoutForm from './WorkoutForm';

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
