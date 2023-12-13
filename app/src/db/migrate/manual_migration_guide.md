
# Manual migrations

Migrations to be executed (or just completed) in all non-development environments.

## Access to database

`docker exec -ti backend_express_eicaa_1 /bin/bash`

Container name may differ in non-development environments.

## List of advancing ("up") migrations

### 23V0309-0

```sql
use eicaa;
alter table `assessments` add `hash` varchar(255);
alter table `assessments` add index `idx_assessments_hash`(`hash`);
```