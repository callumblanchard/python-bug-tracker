require('babel-polyfill');
const m = require('mithril');
const {
  Dashboard,
  Login,
  Register,
  IssuesList,
  ViewIssue,
  CreateIssue,
  EditIssue,
  ToolbarContainer,
  CloseIssue,
} = require('./views');
const { UsersModel, IssuesModel } = require('./viewmodels');

const issuesModel = new IssuesModel();
const usersModel = new UsersModel();

// let isLoggedIn = false;

m.route(document.body, '/issues', {
  '/': {
    render() {
      return m(ToolbarContainer, m(Dashboard, { model: issuesModel }));
    },
  },
  '/register': {
    render() {
      return m(ToolbarContainer, m(Register, { model: usersModel }));
    },
  },
  '/login': {
    render() {
      return m(ToolbarContainer, m(Login, { model: usersModel }));
    },
  },
  '/logout': {
    render() {
      return m(ToolbarContainer);
    },
  },
  '/issues': {
    render() {
      return m(ToolbarContainer, m(IssuesList, { model: issuesModel }));
    },
  },
  '/issues/create': {
    render() {
      return m(ToolbarContainer, m(CreateIssue, { model: issuesModel }));
    },
  },
  '/issues/:issueId': {
    render(vnode) {
      return m(
        ToolbarContainer,
        (vnode.attrs.issueId === 'new')
          ? m(CreateIssue, { model: issuesModel })
          : m(ViewIssue, { model: issuesModel, issueId: vnode.attrs.issueId }),
      );
    },
  },
  '/issues/:issueId/edit': {
    render(vnode) {
      return m(ToolbarContainer, m(
        EditIssue, { model: issuesModel, issueId: vnode.attrs.issueId },
      ));
    },
  },
  '/issues/:issueId/close': {
    render(vnode) {
      return m(ToolbarContainer, m(
        CloseIssue, { model: issuesModel, issueId: vnode.attrs.issueId },
      ));
    },
  },
});
