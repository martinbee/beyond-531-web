import { useMutation, useQuery, gql } from '@apollo/client';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Formik, Field } from 'formik';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

import Switch from './Switch';

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

const COMPLETE_WORKOUT = gql`
  mutation CompleteWorkout($input: CompleteWorkoutInput!) {
    completeWorkout(input: $input) {
      workout {
        id
      }
    }
  }
`;

const getInitialValues = ({ didWarmUp, didFirstSetLast }) => {
  return {
    didWarmUp,
    didFirstSetLast,
  };
};

const Workouts = () => {
  const { workoutId } = useParams();

  const { data, error, loading } = useQuery(GET_WORKOUT, {
    variables: { id: workoutId },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :( {JSON.stringify(error)}</p>;

  const { liftType, user } = data.workout;
  const initialValues = getInitialValues(data.workout);

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ handleSubmit, isSubmitting, values }) => (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Week {user.week} {liftType}
              </Typography>
              <Field as={Switch} label="Warm up" name="didWarmUp" />
              <Field
                as={Switch}
                label="First Set Last"
                name="didFirstSetLast"
              />
            </CardContent>
            <CardActions>
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </CardActions>
          </Card>
        </form>
      )}
    </Formik>
  );
};

export default Workouts;
