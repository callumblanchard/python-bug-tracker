const m = require('mithril');

class Dashboard {
  constructor(vnode) {
    this.model = vnode.attrs.model;
  }

  oninit() {
    this.model.loadIssues();
  }

  view() {
    return [
      m('.container', [
        m(
          'a.btn.btn-primary',
          { href: '/issues', oncreate: m.route.link },
          'View Issues',
        ),
        m('div', [
          m('p.h3', `Number of open issues: ${this.model.countOpen}`),
          m('p.h3', `Number of issues closed in the last week: ${this.model.countCLW}`),
        ]),
      ]),
    ];
  }
}

class UserInputField {
  constructor(vnode) {
    this.fields = vnode.attrs.fields;
  }

  view() {
    return [
      m('.container', [
        m('.row', [
          m('.col-lg-3.col-md-2'),
          m('.col-lg-6.col-md-2', this.fields),
        ]),
        m('.col-lg-3.col-md-2'),
      ]),
    ];
  }
}

class Login {
  constructor(vnode) {
    this.model = vnode.attrs.model;
  }

  oninit() {
    this.email = '';
    this.password = '';
  }

  view() {
    return m('form', {
      onsubmit: () => this.onSubmit({
        email: this.email,
        password: this.password,
      }),
    }, m(UserInputField, {
      fields: [
        m('.form-group', [
          m('label', { for: 'email-input' }, 'E-mail Address'),
          m('input.form-control#email-input', { value: this.email, oninput: (e) => { this.email = e.target.value; } }),
        ]),
        m('.form-group', [
          m('label', { for: 'password-input' }, 'Password'),
          m('input.form-control#password-input', { type: 'password', oninput: (e) => { this.password = e.target.value; } }, this.password),
        ]),
        m('button.btn.btn-primary#login-button', { type: 'submit' }, 'Login'),
      ],
    }));
  }
}

class Register {
  constructor(vnode) {
    this.model = vnode.attrs.model;
  }

  oninit() {
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  view() {
    return m('form', {
      onsubmit: () => {
        console.log('submitting');
        if (this.password !== this.confirmPassword) {
          console.log('passwords do not match.');
        } else {
          this.model.createUser({
            user: this.email,
            password: this.password,
          });
          m.route.set('/issues');
          m.redraw();
        }
      },
    }, m(UserInputField, {
      fields: [
        m('.form-group', [
          m('label', { for: 'email-input' }, 'E-mail Address'),
          m('input.form-control#email-input', { value: this.email, oninput: (e) => { this.email = e.target.value; } }),
        ]),
        m('.form-group', [
          m('label', { for: 'password-input' }, 'Password'),
          m('input.form-control#password-input', { type: 'password', oninput: (e) => { this.password = e.target.value; } }, this.password),
        ]),
        m('.form-group', [
          m('label', { for: 'confirm-password-input' }, 'Confirm Password'),
          m('input.form-control#confirm-password-input', { type: 'password', oninput: (e) => { this.confirmPassword = e.target.value; } }, this.confirmPassword),
        ]),
        m('button.btn.btn-primary#register-button', { type: 'submit' }, 'Register'),
      ],
    }));
  }
}

class IssueEditor {
  constructor(vnode) {
    this.title = vnode.attrs.title;
    this.descriptionText = vnode.attrs.descriptionText;
    this.onSubmit = vnode.attrs.onSubmit;
  }

  view() {
    return m('form', {
      onsubmit: () => this.onSubmit({
        title: this.title,
        description: this.descriptionText,
      }),
    }, [
      m('.form-group', [
        m('label', { for: 'title-input' }, 'Issue Title'),
        m('input.form-control#title-input', { value: this.title, oninput: (e) => { this.title = e.target.value; } }),
      ]),
      m('.form-group', [
        m('label', { for: 'description-input' }, 'Issue Description'),
        m('textarea.form-control#description-input', { oninput: (e) => { this.descriptionText = e.target.value; } }, this.descriptionText),
      ]),
      m('button.btn.btn-primary#save-button', { type: 'submit' }, 'Save'),
    ]);
  }
}

class IssuesList {
  constructor(vnode) {
    this.model = vnode.attrs.model;
  }

