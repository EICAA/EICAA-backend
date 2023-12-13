const ASSESSMENT_FIELDS = [
  'name',
  'assessmentType',
  'activeFrom',
  'activeTo',
  'archived',
  'participants',
  'maxParticipants',
  'createdAt',
];

const MISC_FIELDS = ['country', 'language', 'createdAt', 'durationSeconds'];

const DEMOGRAPHICS_FIELDS_SENSITIVE = ['gender', 'educationLevel'];
const DEMOGRAPHICS_FIELDS_NOT_SENSITIVE = {
  employee: [
    'country',
    'workExperience',
    'workField',
    'organisationType',
    'organisationSize',
    'levelOfPosition',
    'ageGroup',
  ],
  student: [
    'country',
    'majorField',
    'hasWorkExperience',
    'workExperience',
    'employmentStatus',
    'employmentType',
    'ageGroup',
  ],
};

const DEMOGRAPHICS_FIELDS = {
  employee: [
    'country',
    'educationLevel',
    'workExperience',
    'workField',
    'organisationType',
    'organisationSize',
    'levelOfPosition',
    'gender',
    'ageGroup',
  ],
  student: [
    'country',
    'educationLevel',
    'majorField',
    'hasWorkExperience',
    'workExperience',
    'employmentStatus',
    'employmentType',
    'gender',
    'ageGroup',
  ],
};

module.exports = {
  ASSESSMENT_FIELDS,
  DEMOGRAPHICS_FIELDS,
  DEMOGRAPHICS_FIELDS_SENSITIVE,
  DEMOGRAPHICS_FIELDS_NOT_SENSITIVE,
  MISC_FIELDS,
};
