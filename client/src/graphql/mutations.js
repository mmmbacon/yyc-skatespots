export const SIGN_UP_MUTATION = `
  mutation($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        name
        email
        picture
      }
    }
  }
`;

export const SIGN_IN_MUTATION = `
  mutation($login: String!, $password: String!) {
    signIn(login: $login, password: $password) {
      token
      user {
        _id
        username
        name
        email
        picture
      }
    }
  }
`;

export const CREATE_PIN_MUTATION = `
  mutation($title: String!, $image: String!, $content: String!, $latitude: Float!, $longitude: Float!){
    createPin(input: {
      title: $title,
      image: $image,
      content: $content,
      latitude: $latitude,
      longitude: $longitude
    }){
      _id
      createdAt
      title
      image
      content
      latitude
      longitude
      author {
        _id
        name
        email
        picture
      }
    }
  }
`
export const DELETE_PIN_MUTATION = `
  mutation($pinId: ID!) {
    deletePin(pinId: $pinId) {
      _id
    }
  }
`

export const CREATE_COMMENT_MUTATION = `
  mutation($pinId: ID!, $text: String!){
    createComment(pinId: $pinId, text: $text){
      _id
      createdAt
      title
      content
      image
      latitude
      longitude
      author {
        _id
        name
      }
      comments {
        text
        createdAt
        author {
          name
          picture
        }
      }
    }
  }
`