import { createUser } from "../../../src/endpoints/users/UserService";
import { createDegreeCourse } from "../../../src/endpoints/degreeCourses/DegreeCourseService";
import { createApplication, deleteApplication, getApplicationByID } from "../../../src/endpoints/degreeCourseApplications/ApplicationsService";
import { IUserDocument } from "../../../src/endpoints/users/UserModel";
import { IDegreeCourseDocument } from "../../../src/endpoints/degreeCourses/DegreeCourseModel";
import { IApplication } from "../../../src/endpoints/degreeCourseApplications/ApplicationModel";

describe("deleteApplication", () => {
    let user: IUserDocument;
    let degreeCourse: IDegreeCourseDocument;
    let application: IApplication;

    beforeAll(async() => {
        await createUser({
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

        application = await createApplication({
            applicantUserID: "juliusdittrich",
            degreeCourseID: degreeCourse._id.toString(),
            targetPeriodYear: "2024",
            targetPeriodShortName: "WiSe"
        });
    })

    it("delete application and try to delete the application again", async () => {
        await deleteApplication(application._id.toString());
        //application still in database?
        await expect(getApplicationByID(application._id.toString())).rejects.toMatchObject({
            status: 404,
            message: "application not found"
        });
        await expect(deleteApplication(application._id.toString())).rejects.toMatchObject({
            status: 404,
            message: "application not found"
        })
    });
})