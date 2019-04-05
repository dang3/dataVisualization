import csv

fieldnames = ['CARRIER_NAME', 'ORIGIN', 'ORIGIN_CITY_NAME', 'ORIGIN_COUNTRY_NAME', 'DEST',
'DEST_CITY_NAME', 'DEST_COUNTRY_NAME', 'PASSENGER']

# Copy row if origin airport matches parameter airport
def filter(fileName, city, year):
    with open(fileName, mode='r') as inputFile:
        inputData = csv.DictReader(inputFile)
        
        # write to output for inbound and outbound flights in separate files
        outputFileNames = ['filtered/' + city + '_' + year + '-inbound.csv', 'filtered/' + city + '_' + year + '-outbound.csv']
        with open(outputFileNames[0], mode='wb') as outputFileInbound:
            with open(outputFileNames[1], mode='wb') as outputFileOutbound:
                fileWriter_inbound = csv.DictWriter(outputFileInbound, fieldnames)
                fileWriter_outbound = csv.DictWriter(outputFileOutbound, fieldnames)
                fileWriter_inbound.writeheader()
                fileWriter_outbound.writeheader()
                for row in inputData:
                    if row['ORIGIN'] == city:
                        writeToFile(fileWriter_outbound, row)
                    elif row['DEST'] == city:
                        writeToFile(fileWriter_inbound, row)


def writeToFile(fileHandler, row):
    passenger = True if row['AIRCRAFT_CONFIG'] == '1' else False
    fileHandler.writerow({fieldnames[0] : row[fieldnames[0]],
    fieldnames[1] : row[fieldnames[1]],
    fieldnames[2] : row[fieldnames[2]],
    fieldnames[3] : row[fieldnames[3]],
    fieldnames[4] : row[fieldnames[4]],
    fieldnames[5] : row[fieldnames[5]],
    fieldnames[6] : row[fieldnames[6]],
    fieldnames[7] : str(passenger)})

if __name__ == '__main__':
    # filter for year 2017
    filter('raw/2017-all.csv', 'SFO', '2017')
    filter('raw/2017-all.csv', 'SJC', '2017')
    filter('raw/2017-all.csv', 'OAK', '2017')
    print('2017 done')
    # filter for year 2018
    filter('raw/2018-all.csv', 'SFO', '2018')
    filter('raw/2018-all.csv', 'SJC', '2018')
    filter('raw/2018-all.csv', 'OAK', '2018')
    print('2018 done')