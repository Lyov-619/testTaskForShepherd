import {BASE_URL} from "../resources/environment";

async function setAdminAuthCookie(browser, token){


    const context = await browser.newContext();
    const myPage = await context.newPage();
    await myPage.goto(BASE_URL)
    const cookies = {
        name: 'token',
        value: token,
        url: BASE_URL
    }

    await context.addCookies([cookies]);
    await myPage.goto(BASE_URL)
    return myPage;
}

export {setAdminAuthCookie}