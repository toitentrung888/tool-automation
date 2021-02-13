const Page = require("./page");
const { host, timeoutLoadComp } = require("../constant");
const common = require("../util/common");
const TypeTask = require("./../data/TypeTask");
let {
  numberTaskComplete,
  numberTaskNotComplete,
  listImageScreenShot,
  listURLTask,
} = require("../data/Model");

/**
 * sub page containing specific selectors and methods for a specific page
 */
class HomePage extends Page {
  /**
   * define selectors using getter methods
   */
  get containerTask() {
    return $("//div[contains(@class, 'homepage')]");
  }
  get renwuliebiao() {
    return this.containerTask.$("//div[contains(@class, 'renwuliebiao_a')]");
  }
  get layersection() {
    return $('[class="layui-m-layermain"]')
      .$('[class="layui-m-layersection"]')
      .$('[class="layui-m-layercont"]');
  }
  get layercont() {
    return $('[class="layui-m-layercont"]').getText();
  }
  get layerbtn() {
    return $('[class="layui-m-layerbtn"]');
  }

  // fb
  get watchFeed() {
    return $('[id="watch_feed"]').$("div:first-child").$("div:first-child");
  }
  get likeAriaLabel() {
    return this.watchFeed.$('[aria-label="Thích"]');
  }
  get unLikeAriaLabel() {
    return this.watchFeed.$('[aria-label="Gỡ Thích"]');
  }

  // youtube
  get pageManager() {
    return $('[id="page-manager"]');
  }
  get likeBtn() {
    return this.pageManager
      .$('[id="info"]')
      .$('[id="menu-container"]')
      .$("ytd-toggle-button-renderer")
      .$('[class="style-scope ytd-toggle-button-renderer style-text"]');
  }
  get subscribeBtn() {
    return this.pageManager
      .$('[id="meta-contents"]')
      .$('[id="subscribe-button"]')
      .$("paper-button");
  }

  getNumberTaskOfDay() {
    let result = 0;
    let listInfo = $('[class="row text-center mt-1"]').$$(
      '[class="card-body"]'
    );
    for (let i = 0; i < listInfo.length; i++) {
      if (
        listInfo[i]
          .$('[class="text-secondary text-mute small"]')
          .getText()
          .toUpperCase() === "SỐ NHIỆM VỤ"
      ) {
        result = Number(
          listInfo[i].$('[class="mb-0 font-weight-normal"]').getText()
        );
        break;
      }
    }
    return result;
  }

  goToSubmissionTaskPage() {
    super.open("/index.php/Home/Task/submission_task.html");
    this.containerTask
      .$("//div[contains(@class, 'swiper-slide-active')]")
      .$("//a[contains(@class, 'btn-outline-default')]")
      .waitForDisplayed({ timeout: timeoutLoadComp });
  }

  goToApplyTaskPage() {
    super.open("/index.php/Home/Member/apply.html");
    this.containerTask
      .$("//div[contains(@class, 'swiper-slide-next')]")
      .$("//a[contains(@class, 'btn-outline-default')]")
      .waitForDisplayed({ timeout: timeoutLoadComp });
  }

  goToFenleiPage() {
    super.open("/index.php/Home/Index/fenlei.html");
    this.renwuliebiao.waitForDisplayed({ timeout: timeoutLoadComp });
  }

  getNumberTaskCompleteReceived(numberTaskOfDay) {
    let result = [];
    let listAllTaskReceived = this.containerTask.$$("[class='card mb-3']");
    for (let i = 0; i < listAllTaskReceived.length; i++) {
      if (result.length === numberTaskOfDay) {
        break;
      }
      let currentDate = new Date();
      let dateOfTasks = listAllTaskReceived[i]
        .$('[class="text-secondary small"]')
        .getText()
        .split(" ")[0]
        .split("-");
      if (
        Number(dateOfTasks[0]) === currentDate.getFullYear() &&
        Number(dateOfTasks[1]) === currentDate.getMonth() + 1 &&
        Number(dateOfTasks[2]) === currentDate.getDate()
      ) {
        result.push(listAllTaskReceived[i]);
      }
    }
    return result;
  }

