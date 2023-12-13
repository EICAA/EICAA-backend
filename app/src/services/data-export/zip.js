var AdmZip = require('adm-zip');

const createAssessmentResultsZipFile = async (files) => {
  const zip = new AdmZip();

  for (let file of files) {
    const { data, name } = file;

    zip.addFile(name, data);
  }

  return zip.toBufferPromise();
};

module.exports = {
  createAssessmentResultsZipFile,
};
