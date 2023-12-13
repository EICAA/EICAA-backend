## Migrate

### Current approach

Structural changes of the database used on `staging` and `production` environment should be tracked carefully. To apply updates in these databases, SQL DDL scripts are generated for being executed by the MYSQL client.

### Possible future approach

The Migrations feature provided by knex can be considered suitable for use, but it is not configured yet.