  receiveTask(numberTaskOfDay) {
    let count = 0;
    let name = common.getVip(numberTaskOfDay);
    let listAllTask = this.renwuliebiao.$$("li");
    for (let i = 0; i < listAllTask.length; i++) {
      if (
        numberTaskComplete + numberTaskNotComplete + count ===
        numberTaskOfDay
      ) {
        break;
      }

      let taskComponent = listAllTask[i];
      let vipName = taskComponent.$('[class="renwu_xq_dj"]').getText();
      if (vipName === name) {
        let remainNumberAllTaskText = taskComponent
          .$('[class="renwu_xq_center"]')
          .$$('[class="renwu_xq_pa"]')[2]
          .getText();
        let remainNumberAllTask = remainNumberAllTaskText.slice(
          remainNumberAllTaskText.lastIndexOf("/") + 1
        );
        if (Number(remainNumberAllTask) === 0) {
          continue;
        }

        let typeTaskText = taskComponent
          .$('[class="renwu_xq_img"]')
          .$("img")
          .getAttribute("src");
        if (TypeTask.indexOf(typeTaskText) === -1) {
          continue;
        }

        taskComponent.$('[class="renwu_jdbtn"]').$("a").scrollIntoView();
        let receiveBtn = taskComponent.$('[class="renwu_jd"]').$("a");
        browser.execute("arguments[0].click();", receiveBtn);
        this.layersection.waitForDisplayed({ timeout: timeoutLoadComp });
        if (
          this.layercont ===
          `Cấp độ hội viên của bạn mỗi ngày chỉ được nhận (${numberTaskOfDay}) nhiệm vụ！,`
        ) {
          break;
        } else if (
          this.layercont.toUpperCase() === "LĨNH NHIỆM VỤ THÀNH CÔNG"
        ) {
          count++;
        }
        this.layerbtn.$("span").click();
        browser.waitUntil(
          () =>
            !$('[class="layui-m-layermain"]').isExisting() &&
            !$('[class="layui-m-layermain"]').isDisplayed(),
          { timeout: timeoutLoadComp }
        );
      }
    }
  }

  executeTask() {
    this.goToSubmissionTaskPage();
    let listAllTaskReceived = $$('[class="card mb-3"]');
    for (let i = 0; i < listAllTaskReceived.length; i++) {
      let taskReceived = listAllTaskReceived[i];

      let cashTask = taskReceived.$('[class="text-right text-mute"]').getText();
      let taskAvailable = cashTask.slice(0, cashTask.indexOf("đ"));
      let urlTask = taskReceived
        .$('[class="text-left text-mute text-break"]')
        .getText();
      let idImage = "";
      if (!urlTask || taskAvailable === "0") {
        idImage = "none";
        if (listURLTask.indexOf(urlTask) === -1) {
          listURLTask.push(urlTask);
          listImageScreenShot.push(idImage);
          taskReceived.saveScreenshot(`./image_${idImage}.png`);
        }

        this.sendImage(taskReceived, idImage);
        continue;
      }
      let typeTask = taskReceived.$('[class="media-body"]').$("p").getText();
      let hrefSubmitTask = taskReceived.$("button").getAttribute("onclick");
      let urlSubmitTask = hrefSubmitTask.slice(
        hrefSubmitTask.indexOf("'") + 1,
        hrefSubmitTask.lastIndexOf("'")
      );
      idImage = urlSubmitTask.slice(
        urlSubmitTask.lastIndexOf("/id/") + 4,
        urlSubmitTask.indexOf(".html")
      );
      if (listURLTask.indexOf(urlTask) > -1) {
        let ind = listURLTask.indexOf(urlTask);
        this.sendImage(taskReceived, listImageScreenShot[ind]);
        continue;
      }
      if (typeTask.toUpperCase() === "FACEBOOK") {
        this.executeTaskFacebook(urlTask, taskReceived, idImage);
      } else if (typeTask.toUpperCase() === "YOUTUBE") {
        this.executeTaskYouTube(urlTask, taskReceived, idImage);
      } else if (typeTask.toUpperCase() === "TIKTOK") {
        this.executeTaskTiktok(urlTask, taskReceived, idImage);
      } else if (typeTask.toUpperCase() === "INSTAGRAM") {
        this.executeTaskInstagram(urlTask, taskReceived, idImage);
      }
    }
  }

