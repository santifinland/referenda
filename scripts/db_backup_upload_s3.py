from boto.s3.connection import S3Connection
from boto.s3.bucket import Bucket
from crypto import encrypt
from datetime import date
import ConfigParser
import os
import tarfile


# Read configuration
config = ConfigParser.RawConfigParser()
config.read('referenda.cfg')
aws_access_key = config.get('AWS', 'key')
aws_secret_key = config.get('AWS', 'secret')
bucket_name = config.get('AWS', 'bucket')
backup_filename = config.get('DB', 'backup_filename')


# File names to be used
backup_filename_with_day = backup_filename + "." + str(date.today())
encrypted_backup_filename_with_day = "encrypted_" + backup_filename_with_day
zipped_encrypted_backup_filename_with_day = encrypted_backup_filename_with_day + ".tar.gz"


# Encrypt database backup file
password = "change"
with open(backup_filename_with_day, 'rb') as in_file, open(encrypted_backup_filename_with_day, 'wb') as out_file:
    encrypt(in_file, out_file, password)


# Make tar gz file
tar = tarfile.open(zipped_encrypted_backup_filename_with_day, "w:gz")
tar.add(encrypted_backup_filename_with_day)
tar.close()


# Upload daily database backup file
#conn = S3Connection(aws_access_key, aws_secret_key)
#b = Bucket(conn, bucket_name)
#print backup_filename
#key = b.new_key(backup_filename)
#key.set_contents_from_filename(backup_filename)


# Remove not needed files
os.remove(backup_filename_with_day)
os.remove(encrypted_backup_filename_with_day)

