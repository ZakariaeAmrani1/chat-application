import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.autoreload
import os
import uuid
import sqlite3
from urllib.parse import quote
from urllib.parse import unquote

clients = []
users = []
users1 = []
groups = []
groups1 = []

class groupmessageDeleteHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        groups1.append(self)
    def on_message(self, message1):
        message = message1.split(",")
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor.execute("UPDATE groupmessages set message = 'This message was deleted.' WHERE id =?",(message[0],))
        conn.commit()
        conn.close()
        for user in groups1:
            user.write_message(message1)
    def on_close(self):
        groups1.remove(self)

class messageDeleteHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        users1.append(self)
    def on_message(self, message1):
        message = message1.split(",")
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor.execute("UPDATE messages set message = 'This message was deleted.' WHERE id =?",(message[0],))
        conn.commit()
        conn.close()
        for user in users1:
            user.write_message(message1)
    def on_close(self):
        users1.remove(self)

class groupEditHandler(tornado.web.RequestHandler):
    
    def post(self):
        groupid = self.get_argument("groupid")
        groupname = self.get_argument("groupname")
        groupstatus = self.get_argument("groupstatus")
        removegroupmembers = self.get_argument("removegroupmembers").split(',')
        addgroupmembers = self.get_argument("addgroupmembers").split(',')
        groupoldimage = self.get_argument("groupoldimage")
        group_image = self.request.files.get("groupimage", None)
        group_image_path = None
        if group_image:
            filename = f"{uuid.uuid4().hex}_{group_image[0]['filename']}"
            group_image_path = os.path.join("static", "uploads", filename)
            with open(group_image_path, "wb") as f:
                f.write(group_image[0]['body'])
        else: 
            group_image_path = groupoldimage
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor1 = conn.cursor()
        cursor2 = conn.cursor()
        cursor.execute('''UPDATE groups SET name = ? , group_image = ? , Description = ?   where id = ?''',(groupname,group_image_path,groupstatus,groupid,))
        if addgroupmembers[0]:
            for member in addgroupmembers:
                cursor1.execute(''' INSERT INTO group_members  (group_id,user_id) VALUES (?,?)''',(groupid,member,))
        if removegroupmembers[0]:
            for member in removegroupmembers:
                cursor2.execute(''' DELETE FROM group_members WHERE group_id = ? and user_id = ?''',(groupid,member,))
        conn.commit()
        self.redirect("/index")

class friendAddHandler(tornado.websocket.WebSocketHandler):
    def on_message(self, message1):
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor1 = conn.cursor()
        cursor2 = conn.cursor()
        message= message1.split(',')
        cursor.execute("INSERT INTO friends (friend1,friend2) VALUES (?,?) ", (message[0],message[1],))
        cursor1.execute("INSERT INTO friends (friend1,friend2) VALUES (?,?)", (message[1],message[0],))
        cursor2.execute("SELECT NickName,id,Status, profile_image_path, onoff FROM users where id=?",(message[1],))
        friendinfo = cursor2.fetchone()
        friendinfo = friendinfo[0]+","+str(friendinfo[1])+","+friendinfo[2]+","+friendinfo[3]+","+str(friendinfo[4])
        conn.commit()
        conn.close()
        self.write_message(friendinfo)

class groupAddHandler(tornado.websocket.WebSocketHandler):

    def on_message(self, message1):
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor2 = conn.cursor()
        message= message1.split(',')
        cursor.execute("INSERT INTO group_members (group_id,user_id) VALUES (?,?) ", (message[1],message[0],))
        cursor2.execute("SELECT id, name , group_image ,Description FROM groups where id=?",(message[1],))
        groupinfo = cursor2.fetchone()
        groupinfo = str(groupinfo[0])+","+groupinfo[1]+","+groupinfo[2]+","+groupinfo[3]
        conn.commit()
        conn.close()
        self.write_message(groupinfo)


class groupRemoverHandler(tornado.websocket.WebSocketHandler):

    def on_message(self, message1):
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor2 = conn.cursor()
        message= message1.split(',')
        cursor.execute("DELETE FROM group_members WHERE group_id = ? and user_id = ?", (message[1],message[0],))
        cursor2.execute("SELECT id, name , group_image ,Description FROM groups where id=?",(message[1],))
        groupinfo = cursor2.fetchone()
        groupinfo = str(groupinfo[0])+","+groupinfo[1]+","+groupinfo[2]+","+groupinfo[3]
        conn.commit()
        conn.close()
        self.write_message(groupinfo)

