# migrate cmds
```
python3 manage.py inspectdb
python3 manage.py migrate index
python3 manage.py makemigrations index
```

# 不顺时 尝试删除模块下的 migrations 文件夹
# 不顺时 尝试删除 DB 文件
pipenv run python3 manage.py migrate --run-syncdb
