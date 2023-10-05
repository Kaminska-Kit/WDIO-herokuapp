describe("Login page tests", () => {
    //TODO: ВЫНЕСЛИ В КОНСТАНТЫ НА УРОВЕНЬ ДЕСКРАЙБА ВСЕ БОЛЕЕ ОДНОГО РАЗА ИСПОЛЬЗУЕМЫЕ СЕЛЕКТОРЫ!
  
    const url = "http://the-internet.herokuapp.com/";
    const loginPageLink = 'a[href="/login"]'
    const usernameInput = "#username";
    const passwordInput = "//input[@id='password']";
    const loginButton = 'button.radius';
    const validUsername = "tomsmith";
    const validPassword = "SuperSecretPassword!";
    const errorMessageSelector = "div#flash";
    const secretPageTitle = "//h2[text()[normalize-space()='Secure Area']]";
    const loginPageTitle = 'h2'
    const homePageTitle = 'h1.heading'
    
    before(async () => {
      await browser.maximizeWindow();
    });
  
    beforeEach(async () => {
      await browser.url(url);
    });
    context("Positive scenarions", () => {
      it("Should login with valid data", async () => {
    //     /*
    //   - Открыть сайт
    //   - Перейти на страницу авторизации
    //   - Ввести логин
    //   - Ввести пароль
    //   - Кликнуть логин
    //   */
  
        await $(homePageTitle).waitForDisplayed({ timeout: 5000, timeoutMsg: `Home page not opened after 5 seconds`, reverse: false });
        await $(loginPageLink).click();
        await $(loginPageTitle).waitForDisplayed({ timeout: 5000, timeoutMsg: `Login page not opened after 5 seconds`, reverse: false });
        await $(usernameInput).setValue(validUsername);
        await $(passwordInput).setValue(validPassword);
        $(loginButton).click();
        const currentUrlOfSecretPage = (await browser.getUrl()).split(url)[1];
        expect(currentUrlOfSecretPage).toBe("login");
  
        const title = await $(secretPageTitle).getText();
        expect(title).toBe("Secure Area");
  
        // const linkToAuthenticationPage = await $(`a[href="/login"]`);
        // await linkToAuthenticationPage.click();
        // const username = await $("#username");
        // const password = await $(`//input[@id="password"]`);
  
        // await username.setValue(validUsername);
        // await username.addValue(validUsername);
        // await username.clearValue();
        // await password.setValue(validPassword);
  
        
        await $(loginButton).click();
  
        // const secretPageTitle = await $(`//h2[text()[normalize-space()='Secure Area']]`);
      });
    });
  
    context("Negative Scenarions", () => {
      it("Should NOT login with invalid username", async () => {
        const invalidUsername = validUsername + "23";
        await $(homePageTitle).waitForDisplayed({ timeout: 5000, timeoutMsg: `Home page not opened after 5 seconds`, reverse: false });
        await $(loginPageLink).click();
        await $(loginPageTitle).waitForDisplayed({ timeout: 5000, timeoutMsg: `Login page not opened after 5 seconds`, reverse: false });
        await $(usernameInput).setValue(invalidUsername);
        await $(passwordInput).setValue(validPassword);
        $(loginButton).click();
        const currentUrlOfSecretPage = (await browser.getUrl()).split(url)[1];
        expect(currentUrlOfSecretPage).toBe("login");
  
        const title = await $("h2").getText();
        expect(title).toBe("Login Page");
  
        const errorMessage = await $(errorMessageSelector).getText();
        expect(errorMessage).toBe("Your username is invalid!\n×");
      });
  
      it("Should NOT login with invalid password", async () => {
        const invalidPassword = validPassword + "23";
        await $(homePageTitle).waitForDisplayed({ timeout: 5000, timeoutMsg: `Home page not opened after 5 seconds`, reverse: false });
        await $(loginPageLink).click();
        await $(loginPageTitle).waitForDisplayed({ timeout: 5000, timeoutMsg: `Login page not opened after 5 seconds`, reverse: false });
        await $(usernameInput).setValue(validUsername);
        await $(passwordInput).setValue(invalidPassword);
        $(loginButton).click();
        const currentUrlOfSecretPage = (await browser.getUrl()).split(url)[1];
        expect(currentUrlOfSecretPage).toBe("login");
  
        const title = await $(loginPageTitle).getText();
        expect(title).toBe("Login Page");
  
        const errorMessage = await $(errorMessageSelector).getText();
        expect(errorMessage).toBe("Your password is invalid!\n×");
      });
    });
  
    //TODO: Сделать из этого теста ПОЛНОЦЕННЫЙ e2e тест, ищущий ссылку из массива по тексту
    /*
    - поиск линки по тексту
    - клик
    - валидный логин
    - проверка страницы
    - логаут
    - проверка страницы куда вернулись
    */
  
   
   it.only("E2E test", async () => {
        let linkToAuthenticationPage;
        const links = await $$("ul a");
        for (const link of links) {
          if (await link.getText() === 'Form Authentication') {
            linkToAuthenticationPage = link;
            break;            
          }
        }
        await linkToAuthenticationPage?.click();
        browser.pause(2000)

        await $(loginPageTitle).waitForDisplayed({timeout: 5000, timeoutMsg: 'Login page is not opened after 5 seconds'});
        const titleText = await $(loginPageTitle).getText();
        expect(titleText).toBe("Login Page");

        await $(usernameInput).setValue(validUsername);
        await $(passwordInput).setValue(validPassword);
        await $(loginButton).click();
        await $('div#flash.success').waitForDisplayed({timeout: 5000, timeoutMsg: 'Success alert is not displayed after 5 seconds'});

        const secretPageTitleText = await $(secretPageTitle).getText();
        expect(secretPageTitleText).toBe("Secure Area");

        await $('a.button.secondary.radius').click();

        await $(loginPageTitle).waitForDisplayed({timeout: 5000, timeoutMsg: 'Login page is not opened after 5 seconds'});
        expect(titleText).toBe("Login Page");
        })
})