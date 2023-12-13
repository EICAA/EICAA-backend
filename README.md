# Backend for EICAA

The backend application is based on `Node.js`, which is a very well established and popular choice for application development in JavaScript.

## Technology used

### `express`

This library provides us all the features, which is essential for implementing the server application. Handling all the requests and responding is done by various routers and middlewares.

### `knex`

This library helps formalizing data definition and queries against relational database management systems (RDBMS) - various clients are supported, in our case, we opted to use the `mysql2` client. Using this library provided us an efficient and flexible layer above SQL, which respects each supported RDBMS's feature set.

### Database

The requirements suggested the usage of MySQL, which is a RDBMS with a suitable feature set. Only a few tables are used, no views and stored procedures. Relation integrity and efficient access of data is important, so the table relations are enforced with foreign keys.

## Application structure

### Top level
```
/app - Dependencies and application source code
/database_data - the data folder for the MySQL server hosted within Docker 
.env.example - An example for the .env file used by the application (please make a copy named .env, and edit contents there)
.gitlab-ci.yml - Descriptor for the GitLab CI/CD pipeline
docker-compose.yaml - service descriptor file for usage with Docker
Dockerfile.deploy - descriptor for deployment Docker image build
Dockerfile.develop - descriptor for development Docker image build
```

### `/app` - Dependencies and application source code
```
/node_modules - source codes for all resolved remote dependencies 
/src - application source code
appInit.js
    - small script to be run separately for initializing randomized values
    - result must be hand copied to a few variables in .env (one value for one variable)
package.json - Node.js application scripts and dependencies destriptor
server.js - Application entry-point
yarn.lock - Lockfile for yarn package manager (`yarn` gives better, less ambiguous results on dependency resolutions than `npm`)
```

### `/app/src` - Application source code
```
/assessment_type_data
    - JSON files, which store text information for each AssessmentType
    - direct subfolders are named for the AssessmentType, which contain language code named JSON files with information for the given language
/controllers
/db - Database related functions (completely relying on `knex` features)
/middlewares - functions executed before or after controller functions of all, or a subset of routes
/routes - code for creating API endpoints, resolved by routers, handled by middleware and controller functions
/services - functions not used by API endpoints
/utils - utility functions for handle emailing and pre-insert validation
app.js
    - initializing of the Express application
    - mounting middlewares for the whole application
    - mouting routers
```

### `/app/src/db` - Database related functions (completely relying on `knex` features)
```
/query - Functions for querying the data tables conveniently from the controllers
/schema - Functions for executing data definition language of each tables (create, drop)
config.js - configuration for Knex database connection
```

## Configuration

### Installation
### Development

sudo docker-compose up --build express_eicaa

### Deployment

## Data handling

### Data deletion FAQ

Q: What will happen, when a Participant requests deletion of his/her Result?

A: The Result data stays in place, however, it is not presented or retrieved in any form for the User.

Q: What will happen, when an User requests deletion of a specific Assessment he/she owns?

A: The User should be warned, that this action is irreversible. After confirmation, the Assessment should be disowned - the related userId in the database is removed, so it will be inaccessible by the user, but the data (and the related Results) stay in place.

Q: What will happen, when an User requests deletion of his/her account?

A: The User should be warned, that this action is irreversible. After confirmation, all Assessments of the User should be disowned (same process as above for each), then the User is set to be deleted, so future authentication attempts will fail.

