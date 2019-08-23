from __future__ import absolute_import
import falcon


def _issue_to_json(issue):
    return {
        'id': issue.id,
        'title': issue.title,
        'description': issue.description,
        'opened': issue.opened.isoformat() if issue.opened else None,
        'closed': issue.closed.isoformat() if issue.closed else None,
    }


class UsersResource(object):
    def __init__(self, repo):
        self._repo = repo

    def on_get(self, req, resp):
        with self._repo.open() as repo: # noqa
            pass

    def on_post(self, req, resp):
        with self._repo.open() as repo:
            new_user = req.media
            repo.users.create_user(
                new_user['user'],
                new_user['password'],
                new_user['confirmPassword'],
            )
            resp.status = falcon.HTTP_201


class UserResource(object):
    def __init__(self, repo):
        self._repo = repo

    def on_put(self, req, resp, user_id):
        with self._repo.open() as repo:
            new_user = req.media
            repo.users.update_user(
                user_id,
                new_user['oldPassword'],
                new_user['newPassword'],
                new_user['confirmNewPassword'],
            )
            resp.status = falcon.HTTP_204


class UserAuth(object):
    def __init__(self, repo):
        self._repo = repo

    def on_post(self, req, resp):
        with self._repo.open() as repo: # noqa
            pass


class IssuesResource(object):
    def __init__(self, repo):
        self._repo = repo

    def on_get(self, req, resp):
        with self._repo.open() as repo:
            issue_list = repo.issues.list_issues()
            resp.media = {
                'issues': [_issue_to_json(issue) for issue in issue_list]
            }
            resp.status = falcon.HTTP_200

    def on_post(self, req, resp):
        with self._repo.open() as repo:
            new_issue = req.media
            new_id = repo.issues.create_issue(
                new_issue['title'],
                new_issue['description']
            )
        raise falcon.HTTPSeeOther('/issues/{}'.format(new_id))


class IssueResource(object):
    def __init__(self, repo):
        self._repo = repo

    def on_get(self, req, resp, issue_id):
        with self._repo.open() as repo:
            issue = repo.issues.fetch_issue(issue_id)
            if issue is None:
                resp.media = {"message": "Issue Not Found"}
                resp.status = falcon.HTTP_404
            else:
                resp.media = _issue_to_json(issue)
                resp.status = falcon.HTTP_200

    def on_put(self, req, resp, issue_id):
        with self._repo.open() as repo:
            update = req.media
            repo.issues.update_issue(issue_id, **update)
            resp.status = falcon.HTTP_204


class IssueClose(object):
    def __init__(self, repo):
        self._repo = repo

    def on_post(self, req, resp, issue_id):
        with self._repo.open() as repo:
            repo.issues.close_issue(issue_id)
            resp.status = falcon.HTTP_204
