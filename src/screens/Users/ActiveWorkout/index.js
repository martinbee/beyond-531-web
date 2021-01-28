import { useMutation, gql } from '@apollo/client';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';

const CenteredCardContent = styled(CardContent)`
  justify-content: center;
  text-align: center;
`;
const StyledCardActions = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;

  & button:not(:first-child) {
    margin-top: 1rem;
  }
`;

const CREATE_WORKOUT = gql`
  mutation CreateWorkout($input: CreateWorkoutInput!) {
    createWorkout(input: $input) {
      workout {
        id
        user {
          activeWorkout {
            id
            liftType
          }
          id
          week
        }
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
          week
        }
      }
    }
  }
`;

// wow this sucks
// probably leave in users proper instead of here
export default function ActiveWorkout({ activeWorkout, week }) {
  const history = useHistory();
  const { userId } = useParams();

  const [completeWorkout] = useMutation(COMPLETE_WORKOUT, {
    variables: { input: { id: activeWorkout?.id } },
  });
  const [createWorkout] = useMutation(CREATE_WORKOUT, {
    variables: { input: { userId: userId } },
  });

  const createNewWorkoutAndGo = async () => {
    try {
      const { data } = await createWorkout();

      const newWorkoutId = data?.createWorkout?.workout?.id;
      if (newWorkoutId) goToWorkout(newWorkoutId);
    } catch (e) {
      // toast
    }
  };

  const completeCurrentWorkoutAndCreateNew = async () => {
    try {
      await completeWorkout();
      await createNewWorkoutAndGo();
    } catch (e) {
      console.log(e);
    }
  };

  const hasActiveWorkout = Boolean(activeWorkout);
  const goToWorkout = (id) => {
    history.push(`/users/${userId}/workouts/${id}`);
  };
  const goToActiveWorkout = () => goToWorkout(activeWorkout.id);

  return (
    <Card>
      <CenteredCardContent>
        {hasActiveWorkout ? (
          <div>
            <Typography variant="h6">Current Lift:</Typography>
            <Typography>
              Week {week} {activeWorkout.liftType}
            </Typography>
          </div>
        ) : null}
        <StyledCardActions disableSpacing>
          {hasActiveWorkout ? (
            <>
              <Button
                onClick={goToActiveWorkout}
                variant="contained"
                color="primary"
              >
                Go To
              </Button>
              <Button
                color="secondary"
                onClick={completeCurrentWorkoutAndCreateNew}
                variant="outlined"
              >
                Create New Workout
              </Button>
            </>
          ) : (
            <Button
              color="primary"
              onClick={createNewWorkoutAndGo}
              variant="contained"
            >
              Get Started By Creating A New Workout
            </Button>
          )}
        </StyledCardActions>
      </CenteredCardContent>
    </Card>
  );
}
