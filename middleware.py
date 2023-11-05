import os
from flask import json
from dB.dB_connection import cursor, cnxn


import os
from flask import json
from dB.dB_connection import cursor
from dB.Authentication.signin_dB import SignInDB

class TaskMiddleWare(object):
    def __init__(self, app, APP_ROOT):
        self.app = app
        SignInDB()
        self.app_route = APP_ROOT
        self.ship_names_to_remove = set()

        # Load ship names to remove at startup
        self.load_ship_names_to_remove()

    def load_ship_names_to_remove(self):
        target_path = os.path.join(self.app_route, 'tasks/')
        files = os.listdir(target_path)
        for t in files:
            target = os.path.join(self.app_route, 'tasks/' + t)
            task = json.load(open(target))
            for item in task:
                ship_name = item.get("shipName")
                if ship_name:
                    check_sql = "SELECT COUNT(*) FROM user_selection WHERE ship_name = ?"
                    cursor.execute(check_sql, ship_name)
                    count = cursor.fetchone()[0]
                    if count == 0:
                        self.ship_names_to_remove.add(target)

    def __call__(self, environ, start_response):
        # Clean up tasks that should be removed
        self.remove_stale_tasks()
        return self.app(environ, start_response)

    def remove_stale_tasks(self):
        for target in self.ship_names_to_remove:
            os.remove(target)
        self.ship_names_to_remove.clear()