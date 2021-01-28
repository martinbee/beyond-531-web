import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CompletedIcon from '@material-ui/icons/Done';
import NotCompletedIcon from '@material-ui/icons/Close';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  margin-top: 1rem;
`;
const Section = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`;
const Row = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`;
const Title = styled(Typography)`
  text-align: center;
`;

const getCompletedIcon = (completed) => {
  if (!completed) return <NotCompletedIcon />;

  return <CompletedIcon />;
};

export default function History({ history }) {
  const renderHistory = () =>
    history.map((workout) => {
      const {
        id,
        liftType,
        didWarmUp,
        didFirstSetLast,
        coreSets,
        jokerSets,
      } = workout;

      return (
        <StyledCard key={id}>
          <CardContent>
            <Typography variant="h6">{liftType}</Typography>
            <Section>
              <Row>
                <Typography>Warmed Up:</Typography>
                {getCompletedIcon(didWarmUp)}
              </Row>
            </Section>
            <Section>
              <Typography>Core Sets</Typography>
              {coreSets.map(({ completed, reps, weight }) => (
                <Row>
                  <Typography>
                    {weight} x {reps}:
                  </Typography>
                  {getCompletedIcon(completed)}
                </Row>
              ))}
            </Section>
            <Section>
              {jokerSets.map(({ completed, reps, weight }) => (
                <Row>
                  <Typography>
                    {weight} x {reps}:
                  </Typography>
                  {getCompletedIcon(completed)}
                </Row>
              ))}
            </Section>
            <Section>
              <Row>
                <Typography>First Set Last:</Typography>
                {getCompletedIcon(didWarmUp)}
              </Row>
            </Section>
          </CardContent>
        </StyledCard>
      );
    });

  return (
    <>
      <Title variant="h5">Workout History</Title>
      {renderHistory()}
    </>
  );
}
