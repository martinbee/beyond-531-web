import { useMutation, useQuery, gql } from '@apollo/client';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { Formik, Field, FieldArray } from 'formik';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

import Switch from './Switch';

const FormSection = styled.div`
  padding: 1rem;
`;
const FullWidthButton = styled(Button)`
  width: 100%;
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
      didFirstSetLast
      didWarmUp
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
        didFirstSetLast
        didWarmUp
        id
      }
    }
  }
`;

const COMPLETE_WORKOUT = gql`
  mutation CompleteWorkout($input: CompleteWorkoutInput!) {
    completeWorkout(input: $input) {
      workout {
        id
        user {
          activeWorkout {
            id
            liftType
          }
          id
        }
      }
    }
  }
`;

const filterTypename = ({ __typename, ...rest }) => ({ ...rest });

const getInitialValues = ({ coreSets, didWarmUp, didFirstSetLast }) => {
  return {
    coreSets: coreSets.map(filterTypename),
    didFirstSetLast,
    didWarmUp,
  };
};

const Workouts = () => {
  const history = useHistory();
  const { userId, workoutId } = useParams();

  const [updateWorkout] = useMutation(UPDATE_WORKOUT);
  const [completeWorkout] = useMutation(COMPLETE_WORKOUT, {
    variables: { input: { id: workoutId } },
  });

  const saveAndFinishWorkout = async (updates) => {
    try {
      await updateWorkout({
        variables: {
          input: {
            id: workoutId,
            updates,
          },
        },
      });
      await completeWorkout();
      history.push(`/users/${userId}`);
    } catch (e) {
      console.log(e); // add toast
    }
  };

  const { data, error, loading } = useQuery(GET_WORKOUT, {
    variables: { id: workoutId },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :( {JSON.stringify(error)}</p>;

  const { liftType, user } = data.workout;
  const initialValues = getInitialValues(data.workout);

  // add a debounced save in this form
  return (
    <Formik initialValues={initialValues} onSubmit={saveAndFinishWorkout}>
      {({ handleSubmit, isSubmitting, values }) => (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Week {user.week} {liftType}
              </Typography>

              <FormSection>
                <Field as={Switch} label="Warm up" name="didWarmUp" />
              </FormSection>

              <Divider />
              <FormSection>
                <Typography>Core Sets</Typography>
                <FieldArray
                  name="coreSets"
                  render={() =>
                    values.coreSets.map(({ reps, weight }, index) => (
                      <Field
                        as={Switch}
                        label={`${weight} x ${reps}`}
                        name={`coreSets[${index}].completed`}
                      />
                    ))
                  }
                />
              </FormSection>
              <Divider />
              <FormSection>
                <Field
                  as={Switch}
                  label="First Set Last"
                  name="didFirstSetLast"
                />
              </FormSection>
            </CardContent>
            <CardActions>
              <FullWidthButton
                color="primary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
              >
                Submit
              </FullWidthButton>
            </CardActions>
          </Card>
        </form>
      )}
    </Formik>
  );
};

export default Workouts;
