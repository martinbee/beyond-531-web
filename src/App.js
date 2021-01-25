import { useQuery, gql } from '@apollo/client';

import logo from './logo.svg';
import './App.css';

const GET_USERS = gql`
  query GetUsers {
    users {
      firstName
      lastName
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :(</p>;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello {data.users[0]?.firstName}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
