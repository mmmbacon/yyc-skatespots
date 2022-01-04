const { gql } = require('apollo-server');

module.exports = gql`
type User {
  _id: ID
  username: String
  name: String
  email: String
  password: String
  picture: String
}

type Pin {
  _id: ID
  createdAt: String
  title: String
  content: String
  image: String
  latitude: Float
  longitude: Float
  author: User
  comments: [Comment]
}

type Comment {
  text: String
  createdAt: String
  author: User
}

input CreatePinInput {
  title: String
  image: String
  content: String
  latitude: Float
  longitude: Float
}

input CreateUserInput {
  username: String
  email: String
  password: String
}

input LoginUser {
  email: String
  password: String
}

type Query {
  me: User
  getPins: [Pin!]
  getPinsProximity(
    lat: Float = 0.0, 
    lng: Float = 0.0,
    rng: Float = 0.0
  ): [Pin!]
}

type Mutation {
  createPin(input: CreatePinInput!): Pin
  deletePin(pinId: ID!): Pin
  createComment(pinId: ID!, text: String!): Pin
  createNewUser(input: CreateUserInput): User
  loginUser(input: LoginUser): User
}

type Subscription {
  pinAdded: Pin
  pinDeleted: Pin
  pinUpdated: Pin
}

`;
