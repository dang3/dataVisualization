import csv

fieldnames = ['CARRIER_NAME', 'ORIGIN', 'ORIGIN_CITY_NAME', 'ORIGIN_COUNTRY_NAME', 'DEST',
'DEST_CITY_NAME', 'DEST_COUNTRY_NAME', 'PASSENGER', 'INSTANCES']

outboundFlights = dict()
inboundFlights = dict()

def filter(fileName, city, year):
    outputFileNames = ['filtered/' + city + '_' + year + '-inbound.csv', 'filtered/' + city + '_' + year + '-outbound.csv']
    with open(fileName, mode='r') as inputFile:
        inputData = csv.DictReader(inputFile)
        for row in inputData:
            isPassengerFlight = True if row['AIRCRAFT_CONFIG'] == '1' else False
            if row['ORIGIN'] == city: # outbound flights
                if row['DEST'] != city:
                    if row['DEST'] not in outboundFlights:
                        addToDict(row['DEST'], outboundFlights, row, isPassengerFlight)
                    else:
                        outboundFlights[row['DEST']]['INSTANCES'] += 1
            elif row['DEST'] == city: # inbound flights
                if row['ORIGIN'] != city:
                    if row['ORIGIN'] not in inboundFlights:
                        addToDict(row['ORIGIN'], inboundFlights, row, isPassengerFlight)
                    else:
                        inboundFlights[row['ORIGIN']]['INSTANCES'] += 1
    
    writeToFile(outputFileNames[0], inboundFlights)
    writeToFile(outputFileNames[1], outboundFlights)


def addToDict(key, dictHandler, row, isPassengerFlight):
    dictHandler[key] = { 
        fieldnames[0] : row[fieldnames[0]],
        fieldnames[1] : row[fieldnames[1]],
        fieldnames[2] : row[fieldnames[2]],
        fieldnames[3] : row[fieldnames[3]],
        fieldnames[4] : row[fieldnames[4]],
        fieldnames[5] : row[fieldnames[5]],
        fieldnames[6] : row[fieldnames[6]],
        fieldnames[7] : str(isPassengerFlight),
        fieldnames[8] : 1,
    }

def writeToFile(fileName, dictHandler):
    with open(fileName, mode='wb') as file:
        fileWriter = csv.DictWriter(file, fieldnames)
        fileWriter.writeheader()
        for key, value in dictHandler.items():
            fileWriter.writerow({
                fieldnames[0] : value[fieldnames[0]],
                fieldnames[1] : value[fieldnames[1]],
                fieldnames[2] : value[fieldnames[2]],
                fieldnames[3] : value[fieldnames[3]],
                fieldnames[4] : value[fieldnames[4]],
                fieldnames[5] : value[fieldnames[5]],
                fieldnames[6] : value[fieldnames[6]],
                fieldnames[7] : value[fieldnames[7]],
                fieldnames[8] : value[fieldnames[8]],
            })



if __name__ == '__main__':
    # filter for year 2017
    #filter('raw/2017-all.csv', 'SFO', '2017')
    #filter('raw/2017-all.csv', 'SJC', '2017')
    #filter('raw/2017-all.csv', 'OAK', '2017')
    #filter('raw/2017-all.csv', 'LAX', '2017')
    # print('2017 done')
    # # filter for year 2018
    # filter('raw/2018-all.csv', 'SFO', '2018')
    # filter('raw/2018-all.csv', 'SJC', '2018')
    # filter('raw/2018-all.csv', 'OAK', '2018')
    # filter('raw/2018-all.csv', 'LAX', '2018')
    print('2018 done')