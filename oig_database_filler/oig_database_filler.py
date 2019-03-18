from botocore.vendored import requests
import csv
import pymysql

OIG_URL = "https://oig.hhs.gov/exclusions/downloadables/UPDATED.csv"


def import_the_csv(mydb):
    cursor = mydb.cursor()

    truncate = 'TRUNCATE `oigdatabase`.`oig_local`;'

    load_sql = "LOAD DATA LOCAL INFILE '/tmp/output.csv'" \
               " INTO TABLE oigdatabase.oig_local FIELDS TERMINATED BY ',' ENCLOSED BY '{}' IGNORE 1 LINES" \
               "(`LASTNAME`,`FIRSTNAME`,`MIDNAME`,`BUSNAME`,`GENERAL`,`SPECIALTY`,`UPIN`,`NPI`,`DOB`,`ADDRESS`,`CITY`,`STATE`,`ZIP`,`EXCLTYPE`,`EXCLDATE`,`REINDATE`,`WAIVERDATE`,`WVRSTATE`);".format('"')

    cursor.execute(truncate)
    mydb.commit()
    print('Successfully truncated the oig_local table.')

    cursor.execute(load_sql)
    print('Successfully loaded the oig_local table from csv.')

    mydb.commit()
    cursor.close()
    print("Done")

    return True


def get_csv():
    print('start csv download')
    response = requests.get(OIG_URL)
    print('got csv')
    cr = csv.reader(response.content.decode('utf-8').splitlines(), delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    my_list = list(cr)
    with open("/tmp/output.csv", "w") as f:
        writer = csv.writer(f, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        writer.writerows(my_list)


def run():
    mydb = pymysql.connect(
        host="oigdatabase.cjdyse7zes2s.us-east-2.rds.amazonaws.com",
        user="oigadmin",
        passwd="accredOIG",
        local_infile=1
    )
    print('db connector made')
    get_csv()
    import_the_csv(mydb)


def lambda_handler(event,context):
    run()
