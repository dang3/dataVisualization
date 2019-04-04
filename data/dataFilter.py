import csv

# with open('2017-all.csv', mode='r') as file:
#     data = csv.DictReader(file)
#     for row in data:
#         print(row['CARRIER_NAME'])
#     print("\n")


def filterByCity(fileName, cityName):
    with open(cityName, mode='r') as inputFile:
        inputData = csv.DictReader(inputFile)

        # write to output
        with open(fileName + 'filtered.csv', mode='a') as outputFile:
            fileWriter = csv.writer()
            for row in inputData:
                if row['ORIGIN'] == cityName:

