
# Manual migrations (previous)

Migrations already settled long before.

## Access to database

`docker exec -ti backend_express_eicaa_1 /bin/bash`

Container name may differ in non-development environments.

## List of advancing ("up") migrations

### before 2022.11.22.

```sql
use eicaa;

drop table `results_for_student`;

create table `results_for_student` (`id` int unsigned not null auto_increment primary key, `assessmentId` int unsigned, `email` varchar(255), `start` datetime default CURRENT_TIMESTAMP, `end` datetime default CURRENT_TIMESTAMP, `durationSeconds` int default '0', `language` varchar(255), `resultToken` varchar(255), `feedbackScore` tinyint, `feedbackText` text, `requestedRemoval` boolean default '0', `createdAt` datetime default CURRENT_TIMESTAMP, `higherEducation` varchar(255), `country` varchar(255), `educationLevel` varchar(255), `majorField` varchar(255), `majorFieldText` varchar(255), `educationMode` varchar(255), `enterpriseAction` varchar(255), `workExperience` varchar(255), `employmentStatus` varchar(255), `employmentType` varchar(255), `employmentFoundingYear` varchar(255), `employmentField` varchar(255), `employmentHours` varchar(255), `q1` tinyint, `q2` tinyint, `q3` tinyint, `q4` tinyint, `q5` tinyint, `q6` tinyint, `q7` tinyint, `q8` tinyint, `q9` tinyint, `q10` tinyint, `q11` tinyint, `q12` tinyint, `q13` tinyint, `q14` tinyint, `q15` tinyint, `q16` tinyint, `q17` tinyint, `q18` tinyint, `q19` tinyint, `q20` tinyint, `q21` tinyint, `q22` tinyint, `q23` tinyint, `q24` tinyint, `q25` tinyint, `q26` tinyint, `q27` tinyint, `q28` tinyint, `q29` tinyint, `q30` tinyint, `q31` tinyint, `q32` tinyint, `q33` tinyint, `q34` tinyint, `q35` tinyint, `q36` tinyint, `q37` tinyint, `q38` tinyint, `q39` tinyint, `q40` tinyint, `q41` tinyint, `q42` tinyint, `q43` tinyint, `q44` tinyint, `q45` tinyint, `q46` tinyint, `q47` tinyint, `q48` tinyint, `q49` tinyint, `q50` tinyint, `q51` tinyint, `q52` tinyint, `q53` tinyint, `q54` tinyint, `q55` tinyint, `q56` tinyint, `q57` tinyint, `q58` tinyint, `q59` tinyint, `q60` tinyint, `q61` tinyint, `q62` tinyint, `q63` tinyint, `q64` tinyint, `q65` tinyint, `q66` tinyint, `q67` tinyint, `q68` tinyint, `q69` tinyint, `q70` tinyint, `q71` tinyint, `q72` tinyint, `q73` tinyint, `q74` tinyint, `q75` tinyint, `q76` tinyint, `q77` tinyint, `q78` tinyint, `q79` tinyint);
alter table `results_for_student` add index `idx_rf_student_assessment_id`(`assessmentId`);
alter table `results_for_student` add constraint `fk_rf_student_assessment_id_to_assessments_id` foreign key (`assessmentId`) references `assessments` (`id`);

alter table `assessments` modify `activeFrom` datetime null, modify `activeTo` datetime null;
```


### 22V1122-0

