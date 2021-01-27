import styled from 'styled-components';
import { useMutation, useQuery, gql } from '@apollo/client';

const CheckboxWrapper = styled.div`
  padding: 10px;
`;

const GET_WORKOUT = gql`
  query GetWorkout($id: ID!) {
    workout(id: $id) {
      active
      coreSets {
        completed
        reps
        weight
      }
      didWarmUp
      didFirstSetLast
      id
      liftType
      user {
        id
        week
      }
    }
  }
`;

const UPDATE_WORKOUT = gql`
  mutation UpdateWorkout($input: UpdateWorkoutInput!) {
    updateWorkout(input: $input) {
      workout {
        active
        coreSets {
          completed
          reps
          weight
        }
        didWarmUp
        didFirstSetLast
        id
      }
    }
  }
`;

function WorkoutForm({ workoutId }) {
  const { loading, error, data } = useQuery(GET_WORKOUT, {
    variables: { id: workoutId },
  });
  const [updateWorkoutMutation] = useMutation(UPDATE_WORKOUT);

  // maybe autosave and update all at once, rather than each operation
  const updateWorkout = (updates) => {
    updateWorkoutMutation({
      variables: {
        input: {
          id: workoutId,
          updates,
        },
      },
    });
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :( {JSON.stringify(error)}</p>;

  const {
    active,
    coreSets,
    didFirstSetLast,
    didWarmUp,
    liftType,
    user,
  } = data.workout;

  const toggleDidWarmUp = () => updateWorkout({ didWarmUp: !didWarmUp });
  const toggleDidFirstSetLast = () =>
    updateWorkout({ didFirstSetLast: !didFirstSetLast });

  const updateCoreSets = (indexToUpdate) => {
    const updatedCoreSets = coreSets.map(
      ({ __typename, completed, ...set }, index) => {
        if (index !== indexToUpdate) return { completed, ...set }; // hate this

        return {
          ...set,
          completed: !completed,
        };
      }
    );

    updateWorkout({ coreSets: updatedCoreSets });
  };

  return (
    <div>
      <h3>
        {liftType} for week {user?.week}
      </h3>
      <div>Is Active: {active ? 'Yes' : 'No'}</div>
      <CheckboxWrapper>
        <input
          type="checkbox"
          id="didWarmUp"
          name="didWarmUp"
          onChange={toggleDidWarmUp}
          checked={didWarmUp}
        />
        <label htmlFor="didWarmUp">Finished Warming up?</label>
      </CheckboxWrapper>
      {coreSets.map(({ completed, reps, weight }, index) => {
        const id = `coreSet-${index}`;
        const updateCoreSet = () => updateCoreSets(index);

        return (
          <CheckboxWrapper key={weight}>
            <input
              type="checkbox"
              id={id}
              name={id}
              checked={completed}
              onChange={updateCoreSet}
            />
            <label htmlFor={id}>
              {weight} x {reps}
            </label>
          </CheckboxWrapper>
        );
      })}
      <CheckboxWrapper>
        <input
          type="checkbox"
          id="didFirstSetLast"
          name="didFirstSetLast"
          onChange={toggleDidFirstSetLast}
          checked={didFirstSetLast}
        />
        <label htmlFor="didFirstSetLast">Did first set last?</label>
      </CheckboxWrapper>
    </div>
  );
}

export default WorkoutForm;
