import { BrowninglogicNgFileDropDemoPage } from './app.po';

describe('@browninglogic/ng-file-drop-demo App', () => {
  let page: BrowninglogicNgFileDropDemoPage;

  beforeEach(() => {
    page = new BrowninglogicNgFileDropDemoPage ();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