```sql
use eicaa;

drop table `users`;

create table `users` (`id` int unsigned not null auto_increment primary key, `email` varchar(255), `lastName` varchar(255), `firstName` varchar(255), `password` varchar(255), `organization` varchar(255), `position` varchar(255), `role` varchar(255), `country` varchar(255), `languagePreference` varchar(255) default 'en', `resetPasswordToken` varchar(255), `deleted` boolean default '0', `createdAt` timestamp default CURRENT_TIMESTAMP);
alter table `users` add unique `idxu_users_email`(`email`);
alter table `users` add index `idx_password`(`password`);
alter table `users` add index `idx_reset_pw_token`(`resetPasswordToken`)


drop table `assessments`;

create table `assessments` (`id` int unsigned not null auto_increment primary key, `userId` int unsigned, `assessmentType` varchar(255), `name` varchar(255), `country` varchar(255), `emailRequired` boolean default '0', `demographics` boolean default '1', `shareResults` boolean default '0', `archived` boolean default '0', `activeFrom` datetime, `activeTo` datetime, `participants` int default '0', `maxParticipants` int, `createdAt` datetime default CURRENT_TIMESTAMP);
alter table `assessments` add index `idx_assessments_user_id`(`userId`);
alter table `assessments` add index `idx_assessments_assessment_type`(`assessmentType`)
alter table `assessments` add constraint `fk_assessments_user_id_to_users_id` foreign key (`userId`) references `users` (`id`);

drop table `results_for_student`;

create table `results_for_student` (`id` int unsigned not null auto_increment primary key, `assessmentId` int unsigned, `email` varchar(255), `start` datetime default CURRENT_TIMESTAMP, `end` datetime default CURRENT_TIMESTAMP, `durationSeconds` int default '0', `language` varchar(255), `resultToken` varchar(255), `feedbackScore` tinyint, `feedbackText` text, `requestedRemoval` boolean default '0', `createdAt` datetime default CURRENT_TIMESTAMP, `higherEducation` varchar(255), `country` varchar(255), `educationLevel` varchar(255), `majorField` varchar(255), `majorFieldText` varchar(255), `educationMode` varchar(255), `enterpriseAction` varchar(255), `workExperience` varchar(255), `employmentStatus` varchar(255), `employmentType` varchar(255), `employmentFoundingYear` varchar(255), `employmentField` varchar(255), `employmentHours` varchar(255), `q1` tinyint, `q2` tinyint, `q3` tinyint, `q4` tinyint, `q5` tinyint, `q6` tinyint, `q7` tinyint, `q8` tinyint, `q9` tinyint, `q10` tinyint, `q11` tinyint, `q12` tinyint, `q13` tinyint, `q14` tinyint, `q15` tinyint, `q16` tinyint, `q17` tinyint, `q18` tinyint, `q19` tinyint, `q20` tinyint, `q21` tinyint, `q22` tinyint, `q23` tinyint, `q24` tinyint, `q25` tinyint, `q26` tinyint, `q27` tinyint, `q28` tinyint, `q29` tinyint, `q30` tinyint, `q31` tinyint, `q32` tinyint, `q33` tinyint, `q34` tinyint, `q35` tinyint, `q36` tinyint, `q37` tinyint, `q38` tinyint, `q39` tinyint, `q40` tinyint, `q41` tinyint, `q42` tinyint, `q43` tinyint, `q44` tinyint, `q45` tinyint, `q46` tinyint, `q47` tinyint, `q48` tinyint, `q49` tinyint, `q50` tinyint, `q51` tinyint, `q52` tinyint, `q53` tinyint, `q54` tinyint, `q55` tinyint, `q56` tinyint, `q57` tinyint, `q58` tinyint, `q59` tinyint, `q60` tinyint, `q61` tinyint, `q62` tinyint, `q63` tinyint, `q64` tinyint, `q65` tinyint, `q66` tinyint, `q67` tinyint, `q68` tinyint, `q69` tinyint, `q70` tinyint, `q71` tinyint, `q72` tinyint, `q73` tinyint, `q74` tinyint, `q75` tinyint, `q76` tinyint, `q77` tinyint, `q78` tinyint, `q79` tinyint);
alter table `results_for_student` add index `idx_rf_student_assessment_id`(`assessmentId`)
alter table `results_for_student` add constraint `fk_rf_student_assessment_id_to_assessments_id` foreign key (`assessmentId`) references `assessments` (`id`);
```


### 22V1125-0

```sql
use eicaa;

drop table `results_for_student`;

create table `results_for_student` (`id` int unsigned not null auto_increment primary key, `assessmentId` int unsigned, `email` varchar(255), `start` datetime default CURRENT_TIMESTAMP, `end` datetime default CURRENT_TIMESTAMP, `durationSeconds` int default '0', `language` varchar(255), `resultToken` varchar(255), `feedbackScore` tinyint, `feedbackText` text, `requestedRemoval` boolean default '0', `createdAt` datetime default CURRENT_TIMESTAMP, `country` varchar(255), `educationLevel` varchar(255), `majorField` varchar(255), `hasWorkExperience` varchar(255), `workExperience` varchar(255), `employmentStatus` varchar(255), `employmentType` varchar(255), `gender` varchar(255), `ageGroup` varchar(255), `q1` tinyint, `q2` tinyint, `q3` tinyint, `q4` tinyint, `q5` tinyint, `q6` tinyint, `q7` tinyint, `q8` tinyint, `q9` tinyint, `q10` tinyint, `q11` tinyint, `q12` tinyint, `q13` tinyint, `q14` tinyint, `q15` tinyint, `q16` tinyint, `q17` tinyint, `q18` tinyint, `q19` tinyint, `q20` tinyint, `q21` tinyint, `q22` tinyint, `q23` tinyint, `q24` tinyint, `q25` tinyint, `q26` tinyint, `q27` tinyint, `q28` tinyint, `q29` tinyint, `q30` tinyint, `q31` tinyint, `q32` tinyint, `q33` tinyint, `q34` tinyint, `q35` tinyint, `q36` tinyint, `q37` tinyint, `q38` tinyint, `q39` tinyint, `q40` tinyint, `q41` tinyint, `q42` tinyint, `q43` tinyint, `q44` tinyint, `q45` tinyint, `q46` tinyint, `q47` tinyint, `q48` tinyint, `q49` tinyint, `q50` tinyint, `q51` tinyint, `q52` tinyint, `q53` tinyint, `q54` tinyint, `q55` tinyint, `q56` tinyint, `q57` tinyint, `q58` tinyint, `q59` tinyint, `q60` tinyint, `q61` tinyint, `q62` tinyint, `q63` tinyint, `q64` tinyint, `q65` tinyint, `q66` tinyint, `q67` tinyint, `q68` tinyint, `q69` tinyint, `q70` tinyint, `q71` tinyint, `q72` tinyint, `q73` tinyint, `q74` tinyint, `q75` tinyint, `q76` tinyint, `q77` tinyint, `q78` tinyint, `q79` tinyint);
alter table `results_for_student` add index `idx_rf_student_assessment_id`(`assessmentId`)
alter table `results_for_student` add constraint `fk_rf_student_assessment_id_to_assessments_id` foreign key (`assessmentId`) references `assessments` (`id`);
```


### 22V1128-0

```sql
use eicaa;
alter table `assessments` modify maxParticipants int null, add availableLanguages varchar(255) null;
```


### 22V1219-0

```sql
use eicaa;
alter table `results_for_student` add `consentGiven` boolean null;
alter table `users` add `consentGiven` boolean null;
```