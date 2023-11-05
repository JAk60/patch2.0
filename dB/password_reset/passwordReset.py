from flask_mail import Message
from dB.dB_connection import cursor, cnxn
from flask import render_template


class EmailSender:
    def __init__(self, mail):
        self.mail = mail

    def get_user_info(self, username):
        cursor.execute(
            'SELECT username, level FROM users WHERE username = ?', username)
        columns = [column[0] for column in cursor.description]
        user_info = cursor.fetchone()

        if user_info:
            return dict(zip(columns, user_info))
        else:
            return None

    def send_notification_email(self, username, logo_data):
        user_info = self.get_user_info(username)

        if user_info:
            msg = Message('Reset Request Notification', sender='lazaro.dubuque54@ethereal.email',
                        recipients=['lazaro.dubuque54@ethereal.email'])

            msg.attach('netra.png', 'image/png', logo_data, 'inline', headers=[['Content-ID', '<netra_cid>']])

            html_body = render_template('reset_email.html', user_info=user_info ,logo_data=logo_data)

            msg.html = html_body

            try:
                self.mail.send(msg)
                return "Password reset email sent successfully", 200
            except Exception as e:
                print(f"Error sending email: {e}")
                return "Error sending password reset email", 500
        else:
            return "Username is incorrect. Please enter a valid username.", 404
