from os import name
from dB.dB_connection import cursor, cnxn
from dB.dB_utility import check_table_exist
from flask import jsonify


class MissionProfile:
    def __init__(self):
        '''To save the mission data, we  need to create the mission profile table.
        In init function, we initialize the table'''
        self.success_return = {"message": "Data Saved Successfully.",
                               "code": 1}
        self.error_return = {"message": "Some Error Occured, Please try agian.",
                             "code": 0}
        is_exist = check_table_exist('mission_profile')
        if not is_exist:
            create_sql = '''create table mission_profile
                            (
                                id           varchar(45) not null
                                    constraint mission_profile_pk
                                        primary key nonclustered,
                                mission_name varchar(max),
                                harbour_dur  varchar(200),
                                ELH_dur      varchar(200),
                                cruise_dur   varchar(200),
                                defense_dur  varchar(200),
                                action_dur   varchar(200),
                                target_rel   float
                            )'''
            cursor.execute(create_sql)
            cnxn.commit()

    def insert_mission(self, data):
        insert_sql = '''insert into mission_profile (id, mission_name, harbour_dur,
         ELH_dur, cruise_dur, defense_dur, action_dur, target_rel)
        values (?, ?, ?, ?, ?, ?, ?, ?);'''
        try:
            self.delete_all_missions()
            for mission in data:
                id = mission['id']
                name = mission['missionName']
                harbour = mission['Harbour']
                elh = mission['elh']
                cruise = mission['cruise']
                ds = mission['ds']
                action_s = mission['as']
                tar_rel = mission['tar_rel']
                cursor.execute(insert_sql, id, name, harbour,
                                   elh, cruise, ds, action_s, tar_rel)
            cnxn.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def update_mission(self, mission):
        id = mission['id']
        name = mission['missionName']
        harbour = mission['Harbour']
        elh = mission['elh']
        cruise = mission['cruise']
        ds = mission['ds']
        action_s = mission['as']
        tar_rel = mission['tar_rel']
        update_sql = '''update mission_profile set mission_name =?, harbour_dur =?,
         ELH_dur =?, cruise_dur =?, defense_dur =?, action_dur=?, target_rel=?  where id= ?'''
        try:
            cursor.execute(update_sql, name, harbour,
                           elh, cruise, ds, action_s, tar_rel, id)
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def select_mission(self, toJson=True):
        sql = '''select * from mission_profile'''
        cursor.execute(sql)
        d = cursor.fetchall()
        data = [{
            'id': r[0],
            'missionName': r[1],
            'Harbour': r[2],
            'elh': r[3],
            'cruise': r[4],
            'ds': r[5],
            'as': r[6],
            'tar_rel': r[7]
        } for r in d]
        if toJson:
            return jsonify(data)
        else:
            return data

    def check_mission_exists(self, id):
        check_sql = '''select mission_name from mission_profile where id = ?'''
        cursor.execute(check_sql, id)
        exist = cursor.fetchone()
        if exist:
            return True
        else:
            False

    def delete_all_missions(self):
        delete_sql = '''delete from mission_profile'''
        cursor.execute(delete_sql)
        cnxn.commit()
