import { test, expect, Page } from '@playwright/test';

let page: Page;
const nextName = 'test20230201';
const nextAppId = '2021002175634970';
/**
 * 2021002147639635
 * 2021003109637174
 * 2021002134696668
 * 2021001161692099
 * 2021002103688154
 * 2021001180657484
 * 2088002134696668
 * 2021002175634970
 * 2021003106604609
 */

test.describe.serial("miniApp notice", () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    context.addCookies([{ name: 'SHIRO_SESSION_ID', value: '248de0e8-3937-4999-9489-d72d709b9868', domain: 'localhost', path: '/' }])
    await page.goto("http://localhost:5001/#/adc-domain-saas/miniAppNotice");
  });

  test.afterAll(async () => {
    page.close();
  })

  test("has title", async () => {
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/小程序公告/);
  });

  test("add dialog type notice", async () => {
    await page.getByRole('button', { name: '新 增' }).click();
    await page.getByRole('textbox', { name: '* APPID :' }).fill(nextAppId);
    await page.getByRole('textbox', { name: '* 公告名称 :' }).fill(nextName + 'dialog');
    await page.getByRole('textbox', { name: '* 公告点位 :' }).fill(nextName + 'dialog');
    await page.getByLabel('公告描述').fill('desc');
    await page.getByTitle('每天一次').click();
    await page.getByText('每人一次').click();
    await page.getByLabel('图片弹窗').check();

    const uploadPromise = page.waitForResponse(response => response.url() === 'http://localhost:5001/web/gateway.do');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'plus Upload' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('/Users/wujun/github/iamwjun/explore-playwright/tests/assets/upload.png');
    await uploadPromise;

    const confirm = page.getByRole('button', { name: '确 定' });
    const requestPromise = page.waitForRequest(request => request.url() === 'http://localhost:5001/web/gateway.do');
    await confirm.click();
    const request = await requestPromise;
    const response: any = await request.response().then(res => res?.json());
    await expect(response?.code).toEqual(200);
  });

  test("delete dialog notice", async () => {
    await page.getByRole('row', { name: nextName + 'dialog' }).getByText('删除').click();
    const count = await page.getByText('已上架的公告不能删除，请先执行下架操作').count();
    if (count > 0) {
      await page.getByRole('button', { name: '知道了' }).click();
      await page.getByRole("row", { name: nextName + 'dialog' }).getByRole("switch").click();
      await page.getByRole('row', { name: nextName + 'dialog' }).getByText('删除').click();
    }
    const confirm = page.getByRole('button', { name: '确 定' });
    const requestPromise = page.waitForRequest(request => request.url() === 'http://localhost:5001/web/gateway.do');
    await confirm.click();
    const request = await requestPromise;
    const response = await request.response().then(res => res?.json());
    await expect(response?.code).toEqual(200);
  });

  test("add yellow tips type notice", async () => {
    await page.getByRole('button', { name: '新 增' }).click();
    await page.getByRole('textbox', { name: '* APPID :' }).fill(nextAppId);
    await page.getByRole('textbox', { name: '* 公告名称 :' }).fill(nextName);
    await page.getByRole('textbox', { name: '* 公告点位 :' }).fill(nextName);
    await page.getByLabel('公告描述').fill('desc');
    await page.getByLabel('公告内容').fill('notice');

    const confirm = page.getByRole('button', { name: '确 定' });
    const requestPromise = page.waitForRequest(request => request.url() === 'http://localhost:5001/web/gateway.do');
    await confirm.click();
    const request = await requestPromise;
    const response: any = await request.response().then(res => res?.json());
    await expect(response?.code).toEqual(200);
  });

  test("delete when notice's status is open", async () => {
    await page.getByRole('row', { name: nextName }).getByText('删除').click();
    await expect(await page.getByText('已上架的公告不能删除，请先执行下架操作').count()).toEqual(1);
    await page.getByRole('button', { name: '知道了' }).click();
  });

  test("edit notice", async () => {
    await page.getByRole('row', { name: nextName }).getByRole('switch').click();
    await page.getByRole('row', { name: nextName }).getByText('编辑').click();
    await page.getByRole('textbox', { name: '* 公告名称 :' }).fill(nextName + '-edit');
    await page.getByLabel('公告描述').fill('desc' + '-edit');
    await page.getByLabel('公告内容').fill('notice' + '-edit');

    const confirm = page.getByRole('button', { name: '确 定' });
    const requestPromise = page.waitForRequest(request => request.url() === 'http://localhost:5001/web/gateway.do');
    await confirm.click();
    const request = await requestPromise;
    const response = await request.response().then(res => res?.json());
    await expect(response?.code).toEqual(200);
  });

  test("search notice by app id", async () => {
    // await page.getByLabel('APPID').waitFor();
    await page.getByLabel('APPID').last().fill(nextAppId);
    // for (const li of await page.getByLabel('APPID').all()) {
    //   await li.fill(nextAppId);
    // }
    const requestPromise = page.waitForRequest(request => request.url() === 'http://localhost:5001/web/gateway.do');
    await page.getByRole('button', { name: '搜 索' }).click();

    const request = await requestPromise;
    const response = await request.response().then(res => res?.json());
    await expect(response?.code).toEqual(200);
    await page.getByLabel('APPID').clear();
  });

  test("search notice by name", async () => {
    await page.getByLabel('公告名称').fill(nextName + '-edit');
    const requestPromise = page.waitForRequest(request => request.url() === 'http://localhost:5001/web/gateway.do');
    await page.getByRole('button', { name: '搜 索' }).click();

    const request = await requestPromise;
    const response = await request.response().then(res => res?.json());
    await expect(response?.code).toEqual(200);
    await page.getByLabel('公告名称').clear();
  });
  
  test("search notice by point", async () => {
    await page.getByLabel('公告点位').fill(nextName);
    const requestPromise = page.waitForRequest(request => request.url() === 'http://localhost:5001/web/gateway.do');
    await page.getByRole('button', { name: '搜 索' }).click();

    const request = await requestPromise;
    const response = await request.response().then(res => res?.json());
    await expect(response?.code).toEqual(200);
    await page.getByLabel('公告点位').clear();
  });

  test("search notice filter by type", async () => {
    await page.getByText('全部').click();
    await page.getByTitle('小黄条').getByText('小黄条').click();
    const requestPromise = page.waitForRequest(request => request.url() === 'http://localhost:5001/web/gateway.do');
    await page.getByRole('button', { name: '搜 索' }).click();

    const request = await requestPromise;
    const response = await request.response().then(res => res?.json());
    await expect(response?.code).toEqual(200);
    await page.getByRole('button', { name: '清 除' }).click();
  });

  test("delete yellow tips notice", async () => {
    await page.getByRole('row', { name: nextName + '-edit' }).getByText('删除').click();
    const count = await page.getByText('已上架的公告不能删除，请先执行下架操作').count();
    if (count > 0) {
      await page.getByRole('button', { name: '知道了' }).click();
      await page.getByRole("row", { name: nextName + '-edit' }).getByRole("switch").click();
      await page.getByRole('row', { name: nextName + '-edit' }).getByText('删除').click();
    }
    const requestPromise = page.waitForRequest(request => request.url() === 'http://localhost:5001/web/gateway.do');
    await page.getByRole('button', { name: '确 定' }).click();
    const request = await requestPromise;
    const response = await request.response().then(res => res?.json());
    await expect(response?.code).toEqual(200);
  });

  test("visual comparisons",async () => {
    const responsePromise = page.waitForResponse(response => response.url() === 'http://localhost:5001/web/gateway.do');
    await responsePromise;
    await expect(await page).toHaveScreenshot('landing.png', { maxDiffPixels: 1000 });
  })
});
