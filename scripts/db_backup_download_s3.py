from boto.s3.connection import S3Connection
from boto.s3.bucket import Bucket
from crypto import decrypt
from datetime import date
import ConfigParser
import tarfile


# Read configuration
config = ConfigParser.RawConfigParser()
config.read('referenda.cfg')
aws_access_key = config.get('AWS', 'key')
aws_secret_key = config.get('AWS', 'secret')
bucket_name = config.get('AWS', 'bucket')
backup_filename = config.get('DB', 'backup_filename')
s3_folder = config.get('DB', 's3_folder')
password = config.get('Crypto', 'password')


# File names to be used
backup_filename_with_day = backup_filename + "." + str(date.today())
encrypted_backup_filename_with_day = "encrypted_" + backup_filename_with_day
zipped_encrypted_backup_filename_with_day = encrypted_backup_filename_with_day + ".tar.gz"


# Download daily database backup file
conn = S3Connection(aws_access_key, aws_secret_key)
b = Bucket(conn, bucket_name)
key = b.new_key(s3_folder + "/" + zipped_encrypted_backup_filename_with_day)
key.get_contents_to_filename(zipped_encrypted_backup_filename_with_day)


# Unzip downloaded database backup file
tar = tarfile.open(zipped_encrypted_backup_filename_with_day)
tar.extractall()
tar.close()


# Decrypt downloaded database backup file
with open(encrypted_backup_filename_with_day, 'rb') as in_file, open(backup_filename_with_day, 'wb') as out_file:
    decrypt(in_file, out_file, password)
