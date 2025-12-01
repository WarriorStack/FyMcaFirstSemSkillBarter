ALTER TABLE collaborations
  ADD COLUMN conversation_id INT UNSIGNED DEFAULT NULL,
  ADD CONSTRAINT fk_collab_conversation
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

use skill_Barter;

-- Source - https://stackoverflow.com/a
-- Posted by Eemeli Kantola
-- Retrieved 2025-11-30, License - CC BY-SA 2.5

DESCRIBE table;
