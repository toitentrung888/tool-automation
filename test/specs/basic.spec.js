const HomePage = require("../pages/home.page");
const LoginPage = require("../pages/login.page");

const Users = require("../data/Users");
const common = require("../util/common");

describe("webdriver.io page", () => {
  it("demo receive task", () => {
    browser.maximizeWindow();
    // LoginPage.loginTikTok();
    LoginPage.loginYoutube();
    LoginPage.loginFaceBook();
    LoginPage.loginInstagram();

    for (let i = 0; i < Users.length; i++) {
      LoginPage.open();
      LoginPage.login(Users[i].username, Users[i].password);

      HomePage.closePopupModelFadeShow();
      let numberTaskOfDay = HomePage.getNumberTaskOfDay();

      HomePage.goToApplyTaskPage();
      let taskCompleteReceived;
      let taskNOTCompleteReceived;

      taskCompleteReceived = HomePage.getNumberTaskCompleteReceived(
        numberTaskOfDay
      );
      if (numberTaskOfDay === taskCompleteReceived.length) {
        continue;
      } else {
        HomePage.goToSubmissionTaskPage();
        taskNOTCompleteReceived = HomePage.getNumberTaskCompleteReceived(
          numberTaskOfDay
        );
      }
      let remainNumberTask =
        numberTaskOfDay -
        (taskCompleteReceived.length + taskNOTCompleteReceived.length);
      let countNewTaskReceive = 0
      if (remainNumberTask > 0) {
        HomePage.goToFenleiPage();
        countNewTaskReceive = HomePage.receiveTask(remainNumberTask, common.getVip(numberTaskOfDay));
        HomePage.goToSubmissionTaskPage();
      }
      if (taskNOTCompleteReceived.length > 0 ||
        countNewTaskReceive > 0) {
        HomePage.executeTask(numberTaskOfDay - taskCompleteReceived.length);
      }
      console.log("Execute task complete");
    }
  });
});
