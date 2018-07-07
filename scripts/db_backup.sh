#!/bin/bash

cd
source /home/sdmt/.virtualenv/referenda/bin/activate
cd referenda/scripts
python db_backup_upload_s3.py

