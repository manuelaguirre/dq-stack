dq-server

# Backend for DQ app

This app was built using MongoDB and Node.js (Express)

## API

### Themes 

#### POST

`company` is only allowed when `isPublic` is false. Trying to set a company otherwise wil result in an error. 

#### PUT

If `company` is set as an empty string in the request body, the corresponding company field in the database will be unset.   
