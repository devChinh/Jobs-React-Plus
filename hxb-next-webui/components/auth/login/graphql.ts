import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      token
    }
  }
`;

export const LOGIN_AUTH0_MUTATION = gql`
  mutation LoginAuth0($auth0Input: Auth0Input!) {
    loginAuth0(auth0Input: $auth0Input) {
      token
    }
  }
`;


export const SIGNUP_AUTH0 = gql`
  mutation SignUpAuth0($auth0Input: Auth0Input!) {
  signUpAuth0(auth0Input: $auth0Input) {
    token
  }
  }
`;
