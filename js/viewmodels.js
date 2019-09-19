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

  get counta() {
    return Object.keys(this.issues).length;
  }

  get countOpen() {
    return Object.keys(this.issues).reduce((rtn, i) => {
      if (this.issues[i].closed === null) return (rtn + 1);
      return rtn;
    }, 0);
  }

  get countCLW() {
    let oneWeekAgo = new Date();
    oneWeekAgo = oneWeekAgo.getTime() - (7 * 24 * 60 * 60 * 1000);
    console.log(oneWeekAgo);
    return Object.keys(this.issues).reduce((rtn, i) => {
      if (new Date(this.issues[i].closed).getTime() > oneWeekAgo) return (rtn + 1);
      return rtn;
    }, 0);
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
