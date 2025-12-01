



SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE feedback;
TRUNCATE TABLE notifications;
TRUNCATE TABLE messages;
TRUNCATE TABLE conversations;
TRUNCATE TABLE transactions;
TRUNCATE TABLE collaborations;
TRUNCATE TABLE project_participants;
TRUNCATE TABLE projects;
TRUNCATE TABLE skill_verifications;
TRUNCATE TABLE user_skills;
TRUNCATE TABLE skills;
TRUNCATE TABLE admins;
TRUNCATE TABLE students;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

UPDATE users 
SET password = '$2b$10$0O3h57RQW5wje7gZTTDN5.grTiO0hZQGES8KWQhDwUhQQiKhFD0ES'
WHERE user_type = 'student';

UPDATE users 
SET password = '$2b$10$MWaTxZDJR1wm86NIq.Fm/ulQgzhL1kWlFUMQYyw2Uhzp5LAEZFsEq'
WHERE user_type = 'admin';


use skill_Barter;
show tables;

select * from users;
select * from project_participants;
select * from projects;
select * from user_skills;
select * from feedback;


