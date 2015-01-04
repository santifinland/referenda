import ConfigParser
from subprocess import call


def stop_db():
    call(["/etc/init.d/postgresql", "stop"])


# Read configuration
config = ConfigParser.RawConfigParser()
config.read('referenda.cfg')
log_filename = config.get('DB', 'log_filename')


# Open log file in read mode
in_file = open(log_filename, 'r')
lines = in_file.readlines()
in_file.close

# Search failed loging and stop db if needed
failed_login_threshold = 3
failed_logins = 0
for line in lines:
    if "FATAL" in line:
        failed_logins = failed_logins + 1
if failed_logins > failed_login_threshold:
    stop_db()

