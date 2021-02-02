const Page = require("./page");
const { timeoutLoadComp } = require("../constant");

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
  /**
   * define selectors using getter methods
   */
  get wrapperPassport() {
    return $('[class="wrapper passport"]');
  }
  get inputUsername() {
    return $("#inputEmail");
  }
  get inputPassword() {
    return $("#inputPassword");
  }
  get btnSubmit() {
    return $(
      '[class="btn btn-default btn-lg btn-rounded shadow btn-block login"]'
    );
  }
  get modelPage() {
    return $('[class="modal-open"]');
  }
  get modelFadeShow() {
    return $('[class="modal fade in tanchuang show"]');
  }
  get closeModelFadeShowBtn() {
    return $('[class="close close-rounded tanchuangClose"]');
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
    return $(
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

  /**
   * a method to encapsule automation code to interact with the page
   * e.g. to login using username and password
   */

  loginTikTok(username, password) {
    browser.url("https://www.tiktok.com/vi-VN/");
    this.loginTikTokButton.click();
    browser.pause(2000);

    // switch iframe
    browser.switchToFrame(this.iframeLoginTikTok);
    this.buttonLoginByFBInTikTok.click();
    browser.pause(2000);

    let windows = browser.getWindowHandles();
    browser.switchToWindow(windows[1]);
    if (this.inputEmailLoginFB.isExisting()) {
      this.inputEmailLoginFB.setValue("yihoda9179@serohiv.com");
    }
    this.inputLoginFB.setValue("qwe123!");
    this.submitLoginFB.click();
    browser.pause(5000);

    browser.switchToWindow(windows[0]);
    browser.pause(2000);
  }

  login(username, password) {
    this.inputUsername.setValue(username);
    this.inputPassword.setValue(password);
    this.btnSubmit.click();
    this.modelPage.waitForDisplayed({ timeout: timeoutLoadComp });
    this.modelFadeShow.waitForDisplayed({ timeout: timeoutLoadComp });
  }

  loginFaceBook() {
    browser.url("https://www.facebook.com/");

    const username = $('[data-testid="royal_email"]');
    const password = $('[data-testid="royal_pass"]');
    const loginButton = $('[data-testid="royal_login_button"]');

    username.waitForDisplayed({ timeout: timeoutLoadComp });
    // username.setValue('yihoda9179@serohiv.com')
    // password.setValue('qwe123!')
    username.setValue("0867574219");
    password.setValue("Abc1234@");
    loginButton.click();
    this.htmlFacebook.waitForDisplayed({ timeout: timeoutLoadComp });
  }

  loginInstagram() {
    browser.url("https://www.instagram.com/accounts/login/");

    const loginForm = $('[id="loginForm"]');
    const username = loginForm.$('[name="username"]');
    const password = loginForm.$('[name="password"]');
    const loginButton = loginForm.$('[type="submit"]');

    loginForm.waitForDisplayed({ timeout: timeoutLoadComp });
    username.setValue("0867574219");
    password.setValue("Abc1234@");
    loginButton.click();
    this.htmlInstagram.waitForDisplayed({ timeout: timeoutLoadComp });
    browser.pause(5000);
    // if ($('[role="presentation"]').$('[role="dialog"]').isDisplayed()) {
    //     $('[role="presentation"]').$('[role="dialog"]').$$('button')[1].click()
    // }
  }

  loginYoutube() {
    browser.url(
      "https://accounts.google.com/signin/v2/identifier?service=youtube&uilel=3&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26hl%3Den%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252Faccount_advanced%253Fhl%253Dvi%26feature%3Dredirect_login&hl=en&flowName=GlifWebSignIn&flowEntry=ServiceLogin"
    );
    const formLogin = $('[id="initialView"]');
    const username = formLogin.$("input");

    formLogin.waitForDisplayed({ timeout: timeoutLoadComp });
    username.setValue("letrung27012021@gmail.com");
    browser.keys("\uE007");
    const password = formLogin
      .$('[id="view_container"]')
      .$('[id="password"]')
      .$("input");
    password.waitForDisplayed({ timeout: timeoutLoadComp });
    password.setValue("Abc1234@");
    browser.keys("\uE007");
    this.htmlYoutube.waitForDisplayed({ timeout: timeoutLoadComp });
  }

  /**
   * overwrite specifc options to adapt it to page object
   */
  open() {
    super.open("/index.php/Home/Public/login.html");
    browser.pause(2000);
    this.wrapperPassport.waitForDisplayed({ timeout: timeoutLoadComp });
  }

  /**
   * overwrite specifc options to adapt it to page object
   */
  close() {
    super.close();
  }
}

module.exports = new LoginPage();
