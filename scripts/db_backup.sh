#/bin/bash

NOW=$(date +"%Y-%m-%d")
FILE="db_referenda_backup.$NOW"
pg_dump -U postgres -w -d referenda > $FILE