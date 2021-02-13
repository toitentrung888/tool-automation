const HomePage = require("../pages/home.page");
const LoginPage = require("../pages/login.page");
let { numberTaskComplete, numberTaskNotComplete } = require("../data/Model");
const { iearns } = require("../data/Users");

describe("webdriver.io page", () => {
  context.skip("USER FILE", () => {
    it("Thực hiện nhận nhiệm vụ", () => {
      browser.maximizeWindow();

      for (let i = 0; i < iearns.length; i++) {
        try {
          LoginPage.open();
          LoginPage.login(iearns[i].username, iearns[i].password);

          let numberTaskOfDay = HomePage.getNumberTaskOfDay();

          HomePage.goToApplyTaskPage();

          numberTaskComplete = HomePage.getNumberTaskCompleteReceived(
            numberTaskOfDay
          ).length;
          if (numberTaskOfDay === numberTaskComplete) {
            continue;
          } else {
            HomePage.goToSubmissionTaskPage();
            numberTaskNotComplete = HomePage.getNumberTaskCompleteReceived(
              numberTaskOfDay
            ).length;
          }
          let remainNumberTask =
            numberTaskOfDay - (numberTaskComplete + numberTaskNotComplete);
          if (remainNumberTask > 0) {
            HomePage.goToFenleiPage();
            HomePage.receiveTask(numberTaskOfDay);
          }
        } catch (err) {
          console.log(`LỖI NHẬN NHIỆM VỤ: 0${iearns[i].username}`)
        }
      }
    });

    it("Thực hiện làm nhiệm vụ", () => {
      browser.maximizeWindow();
      LoginPage.loginTikTok();
      LoginPage.loginInstagram();
      LoginPage.loginYoutube();

      // LoginPage.loginFaceBook();

      for (let i = 0; i < iearns.length; i++) {
        try {
          LoginPage.open();
          LoginPage.login(iearns[i].username, iearns[i].password);
          HomePage.executeTask();
        } catch (e) {
          console.log(`LỖI THỰC HIỆN NHIỆM VỤ: 0${iearns[i].username}`)
        }
      }
    });
  })

  context("ACCOUNT INCREASE", () => {
    let phoneNumber = 0911111001;
    let loop = 400;
    it.skip("Thực hiện nhận nhiệm vụ", () => {
      browser.maximizeWindow();

      for (let i = 0; i < loop; i++) {
        try {
          LoginPage.open();
          LoginPage.login(`0${Number(phoneNumber) + i}`, "Abc1234@");

          let numberTaskOfDay = HomePage.getNumberTaskOfDay();

          HomePage.goToApplyTaskPage();

          numberTaskComplete = HomePage.getNumberTaskCompleteReceived(
            numberTaskOfDay
          ).length;
          if (numberTaskOfDay === numberTaskComplete) {
            continue;
          } else {
            HomePage.goToSubmissionTaskPage();
            numberTaskNotComplete = HomePage.getNumberTaskCompleteReceived(
              numberTaskOfDay
            ).length;
          }
          let remainNumberTask =
            numberTaskOfDay - (numberTaskComplete + numberTaskNotComplete);
          if (remainNumberTask > 0) {
            HomePage.goToFenleiPage();
            HomePage.receiveTask(numberTaskOfDay);
          }
        } catch (err) {
          console.log(`LỖI NHẬN NHIỆM VỤ: 0${Number(phoneNumber) + i}`)
        }
      }
    });

    it("Thực hiện nhiệm vụ", () => {
      browser.maximizeWindow();
      LoginPage.loginTikTok();
      LoginPage.loginInstagram();
      LoginPage.loginYoutube();

      // LoginPage.loginFaceBook();

      for (let i = 0; i < loop; i++) {
        try {
          LoginPage.open();
          LoginPage.login(`0${Number(phoneNumber) + i}`, "Abc1234@");
          HomePage.executeTask();
        } catch (e) {
          console.log(`LỖI THỰC HIỆN NHIỆM VỤ: 0${Number(phoneNumber) + i}`)
        }
      }
    });
  })

  context.skip("COMMON FUNCTION", () => {
    it("Register account", () => {
      browser.maximizeWindow();
      LoginPage.register();
    })
  });
});
