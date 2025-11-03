--liquibase formatted sql
--changeset adam.zimny:4 labels:DEV

ALTER TABLE vocabulary_entries
ADD COLUMN image_url VARCHAR(1024) DEFAULT NULL;

--rollback ALTER TABLE vocabulary_entries DROP COLUMN image_url;