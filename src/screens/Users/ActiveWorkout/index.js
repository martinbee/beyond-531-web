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

// wow this sucks
// probably leave in users proper instead of here
export default function ActiveWorkout({ activeWorkout, week }) {
  const history = useHistory();
  const { userId } = useParams();
  const hasActiveWorkout = Boolean(activeWorkout);
  const goToWorkout = () => {
    history.push(`/users/${userId}/workouts/${activeWorkout.id}`);
  };

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
              <Button onClick={goToWorkout} variant="contained" color="primary">
                Go To
              </Button>
              <Button variant="outlined" color="secondary">
                Create New Workout
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary">
              Get Started By Creating A New Workout
            </Button>
          )}
        </StyledCardActions>
      </CenteredCardContent>
    </Card>
  );
}