  executeTaskFacebook(urlTask, taskReceived, idImage) {
    browser.url(urlTask);
    browser.pause(2000);
    this.watchFeed.waitForDisplayed({ timeout: timeoutLoadComp });
    let followBtn = this.watchFeed.$('[dir="auto"]').$("span=Theo dõi");
    let unFollowBtn = this.watchFeed.$('[dir="auto"]').$("span=Đang theo dõi");
    if (followBtn.isExisting() && followBtn.isDisplayed()) {
      browser.execute("arguments[0].click();", followBtn);
      browser.waitUntil(
        () => unFollowBtn.isExisting() && unFollowBtn.isDisplayed(),
        { timeout: timeoutLoadComp }
      );
    }
    if (
      this.likeAriaLabel.isDisplayed() &&
      this.likeAriaLabel.$("div:first-child").getText().toUpperCase() ===
        "THÍCH"
    ) {
      browser.execute(
        "arguments[0].click();",
        this.likeAriaLabel.$("div:first-child")
      );
      browser.waitUntil(
        () =>
          !this.likeAriaLabel.isDisplayed() &&
          !this.likeAriaLabel.isExisting() &&
          this.unLikeAriaLabel.isDisplayed() &&
          this.unLikeAriaLabel.isExisting(),
        { timeout: timeoutLoadComp }
      );
    }
    listURLTask.push(urlTask);
    listImageScreenShot.push(idImage);
    this.watchFeed.saveScreenshot(`./image_${idImage}.png`);

    this.sendImage(taskReceived, idImage);
  }

  executeTaskYouTube(urlTask, taskReceived, idImage) {
    browser.url(urlTask);
    browser.pause(2000);
    this.pageManager.waitForDisplayed({ timeout: timeoutLoadComp });
    if (
      this.subscribeBtn.isDisplayed() &&
      (this.subscribeBtn.$("yt-formatted-string").getText().toUpperCase() ===
        "ĐĂNG KÝ" ||
        this.subscribeBtn.$("yt-formatted-string").getText().toUpperCase() ===
          "SUBSCRIBE")
    ) {
      this.subscribeBtn.click();
      browser.waitUntil(
        () =>
          this.subscribeBtn.$("yt-formatted-string").getText().toUpperCase() ===
          "SUBSCRIBED",
        { timeout: timeoutLoadComp }
      );
    }
    if (this.likeBtn.isDisplayed() && this.likeBtn.isExisting()) {
      this.likeBtn.$("button").click();
    }
    listURLTask.push(urlTask);
    listImageScreenShot.push(idImage);
    browser.execute("window.scroll(0, 50)");
    this.pageManager
      .$('[id="primary-inner"]')
      .saveScreenshot(`./image_${idImage}.png`);

    this.sendImage(taskReceived, idImage);
  }

  executeTaskTiktok(urlTask, taskReceived, idImage) {
    browser.url(urlTask);
    $('[id="main"]').waitForDisplayed({ timeout: timeoutLoadComp });
    if (
      $('[id="main"]')
        .$('//main[contains(@class, "is-error-page")]')
        .isDisplayed()
    ) {
      listURLTask.push(urlTask);
      listImageScreenShot.push(idImage);
      $('[id="main"]')
        .$('//main[contains(@class, "is-error-page")]')
        .saveScreenshot(`./image_${idImage}.png`);

      return this.sendImage(taskReceived, idImage);
    }
    if (
      $('[id="main"]')
        .$('[class="share-layout-main"]')
        .$('[class="lazyload-wrapper"]')
        .$('[class="item-follow-wrapper"]')
        .isExisting() &&
      $('[id="main"]')
        .$('[class="share-layout-main"]')
        .$('[class="lazyload-wrapper"]')
        .$('[class="item-follow-wrapper"]')
        .isDisplayed() &&
      ($('[id="main"]')
        .$('[class="share-layout-main"]')
        .$('[class="lazyload-wrapper"]')
        .$('[class="item-follow-wrapper"]')
        .$("button")
        .getText()
        .toUpperCase() === "ĐĂNG KÝ" ||
        $('[id="main"]')
          .$('[class="share-layout-main"]')
          .$('[class="lazyload-wrapper"]')
          .$('[class="item-follow-wrapper"]')
          .$("button")
          .getText()
          .toUpperCase() === "FOLLOW")
    ) {
      browser.pause(2000);
      $('[id="main"]')
        .$('[class="share-layout-main"]')
        .$('[class="lazyload-wrapper"]')
        .$('[class="item-follow-wrapper"]')
        .$("button")
        .click();
    }
    if (
      $('[id="main"]')
        .$('[class="share-layout-main"]')
        .$('[class="lazyload-wrapper"]')
        .$('//div[contains(@class, "item-action-bar")]')
        .$('//div[contains(@class, "bar-item-wrapper")]')
        .$("svg")
        .$("path")
        .getAttribute("fill")
        .toUpperCase() === "BLACK"
    ) {
      browser.pause(2000);
      $('[id="main"]')
        .$('[class="share-layout-main"]')
        .$('[class="lazyload-wrapper"]')
        .$('//div[contains(@class, "item-action-bar")]')
        .$('//div[contains(@class, "bar-item-wrapper")]')
        .click();
    }

    listURLTask.push(urlTask);
    listImageScreenShot.push(idImage);
    $('[id="main"]')
      .$('[class="share-layout-main"]')
      .$('[class="lazyload-wrapper"]')
      .saveScreenshot(`./image_${idImage}.png`);

    this.sendImage(taskReceived, idImage);
  }

