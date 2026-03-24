const API_BASE_URL = '/api';

const api = {
  request(url, options = {}) {
    const token = localStorage.getItem('token') || localStorage.getItem('Authorization') || '';
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token.replace(/"/g, '')
      }
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    mergedOptions.headers = { ...defaultOptions.headers, ...options.headers };
    
    return fetch(API_BASE_URL + url, mergedOptions)
      .then(response => response.json())
      .then(data => {
        if (data.code !== 200) {
          throw new Error(data.message || '请求失败');
        }
        return data;
      });
  },
  
  batchSubmit(vulnerabilities) {
    return this.request('/vulnerability/batch-submit', {
      method: 'POST',
      body: JSON.stringify({ vulnerabilities })
    });
  },
  
  getAssetList(params) {
    return this.request('/asset/list', { params });
  },
  
  getDictData(dictType) {
    return this.request(`/dict/data/${dictType}`);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}
