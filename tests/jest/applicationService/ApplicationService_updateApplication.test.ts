import { IApplication } from "../../../src/endpoints/degreeCourseApplications/ApplicationModel";
import { IDegreeCourseDocument } from "../../../src/endpoints/degreeCourses/DegreeCourseModel";
import { IUserDocument } from "../../../src/endpoints/users/UserModel";
import { createUser } from "../../../src/endpoints/users/UserService";
import { createDegreeCourse } from "../../../src/endpoints/degreeCourses/DegreeCourseService";
import { createApplication, updateApplication } from "../../../src/endpoints/degreeCourseApplications/ApplicationsService";


describe("updateApplication", () => {
    let user: IUserDocument;
    let degreeCourse: IDegreeCourseDocument;
    let application: IApplication;

    beforeEach(async () => {
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
    });

    it("change year and targetPeriodShortName", async () => {
        const updatedApplication = await updateApplication(application._id.toString(),{
            targetPeriodYear: "2025",
            targetPeriodShortName: "SoSe"
        });
        console.log(degreeCourse._id.toString());
        expect(updatedApplication.toObject()).toMatchObject({
            applicantUserID: "juliusdittrich",
            degreeCourseID: degreeCourse._id.toString(),
            targetPeriodYear: "2025",
            targetPeriodShortName: "SoSe",
            identifier: `juliusdittrich${degreeCourse._id.toString()}2025SoSe`
        });
        console.log(degreeCourse._id.toString());
    });

    it("change application in a application which already exists", async () => {
        await createApplication({
            applicantUserID: "juliusdittrich",
            degreeCourseID: degreeCourse._id.toString(),
            targetPeriodYear: "2026",
            targetPeriodShortName: "SoSe"
        });
        await expect(updateApplication(application._id.toString(),{
            targetPeriodYear: "2026",
            targetPeriodShortName: "SoSe"
        })).rejects.toMatchObject({
            status: 400,
            message: "An application already exists"
        });
    });
})