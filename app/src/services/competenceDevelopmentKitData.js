const { ValidationError } = require('yup');
const { findCdk, createCdk, updateCdk } = require('../db/query/cdks');
const employee = require('../competence_development_kit_data/employee/eicaa_cdk_employee_v6');
const student = require('../competence_development_kit_data/student/eicaa_cdk_student_v6');
const { getAssessmentTypesData } = require('./assessmentTypesData');

const upsertModule = async (cdkType, module, lastCreated) => {
  const { id, competenceID, competence, moduleName } = module;
  const { areas } = getAssessmentTypesData()[cdkType];
  let created = 0;
  let updated = 0;

  if (competenceID) {
    let [areaId, areaCompetenceId, difficulty] = competenceID.split('.');
    difficulty = difficulty.trim().toLowerCase();

    const cdkExists = await findCdk({ jsonId: id, cdkType });

    const area = areas[areaId]?.name;

    if (area) {
      try {
        const cdkInfo = {
          jsonId: id,
          cdkType,
          name: moduleName,
          area,
          competence,
          difficulty,
          lastCreated,
        };

        if (cdkExists) {
          if (lastCreated !== cdkExists.lastCreated) {
            await updateCdk(cdkExists.id, cdkInfo);
            updated++;
          }
        } else {
          await createCdk(cdkInfo);
          created++;
        }
      } catch (err) {
        if (!(err instanceof ValidationError)) {
          console.log(err);
        }
      }
    }
  }

  return { created, updated };
};

const upsertCdkMetadata = async (fileData) => {
  const { cdkType, cdkModules, lastCreated } = fileData;

  const upsertJobs = [];

  for (let module of cdkModules) {
    upsertJobs.push(upsertModule(cdkType, module, lastCreated));
  }

  const results = (await Promise.all(upsertJobs)).reduce(
    (acc, result) => {
      const { created, updated } = result;
      acc.created += created;
      acc.updated += updated;

      return acc;
    },
    { created: 0, updated: 0 },
  );

  console.log(`Competence Development Kit modules (${cdkType})`, JSON.stringify(results));
};

const processCdkMetadataFiles = async () => {
  const files = [student, employee];
  const processingFiles = [];

  for (let fileData of files) {
    processingFiles.push(upsertCdkMetadata(fileData));
  }

  return Promise.all(processingFiles);
};

module.exports = {
  processCdkMetadataFiles,
};
