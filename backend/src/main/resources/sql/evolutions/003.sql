--liquibase formatted sql
--changeset adam.zimny:3 labels:DEV

ALTER TABLE game_session
    ADD COLUMN winning_side VARCHAR(1)
        CHECK (winning_side IN ('X', 'O', 'NULL'))
        DEFAULT NULL,
    ADD COLUMN won_coordinates TEXT
        DEFAULT NULL;

--rollback ALTER TABLE game_session DROP COLUMN winning_side;
--rollback ALTER TABLE game_session DROP COLUMN won_coordinates;