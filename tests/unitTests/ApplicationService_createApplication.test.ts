import { createApplication } from '../../src/endpoints/degreeCourseApplications/ApplicationsService';
import { createUser } from '../../src/endpoints/users/UserService';
import mongoose from 'mongoose';
import { DegreeCourseModel, IDegreeCourseDocument } from '../../src/endpoints/degreeCourses/DegreeCourseModel';
import { createDegreeCourse } from '../../src/endpoints/degreeCourses/DegreeCourseService';
import { IUserDocument } from '../../src/endpoints/users/UserModel';

describe('createApplication',() => {
  let user: IUserDocument;
  let degreeCourse: IDegreeCourseDocument;

  beforeAll(async () => {
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
      degreeCourseID: degreeCourse._id.toString(),
      targetPeriodYear: "2024",
      targetPeriodShortName: "WiSe",
      identifier: ""
    });
    expect(application).toBeDefined();
    expect(application.applicantUserID).toBe("juliusdittrich");
    expect(application.degreeCourseID.toString()).toBe(degreeCourse._id.toString());
    expect(application.targetPeriodYear).toBe("2024");
    expect(application.targetPeriodShortName).toBe("WiSe");
    expect(application.identifier).toBe(`juliusdittrich${degreeCourse._id.toString()}2024WiSe`);
  })

});