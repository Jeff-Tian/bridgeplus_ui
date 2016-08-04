describe('Query parser', function () {
    var queryParser;

    beforeEach(module('accountSetting'));

    beforeEach(inject(function (_queryParser_) {
        queryParser = _queryParser_;
    }));

    it('can parse values by key from query string', function () {
        expect(queryParser.get('?nickName=叽歪', 'nickName')).toBe('叽歪');

        spyOn(queryParser, 'getQueryString').and.returnValue('?nickName=叽歪');
        expect(queryParser.getQueryString()).toBe('?nickName=叽歪');
        expect(queryParser.get('nickName')).toBe('叽歪');
    });

    it('can parse values by key from query string exactly', function () {
        spyOn(queryParser, 'getQueryString').and.returnValue('?wechat_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb3VyY2UiOiJ3ZWNoYXQiLCJvcGVuX2lkIjoib2RFdDB2MGJDNDBlLXJfY1ZTMWQ2MVR5SVVTMCIsIndlY2hhdCI6IuWPveatqiIsImdlbmRlciI6MSwicHJvdmluY2UiOiJTaGFuZ2hhaSIsImNpdHkiOiJDaGFuZ25pbmciLCJjb3VudHJ5IjoiQ04iLCJhdmF0YXIiOiJodHRwOi8vd3gucWxvZ28uY24vbW1vcGVuL0ZiUjBwNTdXekRhMDJwWWNObHBpY3hqMWROUGliV082aWN1VENja21nU2NsWDhZQTlEeFA2TWdGcTNFQU5ZM3E5TjVDSUxNYjlpYktEY2tJeEc3UFg1Nmg1cTZDd2VON3FadkcvMCIsInVuaW9uaWQiOiJvbVZDN3dvUXFtUEpuclRRSXF6dDFQWGpuaElrIn0.zy9YfF9QGkNuolrXxUNB9OqkOT16bmJVj06mco0JLLg');
        expect(queryParser.get('token')).toBe('');
        expect(queryParser.get('wechat_token')).toBe('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb3VyY2UiOiJ3ZWNoYXQiLCJvcGVuX2lkIjoib2RFdDB2MGJDNDBlLXJfY1ZTMWQ2MVR5SVVTMCIsIndlY2hhdCI6IuWPveatqiIsImdlbmRlciI6MSwicHJvdmluY2UiOiJTaGFuZ2hhaSIsImNpdHkiOiJDaGFuZ25pbmciLCJjb3VudHJ5IjoiQ04iLCJhdmF0YXIiOiJodHRwOi8vd3gucWxvZ28uY24vbW1vcGVuL0ZiUjBwNTdXekRhMDJwWWNObHBpY3hqMWROUGliV082aWN1VENja21nU2NsWDhZQTlEeFA2TWdGcTNFQU5ZM3E5TjVDSUxNYjlpYktEY2tJeEc3UFg1Nmg1cTZDd2VON3FadkcvMCIsInVuaW9uaWQiOiJvbVZDN3dvUXFtUEpuclRRSXF6dDFQWGpuaElrIn0.zy9YfF9QGkNuolrXxUNB9OqkOT16bmJVj06mco0JLLg');
    });

    it('can ignore case of the key', function () {
        spyOn(queryParser, 'getQueryString').and.returnValue('?ToKeN=test');
        expect(queryParser.get('token')).toBe('test');
    });

    it('can get pytui', function () {
        spyOn(queryParser, 'getQueryString').and.returnValue('?redemption_code=ms2015pytui&trk_tag=pytui&partner=pytui');
        expect(queryParser.get('partner')).toBe('pytui');
    });

    it('can parse query string', function () {
        spyOn(queryParser, 'getQueryString').and.returnValue('?a=a&b=b');
        expect(queryParser.parse()).toEqual({"a": "a", "b": "b"});
    });
});