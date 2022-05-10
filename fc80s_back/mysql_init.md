create databases fc80s_db;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
grant all on fc80s_db.* to 'fc80s'@'%';
show grants for fc80s;
