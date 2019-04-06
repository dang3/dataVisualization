import csv

fieldNames = ['ORIGIN', 'ORIGIN_CITY_NAME', 'ORIGIN_COUNTRY_NAME', 'DEST',
'DEST_CITY_NAME', 'DEST_COUNTRY_NAME', 'IS_PASSENGER_FLIGHT', 'INSTANCES']

outboundFlights = dict()
inboundFlights = dict()

def filter(fileName, city, year):
    with open(fileName, mode='r') as inputFile:
        inputData = csv.DictReader(inputFile)

        for row in inputData:
            # if there is an outbound flight from input city
            if row['ORIGIN'] == city:
                # check if destination city has already been counted
                if row['DEST'] not in outboundFlights:
                    outboundFlights['DEST'] = [ 'DEST_CITY_NAME' : row['DEST_CITY_NAME'],
                                                'DEST_COUNTRY_NAME' : row['DEST_COUNTRY_NAME'],
                                                'INSTANCES' : 0]
                else:
                    outboundFlights['DEST']


