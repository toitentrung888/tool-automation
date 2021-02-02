const Page = require("./page");
const { host, timeoutLoadComp } = require("../constant");
const TypeTask = require("./../data/TypeTask");

/**
 * sub page containing specific selectors and methods for a specific page
 */
class HomePage extends Page {
  /**
   * define selectors using getter methods
   */
  get modelFadeShow() {
    return $('[class="modal fade in tanchuang show"]');
  }
  get closeModelFadeShowBtn() {
    return $('[class="close close-rounded tanchuangClose"]');
  }
  get containerTask() {
    return $('[class="container mb-3"]');
  }
  get renwuliebiao() {
    return $('[class="renwuliebiao_a"]');
  }
  get layersection() {
    return $('[class="layui-m-layersection"]');
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

  closePopupModelFadeShow() {
    if (this.modelFadeShow.isExisting()) {
      this.modelFadeShow
        .$('[class="close close-rounded tanchuangClose"]')
        .click();
    }
  }

  getNumberTaskOfDay() {
    let result = 0;
    let listInfo = $('[class="row text-center mt-1"]').$$(
      '[class="card-body"]'
    );
    for (let i = 0; i < listInfo.length; i++) {
      if (
        listInfo[i].$('[class="text-secondary text-mute small"]').getText() ===
        "Số nhiệm vụ"
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
    this.containerTask.waitForDisplayed({ timeout: timeoutLoadComp });
  }

  goToApplyTaskPage() {
    super.open("/index.php/Home/Member/apply.html");
    this.containerTask.waitForDisplayed({ timeout: timeoutLoadComp });
  }

  goToFenleiPage() {
    super.open("/index.php/Home/Index/fenlei.html");
    this.renwuliebiao.waitForDisplayed({ timeout: timeoutLoadComp });
  }

  getNumberTaskCompleteReceived(numberTaskOfDay) {
    let result = [];
    let listAllTaskReceived = $$('[class="card-header bg-none"]');
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

  receiveTask(remainNumber, name) {
    let count = 0;
    let listAllTask = this.renwuliebiao.$$("li");
    for (let i = 0; i < listAllTask.length; i++) {
      if (count === remainNumber) {
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
        if (TypeTask.length === 0) {
          let receiveBtn = taskComponent.$('[class="renwu_jd"]').$("a");
          browser.execute("arguments[0].click();", receiveBtn);
          this.layersection.waitForDisplayed({ timeout: timeoutLoadComp });
          if (this.layercont === "Lĩnh nhiệm vụ thành công") {
            count++;
          }
          this.layerbtn.$("span").click();
          browser.pause(3000);
        } else {
          let typeTaskText = taskComponent
            .$('[class="renwu_xq_img"]')
            .$("img")
            .getAttribute("src");
          if (TypeTask.indexOf(typeTaskText) > -1) {
            taskComponent.$('[class="renwu_jdbtn"]').$("a").scrollIntoView();
            let receiveBtn = taskComponent.$('[class="renwu_jd"]').$("a");
            browser.execute("arguments[0].click();", receiveBtn);
            browser.pause(3000);
            this.layersection.waitForDisplayed({ timeout: timeoutLoadComp });
            if (this.layercont === "Lĩnh nhiệm vụ thành công") {
              count++;
            }
            this.layerbtn.$("span").click();
            browser.pause(3000);
          }
        }
      }
    }
    return count;
  }

  executeTask(numberTaskOfDay) {
    let result = [];
    let listAllTaskReceived = $$('[class="card mb-3"]');
    let count = 0;
    let resultExecuteTask = false;
    for (let i = 0; i < listAllTaskReceived.length; i++) {
      this.goToSubmissionTaskPage();
      browser.pause(3000);
      if (result.length === numberTaskOfDay) {
        break;
      }
      let taskReceived = listAllTaskReceived[count];
      let currentDate = new Date();
      let dateOfTasks = taskReceived
        .$('[class="text-secondary small"]')
        .getText()
        .split(" ")[0]
        .split("-");
      let cashTask = taskReceived.$('[class="text-right text-mute"]').getText();
      let taskAvailable = cashTask.slice(0, cashTask.indexOf("đ"));
      if (
        Number(dateOfTasks[0]) === currentDate.getFullYear() &&
        Number(dateOfTasks[1]) === currentDate.getMonth() + 1 &&
        Number(dateOfTasks[2]) === currentDate.getDate() &&
        taskAvailable !== "0"
      ) {
        let typeTask = taskReceived.$('[class="media-body"]').$("p").getText();
        if (typeTask === "facebook") {
          resultExecuteTask = this.executeTaskFacebook(
            taskReceived,
            dateOfTasks,
            i
          );
        } else if (typeTask === "youtube") {
          resultExecuteTask = this.executeTaskYouTube(
            taskReceived,
            dateOfTasks,
            i
          );
        } else if (typeTask === "tiktok") {
          resultExecuteTask = this.executeTaskTiktok(
            taskReceived,
            dateOfTasks,
            i
          );
        } else if (typeTask === "Instagram") {
          resultExecuteTask = this.executeTaskInstagram(
            taskReceived,
            dateOfTasks,
            i
          );
        }
        if (resultExecuteTask) {
          result.push(taskReceived);
        } else {
          count++;
        }
      }
    }
  }

  executeTaskFacebook(taskReceived, dateOfTasks, index) {
    let urlTask = taskReceived
      .$('[class="text-left text-mute text-break"]')
      .getText();
    if (!urlTask) {
      return;
    }
    // browser.newWindow(urlTask)
    browser.url(urlTask);
    browser.pause(2000);
    this.watchFeed.waitForDisplayed({ timeout: timeoutLoadComp });
    let followBtn = this.watchFeed.$('[dir="auto"]').$("span=Theo dõi");
    if (followBtn.isExisting() && followBtn.isDisplayed()) {
      browser.execute("arguments[0].click();", followBtn);
    }
    browser.pause(2000);
    if (
      this.likeAriaLabel.isDisplayed() &&
      this.likeAriaLabel.$("div:first-child").getText() === "Thích"
    ) {
      browser.execute(
        "arguments[0].click();",
        this.likeAriaLabel.$("div:first-child")
      );
    }
    // const filePath = `./${dateOfTasks[0]}${dateOfTasks[1]}${dateOfTasks[2]}/screenShot${index + 1}.png`
    const filePath = `./screenShot_${dateOfTasks[0]}${dateOfTasks[1]}${
      dateOfTasks[2]
    }_${index + 1}.png`;
    this.watchFeed.saveScreenshot(filePath);
    this.goToSubmissionTaskPage();

    // location.href='/index.php/Home/Task/submission_task_do/id/284375.html'
    let hrefSubmitTask = taskReceived.$("button").getAttribute("onclick");
    let urlSubmitTask = hrefSubmitTask.slice(
      hrefSubmitTask.indexOf("'") + 1,
      hrefSubmitTask.lastIndexOf("'")
    );
    browser.url(`${host}${urlSubmitTask}`);
    $('[class="body_main mt tline"]').waitForDisplayed({
      timeout: timeoutLoadComp,
    });

    const remoteFilePath = browser.uploadFile(filePath);
    $('[class="body_main mt tline"]')
      .$('[type="file"]')
      .setValue(remoteFilePath);
    browser.pause(2000);
    $('[class="bala-btn"]').click();
    console.log("hihi");
    return true;
  }

  executeTaskYouTube(taskReceived, dateOfTasks, index) {
    let urlTask = taskReceived
      .$('[class="text-left text-mute text-break"]')
      .getText();
    if (!urlTask) {
      return;
    }
    browser.url(urlTask);
    browser.pause(2000);
    this.pageManager.waitForDisplayed({ timeout: timeoutLoadComp });
    if (
      this.subscribeBtn.isExisting() &&
      this.subscribeBtn.isDisplayed() &&
      (this.subscribeBtn.$("yt-formatted-string").getText() === "Đăng ký" ||
        this.subscribeBtn.$("yt-formatted-string").getText() === "SUBSCRIBE")
    ) {
      this.subscribeBtn.click();
    }
    browser.pause(2000);
    if (this.likeBtn.isDisplayed() && this.likeBtn.isExisting()) {
      this.likeBtn.$("button").click();
    }
    browser.execute("window.scroll(0, 50)");
    const filePath = `./screenShot_${dateOfTasks[0]}${dateOfTasks[1]}${
      dateOfTasks[2]
    }_${index + 1}.png`;
    this.pageManager.$('[id="primary-inner"]').saveScreenshot(filePath);
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

    const remoteFilePath = browser.uploadFile(filePath);
    $('[class="body_main mt tline"]')
      .$('[type="file"]')
      .setValue(remoteFilePath);
    browser.pause(2000);
    $('[class="bala-btn"').click();
    console.log("hihi");
    return true;
  }

  executeTaskTiktok(taskReceived, dateOfTasks, index) {
    let urlTask = taskReceived
      .$('[class="text-left text-mute text-break"]')
      .getText();
    if (!urlTask) {
      return;
    }
    browser.url(urlTask);
    browser.pause(2000);
    $('[id="main"]').waitForDisplayed({ timeout: timeoutLoadComp });
    if (
      $('[id="main"]')
        .$('[class="share-layout-main is-error-page"]')
        .isDisplayed() &&
      $('[id="main"]')
        .$('[class="share-layout-main is-error-page"]')
        .isExisting()
    ) {
      return;
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
        .getText() === "Đăng ký" ||
        $('[id="main"]')
          .$('[class="share-layout-main"]')
          .$('[class="lazyload-wrapper"]')
          .$('[class="item-follow-wrapper"]')
          .$("button")
          .getText() === "Follow")
    ) {
      $('[id="main"]')
        .$('[class="share-layout-main"]')
        .$('[class="lazyload-wrapper"]')
        .$('[class="item-follow-wrapper"]')
        .$("button")
        .click();
    }
    browser.pause(2000);
    if (
      $('[id="main"]')
        .$('[class="share-layout-main"]')
        .$('[class="lazyload-wrapper"]')
        .$('[class="item-action-bar"]')
        .$('[class="bar-item-wrapper"]')
        .$("svg")
        .$("path")
        .getAttribute("fill") === "black"
    ) {
      $('[id="main"]')
        .$('[class="share-layout-main"]')
        .$('[class="lazyload-wrapper"]')
        .$('[class="item-action-bar"]')
        .$('[class="bar-item-wrapper"]')
        .click();
    }

    const filePath = `./screenShot_${dateOfTasks[0]}${dateOfTasks[1]}${
      dateOfTasks[2]
    }_${index + 1}.png`;

    $('[id="main"]')
      .$('[class="share-layout-main"]')
      .$('[class="lazyload-wrapper"]')
      .saveScreenshot(filePath);
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

    const remoteFilePath = browser.uploadFile(filePath);
    $('[class="body_main mt tline"]')
      .$('[type="file"]')
      .setValue(remoteFilePath);
    browser.pause(2000);
    $('[class="bala-btn"').click();
    console.log("hihi");
    return true;
  }

  executeTaskInstagram(taskReceived, dateOfTasks, index) {
    let urlTask = taskReceived
      .$('[class="text-left text-mute text-break"]')
      .getText();
    if (!urlTask) {
      return;
    }
    browser.url(urlTask);
    browser.pause(2000);
    if ($("main").$("h2").getText() === "Sorry, this page isn't available.") {
      return;
    }
    $("article").waitForDisplayed({ timeout: timeoutLoadComp });
    if (
      $("article").$("header").$("button").isExisting() &&
      $("article").$("header").$("button").isDisplayed() &&
      ($("article").$("header").$("button").getText() === "Đăng ký" ||
        $("article").$("header").$("button").getText() === "Follow")
    ) {
      $("article").$("header").$("button").click();
    }
    browser.pause(2000);
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
    }
    const filePath = `./screenShot_${dateOfTasks[0]}${dateOfTasks[1]}${
      dateOfTasks[2]
    }_${index + 1}.png`;
    $("article").saveScreenshot(filePath);
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

    const remoteFilePath = browser.uploadFile(filePath);
    $('[class="body_main mt tline"]')
      .$('[type="file"]')
      .setValue(remoteFilePath);
    browser.pause(2000);
    $('[class="bala-btn"').click();
    console.log("hihi");
    return true;
  }
}

module.exports = new HomePage();
