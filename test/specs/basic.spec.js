describe('webdriver.io page', () => {
    it('should have the right title', () => {

        // waitForDisplayed
        // waitForExist
        // waitUntil
        browser.url('https://i-earn1.vip/index.php/Home/Index/index.html')

        const formLogin = $('[class="wrapper passport"]');
        formLogin.waitForDisplayed({ timeout: 10000 });
        $('#inputEmail').setValue('0914470108')
        $('#inputPassword').setValue('MATKHAUiearn135')
        $('[class="btn btn-default btn-lg btn-rounded shadow btn-block login"]').click()
        $('[class="modal-open"]').waitForDisplayed({ timeout: 20000 })
        $('[class="modal fade in tanchuang show"]').waitForDisplayed({ timeout: 20000 })
        // browser.pause(5000)

        let modelContent = $('[class="modal fade in tanchuang show"]')
        // browser.pause(2000)
        if (modelContent.isExisting()) {
            modelContent.$('[class="close close-rounded tanchuangClose"]').click()
        }

        let numberTaskOfDay
        // browser.pause('6000')
        let listInfo = $('[class="row text-center mt-1"]').$$('[class="card-body"]')
        for (let i = 0; i < listInfo.length; i++) {
            if (listInfo[i].$('[class="text-secondary text-mute small"]').getText() === 'Số nhiệm vụ') {
                numberTaskOfDay = Number(listInfo[i].$('[class="mb-0 font-weight-normal"]').getText())
                break
            }
        }

        // browser.pause(5000)
        let receiveTaskBtn = $('[class="btn btn-link-default"]')
        receiveTaskBtn.click()
        browser.pause(5000)

        let numberTaskReceived = []
        let listAllTaskReceived = $$('[class="card-header bg-none"]')
        for (let i = 0; i < listAllTaskReceived.length; i++) {
            if (numberTaskOfDay > numberTaskReceived.length) {
                let currentDate = new Date()
                let dateOfTasks = listAllTaskReceived[i].$('[class="text-secondary small"]').getText().split(' ')[0].split('-')
                if (Number(dateOfTasks[0]) === currentDate.getFullYear()
                    && Number(dateOfTasks[1]) === (currentDate.getMonth() + 1)
                    && Number(dateOfTasks[2]) === currentDate.getDate()) {
                    numberTaskReceived.push(listAllTaskReceived[i])
                }

            }
        }
        console.log('KAKAAAAAAAAAAAAAAAA: ' + numberTaskReceived.length)

        // like
        // aria-label="Like"
        // class="_8-yf5 "

        // follow button
        // class="sqdOP yWX7d     _8A5w5    "
    })
})

