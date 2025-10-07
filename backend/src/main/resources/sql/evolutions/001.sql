--liquibase formatted sql
--changeset adam.zimny:1 labels:DEV

--------------------------------------------
---------------Tables-----------------------
--------------------------------------------

-- If you are using PostgreSQL, you may need to enable the UUID extension
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


--rollback DROP TABLE account;