const Page = require("./page");
const { timeoutLoadComp, host } = require("../constant");
const { facebook, youtube } = require("../data/Users")
const FormRegisterAccount = require("../data/FormRegisterAccount")
const CookiesFacebook = require("../data/CookiesFacebook");

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
  /**
   * define selectors using getter methods
   */
  get wrapperPassport() {
    return $("//div[contains(@class, 'wrapper passport')]");
  }
  get inputUsername() {
    return this.wrapperPassport.$("//input[contains(@id, 'inputEmail')]");
  }
  get inputPassword() {
    return this.wrapperPassport.$("//input[contains(@id, 'inputPassword')]");
  }
  get btnSubmit() {
    return this.wrapperPassport.$("//button[contains(@class, 'login')]")
  }
  get modelOpen() {
    return $("//body[contains(@class, 'modal-open')]");
  }
  get confirmClosePopupBtn() {
    return this.modelOpen.$("//div[contains(@class, 'modal-content')]").$("//div[contains(@class, 'modal-footer')]").$('button')
  }
  get htmlFacebook() {
    return $('[id="facebook"]');
  }
  get htmlInstagram() {
    return $('[id="react-root"]').$('[placeholder="Search"]');
  }
  get htmlYoutube() {
    return $('[id="search-form"]');
  }

  get loginTikTokButton() {
    return $('[id="main"]')
      .$('//div[contains(@class, "header-content")]')
      .$(
        "//div[contains(@class,'menu-right')]//button[contains(@class,'login-button')]"
      );
  }

  get formLogin() {
    return $("//div[contains(@class,'tiktok-app-container')]");
  }

  get buttonLoginByFBInTikTok() {
    return $("//div[contains(text(),'Đăng nhập bằng Facebook')]");
  }

  get inputLoginFB() {
    return $("//input[contains(@type,'password')]");
  }

  get inputEmailLoginFB() {
    return $("//input[contains(@name,'email')]");
  }

  get submitLoginFB() {
    return $("//input[contains(@type,'submit')]");
  }

  get iframeLoginTikTok() {
    return $("//iframe[contains(@class, 'jsx')]");
  }

  get homePage() {
    return $("//div[contains(@class, 'homepage')]");
  }

  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */

  loginTikTok(username, password) {
    browser.url("https://www.tiktok.com/vi-VN/");
    this.loginTikTokButton.waitForDisplayed({ timeout: timeoutLoadComp });
    this.loginTikTokButton.click();

    // switch iframe
    $('//div[contains(@class, "login-frame-container")]')
      .$("iframe")
      .waitForDisplayed({ timeout: timeoutLoadComp });
    browser.switchToFrame(this.iframeLoginTikTok);
    this.buttonLoginByFBInTikTok.click();
    browser.waitUntil(() => browser.getWindowHandles().length === 2, {
      timeout: timeoutLoadComp,
    });

    let windows = browser.getWindowHandles();
    browser.switchToWindow(windows[1]);
    if (this.inputEmailLoginFB.isExisting()) {
      // this.inputEmailLoginFB.setValue("yihoda9179@serohiv.com");
      this.inputEmailLoginFB.setValue(facebook.username);
    }
    // this.inputLoginFB.setValue("qwe123!");
    this.inputLoginFB.setValue(facebook.password);
    this.submitLoginFB.click();
    browser.waitUntil(() => browser.getWindowHandles().length === 1, {
      timeout: timeoutLoadComp,
    });

    browser.switchToWindow(windows[0]);
    browser.waitUntil(
      () => $('[id="main"]').$('//div[contains(@class, "header-content")]').$('//div[contains(@class, "menu-right")]').$('//div[contains(@class, "profile")]').isExisting(),
      { timeout: timeoutLoadComp }
    )
  }

  /**
   * overwrite specifc options to adapt it to page object
   */
  open() {
    super.open("/index.php/Home/Public/login.html");
    this.inputUsername.waitForDisplayed({ timeout: timeoutLoadComp });
    this.inputPassword.waitForDisplayed({ timeout: timeoutLoadComp });
    this.btnSubmit.waitForDisplayed({ timeout: timeoutLoadComp });
  }

  login(username, password) {
    this.inputUsername.setValue(username);
    this.inputPassword.setValue(password);
    this.btnSubmit.click();
    this.confirmClosePopupBtn.isDisplayed()
    this.closePopupNotify()
  }

  closePopupNotify() {
    browser.pause(2000);
    this.confirmClosePopupBtn.click();
    browser.waitUntil(() => !this.modelOpen.isExisting(),
      { timeout: timeoutLoadComp }
    );
  }

  loginFaceBook() {
    browser.url("https://www.facebook.com/");

    const loginForm = $('[data-testid="royal_login_form"]');
    const usernameInp = loginForm.$('[data-testid="royal_email"]');
    const passwordInp = loginForm.$('[data-testid="royal_pass"]');
    const loginButton = loginForm.$('[data-testid="royal_login_button"]');

    usernameInp.waitForDisplayed({ timeout: timeoutLoadComp });
    passwordInp.waitForDisplayed({ timeout: timeoutLoadComp });
    loginButton.waitForDisplayed({ timeout: timeoutLoadComp });

    const { username, password } = facebook;
    // username.setValue('yihoda9179@serohiv.com')
    // password.setValue('qwe123!')
    usernameInp.setValue(username);
    passwordInp.setValue(password);
    loginButton.click();
    this.htmlFacebook.waitForDisplayed({ timeout: timeoutLoadComp });
  }

  loginInstagram() {
    browser.url("https://www.instagram.com/accounts/login/");

    // const loginForm = $('[id="loginForm"]');
    // const username = loginForm.$('[name="username"]');
    // const password = loginForm.$('[name="password"]');
    // const loginButton = loginForm.$('[type="submit"]');

    // username.waitForDisplayed({ timeout: timeoutLoadComp });
    // password.waitForDisplayed({ timeout: timeoutLoadComp });
    // loginButton.waitForDisplayed({ timeout: timeoutLoadComp });
    // username.setValue("0867574219");
    // password.setValue("Abc1234@");
    // loginButton.click();
    $('[id="react-root"]')
      .$("main")
      .$("button")
      .waitForDisplayed({ timeout: timeoutLoadComp });
    $('[id="react-root"]').$("main").$("button").click();
    // browser.waitUntil(() => !loginByFbBtn.isDisplayed() && !loginByFbBtn.isExisting());
    // $('[id="platformDialogForm"]').$('[name="__CONFIRM__"]').waitForDisplayed({ timeout: timeoutLoadComp });
    // $('[id="platformDialogForm"]').$('[name="__CONFIRM__"]').click()
    this.htmlInstagram.waitForDisplayed({ timeout: timeoutLoadComp });
  }

  loginYoutube() {
    browser.url(
      "https://accounts.google.com/signin/v2/identifier?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252Faccount_advanced%253Fhl%253Dvi%26feature%3Dredirect_login&hl=en&flowName=GlifWebSignIn&flowEntry=ServiceLogin"
    );
    const formLogin = $('[id="initialView"]');
    const usernameInp = formLogin.$("input");

    formLogin.waitForDisplayed({ timeout: timeoutLoadComp });
    usernameInp.waitForDisplayed({ timeout: timeoutLoadComp });

    const { username, password } = youtube;
    usernameInp.setValue(username);
    browser.keys("\uE007");
    const passwordInp = formLogin
      .$('[id="view_container"]')
      .$('[id="password"]')
      .$("input");
    passwordInp.waitForDisplayed({ timeout: timeoutLoadComp });
    passwordInp.setValue(password);
    browser.keys("\uE007");
    this.htmlYoutube.waitForDisplayed({ timeout: timeoutLoadComp });
  }

  /**
   * overwrite specifc options to adapt it to page object
   */
  close() {
    super.close();
  }

  register() {
    const { phoneNumber, number, yaoqing, nickname, password, repassword, captcha } = FormRegisterAccount
    for (let i = 0; i < number; i++) {
      try {
        browser.url(`${host}/index.php/Home/Public/reg.html`);
        let formReg = $('[class="container"]');
        formReg.waitForDisplayed({ timeout: timeoutLoadComp });

        console.log(`ĐANG ĐĂNG KÝ TÀI KHOẢN ${Number(phoneNumber) + i}`)

        let phoneInput = formReg
          .$('[class="row no-gutters login-row"]')
          .$('[name="username"]');
        let nicknameInput = formReg
          .$('[class="row no-gutters login-row"]')
          .$('[name="nickname"]');
        let passwordInput = formReg
          .$('[class="row no-gutters login-row"]')
          .$('[name="password"]');
        let repasswordInput = formReg
          .$('[class="row no-gutters login-row"]')
          .$('[name="repassword"]');
        let captchaInput = formReg
          .$('[class="row no-gutters login-row"]')
          .$('[name="captcha"]');
        let yaoqingInput = formReg
          .$('[class="row no-gutters login-row"]')
          .$('[name="yaoqing"]');
        let confirmBtn = formReg.$('[class="bg-default"]').$("a=xác nhận");

        phoneInput.waitForDisplayed({ timeout: timeoutLoadComp });
        nicknameInput.waitForDisplayed({ timeout: timeoutLoadComp });
        passwordInput.waitForDisplayed({ timeout: timeoutLoadComp });
        repasswordInput.waitForDisplayed({ timeout: timeoutLoadComp });
        captchaInput.waitForDisplayed({ timeout: timeoutLoadComp });
        yaoqingInput.waitForDisplayed({ timeout: timeoutLoadComp });
        confirmBtn.waitForDisplayed({ timeout: timeoutLoadComp });

        phoneInput.setValue(`0${Number(phoneNumber) + i}`);
        nicknameInput.setValue(nickname);
        passwordInput.setValue(password);
        repasswordInput.setValue(repassword);
        yaoqingInput.setValue(yaoqing);
        captchaInput.setValue(captcha);

        $('[class="dialog dialog-open dialog-notice"]').waitForDisplayed({
          timeout: 1800000,
        });
        $('[class="dialog dialog-open dialog-notice"]')
          .$('[class="dialog-content"]')
          .waitForDisplayed({ timeout: 1800000 });
        $('[class="dialog dialog-open dialog-notice"]')
          .$('[class="dialog-content"]')
          .$("span")
          .waitForDisplayed({ timeout: 1800000 });

        let isInProcess = true;
        let isError = false;
        while (isInProcess) {
          if (
            $('[class="dialog dialog-open dialog-notice"]')
              .$('[class="dialog-content"]')
              .$("span")
              .getText().toUpperCase() === "THÀNH CÔNG"
          ) {
            isInProcess = false;
          } else if (
            $('[class="dialog dialog-open dialog-notice"]')
              .$('[class="dialog-content"]')
              .$("span")
              .getText().toUpperCase() === "GHI CHÉP"
          ) {
            isError = true;
            isInProcess = false;
          }
        }
        if (isError) {
          throw Error(
            `Tài khoản 0${Number(phoneNumber) + i} đăng ký không thành công`
          );
        }

        console.log(`Tài khoản 0${Number(phoneNumber) + i} đăng ký thành công`);
        this.confirmClosePopupBtn.isDisplayed()
        this.closePopupNotify();

        browser.url(`${host}/index.php/Home/Public/logout.html`);
        this.inputUsername.waitForDisplayed({ timeout: timeoutLoadComp });
        this.inputPassword.waitForDisplayed({ timeout: timeoutLoadComp });
      } catch (err) {
        console.log(`LỖI ĐĂNG KÝ TÀI KHOẢN ${Number(phoneNumber) + i}`)
      }
    }
  }
}

module.exports = new LoginPage();