  executeTaskInstagram(urlTask, taskReceived, idImage) {
    browser.url(urlTask);
    browser.pause(2000);
    if ($("main").$("h2").getText() === "Sorry, this page isn't available.") {
      return;
    }
    $("article").waitForDisplayed({ timeout: timeoutLoadComp });
    if (
      $("article").$("header").$("button").isExisting() &&
      $("article").$("header").$("button").isDisplayed() &&
      ($("article").$("header").$("button").getText().toUpperCase() ===
        "ĐĂNG KÝ" ||
        $("article").$("header").$("button").getText().toUpperCase() ===
          "FOLLOW")
    ) {
      $("article").$("header").$("button").click();
      browser.waitUntil(
        () =>
          $("article").$("header").$("button").getText().toUpperCase() ===
          "FOLLOWING",
        { timeout: timeoutLoadComp }
      );
    }
    if (
      $("article")
        .$("section")
        .$("button")
        .$('[aria-label="Like"]')
        .isDisplayed() &&
      $("article")
        .$("section")
        .$("button")
        .$('[aria-label="Like"]')
        .isExisting()
    ) {
      $("article").$("section").$("button").click();
      $("article")
        .$("section")
        .$("button")
        .$('[aria-label="Unlike"]')
        .waitForDisplayed({ timeout: timeoutLoadComp });
    }
    listURLTask.push(urlTask);
    listImageScreenShot.push(idImage);
    $("article").saveScreenshot(`./image_${idImage}.png`);

    this.sendImage(taskReceived, idImage);
  }

  sendImage(taskReceived, idImage) {
    this.goToSubmissionTaskPage();
    let hrefSubmitTask = taskReceived.$("button").getAttribute("onclick");
    let urlSubmitTask = hrefSubmitTask.slice(
      hrefSubmitTask.indexOf("'") + 1,
      hrefSubmitTask.lastIndexOf("'")
    );

    browser.url(`${host}${urlSubmitTask}`);
    $('[class="body_main mt tline"]').waitForDisplayed({
      timeout: timeoutLoadComp,
    });

    const remoteFilePath = browser.uploadFile(`./image_${idImage}.png`);
    $('[class="body_main mt tline"]')
      .$('[type="file"]')
      .setValue(remoteFilePath);
    let imageSuccess = $('[class="body_main mt tline"]')
      .$('[class="filelist"]')
      .$('[class="success"]');

    imageSuccess.waitForDisplayed({ timeout: timeoutLoadComp });
    browser.pause(2000);
    $('[class="bala-btn"]').click();
    browser.waitUntil(
      () =>
        !$('[class="body_main mt tline"]').isExisting() &&
        !$('[class="body_main mt tline"]').isDisplayed(),
      { timeout: timeoutLoadComp }
    );
    this.containerTask.waitForDisplayed({ timeout: timeoutLoadComp });
  }
}

module.exports = new HomePage();