  oninit() {
    this.model.loadIssues();
  }

  view() {
    return m('table.table', [
      m('thead', [
        m('th', 'title'),
        m('th', 'opened'),
        m('th', 'closed'),
      ]),
      m('tbody', [
        this.model.list.map((item) => m('tr', [
          m('td.title-cell', m('a', { href: `/issues/${item.id}`, oncreate: m.route.link }, item.title)),
          m('td.opened-cell', item.opened),
          m('td.closed-cell', item.closed),
        ])),
      ]),
    ]);
  }
}

class ViewIssue {
  constructor(vnode) {
    this.model = vnode.attrs.model;
    this.issueId = vnode.attrs.issueId;
  }

  oninit() {
    this.model.loadIssue(this.issueId);
  }

  view() {
    const detail = this.model.issues[this.issueId];
    return detail
      ? m('div', [
        m('.row', [
          m('h1.col-sm-9', detail.title),
          m('.col-sm-1',
            m(
              'a.btn.btn-primary',
              { href: `/issues/${this.issueId}/edit`, oncreate: m.route.link },
              'Edit',
            )),
          m('.col-sm-2',
            m(
              'a.btn.btn-danger',
              { href: `/issues/${this.issueId}/close`, oncreate: m.route.link },
              'Close Issue',
            )),
        ]),
        m('dl.row', [
          m('dt.col-sm-3', 'Opened'),
          m('dd.col-sm-3', detail.opened),
          m('dt.col-sm-3', 'Closed'),
          m('dd.col-sm-3', detail.closed),
        ]),
        m('h2', 'Description'),
        m('p.description', detail.description),
      ])
      : m('.alert.alert-info', 'Loading');
  }
}

class EditIssue {
  constructor(vnode) {
    this.model = vnode.attrs.model;
    this.issueId = vnode.attrs.issueId;
  }

  async oninit() {
    await this.model.loadIssue(this.issueId);
  }

  view() {
    const issue = this.model.issues[this.issueId];
    return issue
      ? m(IssueEditor, {
        title: issue.title,
        descriptionText: issue.description,
        onSubmit: async (fields) => {
          await this.model.updateIssue(this.issueId, fields);
          m.route.set(`/issues/${this.issueId}`);
          m.redraw();
        },
      })
      : m('.alert.alert-info', 'Loading');
  }
}

class CreateIssue {
  constructor(vnode) {
    this.model = vnode.attrs.model;
  }

  view() {
    return m(IssueEditor, {
      title: '',
      descriptionText: '',
      onSubmit: async (fields) => {
        await this.model.createIssue(fields);
        m.route.set('/issues');
        m.redraw();
      },
    });
  }
}

class CloseIssue {
  constructor(vnode) {
    this.model = vnode.attrs.model;
    this.issueId = vnode.attrs.issueId;
  }

  async view() {
    await this.model.closeIssue(this.issueId);
    m.route.set('/issues');
    m.redraw();
  }
}

const ToolbarContainer = {
  view(vnode) {
    return m('div', [
      m('nav.navbar.navbar-expand-lg.navbar-light.bg-light', [
        m('.container', [
          m('a.navbar-brand', { href: '/home', oncreate: m.route.link }, 'Bug Tracker'),
          m('.collapse.navbar-collapse', [
            m('ul.navbar-nav.mr-auto', [
              m('li.nav-item', [
                m('a.nav-link', { href: '/issues/create', oncreate: m.route.link }, 'Create'),
              ]),
            ]),
            m('ul.navbar-nav', [
              m('li.nav_item', [
                m('a.nav-link', { href: '/login', oncreate: m.route.link }, 'Login'),
              ]),
              m('li.nav_item', [
                m('a.nav-link', { href: '/register', oncreate: m.route.link }, 'Register'),
              ]),
            ]),
          ]),
        ]),
      ]),
      m('.container.pt-4', vnode.children),
    ]);
  },
};

module.exports = {
  Dashboard,
  Login,
  Register,
  IssuesList,
  ViewIssue,
  EditIssue,
  CreateIssue,
  IssueEditor,
  ToolbarContainer,
  CloseIssue,
};
