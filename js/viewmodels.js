const m = require('mithril')

class UsersModel {
  constructor() {
    this.users = {}
  }
  async createUser(credentials) {
    await m.request({
      method: "POST",
      url: '/users',
      data: credentials,
    })
    return await this.users[userid]
  }
}

class IssuesModel {
  constructor() {
    this.issues = {}
  }
  async loadIssues() {
    let response = await m.request('/issues')
    this.issues = {}
    for (let issue of response.issues) {
      this.issues[issue.id] = issue
    }
    return this.issues
  }
  get list() {
    return Object.keys(this.issues).map(i => this.issues[i])
  }
  async loadIssue(issueId) {
    let response = await m.request(`/issues/${issueId}`)
    this.issues[issueId] = response
    return response
  }
  async updateIssue(issueId, fields) {
    await m.request({
      method: "PUT",
      url: `/issues/${issueId}`,
      data: fields
    })
    return await this.loadIssue(issueId)
  }
  async createIssue(fields) {
    await m.request({
      method: "POST",
      url: `/issues`,
      data: fields
    })
    return await this.loadIssues()
  }
  async closeIssue(issueId) {
    await m.request({
      method: "POST",
      url: `/issues/${issueId}/close`,
    })
  }
}

module.exports = {UsersModel, IssuesModel}
