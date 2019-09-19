const m = require('mithril');

class UsersModel {
  constructor() {
    this.users = {};
  }

  async createUser(credentials) {
    console.log('request sent');
    const user = await m.request({
      method: 'POST',
      url: '/users',
      data: credentials,
    });
    this.users[user.id] = user;
    return user;
  }
}

class IssuesModel {
  constructor() {
    this.issues = {};
  }

  async loadIssues() {
    const response = await m.request('/issues');
    this.issues = {};
    response.issues.forEach((issue) => {
      this.issues[issue.id] = issue;
    });
    return this.issues;
  }

  get list() {
    return Object.keys(this.issues).map((i) => this.issues[i]);
  }

  async loadIssue(issueId) {
    const response = await m.request(`/issues/${issueId}`);
    this.issues[issueId] = response;
    return response;
  }

  async updateIssue(issueId, fields) {
    await m.request({
      method: 'PUT',
      url: `/issues/${issueId}`,
      data: fields,
    });
    return this.loadIssue(issueId);
  }

  async createIssue(fields) {
    await m.request({
      method: 'POST',
      url: '/issues',
      data: fields,
    });
    return this.loadIssues();
  }

  async closeIssue(issueId) {
    await m.request({
      method: 'POST',
      url: `/issues/${issueId}/close`,
    });
    return this.loadIssues();
  }
}

module.exports = { UsersModel, IssuesModel };
