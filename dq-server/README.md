dq-server

# Backend for DQ app

This app was built using MongoDB and Node.js (Express)

## API

### Themes 

#### POST

`company` is only allowed when `isPublic` is false. Trying to set a company otherwise wil result in an error. 

#### PUT

If `company` is set as an empty string in the request body, the corresponding company field in the database will be unset.

### Questions

#### PUT

Every text field can be modified sending a PUT Request with the updated entity in the body

For updating images, you should send a `multipart/form-data` PUT request to the `/api/questions/<questionID>/image` endpoint, server will respond with 201 if the question didn't previously have an image, or with 200 if an existing image was replaced.
