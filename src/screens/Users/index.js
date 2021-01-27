import { useQuery, gql } from '@apollo/client';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Logo from '@material-ui/icons/FitnessCenter';

import { Switch, Route, useParams, useRouteMatch } from 'react-router-dom';

import styled from 'styled-components';
import History from '../History';
import Workouts from '../Workouts';

const Page = styled.div`
  display: flex;
  flex-direction: column;
`;
const SpacedToolbar = styled(Toolbar)`
  justify-content: space-between;
`;
const Content = styled(Container)`
  padding: 1.5rem;
`;

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      activeWorkout {
        id
        liftType
      }
      id
      firstName
      lastName
      week
    }
  }
`;

const hookUpUsersRoutes = (path) => (
  <Switch>
    <Route path={`${path}/history`}>
      <History />
    </Route>
    <Route path={`${path}/workouts/:workoutId`}>
      <Workouts />
    </Route>
  </Switch>
);

const getFullName = ({ firstName, lastName }) => `${firstName} ${lastName}`;

export default function Users() {
  const { userId } = useParams();
  const { path } = useRouteMatch();

  const { data, error, loading } = useQuery(GET_USER, {
    variables: { id: userId },
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :( {JSON.stringify(error)}</p>;

  const { activeWorkout } = data.user;

  return (
    <Page>
      <AppBar position="static">
        <SpacedToolbar>
          <Logo />
          <Typography variant="h5">Beyond 5/3/1</Typography>
          <Typography>{getFullName(data.user)}</Typography>
        </SpacedToolbar>
      </AppBar>
      <Content maxWidth="sm">
        <Card>
          <CardContent>Testing</CardContent>
        </Card>
        {hookUpUsersRoutes(path)}
      </Content>
    </Page>
  );
}
