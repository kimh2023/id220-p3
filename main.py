import csv

# Input and output file paths
input_file = 'nytb2008-2016Fiction.csv'
output_file = 'nytb2008-2016Fiction_edited.csv'

# Read the CSV file and update the year
with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
    reader = csv.reader(infile, delimiter='\t')
    writer = csv.writer(outfile, delimiter='\t')

    # Write the header
    header = next(reader)
    writer.writerow(header)

    # Update the year in each row
    for row in reader:
        row[0] = row[0].replace('2008', '2022')
        writer.writerow(row)
        if ('2009' in row[0]) :
            break

print(f"The year in {input_file} has been changed to 2022, and the updated data has been saved to {output_file}.")
