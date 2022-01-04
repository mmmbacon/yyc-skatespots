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
export const CREATE_NEW_USER_MUTATION = `
  mutation($email: String!, $password: String!, $username: String! ){
    createNewUser(input: {
      email: $email,
      password: $password,
      username: $username
    }){
      _id
      email
      username
    }
  }
`
export const LOGIN_MUTATION = `
  mutation($email: String!, $password: String!){
    loginUser(input: {
      email: $email,
      password: $password,
    }){
      _id
      email
      username
    }
  }
`