class friendRemoverHandler(tornado.websocket.WebSocketHandler):
    def on_message(self, message1):
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor1 = conn.cursor()
        cursor2 = conn.cursor()
        message= message1.split(',')
        cursor.execute("DELETE FROM friends WHERE friend1 = ? and friend2 = ?", (message[0],message[1],))
        cursor1.execute("DELETE FROM friends WHERE friend1 = ? and friend2 = ?", (message[1],message[0],))
        cursor2.execute("SELECT NickName,id,Status, profile_image_path, onoff FROM users where id=?",(message[1],))
        friendinfo = cursor2.fetchone()
        friendinfo = friendinfo[0]+","+str(friendinfo[1])+","+friendinfo[2]+","+friendinfo[3]+","+str(friendinfo[4])
        conn.commit()
        conn.close()
        self.write_message(friendinfo)

class groupChatHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        groups.append(self)
    
    def on_message(self, message1):
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor1=conn.cursor()
        message=message1.split(",")
        cursor.execute("INSERT INTO groupmessages (message,send,groupid,sendimage) VALUES (?,?,?,?)", (message[0],message[1],message[2],message[3],))
        cursor1.execute("SELECT timestamp,id FROM groupmessages where message = ? and send = ? ORDER BY timestamp DESC", (message[0],message[1],))
        messagetime=cursor1.fetchone()
        message1=message1+","+messagetime[0]+","+str(messagetime[1])
        conn.commit()
        conn.close()  
        for group in groups:
            group.write_message(message1)
        message=""
        message1=""
    def on_close(self):
        groups.remove(self)

class ChatHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        clients.append(self)
    
    def on_message(self, message1):
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor1=conn.cursor()
        cursor2=conn.cursor()
        cursor3=conn.cursor()
        message=message1.split(",")
        cursor.execute("INSERT INTO messages (message,send,recive) VALUES (?,?,?)", (message[0],message[1],message[2],))
        cursor1.execute("SELECT timestamp,id FROM messages where message = ? and send = ? and recive = ? ORDER BY timestamp DESC", (message[0],message[1],message[2],))
        messagetime=cursor1.fetchone()
        cursor2.execute("SELECT profile_image_path FROM users where id = ? ",(message[1],))
        sendprofilepicture=cursor2.fetchone()
        cursor3.execute("SELECT profile_image_path FROM users where id = ? ",(message[2],))
        reciveprofilepicture=cursor3.fetchone()
        message1=message1+","+messagetime[0]+","+sendprofilepicture[0]+","+reciveprofilepicture[0]+","+str(messagetime[1])
        conn.commit()
        conn.close()  
        for client in clients:
            client.write_message(message1)
        message=""
        message1=""
    def on_close(self):
        clients.remove(self)

class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        usererror = ''
        self.render("login.html",usererror=usererror) 
    
    def post(self):
        username = self.get_argument("username")
        password = self.get_argument("password")
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor1=conn.cursor()
        cursor.execute("SELECT id, NickName , Password ,Status , profile_image_path, Phonenumber FROM users where NickName = ? and Password = ?",(username,password,))
        result= cursor.fetchone()

        if result:
            
            id= str(result[0])
            username = str(result[1])
            password = str(result[2])
            status = str(result[3])
            profileimage=str(result[4])
            phonenumber = str(result[5])
            userinfo = id+","+username+","+password+","+status+","+profileimage+","+phonenumber
            cursor1.execute('''UPDATE users SET onoff = 1 where id = ?''',(id,))
            conn.commit()
            self.set_cookie("encoded_data", quote(userinfo))
            self.redirect("/index")
        else:
            usererror = 'error'
            self.render("login.html",usererror=usererror)
        conn.close()  

class SignHandler(tornado.web.RequestHandler):
    def get(self):
        usererror1=''
        self.render("sign.html",usererror1=usererror1) 
    def post(self):
        v=0
        nickname = self.get_argument("nickname")
        password = self.get_argument("password")
        phonenumber = self.get_argument("phonenumber")
        gender = self.get_argument("gender")
        status = self.get_argument("status")
        profile_image = self.request.files.get("profileImage", None)
        profile_image_path = None
        if profile_image:
            filename = f"{uuid.uuid4().hex}_{profile_image[0]['filename']}"
            profile_image_path = os.path.join("static", "uploads", filename)
            with open(profile_image_path, "wb") as f:
                f.write(profile_image[0]['body'])
        else:
            profile_image_path = "static/uploads/profile.png"
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor1 = conn.cursor()
        cursor1.execute("SELECT Nickname from users")
        usersnickname = cursor1.fetchall()
        for usernickname in usersnickname:
            if nickname == usernickname[0]:
                usererror1 = 'error'
                v=1
                self.render("sign.html",usererror1=usererror1) 
                usererror1 = ''
                break
        if v==0 :
            cursor.execute("INSERT INTO users (Nickname , Password , Gender , Phonenumber , Status , profile_image_path,onoff) VALUES (?,?,?,?,?,?,1)", (nickname, password, gender, phonenumber,status,profile_image_path,))
            cursor.execute("commit")
            cursor1 = conn.cursor()
            cursor1.execute("SELECT id, NickName , Password ,Status ,profile_image_path,Phonenumber FROM users where NickName = ? and Password = ?",(nickname,password,))
            result= cursor1.fetchone()
            id= str(result[0])
            username = str(result[1])
            password = str(result[2])
            status = str(result[3])
            profileimage=str(result[4])
            phonenumber = str(result[5])
            userinfo = id+","+username+","+password+","+status+","+profileimage+","+phonenumber
            self.set_cookie("encoded_data", quote(userinfo))
            conn.close()
            self.redirect("/index")

