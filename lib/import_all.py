# After photo upload is complete
import sys
import os

print os.path.abspath( __file__ )
mypath = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..', 'timeline'))
sys.path.append(mypath)

from models import Transaction

import csv

from mongoengine import *
import pprint as pp

connect('sdbm')

rows = []

with open('sdbm.csv', 'rb') as csvfile:
	spamreader = csv.reader(
		csvfile,
		delimiter=',',
		quotechar='"',
		doublequote = True,
    	skipinitialspace = True,
		lineterminator = '\r\n',
	)

	for row in spamreader:
		if len(row) == 50:
			trans = Transaction(
				manuscript_id = row[0],
				duplicate_ms = row[1],
				seller = row[2],
				seller_2 = row[3],
				institution = row[4],
				catalogue_id = row[5],
				cat_lot_num = row[6],
				price = row[7],
				currency = row[8],
				sold = row[9],
				source = row[10],
				current_location = row[11],
				author = row[12],
				author_variant = row[13],
				title = row[14],
				language = row[15],
				material = row[16],
				place = row[17],
				use = row[18],
				date = row[19],
				circa = row[20],
				artist = row[21],
				script = row[22],
				folios = row[23],
				lines = row[24],
				height = row[25],
				width = row[26],
				binding = row[27],
				provenance = row[28],
				comments = row[29],
				link = row[30],
				full_page_mini = row[31],
				large_mini = row[32],
				small_mini = row[33],
				mini = row[34],
				historiated_initials = row[35],
				decorated_initials = row[35],
				possible_duplicates = row[44],
				cat_date = row[47],
				buyer = row[48],
				columns = row[49],
				)
			print trans.manuscript_id
			trans.save()
