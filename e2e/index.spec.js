describe('Top Page', () => {
  beforeEach(() => {
    // Go To Top Page
    browser.get('');
  });
  
  it('Input YourName', () => {
    element(by.id('your-name')).sendKeys(' Me');
    expect(element(by.id('message')).getText()).toBe('Hello Sample Me!');
    browser.sleep(2000);
  });
});
