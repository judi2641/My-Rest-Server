import { createApplication } from '../../../src/endpoints/degreeCourseApplications/ApplicationsService';
import { createUser } from '../../../src/endpoints/users/UserService';
import { IDegreeCourseDocument } from '../../../src/endpoints/degreeCourses/DegreeCourseModel';
import { createDegreeCourse } from '../../../src/endpoints/degreeCourses/DegreeCourseService';
import { IUserDocument } from '../../../src/endpoints/users/UserModel';
import { HttpError } from '../../../src/errors/HttpError';

describe('createApplication',() => {
  let user: IUserDocument;
  let degreeCourse: IDegreeCourseDocument;

  beforeEach(async () => {
    user = await createUser({
      userID: "juliusdittrich",
      firstName: "julius",
      lastName: "dittrich",
      password: "password",
      isAdministrator: false
    });

    degreeCourse = await createDegreeCourse({
      universityName: "Beuth Hochschule für Technik Berlin",
      universityShortName: "Beuth HS",
      departmentName: "Informatik und Medien",
      departmentShortName: "FB VI",
      name: "Orchideenzucht Bachelor",
      shortName: "OZ-BA"
    });
     
  });
  it('create valid application', async () => {
    const application = await createApplication({
      applicantUserID: "juliusdittrich",
      degreeCourseID: degreeCourse._id,
      targetPeriodYear: "2024",
      targetPeriodShortName: "WiSe"
    });
    expect(application.toObject()).toMatchObject({
      applicantUserID: "juliusdittrich",
      degreeCourseID: degreeCourse._id.toString(),
      targetPeriodYear: "2024",
      targetPeriodShortName: "WiSe",
      identifier: `juliusdittrich${degreeCourse._id.toString()}2024WiSe`
    });
  })

  it('create application which already exists', async () => {
    const application = await createApplication({
      applicantUserID: "juliusdittrich",
      degreeCourseID: degreeCourse._id,
      targetPeriodYear: "2024",
      targetPeriodShortName: "WiSe",
    });
    await expect(createApplication({
      applicantUserID: "juliusdittrich",
      degreeCourseID: degreeCourse._id,
      targetPeriodYear: "2024",
      targetPeriodShortName: "WiSe",
    })).rejects.toBeInstanceOf(HttpError);
  })

  it('create application for degreeCourse which does not exist', async () => {
    await expect(createApplication({
      applicantUserID: "juliusdittrich",
      degreeCourseID: "gibt es nicht",
      targetPeriodShortName: "WiSe",
      targetPeriodYear: "2025",
    })).rejects.toMatchObject({
      status: 404,
      message: "course not found"
    });
  });

  it('create application with a userID that does not exist', async () => {
    await expect(createApplication({
      applicantUserID: "manfredschreiben",
      degreeCourseID: degreeCourse._id,
      targetPeriodShortName: "WiSe",
      targetPeriodYear: "2025",
    })).rejects.toMatchObject({
      status: 404,
      message: "user not found"
    });
  });
});