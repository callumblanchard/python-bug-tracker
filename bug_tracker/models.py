from __future__ import absolute_import
import dateutil.parser
import sqlite3
from collections import namedtuple
from datetime import datetime
import hashlib
import binascii
import os

from .migrate_database import do_migrations


def hash_password(password):
    """Hash a password for storing."""
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    pwdhash = hashlib.pbkdf2_hmac(
        'sha512', password.encode('utf-8'), salt, 100000
    )
    pwdhash = binascii.hexlify(pwdhash)
    return (salt + pwdhash).decode('ascii')


def verify_password(stored_passwd, provided_passwd):
    """Verify a stored password against one provided by user"""
    salt = stored_passwd[:64]
    stored_password = stored_passwd[64:]
    pwdhash = hashlib.pbkdf2_hmac(
        'sha512', provided_passwd.encode('utf-8'), salt.encode('ascii'), 100000
    )
    pwdhash = binascii.hexlify(pwdhash).decode('ascii')
    return pwdhash == stored_password


class Repository(object):
    def __init__(self, database_location):
        self._database_location = database_location

    def open(self):
        return RepositoryConnection(sqlite3.connect(self._database_location))

    def migrate_database(self):
        with sqlite3.connect(self._database_location) as conn:
            cursor = conn.cursor()
            try:
                do_migrations(cursor)
            finally:
                cursor.close()


class RepositoryConnection(object):
    def __init__(self, conn):
        self._conn = conn
        self.issues = IssueRepository(self._conn)
        self.users = UserRepository(self._conn)

    def __enter__(self):
        return self

    def __exit__(self, exc, type_, tb):
        try:
            self._conn.__exit__(exc, type_, tb)
        finally:
            self._conn.close()

    def close(self):
        self._conn.close()


User = namedtuple('User', ['id', 'user'])


def make_user(row):
    try:
        id_, user = row
    except TypeError:
        return None
    return User(id_, user)


class UserRepository(object):
    def __init__(self, conn):
        self._conn = conn

    def create_user(
        self, user, password
    ):
        cursor = self._conn.cursor()
        pw_hash = hash_password(password)
        try:
            cursor.execute(
                """INSERT INTO users(
                    username,
                    password
                ) VALUES(?, ?)""",
                (user, pw_hash,)
            )
        finally:
            cursor.close()

    def verify_user(
        self, user_id, password
    ) -> bool:
        cursor = self._conn.cursor()
        try:
            cursor.execute(
                "SELECT password WHERE user = ?",
                (user_id,)
            )
            stored_password = cursor.fetchone()[0]
            return verify_password(stored_password, password)
        finally:
            cursor.close()

    def update_user(
        self, user_id, old_password, new_password
    ):
        if self.verify_user(user_id, old_password):
            cursor = self._conn.cursor()
            new_pw_hash = hash_password(new_password)
            try:
                cursor.execute(
                    "UPDATE users SET password = ? WHERE id = ?",
                    (new_pw_hash, user_id,)
                )
            finally:
                cursor.close()

    def list_users(self):
        cursor = self._conn.cursor()
        try:
            cursor.execute(
                """SELECT
                    id,
                    username
                    FROM users
                    ORDER BY username""")
            return [make_user(row) for row in cursor.fetchall()]
        finally:
            cursor.close()

    def authenticate_user(self, user, password):
        pass


Issue = namedtuple('Issue', ['id', 'title', 'description', 'opened', 'closed'])


def make_issue(row):
    try:
        id_, title, description, opened, closed = row
    except TypeError:
        return None
    if opened is not None:
        opened = dateutil.parser.parse(opened)
    if closed is not None:
        closed = dateutil.parser.parse(closed)
    return Issue(id_, title, description, opened, closed)


class IssueRepository(object):
    def __init__(self, conn):
        self._conn = conn

    def list_issues(self):
        cursor = self._conn.cursor()
        try:
            cursor.execute(
                """SELECT
                    id,
                    title,
                    description,
                    opened_datetime,
                    closed_datetime
                    FROM issues
                    ORDER BY id""")
            return [make_issue(row) for row in cursor.fetchall()]
        finally:
            cursor.close()

    def fetch_issue(self, issue_id):
        cursor = self._conn.cursor()
        try:
            cursor.execute(
                """SELECT
                    id,
                    title,
                    description,
                    opened_datetime,
                    closed_datetime
                    FROM issues
                    WHERE id = ?""",
                (issue_id,)
            )
            return make_issue(cursor.fetchone())
        finally:
            cursor.close()

    def create_issue(self, title, description):
        cursor = self._conn.cursor()
        try:
            cursor.execute(
                """INSERT INTO issues(
                    title,
                    description
                ) VALUES(?, ?)""",
                (title, description,)
            )
            cursor.execute("select last_insert_rowid()")
            return cursor.fetchone()[0]
        finally:
            cursor.close()

    def update_issue(self, issue_id, **kwargs):
        cursor = self._conn.cursor()
        try:
            if 'title' in kwargs:
                cursor.execute(
                    "UPDATE issues SET title = ? WHERE id = ?",
                    (kwargs['title'], issue_id,)
                )
            if 'description' in kwargs:
                cursor.execute(
                    "UPDATE issues SET description = ? WHERE id = ?",
                    (kwargs['description'], issue_id,)
                )
        finally:
            cursor.close()

    def close_issue(self, issue_id):
        cursor = self._conn.cursor()
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        try:
            cursor.execute(
                    """UPDATE issues SET closed_datetime = ? WHERE id = ?""",
                    (now, issue_id,)
                )
        finally:
            cursor.close()