class groupCreateHandler(tornado.web.RequestHandler):
    
    def post(self):
        userid = self.get_argument("userid")
        groupname = self.get_argument("groupname")
        groupstatus = self.get_argument("groupstatus")
        groupmembers = self.get_argument("groupmembers")
        groupmembers = groupmembers.split(',')
        group_image = self.request.files.get("groupimage", None)
        profile_image_path = None
        if group_image:
            filename = f"{uuid.uuid4().hex}_{group_image[0]['filename']}"
            profile_image_path = os.path.join("static", "uploads", filename)
            with open(profile_image_path, "wb") as f:
                f.write(group_image[0]['body'])
        else:
            profile_image_path = "static/uploads/profile.png"
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor1 = conn.cursor()
        cursor2 = conn.cursor()
        cursor.execute('''INSERT INTO groups(name,group_image,Description) VALUES(?,?,?)''',(groupname,profile_image_path,groupstatus,))
        cursor1.execute(''' SELECT id FROM groups WHERE name = ? and Description = ? ORDER BY  Reg_time DESC''',(groupname,groupstatus,))
        groupid = cursor1.fetchone()
        cursor2.execute(''' INSERT INTO group_members  (group_id,user_id) VALUES (?,?)''',(groupid[0],userid,))
        if groupmembers:
            for member in groupmembers:
                cursor2.execute(''' INSERT INTO group_members  (group_id,user_id) VALUES (?,?)''',(groupid[0],member,))
        conn.commit()
        self.redirect("/index")

class profileHandler(tornado.web.RequestHandler):
    
    def post(self):
        userinfo = self.get_cookie('encoded_data', default=None)
        userinfo=unquote(userinfo)
        userinfo=userinfo.split(",")
        id = userinfo[0]
        username = userinfo[1]
        password = self.get_argument("password")
        phonenumber = self.get_argument("phonenumber")
        status = self.get_argument("status")
        profile_image = self.request.files.get("profileimage", None)
        profile_image_path = None
        if profile_image:
            filename = f"{uuid.uuid4().hex}_{profile_image[0]['filename']}"
            profile_image_path = os.path.join("static", "uploads", filename)
            with open(profile_image_path, "wb") as f:
                f.write(profile_image[0]['body'])
        else: 
            profile_image_path = str(userinfo[4])
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor.execute('''UPDATE users SET NickName = ? , Password = ? , Phonenumber = ? , Status = ? ,profile_image_path = ? where id = ?''',(username,password,phonenumber,status,profile_image_path,id,))
        conn.commit()
        userinfo = id+","+username+","+password+","+status+","+profile_image_path+","+phonenumber
        self.set_cookie("encoded_data", quote(userinfo))
        self.redirect("/index")
       



class WebSocketHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        users.append(self)
        userinfo = self.get_cookie('encoded_data', default=None)
        userinfo=unquote(userinfo)
        userinfo=userinfo.split(",")
        id = userinfo[0]
        onoff = '1'
        conn = sqlite3.connect('chat.db')
        cursor1=conn.cursor()
        cursor1.execute('''UPDATE users SET onoff = 1 where id = ?''',(id,))
        conn.commit()
        message1 = id + "," + onoff
        for user in users:
            user.write_message(message1)
        
    def on_close(self):
        userinfo = self.get_cookie('encoded_data', default=None)
        userinfo=unquote(userinfo)
        userinfo=userinfo.split(",")
        id = userinfo[0]
        onoff = '0'
        conn = sqlite3.connect('chat.db')
        cursor1=conn.cursor()
        cursor1.execute('''UPDATE users SET onoff = 0 where id = ?''',(id,))
        conn.commit()
        message1 = id + "," + onoff
        for user in users:
            try:
                user.write_message(message1)
            except Exception as e:
                pass
        users.remove(self)

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        userinfo = self.get_cookie('encoded_data', default=None)
        userinfo=unquote(userinfo)
        userinfo=userinfo.split(",")
        id =int(userinfo[0])
        username = str(userinfo[1])
        password = str(userinfo[2])
        status = str(userinfo[3])
        profileimage = "/"+str(userinfo[4])
        phonenumber = str(userinfo[5])
        friends=[]
        groupsinfo = []
        groupmembers = []
        groupmembersinfo = []
        infos =[]
        conn = sqlite3.connect('chat.db')
        cursor = conn.cursor()
        cursor0 = conn.cursor()
        cursor1=conn.cursor()
        cursor2=conn.cursor()
        cursor3=conn.cursor()
        cursor4=conn.cursor()
        cursor5=conn.cursor()
        cursor6=conn.cursor()
        cursor7=conn.cursor()
        cursor8=conn.cursor()
        cursor9=conn.cursor()
        cursor.execute("SELECT message,send,recive,timestamp,id FROM messages ORDER BY timestamp")
        cursor0.execute("SELECT NickName FROM users where id=?",(id,))
        cursor1.execute("SELECT friend2 FROM friends where friend1=?",(id,))
        friendsid = cursor1.fetchall()   
        cursor8.execute("SELECT NickName,id,Status, profile_image_path, onoff  FROM users WHERE id NOT IN (SELECT friend2 FROM friends WHERE friend1 = ? OR friend2 = ?)",(id,id,))
        cursor9.execute("SELECT id, name , group_image ,Description FROM groups WHERE id NOT IN (SELECT group_id FROM group_members WHERE user_id =?)",(id,))
        users= cursor8.fetchall()
        allgroups = cursor9.fetchall()
        if friendsid:
            for i in range(0,len(friendsid)):
                cursor2.execute("SELECT NickName,id,Status, profile_image_path, onoff, Phonenumber, Gender FROM users where id=?",(friendsid[i][0],))
                friends.append(cursor2.fetchone())
        
        messages = cursor.fetchall()
        cursor3.execute("SELECT group_id FROM group_members WHERE user_id = ?",(id,))
        groups = cursor3.fetchall()
        if groups:
            for i in range(0,len(groups)):
                cursor4.execute("SELECT id, name , group_image ,Description FROM groups WHERE id = ?",(groups[i][0],))
                cursor6.execute("SELECT user_id,group_id FROM group_members WHERE group_id = ?",(groups[i][0],))
                groupmembers.append(cursor6.fetchall())
                groupsinfo.append(cursor4.fetchone())
        if groupmembers:
            for i in range (0,len(groupmembers)):
                for j in range(0,len(groupmembers[i])):
                    cursor7.execute("SELECT id , NickName , profile_image_path FROM users WHERE id = ?",(groupmembers[i][j][0],))
                    infos.append(cursor7.fetchall())
                groupmembersinfo.append(infos)
                infos =[]
        cursor5.execute("SELECT message , send , timestamp ,groupid ,sendimage, id FROM groupmessages")
        groupmessages = cursor5.fetchall()
        
        conn.close()
        self.render("index.html", messages=messages,id=id,username=username,password=password,status=status,profileimage=profileimage,phonenumber=phonenumber,friends=friends,friendsid=friendsid,users=users,groupsinfo=groupsinfo,groupmessages=groupmessages,groupmembersinfo=groupmembersinfo,groupmembers=groupmembers,allgroups=allgroups) 
        friends=[]

application = tornado.web.Application([
    (r"/index", MainHandler),
    (r"/chat", ChatHandler),
    (r"/sign", SignHandler),
    (r"/", LoginHandler),
    (r"/ws", WebSocketHandler),
    (r"/editprofile", profileHandler),
    (r"/groupchat", groupChatHandler),
    (r"/friendremover", friendRemoverHandler),
    (r"/groupremover", groupRemoverHandler),
    (r"/addfriend", friendAddHandler),
    (r"/addgroup", groupAddHandler),
    (r"/creategroup", groupCreateHandler),
    (r"/editgroup", groupEditHandler),
    (r"/deletemessage", messageDeleteHandler),
    (r"/groupdeletemessage", groupmessageDeleteHandler),
    (r'/static/(.*)', tornado.web.StaticFileHandler, {"path": "static"})
],template_path="templates")


if __name__ == "__main__":
    application.listen(8888)
    print("Server is running ...")
    tornado.autoreload.start()
    tornado.autoreload.watch("style.css")
    tornado.autoreload.watch("script.js")
    tornado.ioloop.IOLoop.current().start()