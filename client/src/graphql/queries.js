export const ME_QUERY = `
  {
    me {
      _id
      name
      email
      picture
    }
  }
  `

export const GET_PINS_QUERY = `
  {
    getPins {
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
      comments {
        text
        createdAt
        author {
          _id
          name
          picture
        }
      }
    }
  }
`

export const GET_PINS_PROXIMITY_QUERY = (lat,lng, rng) => {

  console.log(lat,lng)

  return `
  {
    getPinsProximity(lat: ${lat},lng: ${lng}, rng: ${rng}) {
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
      comments {
        text
        createdAt
        author {
          _id
          name
          picture
        }
      }
    }
  }
  `
}